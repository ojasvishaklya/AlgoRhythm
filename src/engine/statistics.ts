/**
 * Statistics and mastery calculation functions
 */

import type { Problem, Topic, Pattern, TopicMastery, ConfidenceLevel } from '../types/problem.js';
import {
  daysBetween,
  calculateRecencyWeight,
  calculateAttemptFactor,
  calculateMemoryDecay,
  calculateHalfLife,
  getMasteryLevel,
  getMasteryColor
} from './formulas.js';

/**
 * Calculate mastery score for a single problem (0-100)
 * Based on confidence scores, recency, and attempt count
 */
export function calculateProblemMastery(problem: Problem): number {
  if (problem.attempts.length === 0) {
    return 0; // Never attempted
  }

  // Get all confidence scores with recency weights
  const now = new Date().toISOString();
  const weightedScores: Array<{ score: number; weight: number }> = [];

  for (const attempt of problem.attempts) {
    const daysSince = daysBetween(attempt.attemptedAt, now);
    const recencyWeight = calculateRecencyWeight(daysSince);
    const score = (attempt.confidenceScore / 5) * 100; // Convert 0-5 to 0-100

    weightedScores.push({ score, weight: recencyWeight });
  }

  // Calculate weighted average
  const totalWeight = weightedScores.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = weightedScores.reduce(
    (sum, item) => sum + item.score * item.weight,
    0
  );
  const avgScore = weightedSum / totalWeight;

  // Apply attempt factor (more attempts = more confident in mastery)
  const attemptFactor = calculateAttemptFactor(problem.attemptCount);

  // Apply memory decay based on last attempt
  const daysSinceLastAttempt = problem.lastAttemptedAt
    ? daysBetween(problem.lastAttemptedAt, now)
    : 0;
  const halfLife = calculateHalfLife(problem.easinessFactor);
  const memoryStrength = calculateMemoryDecay(daysSinceLastAttempt, halfLife);

  // Final mastery score
  return avgScore * attemptFactor * memoryStrength;
}

/**
 * Calculate mastery for a specific topic across all problems
 * @returns Mastery score (0-1)
 */
export function calculateTopicMastery(problems: Problem[], topic: Topic): number {
  const topicProblems = problems.filter(p => p.topic === topic);

  if (topicProblems.length === 0) return 0;

  // Calculate mastery for each problem and average
  const masteryScores = topicProblems.map(p => calculateProblemMastery(p));
  const totalMastery = masteryScores.reduce((sum, score) => sum + score, 0);

  return totalMastery / (topicProblems.length * 100); // Normalize to 0-1
}

/**
 * Calculate mastery for a specific pattern across all problems
 * @returns Mastery score (0-1)
 */
export function calculatePatternMastery(problems: Problem[], pattern: Pattern): number {
  const patternProblems = problems.filter(p => p.pattern === pattern);

  if (patternProblems.length === 0) return 0;

  // Calculate mastery for each problem and average
  const masteryScores = patternProblems.map(p => calculateProblemMastery(p));
  const totalMastery = masteryScores.reduce((sum, score) => sum + score, 0);

  return totalMastery / (patternProblems.length * 100); // Normalize to 0-1
}

/**
 * Calculate mastery for a specific difficulty level
 * @returns Mastery score (0-1)
 */
export function calculateDifficultyMastery(
  problems: Problem[],
  difficulty: 'Easy' | 'Medium' | 'Hard'
): number {
  const difficultyProblems = problems.filter(p => p.difficulty === difficulty);

  if (difficultyProblems.length === 0) return 0;

  const masteryScores = difficultyProblems.map(p => calculateProblemMastery(p));
  const totalMastery = masteryScores.reduce((sum, score) => sum + score, 0);

  return totalMastery / (difficultyProblems.length * 100); // Normalize to 0-1
}

/**
 * Get detailed topic mastery information
 */
export function getTopicMasteryDetails(problems: Problem[], topic: Topic): TopicMastery {
  const topicProblems = problems.filter(p => p.topic === topic);
  const attemptedProblems = topicProblems.filter(p => p.attemptCount > 0);

  // Calculate average mastery
  const averageMastery = calculateTopicMastery(problems, topic) * 100; // Convert to 0-100

  // Calculate average confidence from attempted problems
  const confidenceScores = attemptedProblems
    .filter(p => p.lastConfidenceScore !== null)
    .map(p => p.lastConfidenceScore as number);

  const averageConfidence =
    confidenceScores.length > 0
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0;

  // Find weakest patterns in this topic
  const patternMasteries = new Map<Pattern, number>();

  for (const problem of attemptedProblems) {
    const pattern = problem.pattern;
    if (!patternMasteries.has(pattern)) {
      patternMasteries.set(pattern, calculatePatternMastery(problems, pattern));
    }
  }

  // Get 3 weakest patterns
  const weakestPatterns = Array.from(patternMasteries.entries())
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([pattern]) => pattern);

  // Find most recent practice date
  const lastPracticedAt = attemptedProblems.reduce<string | null>((latest, problem) => {
    if (!problem.lastAttemptedAt) return latest;
    if (!latest) return problem.lastAttemptedAt;
    return problem.lastAttemptedAt > latest ? problem.lastAttemptedAt : latest;
  }, null);

  return {
    topic,
    totalProblems: topicProblems.length,
    attemptedProblems: attemptedProblems.length,
    averageMastery,
    averageConfidence,
    weakestPatterns,
    lastPracticedAt
  };
}

/**
 * Get overall mastery statistics across all topics
 */
export function getOverallMasteryStats(problems: Problem[]) {
  const totalProblems = problems.length;
  const attemptedProblems = problems.filter(p => p.attemptCount > 0).length;
  const completedProblems = problems.filter(p => p.completed).length;

  // Calculate overall mastery (average across all problems)
  const overallMastery =
    problems.reduce((sum, p) => sum + calculateProblemMastery(p), 0) / totalProblems;

  return {
    totalProblems,
    attemptedProblems,
    completedProblems,
    overallMastery: overallMastery / 100, // 0-1 scale
    attemptRate: attemptedProblems / totalProblems,
    completionRate: completedProblems / totalProblems
  };
}

/**
 * Get problems that are due for review based on nextReviewDate
 */
export function getProblemsForReview(problems: Problem[], lookaheadDays: number = 0): Problem[] {
  const now = new Date();
  const lookaheadDate = new Date(now.getTime() + lookaheadDays * 24 * 60 * 60 * 1000);

  return problems.filter(problem => {
    if (!problem.nextReviewDate) return false;

    const reviewDate = new Date(problem.nextReviewDate);
    return reviewDate <= lookaheadDate;
  });
}

/**
 * Get problems that are overdue for review
 */
export function getOverdueProblems(problems: Problem[]): Problem[] {
  return getProblemsForReview(problems, 0);
}

/**
 * Calculate current learning cycle
 * Cycle 1: First pass through all problems
 * Cycle 2+: Revision cycles
 */
export function getCurrentCycle(problems: Problem[]): number {
  const totalProblems = problems.length;
  const attemptedOnce = problems.filter(p => p.attemptCount >= 1).length;

  // If not all problems attempted yet, still in cycle 1
  if (attemptedOnce < totalProblems) {
    return 1;
  }

  // Otherwise, look at average cycle number
  const avgCycle =
    problems.reduce((sum, p) => sum + (p.currentCycle || 1), 0) / totalProblems;

  return Math.floor(avgCycle);
}

/**
 * Get weakest topics (bottom N by mastery)
 */
export function getWeakestTopics(
  problems: Problem[],
  allTopics: readonly Topic[],
  count: number = 3
): Topic[] {
  const topicMasteries = allTopics.map(topic => ({
    topic,
    mastery: calculateTopicMastery(problems, topic)
  }));

  return topicMasteries
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, count)
    .map(item => item.topic);
}

/**
 * Get strongest topics (top N by mastery)
 */
export function getStrongestTopics(
  problems: Problem[],
  allTopics: readonly Topic[],
  count: number = 3
): Topic[] {
  const topicMasteries = allTopics.map(topic => ({
    topic,
    mastery: calculateTopicMastery(problems, topic)
  }));

  return topicMasteries
    .sort((a, b) => b.mastery - a.mastery)
    .slice(0, count)
    .map(item => item.topic);
}

/**
 * Get weakest patterns across all problems
 */
export function getWeakestPatterns(
  problems: Problem[],
  allPatterns: readonly Pattern[],
  count: number = 3
): Pattern[] {
  const patternMasteries = allPatterns.map(pattern => ({
    pattern,
    mastery: calculatePatternMastery(problems, pattern)
  }));

  return patternMasteries
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, count)
    .map(item => item.pattern);
}

/**
 * Calculate study streak (consecutive days with activity)
 */
export function calculateStudyStreak(problems: Problem[]): number {
  // Get all unique attempt dates
  const attemptDates = new Set<string>();

  for (const problem of problems) {
    for (const attempt of problem.attempts) {
      const date = attempt.attemptedAt.split('T')[0]; // Get YYYY-MM-DD
      attemptDates.add(date);
    }
  }

  if (attemptDates.size === 0) return 0;

  // Sort dates
  const sortedDates = Array.from(attemptDates).sort().reverse();

  // Count consecutive days from today backward
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let currentDate = new Date(today);

  for (const dateStr of sortedDates) {
    const checkDate = currentDate.toISOString().split('T')[0];

    if (dateStr === checkDate) {
      streak++;
      // Move to previous day
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      // Streak broken
      break;
    }
  }

  return streak;
}
