import React, { useState } from 'react';
import { X, Target, Check } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: string;
  onSaveGoal: (goal: string) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onSaveGoal,
}) => {
  const [goalText, setGoalText] = useState(currentGoal);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (goalText.trim()) {
      onSaveGoal(goalText.trim());
      onClose();
    }
  };

  const quickGoals = [
    'Solve 3 problems today & master Array Two Pointers',
    'Finish all Trees 🔰 Fundamentals checklist',
    'Revise 5 Hard Dynamic Programming problems',
    'Complete Graph BFS & DFS patterns',
    'Prepare for FAANG Technical Coding Interviews',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0d1322] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Set Your DSA Goal</h3>
              <p className="text-xs text-gray-400">Target your current learning objective</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Current Goal Statement</label>
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g. Solve 3 Binary Search problems daily..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Quick options */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Preset Goal Templates:
            </span>
            <div className="space-y-1">
              {quickGoals.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setGoalText(q)}
                  className="w-full text-left text-xs p-2 rounded-lg bg-gray-900/60 hover:bg-gray-900 border border-gray-800 text-gray-300 hover:text-white transition"
                >
                  • {q}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Check className="w-4 h-4" />
              <span>Save Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
