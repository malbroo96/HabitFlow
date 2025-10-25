// src/components/RewardBadge.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { getRewardForStreak } from '../utils/helpers';

const RewardBadge = () => {
  const habits = useSelector(state => state.habits.habits);

  const rewards = [];
  const rewardSet = new Set();

  habits.forEach(habit => {
    for (let streak = habit.streak; streak >= 3; streak--) {
      const reward = getRewardForStreak(streak);
      if (reward && !rewardSet.has(reward.title)) {
        rewards.push({ ...reward, streak });
        rewardSet.add(reward.title);
        break;
      }
    }
  });

  rewards.sort((a, b) => b.streak - a.streak);

  if (rewards.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rewards & Achievements</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No badges earned yet!</p>
          <p className="text-sm text-gray-400">Complete habits for 3+ days to earn your first badge.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Rewards & Achievements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{reward.title.split(' ')[0]}</div>
              <h4 className="font-bold text-gray-900">{reward.title.substring(3)}</h4>
              <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardBadge;