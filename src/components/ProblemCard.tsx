import React from 'react';
import type { Problem, ProblemStatus } from '../types';
import { Star, FileText, Check, Plus, Minus, Clock, HardDrive } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  isCompleted: boolean;
  status: ProblemStatus;
  revisionCount: number;
  isFavorite: boolean;
  hasNote: boolean;
  onToggleComplete: () => void;
  onSetStatus: (status: ProblemStatus) => void;
  onIncrementRevision: (delta: number) => void;
  onToggleFavorite: () => void;
  onOpenNote: () => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  isCompleted,
  status,
  revisionCount,
  isFavorite,
  hasNote,
  onToggleComplete,
  onSetStatus,
  onIncrementRevision,
  onToggleFavorite,
  onOpenNote,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getStatusColor = (st: ProblemStatus) => {
    switch (st) {
      case 'completed':
        return 'bg-emerald-900/40 text-emerald-300 border-emerald-500/40';
      case 'in_progress':
        return 'bg-indigo-900/40 text-indigo-300 border-indigo-500/40';
      case 'revision_needed':
        return 'bg-purple-900/40 text-purple-300 border-purple-500/40';
      default:
        return 'bg-gray-900 text-gray-400 border-gray-800';
    }
  };

  return (
    <div
      className={`group flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 rounded-xl border transition-all duration-200 gap-3 ${
        isCompleted
          ? 'bg-emerald-950/10 border-emerald-500/30'
          : 'bg-gray-900/60 hover:bg-gray-900 border-gray-800/80 hover:border-gray-700'
      }`}
    >
      {/* Left side: Checkbox + Number + Title */}
      <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onToggleComplete}
          className={`mt-0.5 md:mt-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-400 text-black font-bold glow-emerald'
              : 'border-gray-700 hover:border-indigo-400 bg-gray-900'
          }`}
          aria-label={`Mark Q${problem.number} as completed`}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-gray-400">Q{problem.number}.</span>
            <span
              className={`text-sm font-semibold transition ${
                isCompleted ? 'text-gray-400 line-through' : 'text-gray-100 group-hover:text-indigo-300'
              }`}
            >
              {problem.title}
            </span>

            {/* Difficulty Badge */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
          </div>

          {/* Time & Space Complexity Pills */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1 bg-gray-950/70 border border-gray-800/80 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>{problem.timeComplexity}</span>
            </span>

            <span className="flex items-center gap-1 bg-gray-950/70 border border-gray-800/80 px-2 py-0.5 rounded-md">
              <HardDrive className="w-3 h-3 text-purple-400" />
              <span>{problem.spaceComplexity}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right side controls: Status, Revision, Favorite, Notes */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2.5 md:pt-0 border-gray-800">
        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => onSetStatus(e.target.value as ProblemStatus)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition ${getStatusColor(
            status
          )}`}
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="revision_needed">Revision Needed</option>
          <option value="completed">Completed</option>
        </select>

        {/* Revision Count Controls */}
        <div className="flex items-center gap-1 bg-gray-950/90 border border-gray-800 rounded-lg p-0.5 text-xs">
          <span className="text-[10px] text-gray-400 uppercase font-semibold px-1.5">Rev:</span>
          <button
            onClick={() => onIncrementRevision(-1)}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition"
            title="Decrement Revision"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-mono font-bold text-indigo-300 min-w-[16px] text-center">
            {revisionCount}
          </span>
          <button
            onClick={() => onIncrementRevision(1)}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition"
            title="Increment Revision"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Favorite Star Button */}
        <button
          onClick={onToggleFavorite}
          className={`p-1.5 rounded-lg border transition ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 glow-amber'
              : 'bg-gray-950/80 text-gray-500 border-gray-800 hover:text-amber-300'
          }`}
          title={isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Notes Button */}
        <button
          onClick={onOpenNote}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition ${
            hasNote
              ? 'bg-indigo-900/30 text-indigo-300 border-indigo-500/40 font-semibold'
              : 'bg-gray-950/80 text-gray-400 border-gray-800 hover:text-white'
          }`}
          title="Open Problem Notes"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{hasNote ? 'Note' : '+ Note'}</span>
        </button>
      </div>
    </div>
  );
};
