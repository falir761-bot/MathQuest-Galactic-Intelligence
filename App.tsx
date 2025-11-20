import React, { useState, useEffect, useCallback } from 'react';
import { GameProgress, MathProblem, AppState, INITIAL_PROGRESS } from './types';
import { apiService } from './services/apiService';
import { geminiService } from './services/geminiService';
import { BADGES, LEVELS } from './constants';
import { Navbar } from './components/Navbar';
import { GameScreen } from './components/GameScreen';
import { Dashboard } from './components/Dashboard';
import { Play, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [progress, setProgress] = useState<GameProgress>(INITIAL_PROGRESS);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize App
  useEffect(() => {
    const init = async () => {
      try {
        const data = await apiService.fetchProgress();
        setProgress(data);
        setAppState(AppState.MENU);
      } catch (e) {
        console.error(e);
        setError("Failed to connect to the Galactic Database (Base44). using offline mode.");
        setAppState(AppState.MENU); // Allow playing locally even if save fails (though it won't persist)
      }
    };
    init();
  }, []);

  const loadNextProblem = useCallback(async () => {
    setIsLoadingProblem(true);
    setFeedback(null);
    try {
      const problem = await geminiService.generateProblem(progress.level);
      setCurrentProblem(problem);
      setIsLoadingProblem(false);
    } catch (e) {
      console.error(e);
      setError("AI Communications Down. Please retry.");
      setIsLoadingProblem(false);
    }
  }, [progress.level]);

  const startGame = () => {
    setAppState(AppState.PLAYING);
    loadNextProblem();
  };

  const handleNavigate = (state: AppState) => {
    setAppState(state);
    if (state === AppState.PLAYING && !currentProblem) {
        loadNextProblem();
    }
  };

  const handleAnswer = async (optionIndex: number) => {
    if (!currentProblem) return;

    const isCorrect = optionIndex === currentProblem.correctOptionIndex;
    
    // Generate Feedback
    const feedbackText = await geminiService.explainAnswer(
        currentProblem, 
        currentProblem.options[optionIndex], 
        isCorrect
    );
    setFeedback(feedbackText);

    // Update Progress Locally
    const newProgress = { ...progress };
    newProgress.problems_solved += 1;
    
    if (isCorrect) {
      newProgress.correct_answers += 1;
      newProgress.streak += 1;
      newProgress.total_score += 10 * progress.level + (newProgress.streak * 2); // Bonus for streak
      
      if (newProgress.streak > newProgress.best_streak) {
        newProgress.best_streak = newProgress.streak;
      }

      // Check Badges
      if (newProgress.problems_solved === 5 && !newProgress.badges.includes('novice_counter')) {
        newProgress.badges.push('novice_counter');
      }
      if (newProgress.streak === 5 && !newProgress.badges.includes('streak_master')) {
        newProgress.badges.push('streak_master');
      }
      if (newProgress.correct_answers === 50 && !newProgress.badges.includes('math_wizard')) {
        newProgress.badges.push('math_wizard');
      }
      
      // Level Up Logic (Simple: every 5 correct answers for demo)
      if (newProgress.correct_answers % 5 === 0 && newProgress.level < 10) {
          newProgress.level += 1;
          if (!newProgress.badges.includes('level_up')) newProgress.badges.push('level_up');
      }

    } else {
      newProgress.streak = 0;
    }

    setProgress(newProgress);

    // Save to API (Fire and forget)
    apiService.updateProgress(newProgress).catch(err => console.error("Save failed", err));
  };

  if (appState === AppState.LOADING) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center text-white">
         <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900 flex flex-col">
      <Navbar 
        currentState={appState} 
        onNavigate={handleNavigate} 
        level={progress.level}
        score={progress.total_score}
      />

      <main className="flex-1 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 h-full">
          {error && (
            <div className="max-w-md mx-auto mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto hover:text-white"><div className="w-4 h-4 border rounded-full flex items-center justify-center">x</div></button>
            </div>
          )}

          {appState === AppState.MENU && (
            <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
              <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 tracking-tighter">
                MathQuest
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mb-12">
                Embark on an intergalactic journey of logic and numbers. 
                Train your brain with the ship's AI and conquer the galaxy.
              </p>
              
              <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
                <button 
                  onClick={startGame}
                  className="flex-1 flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-500 text-white py-4 px-8 rounded-xl text-xl font-bold transition-all shadow-lg shadow-brand-900/50 hover:scale-105"
                >
                  <Play className="w-6 h-6 fill-current" /> Start Mission
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 text-center w-full max-w-2xl">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{progress.level}</div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">Current Level</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{progress.total_score}</div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">Total XP</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{progress.badges.length}</div>
                  <div className="text-xs uppercase tracking-widest text-slate-500">Badges</div>
                </div>
              </div>
            </div>
          )}

          {appState === AppState.PLAYING && (
            <GameScreen 
              level={progress.level}
              problem={currentProblem}
              loading={isLoadingProblem}
              onAnswer={handleAnswer}
              feedback={feedback}
              onNext={loadNextProblem}
            />
          )}

          {appState === AppState.DASHBOARD && (
            <Dashboard progress={progress} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;