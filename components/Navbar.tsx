import React from 'react';
import { Rocket, Trophy, LayoutDashboard, LogOut } from 'lucide-react';
import { AppState } from '../types';

interface NavbarProps {
  currentState: AppState;
  onNavigate: (state: AppState) => void;
  level: number;
  score: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentState, onNavigate, level, score }) => {
  return (
    <nav className="w-full bg-space-800/80 backdrop-blur-md border-b border-space-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate(AppState.MENU)}
        >
          <div className="bg-brand-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            MathQuest
          </span>
        </div>

        <div className="flex items-center gap-6">
          {currentState !== AppState.LOADING && (
            <>
              <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 bg-space-900 px-3 py-1.5 rounded-full border border-space-700">
                  <span className="text-brand-400">Lvl {level}</span>
                </div>
                <div className="flex items-center gap-2 bg-space-900 px-3 py-1.5 rounded-full border border-space-700">
                  <span className="text-accent-400">{score} XP</span>
                </div>
              </div>

              <div className="h-6 w-px bg-space-700 mx-2"></div>

              <button 
                onClick={() => onNavigate(AppState.DASHBOARD)}
                className={`p-2 rounded-md transition-colors ${
                  currentState === AppState.DASHBOARD 
                    ? 'bg-brand-500/20 text-brand-400' 
                    : 'hover:bg-space-700 text-slate-400'
                }`}
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>

              <button 
                onClick={() => onNavigate(AppState.MENU)}
                className={`p-2 rounded-md transition-colors ${
                  currentState === AppState.MENU 
                    ? 'bg-brand-500/20 text-brand-400' 
                    : 'hover:bg-space-700 text-slate-400'
                }`}
                title="Main Menu"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};