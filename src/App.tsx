import { useState } from 'react';
import { useDSAProgress } from './useDSAProgress';
import { DSA_TOPICS } from './dsaData';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SidebarNav } from './components/SidebarNav';
import { TopicView } from './components/TopicView';
import { ProblemNotesModal } from './components/ProblemNotesModal';
import { GoalModal } from './components/GoalModal';
import type { Topic } from './types';

export function App() {
  const {
    progress,
    statistics,
    toggleFundamental,
    toggleProblem,
    setProblemStatus,
    incrementRevision,
    toggleFavorite,
    saveProblemNote,
    savePatternNote,
    setCurrentGoal,
    setActiveTopic,
    exportData,
    importData,
    resetAllProgress,
  } = useDSAProgress();

  // Local UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Note Modal state
  const [activeNoteModal, setActiveNoteModal] = useState<{
    isOpen: boolean;
    type: 'problem' | 'pattern';
    targetId: string;
    title: string;
    subtitle?: string;
    initialNote: string;
  }>({
    isOpen: false,
    type: 'problem',
    targetId: '',
    title: '',
    initialNote: '',
  });

  // Goal Modal state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Active topic resolution
  const activeTopic: Topic =
    DSA_TOPICS.find((t) => t.id === progress.activeTopicId) || DSA_TOPICS[0];

  const handleOpenProblemNote = (problemId: string, title: string) => {
    setActiveNoteModal({
      isOpen: true,
      type: 'problem',
      targetId: problemId,
      title,
      subtitle: 'Problem Notes & Approach',
      initialNote: progress.problemNotes[problemId] || '',
    });
  };

  const handleOpenPatternNote = (patternId: string, title: string) => {
    setActiveNoteModal({
      isOpen: true,
      type: 'pattern',
      targetId: patternId,
      title,
      subtitle: 'Pattern Overview & Key Techniques',
      initialNote: progress.patternNotes[patternId] || '',
    });
  };

  const handleSaveNote = (note: string) => {
    if (activeNoteModal.type === 'problem') {
      saveProblemNote(activeNoteModal.targetId, note);
    } else {
      savePatternNote(activeNoteModal.targetId, note);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statistics={statistics}
        exportData={exportData}
        importData={importData}
        resetAllProgress={resetAllProgress}
        streak={progress.dailyStreak}
        currentGoal={progress.currentGoal}
        onEditGoal={() => setIsGoalModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        filterDifficulty={filterDifficulty}
        setFilterDifficulty={setFilterDifficulty}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <SidebarNav
          activeTopicId={activeTopic.id}
          onSelectTopic={(id) => setActiveTopic(id)}
          progress={progress}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center/Right Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-hidden min-w-0">
          {/* Top Analytics Dashboard */}
          <Dashboard
            statistics={statistics}
            progress={progress}
            onSelectTopic={(id) => setActiveTopic(id)}
            onEditGoal={() => setIsGoalModalOpen(true)}
          />

          {/* Active Topic View with 🔰 Fundamentals & Patterns */}
          <TopicView
            topic={activeTopic}
            progress={progress}
            toggleFundamental={toggleFundamental}
            toggleProblem={toggleProblem}
            setProblemStatus={setProblemStatus}
            incrementRevision={incrementRevision}
            toggleFavorite={toggleFavorite}
            onOpenProblemNote={handleOpenProblemNote}
            onOpenPatternNote={handleOpenPatternNote}
            searchQuery={searchQuery}
            filterDifficulty={filterDifficulty}
            filterStatus={filterStatus}
            showFavoritesOnly={showFavoritesOnly}
          />
        </main>
      </div>

      {/* Slide-over Notes Modal */}
      <ProblemNotesModal
        isOpen={activeNoteModal.isOpen}
        onClose={() => setActiveNoteModal((prev) => ({ ...prev, isOpen: false }))}
        title={activeNoteModal.title}
        subtitle={activeNoteModal.subtitle}
        initialNote={activeNoteModal.initialNote}
        onSaveNote={handleSaveNote}
      />

      {/* Goal Edit Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={progress.currentGoal}
        onSaveGoal={setCurrentGoal}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-gray-800/80 bg-[#080b12] py-4 text-center text-xs text-gray-500">
        <p>DSA Mastery Roadmap • Personal Learning Platform • Auto-saved locally</p>
      </footer>
    </div>
  );
}

export default App;
