import React from 'react';
import type { Statistics, UserProgress, Topic } from '../types';
import { CheckCircle, Trophy, BookOpen, Layers, Flame, RotateCcw, Target, ChevronRight, Activity } from 'lucide-react';
import { DSA_TOPICS } from '../dsaData';

interface DashboardProps {
  statistics: Statistics;
  progress: UserProgress;
  onSelectTopic: (topicId: string) => void;
  onEditGoal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  statistics,
  progress,
  onSelectTopic,
  onEditGoal,
}) => {
  const currentTopic: Topic | undefined = DSA_TOPICS.find((t) => t.id === progress.activeTopicId) || DSA_TOPICS[0];
  const activePattern = currentTopic?.patterns[0];

  // Helper for last 7 days activity heatmap
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({
        date: dateStr,
        dayName,
        count: progress.activityLog[dateStr] || 0,
      });
    }
    return days;
  };

  const weekActivity = getLast7Days();

  return (
    <div className="space-y-6 mb-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 p-6 md:p-8 glass-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>DSA Personal Learning Mastery</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back to your <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">DSA Roadmap</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Track 507+ curated patterns, complete topic prerequisite 🔰 Fundamentals, review time/space complexity, and maintain your problem-solving streak.
            </p>

            {/* Current Goal Box */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300">
                <Target className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-gray-400">Goal:</span>
                <span className="text-white font-medium">{progress.currentGoal}</span>
              </div>
              <button
                onClick={onEditGoal}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Set Goal
              </button>
            </div>
          </div>

          {/* Big Progress Circle / Gauge */}
          <div className="flex items-center gap-4 bg-gray-900/80 border border-gray-800 p-4 rounded-2xl self-stretch lg:self-auto justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-800"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * statistics.overallPercentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-white">{statistics.overallPercentage}%</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Done</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Solved:</span>
                <span className="font-bold text-white font-mono">{statistics.solvedProblems} / {statistics.totalProblems}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Remaining:</span>
                <span className="font-bold text-indigo-300 font-mono">{statistics.remainingProblems}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Revisions:</span>
                <span className="font-bold text-purple-300 font-mono">{statistics.totalRevisions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold text-gray-400 uppercase">Solved</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{statistics.solvedProblems}</p>
          <p className="text-[11px] text-gray-400">Out of {statistics.totalProblems} total</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold text-gray-400 uppercase">Remaining</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{statistics.remainingProblems}</p>
          <p className="text-[11px] text-gray-400">To be attempted</p>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold text-gray-400 uppercase">Topics</span>
            <Layers className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {statistics.completedTopics} <span className="text-sm font-normal text-gray-400">/ {statistics.totalTopics}</span>
          </p>
          <p className="text-[11px] text-gray-400">Mastered sections</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold text-gray-400 uppercase">Patterns</span>
            <Trophy className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {statistics.completedPatterns} <span className="text-sm font-normal text-gray-400">/ {statistics.totalPatterns}</span>
          </p>
          <p className="text-[11px] text-gray-400">Patterns finished</p>
        </div>

        {/* Metric 5 */}
        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold text-gray-400 uppercase">Streak</span>
            <Flame className="w-4 h-4 fill-rose-500/20" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{progress.dailyStreak}d</p>
          <p className="text-[11px] text-gray-400">Active learning</p>
        </div>

        {/* Metric 6 */}
        <div className="glass-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-pink-400">
            <span className="text-xs font-semibold text-gray-400 uppercase">Revisions</span>
            <RotateCcw className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">{statistics.totalRevisions}</p>
          <p className="text-[11px] text-gray-400">Total problem revs</p>
        </div>
      </div>

      {/* Difficulty Breakdown & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Difficulty Statistics */}
        <div className="glass-card p-5 rounded-2xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Difficulty Statistics
            </h3>
            <span className="text-xs text-gray-400">Accuracy & Completion</span>
          </div>

          <div className="space-y-3">
            {/* Easy Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Easy Problems
                </span>
                <span className="font-mono text-gray-300">
                  {statistics.easySolved} / {statistics.easyTotal} ({statistics.easyTotal > 0 ? Math.round((statistics.easySolved / statistics.easyTotal) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${statistics.easyTotal > 0 ? (statistics.easySolved / statistics.easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Medium Problems
                </span>
                <span className="font-mono text-gray-300">
                  {statistics.mediumSolved} / {statistics.mediumTotal} ({statistics.mediumTotal > 0 ? Math.round((statistics.mediumSolved / statistics.mediumTotal) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-700"
                  style={{ width: `${statistics.mediumTotal > 0 ? (statistics.mediumSolved / statistics.mediumTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Hard Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Hard Problems
                </span>
                <span className="font-mono text-gray-300">
                  {statistics.hardSolved} / {statistics.hardTotal} ({statistics.hardTotal > 0 ? Math.round((statistics.hardSolved / statistics.hardTotal) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-700"
                  style={{ width: `${statistics.hardTotal > 0 ? (statistics.hardSolved / statistics.hardTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Focus Card */}
        <div className="glass-card p-5 rounded-2xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Currently Learning</span>
            <h4 className="text-lg font-bold text-white">{currentTopic?.title}</h4>
            <p className="text-xs text-gray-400 line-clamp-2">{currentTopic?.description}</p>
          </div>

          <div className="bg-gray-900/90 border border-gray-800 p-3 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>First Pattern:</span>
              <span className="text-indigo-300 font-semibold">{activePattern?.title}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Fundamentals:</span>
              <span className="text-emerald-400 font-mono">
                {currentTopic?.fundamentals.filter((f) => progress.completedFundamentals[f.id]).length} / {currentTopic?.fundamentals.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectTopic(currentTopic?.id || 'arrays')}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
          >
            <span>Continue {currentTopic?.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekly Activity Grid */}
      <div className="glass-card p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Activity Breakdown</h3>
          <span className="text-xs text-gray-400">Last 7 Days</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {weekActivity.map((day, idx) => (
            <div key={idx} className="bg-gray-900/60 border border-gray-800 p-2 rounded-xl space-y-1">
              <span className="text-[10px] text-gray-400 block">{day.dayName}</span>
              <div
                className={`w-full h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition ${
                  day.count > 0
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'bg-gray-800/40 text-gray-600'
                }`}
              >
                {day.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
