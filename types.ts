// Base44 Entity Structure
export interface GameProgress {
  _id?: string;
  level: number;
  total_score: number;
  problems_solved: number;
  correct_answers: number;
  badges: string[];
  streak: number;
  best_streak: number;
}

// Gemini AI Problem Structure
export interface MathProblem {
  question: string;
  options: string[];
  correctOptionIndex: number; // 0-3
  topic: string;
  difficultyRating: number;
}

export enum AppState {
  LOADING = 'LOADING',
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER', // Used for session summary or level up screen
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR'
}

export const INITIAL_PROGRESS: GameProgress = {
  level: 1,
  total_score: 0,
  problems_solved: 0,
  correct_answers: 0,
  badges: [],
  streak: 0,
  best_streak: 0
};

// For badge display
export interface BadgeDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}