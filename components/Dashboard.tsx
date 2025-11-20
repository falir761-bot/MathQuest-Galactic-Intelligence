import React from 'react';
import { GameProgress } from '../types';
import { BADGES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Award, Zap, Brain, CheckCircle } from 'lucide-react';

interface DashboardProps {
  progress: GameProgress;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress }) => {
  const stats = [
    { name: 'Total Score', value: progress.total_score, icon: Zap, color: 'text-yellow-400' },
    { name: 'Solved', value: progress.problems_solved, icon: Brain, color: 'text-brand-400' },
    { name: 'Correct', value: progress.correct_answers, icon: CheckCircle, color: 'text-accent-400' },
    { name: 'Best Streak', value: progress.best_streak, icon: Award, color: 'text-orange-400' },
  ];

  const chartData = [
    { name: 'Correct', value: progress.correct_answers },
    { name: 'Incorrect', value: progress.problems_solved - progress.correct_answers },
  ];

  const accuracy = progress.problems_solved > 0 
    ? Math.round((progress.correct_answers / progress.problems_solved) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-float">
      <h2 className="text-3xl font-bold mb-8 text-white">Mission Command</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-space-800/50 border border-space-700 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-slate-400 text-sm">{stat.name}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Accuracy Chart */}
        <div className="bg-space-800/50 border border-space-700 p-6 rounded-xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6 text-white">Performance Accuracy</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                            cursor={{fill: '#334155', opacity: 0.4}}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#34d399' : '#f87171'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-white">{accuracy}%</span>
                <span className="text-slate-400 ml-2">Accuracy Rate</span>
            </div>
        </div>

        {/* Badges */}
        <div className="bg-space-800/50 border border-space-700 p-6 rounded-xl backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-6 text-white">Earned Badges</h3>
          <div className="grid grid-cols-3 gap-4">
            {BADGES.map((badge) => {
              const isUnlocked = progress.badges.includes(badge.id);
              return (
                <div 
                  key={badge.id} 
                  className={`flex flex-col items-center p-3 rounded-lg text-center transition-all ${
                    isUnlocked 
                      ? 'bg-space-700 border border-brand-500/30 opacity-100' 
                      : 'bg-space-900/50 border border-space-800 opacity-40 grayscale'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${badge.color} text-white shadow-lg`}>
                    {badge.icon}
                  </div>
                  <div className="text-xs font-medium text-slate-300">{badge.name}</div>
                </div>
              );
            })}
          </div>
          {progress.badges.length === 0 && (
              <div className="text-center text-slate-500 mt-8 italic">
                  No badges yet. Start solving to earn them!
              </div>
          )}
        </div>
      </div>
    </div>
  );
};