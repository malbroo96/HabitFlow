// backend/controllers/habitController.js
import Habit from '../models/Habit.js';

// @desc    Get all habits for user
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res) => {
  try {
    const { name, category, icon, scheduledDays, scheduledTime, color } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Please provide name and category' });
    }

    const habit = await Habit.create({
      userId: req.user._id,
      name,
      category,
      icon: icon || '✨',
      scheduledDays: scheduledDays || [],
      scheduledTime: scheduledTime || '',
      color: color || 'emerald',
      streak: 0,
      completions: {}
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check ownership
    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check ownership
    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle habit completion
// @route   POST /api/habits/:id/toggle
// @access  Private
export const toggleCompletion = async (req, res) => {
  try {
    const { date } = req.body;
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check ownership
    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Toggle completion
    const completions = habit.completions.toObject();
    completions[date] = !completions[date];
    habit.completions = completions;

    // Calculate streak
    habit.streak = calculateStreak(completions);

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate streak
function calculateStreak(completions) {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (completions[dateStr]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}