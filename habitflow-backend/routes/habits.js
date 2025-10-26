// backend/routes/habits.js
import express from 'express';
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCompletion
} from '../controllers/habitController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Habit CRUD routes
router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

router.post('/:id/toggle', toggleCompletion);

export default router;