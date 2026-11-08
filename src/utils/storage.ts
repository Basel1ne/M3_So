import { StudyStats } from '../types';

const STORAGE_KEY = 'm3_social_study_stats_v1';

const DEFAULT_STATS: StudyStats = {
  solvedCount: 0,
  correctCount: 0,
  wrongIds: [],
  bookmarkedIds: [],
  unitProgress: {},
  recentTestScores: []
};

export function getStudyStats(): StudyStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStudyStats(stats: StudyStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save study stats to localStorage', e);
  }
}

export function recordQuestionResult(
  questionId: string,
  unitId: string,
  isCorrect: boolean
): StudyStats {
  const stats = getStudyStats();
  stats.solvedCount = (stats.solvedCount || 0) + 1;
  if (isCorrect) {
    stats.correctCount = (stats.correctCount || 0) + 1;
    // Remove from wrongIds if present
    stats.wrongIds = stats.wrongIds.filter(id => id !== questionId);
  } else {
    // Add to wrongIds if not present
    if (!stats.wrongIds.includes(questionId)) {
      stats.wrongIds.push(questionId);
    }
  }

  // Update unit progress
  if (!stats.unitProgress[unitId]) {
    stats.unitProgress[unitId] = { solved: 0, correct: 0 };
  }
  stats.unitProgress[unitId].solved += 1;
  if (isCorrect) {
    stats.unitProgress[unitId].correct += 1;
  }
  stats.lastStudiedUnit = unitId;

  saveStudyStats(stats);
  return stats;
}

export function toggleBookmark(questionId: string): boolean {
  const stats = getStudyStats();
  const exists = stats.bookmarkedIds.includes(questionId);
  if (exists) {
    stats.bookmarkedIds = stats.bookmarkedIds.filter(id => id !== questionId);
  } else {
    stats.bookmarkedIds.push(questionId);
  }
  saveStudyStats(stats);
  return !exists;
}

export function addTestScore(unitName: string, score: number, total: number): void {
  const stats = getStudyStats();
  const now = new Date();
  const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  stats.recentTestScores = [
    { date: dateStr, score, total, unitName },
    ...(stats.recentTestScores || []).slice(0, 9)
  ];
  saveStudyStats(stats);
}

export function resetAllStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}
