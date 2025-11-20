import { BadgeDef } from "./types";

export const BASE44_API_URL = 'https://app.base44.com/api/apps/691ed385b434464bbd0e64df/entities/GameProgress';
export const BASE44_API_KEY = '34dde0ba75614d4faa14a702bb4ea05f';

export const BADGES: BadgeDef[] = [
  { id: 'novice_counter', name: 'Novice Counter', icon: '🧮', description: 'Solve your first 5 problems', color: 'bg-blue-500' },
  { id: 'streak_master', name: 'Streak Master', icon: '🔥', description: 'Reach a streak of 5', color: 'bg-orange-500' },
  { id: 'level_up', name: 'Level Up!', icon: '🚀', description: 'Reach Level 2', color: 'bg-purple-500' },
  { id: 'math_wizard', name: 'Math Wizard', icon: '🧙‍♂️', description: 'Solve 50 problems correctly', color: 'bg-yellow-500' },
  { id: 'perfectionist', name: 'Perfectionist', icon: '💎', description: 'Get a 100% score in a session', color: 'bg-cyan-500' },
];

export const LEVELS = {
  1: "Basic Arithmetic (Addition/Subtraction)",
  2: "Multiplication Basics",
  3: "Division & Mixed Operations",
  4: "Fractions & Decimals",
  5: "Basic Algebra",
  6: "Geometry Concepts",
  7: "Advanced Algebra",
  8: "Calculus Intro (Limits)",
  9: "Complex Numbers",
  10: "Galactic Master (Challenge Mode)"
};