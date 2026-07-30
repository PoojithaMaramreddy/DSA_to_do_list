import React, { useRef } from 'react';
import { Search, Download, Upload, RotateCcw, Target, Flame, Menu, CheckCircle2 } from 'lucide-react';
import type { Statistics } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statistics: Statistics;
  exportData: () => void;
  importData: (json: string) => void;
  resetAllProgress: () => void;
  streak: number;
  currentGoal: string;
  onEditGoal: () => void;
  onToggleMobileSidebar: () => void;
  filterDifficulty: string;
  setFilterDifficulty: (diff: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (fav: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  statistics,
  exportData,
  importData,
  resetAllProgress,
  streak,
  currentGoal,
  onEditGoal,
  onToggleMobileSidebar,
  filterDifficulty,
  setFilterDifficulty,
  filterStatus,
  setFilterStatus,
  showFavoritesOnly,
  setShowFavoritesOnly,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) importData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg glow-primary">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                    DSA Mastery
                  </h1>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                    {statistics.overallPercentage}%
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono tracking-wider">ROADMAP.SH CUSTOM</p>
              </div>
            </div>
          </div>

          {/* Quick Streak & Goal (Mobile) */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>{streak}d</span>
            </div>
          </div>
        </div>

        {/* Center Search & Filters */}
        <div className="flex-1 w-full md:max-w-xl flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search 507+ problems, patterns, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/90 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Filter Pills */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="revision_needed">Revision Needed</option>
            <option value="not_started">Not Started</option>
          </select>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-gray-200'
            }`}
          >
            ★ Favorites
          </button>
        </div>

        {/* Right Tools & Backup */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>{streak} Day Streak</span>
          </div>

          <button
            onClick={onEditGoal}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition"
            title={currentGoal}
          >
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span className="max-w-[120px] truncate">{currentGoal}</span>
          </button>

          <button
            onClick={exportData}
            className="p-2 text-gray-400 hover:text-emerald-400 rounded-lg hover:bg-gray-800 transition"
            title="Export JSON Backup"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-indigo-400 rounded-lg hover:bg-gray-800 transition"
            title="Import JSON Backup"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={resetAllProgress}
            className="p-2 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-800 transition"
            title="Reset All Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
