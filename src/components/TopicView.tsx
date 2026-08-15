import React, { useState } from 'react';
import type { Topic, UserProgress, ProblemStatus } from '../types';
import { ProblemCard } from './ProblemCard';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  Unlock,
  BookOpen,
  CheckCheck,
  XCircle,
  Zap,
} from 'lucide-react';

interface TopicViewProps {
  topic: Topic;
  progress: UserProgress;
  toggleFundamental: (id: string) => void;
  checkAllFundamentals: (ids: string[]) => void;
  clearAllFundamentals: (ids: string[]) => void;
  toggleProblem: (problemId: string) => void;
  setProblemStatus: (problemId: string, status: ProblemStatus) => void;
  incrementRevision: (problemId: string, delta: number) => void;
  toggleFavorite: (problemId: string) => void;
  onOpenProblemNote: (problemId: string, title: string) => void;
  onOpenPatternNote: (patternId: string, title: string) => void;
  searchQuery: string;
  filterDifficulty: string;
  filterStatus: string;
  showFavoritesOnly: boolean;
}

export const TopicView: React.FC<TopicViewProps> = ({
  topic,
  progress,
  toggleFundamental,
  checkAllFundamentals,
  clearAllFundamentals,
  toggleProblem,
  setProblemStatus,
  incrementRevision,
  toggleFavorite,
  onOpenProblemNote,
  onOpenPatternNote,
  searchQuery,
  filterDifficulty,
  filterStatus,
  showFavoritesOnly,
}) => {
  // Track open/collapsed state for pattern accordions
  const [collapsedPatterns, setCollapsedPatterns] = useState<Record<string, boolean>>({});

  const togglePatternCollapse = (patternId: string) => {
    setCollapsedPatterns((prev) => ({
      ...prev,
      [patternId]: !prev[patternId],
    }));
  };

  const completedMap = progress.completedFundamentals || {};

  // Check all fundamentals for this topic
  const handleCheckAll = () => {
    const ids = topic.fundamentals.map((f) => f.id);
    checkAllFundamentals(ids);
  };

  // Clear all fundamentals for this topic
  const handleClearAll = () => {
    const ids = topic.fundamentals.map((f) => f.id);
    clearAllFundamentals(ids);
  };

  // Fundamentals calculations
  const totalFundamentals = topic.fundamentals.length;
  const completedFundamentalsCount = topic.fundamentals.filter(
    (f) => completedMap[f.id]
  ).length;
  const areFundamentalsComplete =
    totalFundamentals > 0 && completedFundamentalsCount === totalFundamentals;
  const fundamentalsPercentage =
    totalFundamentals > 0 ? Math.round((completedFundamentalsCount / totalFundamentals) * 100) : 0;

  // SVG ring for fundamentals progress
  const ringR = 22;
  const ringCircumference = 2 * Math.PI * ringR;
  const ringOffset = ringCircumference - (fundamentalsPercentage / 100) * ringCircumference;

  // Topic overall problems calculation
  let topicTotalProblems = 0;
  let topicSolvedProblems = 0;

  topic.patterns.forEach((pattern) => {
    pattern.problems.forEach((prob) => {
      topicTotalProblems++;
      if (
        progress.completedProblems[prob.id] ||
        progress.problemStatus[prob.id] === 'completed'
      ) {
        topicSolvedProblems++;
      }
    });
  });

  const topicPercentage =
    topicTotalProblems > 0 ? Math.round((topicSolvedProblems / topicTotalProblems) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Topic Header Card */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border border-gray-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Topic Section
              </span>
              {areFundamentalsComplete ? (
                <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                  <Unlock className="w-3 h-3" />
                  Fundamentals Mastered
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  <Lock className="w-3 h-3" />
                  Prerequisites Pending
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">{topic.title}</h2>
            <p className="text-sm text-gray-300 max-w-2xl">{topic.description}</p>
          </div>

          {/* Topic Progress Widget */}
          <div className="bg-gray-900/90 border border-gray-800 p-4 rounded-xl space-y-2 min-w-[200px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Topic Progress:</span>
              <span className="font-bold text-white font-mono">{topicPercentage}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${topicPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-400 text-right font-mono">
              {topicSolvedProblems} / {topicTotalProblems} Problems Solved
            </div>
          </div>
        </div>
      </div>

      {/* 🔰 MANDATORY FUNDAMENTALS SECTION */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border border-indigo-500/30 relative overflow-hidden">
        {/* Background glow when complete */}
        {areFundamentalsComplete && (
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none rounded-2xl" />
        )}

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            {/* Progress Ring SVG */}
            <div className="relative flex-shrink-0">
              <svg width="56" height="56" className="-rotate-90">
                {/* Background circle */}
                <circle
                  cx="28"
                  cy="28"
                  r={ringR}
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="5"
                />
                {/* Progress circle */}
                <circle
                  cx="28"
                  cy="28"
                  r={ringR}
                  fill="none"
                  stroke={areFundamentalsComplete ? '#10b981' : '#6366f1'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center rotate-0">
                <span
                  className={`text-[11px] font-bold font-mono ${
                    areFundamentalsComplete ? 'text-emerald-400' : 'text-indigo-300'
                  }`}
                >
                  {fundamentalsPercentage}%
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-xl">🔰</span>
                FUNDAMENTALS
              </h3>
              <p className="text-xs text-gray-400">
                {completedFundamentalsCount} / {totalFundamentals} core concepts mastered
              </p>
            </div>
          </div>

          {/* Batch Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCheckAll}
              disabled={areFundamentalsComplete}
              title="Check all fundamentals"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                bg-emerald-950/50 text-emerald-300 border-emerald-500/30
                hover:bg-emerald-900/60 hover:border-emerald-400/50
                disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Check All
            </button>
            <button
              onClick={handleClearAll}
              disabled={completedFundamentalsCount === 0}
              title="Clear all fundamentals"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                bg-red-950/40 text-red-400 border-red-500/30
                hover:bg-red-900/40 hover:border-red-400/50
                disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <XCircle className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Lock / Unlock Banner */}
        <div
          className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
            areFundamentalsComplete
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}
        >
          {areFundamentalsComplete ? (
            <>
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>All Fundamentals Mastered!</strong> Pattern section problem solving is now fully unlocked for {topic.title}.
              </span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Prerequisite Warning:</strong> Complete all {totalFundamentals} fundamental concepts below before attempting pattern problems.
              </span>
            </>
          )}
        </div>

        {/* ✅ Checklist Grid — Interactive Fundamentals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {topic.fundamentals.map((fund) => {
            const isChecked = !!completedMap[fund.id];

            return (
              <label
                key={fund.id}
                className={`
                  group flex items-start justify-between gap-3 p-3.5 rounded-xl border
                  cursor-pointer select-none text-left w-full
                  transition-all duration-200
                  ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_14px_rgba(16,185,129,0.2)] hover:bg-emerald-950/60'
                      : 'bg-gray-900/60 border-gray-800 hover:bg-gray-900 hover:border-indigo-500/40 hover:shadow-[0_0_10px_rgba(99,102,241,0.12)]'
                  }
                `}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Native Controlled Checkbox */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFundamental(fund.id)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900 accent-emerald-500 shrink-0 cursor-pointer"
                  />

                  {/* Text Content */}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span
                      className={`text-xs font-bold block transition-all duration-200 ${
                        isChecked
                          ? 'line-through text-emerald-300'
                          : 'text-gray-100 group-hover:text-white'
                      }`}
                    >
                      {fund.title}
                    </span>
                    {fund.description && (
                      <span
                        className={`text-[11px] block leading-tight transition-colors duration-200 ${
                          isChecked ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {fund.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Visible Done Badge */}
                {isChecked && (
                  <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0 self-center">
                    Done ✓
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* Completion celebration row */}
        {areFundamentalsComplete && (
          <div className="pt-2 flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>🎉 All fundamentals complete! You're ready for pattern mastery.</span>
          </div>
        )}
      </div>

      {/* PATTERN SECTIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Pattern Mastery ({topic.patterns.length} Patterns)
          </h3>
          <span className="text-xs text-gray-400">Collapsible Sections</span>
        </div>

        {topic.patterns.map((pattern) => {
          const isCollapsed = collapsedPatterns[pattern.id] || false;

          // Filter problems based on search & filters
          const filteredProblems = pattern.problems.filter((prob) => {
            // Search query
            if (searchQuery) {
              const q = searchQuery.toLowerCase();
              const matchTitle = prob.title.toLowerCase().includes(q);
              const matchNumber = `q${prob.number}`.includes(q) || `${prob.number}` === q;
              if (!matchTitle && !matchNumber) return false;
            }

            // Difficulty filter
            if (filterDifficulty !== 'ALL' && prob.difficulty !== filterDifficulty) {
              return false;
            }

            // Status filter
            if (filterStatus !== 'ALL') {
              const isComp = progress.completedProblems[prob.id] || progress.problemStatus[prob.id] === 'completed';
              const currentStatus = progress.problemStatus[prob.id] || (isComp ? 'completed' : 'not_started');
              if (currentStatus !== filterStatus) return false;
            }

            // Favorites filter
            if (showFavoritesOnly && !progress.favorites[prob.id]) {
              return false;
            }

            return true;
          });

          // Pattern stats
          let patternSolvedCount = 0;
          pattern.problems.forEach((prob) => {
            if (
              progress.completedProblems[prob.id] ||
              progress.problemStatus[prob.id] === 'completed'
            ) {
              patternSolvedCount++;
            }
          });

          const patternTotalCount = pattern.problems.length;
          const patternPercentage =
            patternTotalCount > 0 ? Math.round((patternSolvedCount / patternTotalCount) * 100) : 0;
          const hasPatternNote = !!progress.patternNotes[pattern.id];

          return (
            <div
              key={pattern.id}
              className="glass-card rounded-2xl border border-gray-800/80 overflow-hidden transition-all"
            >
              {/* Pattern Accordion Header */}
              <div
                onClick={() => togglePatternCollapse(pattern.id)}
                className="p-4 bg-gray-900/80 hover:bg-gray-900 border-b border-gray-800/80 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 select-none"
              >
                <div className="flex items-start md:items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 font-mono shrink-0">
                    {pattern.id}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{pattern.title}</h4>
                      {patternPercentage === 100 && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{pattern.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  {/* Pattern Progress Bar */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${patternPercentage}%` }}
                      />
                    </div>
                    <span className="text-gray-300 font-semibold">
                      {patternSolvedCount} / {patternTotalCount}
                    </span>
                  </div>

                  {/* Pattern Notes Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPatternNote(pattern.id, `Pattern ${pattern.id}: ${pattern.title}`);
                    }}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                      hasPatternNote
                        ? 'bg-purple-900/30 text-purple-300 border-purple-500/40 font-semibold'
                        : 'bg-gray-950 text-gray-400 border-gray-800 hover:text-white'
                    }`}
                    title="Pattern Notes"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>

                  <button className="p-1 text-gray-400 hover:text-white">
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Problems Container */}
              {!isCollapsed && (
                <div className="p-4 space-y-2 bg-gray-950/40">
                  {filteredProblems.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-500">
                      No problems match the current search or filters.
                    </div>
                  ) : (
                    filteredProblems.map((prob) => {
                      const isComp =
                        progress.completedProblems[prob.id] ||
                        progress.problemStatus[prob.id] === 'completed';
                      const st = progress.problemStatus[prob.id] || (isComp ? 'completed' : 'not_started');
                      const rev = progress.revisionCounts[prob.id] || 0;
                      const fav = progress.favorites[prob.id] || false;
                      const note = !!progress.problemNotes[prob.id];

                      return (
                        <ProblemCard
                          key={prob.id}
                          problem={prob}
                          isCompleted={isComp}
                          status={st}
                          revisionCount={rev}
                          isFavorite={fav}
                          hasNote={note}
                          onToggleComplete={() => toggleProblem(prob.id)}
                          onSetStatus={(s) => setProblemStatus(prob.id, s)}
                          onIncrementRevision={(d) => incrementRevision(prob.id, d)}
                          onToggleFavorite={() => toggleFavorite(prob.id)}
                          onOpenNote={() => onOpenProblemNote(prob.id, `Q${prob.number}. ${prob.title}`)}
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
