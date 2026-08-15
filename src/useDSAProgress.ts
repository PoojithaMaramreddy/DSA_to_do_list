import { useState, useEffect, useMemo } from 'react';
import type { UserProgress, ProblemStatus, Statistics } from './types';
import { DSA_TOPICS } from './dsaData';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'dsa_mastery_roadmap_v1';

const getTodayDateString = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

const initialProgress: UserProgress = {
  completedFundamentals: {},
  completedProblems: {},
  problemStatus: {},
  revisionCounts: {},
  favorites: {},
  problemNotes: {},
  patternNotes: {},
  dailyStreak: 1,
  lastActiveDate: getTodayDateString(),
  activityLog: { [getTodayDateString()]: 0 },
  currentGoal: 'Solve 3 problems today & master Array Two Pointers',
  activeTopicId: 'arrays',
};

export function useDSAProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = getTodayDateString();
        
        // Update streak logic
        let streak = parsed.dailyStreak || 1;
        const lastActive = parsed.lastActiveDate || today;
        if (lastActive !== today) {
          const lastDate = new Date(lastActive);
          const currentDate = new Date(today);
          const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak += 1;
          } else if (diffDays > 1) {
            streak = 1;
          }
        }
        
        return {
          ...initialProgress,
          ...parsed,
          completedFundamentals: (parsed.completedFundamentals && typeof parsed.completedFundamentals === 'object') ? parsed.completedFundamentals : {},
          completedProblems: (parsed.completedProblems && typeof parsed.completedProblems === 'object') ? parsed.completedProblems : {},
          problemStatus: (parsed.problemStatus && typeof parsed.problemStatus === 'object') ? parsed.problemStatus : {},
          revisionCounts: (parsed.revisionCounts && typeof parsed.revisionCounts === 'object') ? parsed.revisionCounts : {},
          favorites: (parsed.favorites && typeof parsed.favorites === 'object') ? parsed.favorites : {},
          problemNotes: (parsed.problemNotes && typeof parsed.problemNotes === 'object') ? parsed.problemNotes : {},
          patternNotes: (parsed.patternNotes && typeof parsed.patternNotes === 'object') ? parsed.patternNotes : {},
          dailyStreak: streak,
          lastActiveDate: today,
        };
      }
    } catch (err) {
      console.error('Failed to load DSA progress from LocalStorage:', err);
    }
    return initialProgress;
  });

  // Save to LocalStorage whenever progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.error('Failed to save DSA progress:', err);
    }
  }, [progress]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  const toggleFundamental = (id: string) => {
    setProgress((prev) => {
      const map = prev.completedFundamentals || {};
      const updated = !map[id];
      if (updated) triggerConfetti();
      return {
        ...prev,
        completedFundamentals: {
          ...map,
          [id]: updated,
        },
      };
    });
  };

  const checkAllFundamentals = (fundamentalIds: string[]) => {
    setProgress((prev) => {
      const map = { ...(prev.completedFundamentals || {}) };
      fundamentalIds.forEach((id) => {
        map[id] = true;
      });
      triggerConfetti();
      return {
        ...prev,
        completedFundamentals: map,
      };
    });
  };

  const clearAllFundamentals = (fundamentalIds: string[]) => {
    setProgress((prev) => {
      const map = { ...(prev.completedFundamentals || {}) };
      fundamentalIds.forEach((id) => {
        delete map[id];
      });
      return {
        ...prev,
        completedFundamentals: map,
      };
    });
  };

  const toggleProblem = (problemId: string) => {
    setProgress((prev) => {
      const isCurrentlyCompleted = prev.completedProblems[problemId] || prev.problemStatus[problemId] === 'completed';
      const nextCompleted = !isCurrentlyCompleted;
      const today = getTodayDateString();
      const currentLogCount = prev.activityLog[today] || 0;

      if (nextCompleted) {
        triggerConfetti();
      }

      return {
        ...prev,
        completedProblems: {
          ...prev.completedProblems,
          [problemId]: nextCompleted,
        },
        problemStatus: {
          ...prev.problemStatus,
          [problemId]: nextCompleted ? 'completed' : 'not_started',
        },
        activityLog: {
          ...prev.activityLog,
          [today]: nextCompleted ? currentLogCount + 1 : Math.max(0, currentLogCount - 1),
        },
      };
    });
  };

  const setProblemStatus = (problemId: string, status: ProblemStatus) => {
    setProgress((prev) => {
      const isCompleted = status === 'completed';
      const today = getTodayDateString();
      const currentLogCount = prev.activityLog[today] || 0;

      if (isCompleted && prev.problemStatus[problemId] !== 'completed') {
        triggerConfetti();
      }

      return {
        ...prev,
        problemStatus: {
          ...prev.problemStatus,
          [problemId]: status,
        },
        completedProblems: {
          ...prev.completedProblems,
          [problemId]: isCompleted,
        },
        activityLog: {
          ...prev.activityLog,
          [today]: isCompleted ? currentLogCount + 1 : currentLogCount,
        },
      };
    });
  };

  const incrementRevision = (problemId: string, delta: number) => {
    setProgress((prev) => {
      const current = prev.revisionCounts[problemId] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        revisionCounts: {
          ...prev.revisionCounts,
          [problemId]: next,
        },
      };
    });
  };

  const toggleFavorite = (problemId: string) => {
    setProgress((prev) => ({
      ...prev,
      favorites: {
        ...prev.favorites,
        [problemId]: !prev.favorites[problemId],
      },
    }));
  };

  const saveProblemNote = (problemId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      problemNotes: {
        ...prev.problemNotes,
        [problemId]: note,
      },
    }));
  };

  const savePatternNote = (patternId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      patternNotes: {
        ...prev.patternNotes,
        [patternId]: note,
      },
    }));
  };

  const setCurrentGoal = (goal: string) => {
    setProgress((prev) => ({ ...prev, currentGoal: goal }));
  };

  const setActiveTopic = (topicId: string) => {
    setProgress((prev) => ({ ...prev, activeTopicId: topicId }));
  };

  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dsa_roadmap_backup_${getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed && typeof parsed === 'object') {
        setProgress(parsed);
        alert('Roadmap progress successfully imported!');
      }
    } catch (err) {
      alert('Invalid JSON file format.');
    }
  };

  const resetAllProgress = () => {
    if (confirm('Are you sure you want to reset all your progress, notes, and streak data?')) {
      setProgress(initialProgress);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Calculate detailed stats
  const statistics: Statistics = useMemo(() => {
    let totalProblems = 0;
    let solvedProblems = 0;
    let easyTotal = 0;
    let easySolved = 0;
    let mediumTotal = 0;
    let mediumSolved = 0;
    let hardTotal = 0;
    let hardSolved = 0;
    let totalPatterns = 0;
    let completedPatterns = 0;
    let totalTopics = DSA_TOPICS.length;
    let completedTopics = 0;
    let totalFundamentals = 0;
    let completedFundamentalsCount = 0;

    let totalRevisions = Object.values(progress.revisionCounts).reduce((acc, curr) => acc + curr, 0);

    DSA_TOPICS.forEach((topic) => {
      let topicAllFundamentalsDone = true;
      let topicAllProblemsDone = true;

      topic.fundamentals.forEach((f) => {
        totalFundamentals++;
        if (progress.completedFundamentals[f.id]) {
          completedFundamentalsCount++;
        } else {
          topicAllFundamentalsDone = false;
        }
      });

      topic.patterns.forEach((pattern) => {
        totalPatterns++;
        let patternAllDone = true;

        pattern.problems.forEach((prob) => {
          totalProblems++;
          const isSolved = progress.completedProblems[prob.id] || progress.problemStatus[prob.id] === 'completed';

          if (prob.difficulty === 'Easy') {
            easyTotal++;
            if (isSolved) easySolved++;
          } else if (prob.difficulty === 'Medium') {
            mediumTotal++;
            if (isSolved) mediumSolved++;
          } else if (prob.difficulty === 'Hard') {
            hardTotal++;
            if (isSolved) hardSolved++;
          }

          if (isSolved) {
            solvedProblems++;
          } else {
            patternAllDone = false;
            topicAllProblemsDone = false;
          }
        });

        if (patternAllDone && pattern.problems.length > 0) {
          completedPatterns++;
        }
      });

      if (topicAllFundamentalsDone && topicAllProblemsDone && topic.patterns.length > 0) {
        completedTopics++;
      }
    });

    const remainingProblems = totalProblems - solvedProblems;
    const overallPercentage = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

    return {
      totalTopics,
      completedTopics,
      totalPatterns,
      completedPatterns,
      totalProblems,
      solvedProblems,
      remainingProblems,
      overallPercentage,
      easyTotal,
      easySolved,
      mediumTotal,
      mediumSolved,
      hardTotal,
      hardSolved,
      totalRevisions,
      totalFundamentals,
      completedFundamentalsCount,
    };
  }, [progress]);

  return {
    progress,
    statistics,
    toggleFundamental,
    checkAllFundamentals,
    clearAllFundamentals,
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
  };
}
