// src/hooks/useHabits.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadHabits } from "../store/slices/habitsSlice";

export const useHabits = () => {
  const dispatch = useDispatch();

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://habit-flow-backend-delta.vercel.app/api/habits",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Convert MongoDB habits to Redux format
        const habitsData = data.map((habit) => ({
          id: habit._id,
          name: habit.name,
          category: habit.category,
          icon: habit.icon,
          scheduledDays: habit.scheduledDays,
          scheduledTime: habit.scheduledTime,
          color: habit.color,
          streak: habit.streak,
          createdAt: habit.createdAt,
        }));

        // Convert completions from Map to object
        const completionsData = {};
        data.forEach((habit) => {
          if (habit.completions) {
            // MongoDB stores Map, convert to object
            completionsData[habit._id] =
              typeof habit.completions === "object"
                ? habit.completions
                : Object.fromEntries(habit.completions);
          } else {
            completionsData[habit._id] = {};
          }
        });

        dispatch(
          loadHabits({ habits: habitsData, completions: completionsData })
        );
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return { fetchHabits };
};
