import React from 'react';
import type { UserProgress } from '../types';
import { DSA_TOPICS } from '../dsaData';
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react';

interface SidebarNavProps {
  activeTopicId: string;
  onSelectTopic: (id: string) => void;
  progress: UserProgress;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTopicId,
  onSelectTopic,
  progress,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-72 bg-[#0d1322] border-r border-gray-800/80 p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>DSA Learning Roadmap</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-mono">
              23 Topics
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {DSA_TOPICS.map((topic) => {
              const isActive = topic.id === activeTopicId;

              // Check fundamentals progress
              const totalFund = topic.fundamentals.length;
              const completedFund = topic.fundamentals.filter(
                (f) => progress.completedFundamentals[f.id]
              ).length;
              const isFundCompleted = totalFund > 0 && completedFund === totalFund;

              // Check problems progress
              let topicTotalProbs = 0;
              let topicSolvedProbs = 0;
              topic.patterns.forEach((p) => {
                p.problems.forEach((prob) => {
                  topicTotalProbs++;
                  if (
                    progress.completedProblems[prob.id] ||
                    progress.problemStatus[prob.id] === 'completed'
                  ) {
                    topicSolvedProbs++;
                  }
                });
              });

              const isTopicDone =
                topicTotalProbs > 0 && topicSolvedProbs === topicTotalProbs && isFundCompleted;

              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 border border-indigo-500/50 text-white shadow-md glow-primary'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-gray-800/80 text-gray-400 group-hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </div>

                    <div className="text-left truncate">
                      <span className="block truncate font-semibold">{topic.title}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {topicSolvedProbs} / {topicTotalProbs} solved
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Fundamentals status badge */}
                    {isFundCompleted ? (
                      <span
                        className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30"
                        title="🔰 Fundamentals Completed"
                      >
                        🔰
                      </span>
                    ) : (
                      <span title="Fundamentals Pending">
                        <Lock className="w-3 h-3 text-amber-500/70" />
                      </span>
                    )}

                    {isTopicDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}

                    <ChevronRight
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        isActive ? 'rotate-90 text-indigo-400' : 'group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-800/80 text-[11px] text-gray-400 space-y-1">
          <p className="font-semibold text-gray-300">DSA Personal Mastery</p>
          <p>🔰 Fundamentals unlock pattern mastery</p>
        </div>
      </aside>
    </>
  );
};
