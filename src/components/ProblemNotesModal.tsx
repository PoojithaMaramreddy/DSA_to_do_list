import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Code2, Sparkles } from 'lucide-react';

interface ProblemNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  initialNote: string;
  onSaveNote: (note: string) => void;
}

export const ProblemNotesModal: React.FC<ProblemNotesModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  initialNote,
  onSaveNote,
}) => {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveNote(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg h-full bg-[#0d1322] border-l border-gray-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white line-clamp-1">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick template triggers */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">Quick Template:</span>
            <button
              onClick={() =>
                setNote(
                  (prev) =>
                    prev +
                    `\n\n### 💡 Key Intuition\n- Pattern used: \n- Trick / Edge Case: \n\n### ⏱️ Complexity\n- Time: O()\n- Space: O()\n`
                )
              }
              className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-indigo-300 hover:bg-gray-800 transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Intuition
            </button>
            <button
              onClick={() =>
                setNote(
                  (prev) =>
                    prev +
                    `\n\n\`\`\`cpp\n// Optimal Solution Code\n\`\`\`\n`
                )
              }
              className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-purple-300 hover:bg-gray-800 transition flex items-center gap-1"
            >
              <Code2 className="w-3 h-3" />
              Code Block
            </button>
          </div>

          {/* Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400">Personal Notes & Solution Approach</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your intuition, code snippets, tricky test cases, or key takeaways here..."
              rows={16}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  );
};
