import type { UserAnswer, CategoryStats, PerformanceLevel } from '../types';
import type { Category } from '../data/questions';

export function computeCategoryStats(
  userAnswers: UserAnswer[],
  questions: { id: number; category?: string }[]
): CategoryStats[] {
  const map: Record<string, CategoryStats> = {};

  for (const q of questions) {
    const cat = q.category || 'General';
    if (!map[cat]) {
      map[cat] = { category: cat, total: 0, correct: 0 };
    }
    map[cat].total++;
    const ua = userAnswers.find((a) => a.questionId === q.id);
    if (ua?.isCorrect) map[cat].correct++;
  }

  return Object.values(map);
}

export function getPerformanceLevel(correct: number): PerformanceLevel {
  if (correct >= 36) return 'AI Literacy Champion';
  if (correct >= 30) return 'AI-Savvy Professional';
  if (correct >= 20) return 'AI Learner';
  return 'AI Explorer';
}

export function getStrengths(stats: CategoryStats[]): string[] {
  return stats
    .filter((s) => s.total > 0)
    .sort((a, b) => b.correct / b.total - a.correct / a.total)
    .slice(0, 3)
    .map((s) => s.category);
}

export function getImprovementAreas(stats: CategoryStats[]): string[] {
  return stats
    .filter((s) => s.total > 0 && s.correct < s.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
    .slice(0, 3)
    .map((s) => s.category);
}

export function getAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export const ACHIEVEMENT_MILESTONES = [
  { threshold: 10, label: '🏅 First Decade', description: '10 correct answers!' },
  { threshold: 20, label: '🥈 Halfway Hero', description: '20 correct answers!' },
  { threshold: 30, label: '🥇 AI Advocate', description: '30 correct answers!' },
  { threshold: 40, label: '👑 AI Champion', description: 'Perfect score — all 40!' },
];
