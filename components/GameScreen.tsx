import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';
import { Loader2, Check, X, ArrowRight } from 'lucide-react';

interface GameScreenProps {
  level: number;
  problem: MathProblem | null;
  loading: boolean;
  onAnswer: (optionIndex: number) => Promise<void>;
  feedback: string | null;
  onNext: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  level, 
  problem, 
  loading, 
  onAnswer, 
  feedback,
  onNext
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset local state when problem changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitting(false);
  }, [problem]);

  const handleOptionClick = async (index: number) => {
    if (selectedOption !== null || isSubmitting || !problem) return;
    
    setSelectedOption(index);
    setIsSubmitting(true);
    await onAnswer(index);
    setIsSubmitting(false);
  };

  if (loading || !problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-16 h-16 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-400 text-lg animate-pulse">Receiving transmission from Deep Space AI...</p>
      </div>
    );
  }

  const isAnswered = selectedOption !== null && feedback !== null;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8">
      {/* Problem Card */}
      <div className="bg-space-800 border border-space-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500"></div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-brand-400 text-sm font-bold uppercase tracking-wider">
            Mission Level {level}
          </span>
          <span className="text-slate-500 text-xs bg-space-900 px-2 py-1 rounded">
            {problem.topic}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight text-center">
          {problem.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {problem.options.map((option, index) => {
            let buttonStyle = "bg-space-900 hover:bg-space-700 border-space-700 text-slate-200";
            let icon = null;

            if (isAnswered) {
              if (index === problem.correctOptionIndex) {
                buttonStyle = "bg-accent-500/20 border-accent-500 text-accent-300";
                icon = <Check className="w-5 h-5" />;
              } else if (index === selectedOption && index !== problem.correctOptionIndex) {
                buttonStyle = "bg-red-500/20 border-red-500 text-red-300";
                icon = <X className="w-5 h-5" />;
              } else {
                 buttonStyle = "bg-space-900 opacity-50 border-space-700 text-slate-500";
              }
            } else if (selectedOption === index) {
               buttonStyle = "bg-brand-600 border-brand-500 text-white";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered || isSubmitting}
                className={`
                  relative p-4 rounded-xl border-2 text-lg font-semibold transition-all duration-200
                  flex items-center justify-center gap-3
                  ${buttonStyle}
                  ${!isAnswered && "hover:scale-[1.02] active:scale-[0.98]"}
                `}
              >
                {option}
                {icon && <span className="absolute right-4">{icon}</span>}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`
            mt-6 p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-4
            ${selectedOption === problem.correctOptionIndex 
              ? 'bg-accent-900/30 border-accent-500/30' 
              : 'bg-red-900/30 border-red-500/30'}
          `}>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                 {selectedOption === problem.correctOptionIndex 
                   ? <div className="p-1 bg-accent-500 rounded-full"><Check className="w-3 h-3 text-white" /></div>
                   : <div className="p-1 bg-red-500 rounded-full"><X className="w-3 h-3 text-white" /></div>
                 }
              </div>
              <div>
                <p className="text-slate-200 font-medium text-lg mb-1">
                  {selectedOption === problem.correctOptionIndex ? "Excellent work!" : "Not quite right."}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feedback}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={onNext}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-brand-900/50"
              >
                Next Problem <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};