/**
 * Main recommendation engine
 * Combines formulas and statistics to generate problem recommendations
 */

import type {
  Problem,
  Topic,
  Pattern,
  RecommendedProblem,
  RecommendationReason,
  RecommendationRequest,
  RecommendationResponse,
  RecommendationContext,
  TOPICS,
  PATTERNS
} from '../types/problem.js';

import {
  updateEasinessFactor,
  calculateNextInterval,
  getDifficultyWeight,
  calculateWeaknessScore,
  calculateReviewUrgency,
  calculateVarietyBonus,
  daysBetween
} from './formulas.js';

import {
  calculateProblemMastery,
  calculateTopicMastery,
  calculatePatternMastery,
  getWeakestTopics,
  getStrongestTopics,
  getOverdueProblems,
  getCurrentCycle,
  getTopicMasteryDetails,
  calculateStudyStreak
} from './statistics.js';

/**
 * Update problem after user completes it with a confidence rating
 */
export function updateProblemAfterAttempt(
  problem: Problem,
  confidenceScore: number,
  timeTakenMinutes?: number,
  notes?: string
): Problem {
  const now = new Date().toISOString();

  // Create attempt record
  const attemptRecord = {
    attemptedAt: now,
    confidenceScore: confidenceScore as any,
    timeTakenMinutes,
    notes
  };

  // Update easiness factor
  const newEF = updateEasinessFactor(problem.easinessFactor, confidenceScore);

  // Calculate new interval
  const newInterval = calculateNextInterval(
    problem.currentCycle || 1,
    newEF,
    problem.attemptCount + 1,
    confidenceScore
  );

  // Calculate next review date
  const nextReviewDate = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString();

  // Determine if problem should be marked completed
  // Complete when confidence >= 4 on first attempt, or >= 3 on subsequent attempts
  const shouldComplete =
    !problem.completed &&
    ((problem.attemptCount === 0 && confidenceScore >= 4) ||
      (problem.attemptCount > 0 && confidenceScore >= 3));

  // Increment cycle if this was a review (not first attempt)
  const newCycle = problem.attemptCount === 0 ? 1 : (problem.currentCycle || 1) + 1;

  return {
    ...problem,
    attemptCount: problem.attemptCount + 1,
    lastAttemptedAt: now,
    completedAt: shouldComplete ? now : problem.completedAt,
    completed: shouldComplete || problem.completed,
    attempts: [...problem.attempts, attemptRecord],
    lastConfidenceScore: confidenceScore as any,
    easinessFactor: newEF,
    nextReviewDate,
    currentCycle: newCycle,
    masteryScore: 0 // Will be recalculated by statistics engine
  };
}

/**
 * Calculate priority score for a problem in first pass (cycle 1)
 */
function calculateFirstPassPriority(problem: Problem, recentProblems: Problem[]): {
  score: number;
  reason: RecommendationReason;
} {
  let score = 0;
  let reason: RecommendationReason = 'first-exposure';

  // Base weight
  if (problem.attemptCount === 0) {
    score = 100; // Never attempted
  } else if (problem.lastConfidenceScore !== null && problem.lastConfidenceScore < 3) {
    score = 50; // Attempted but scored low
    reason = 'confidence-recovery';
  } else {
    score = 10; // Already attempted with OK score
  }

  // Difficulty weight (Medium > Hard > Easy)
  const difficultyWeight = getDifficultyWeight(problem.difficulty);
  score *= difficultyWeight;

  // Variety bonus
  const recentTopics = recentProblems.map(p => p.topic);
  const recentPatterns = recentProblems.map(p => p.pattern);
  const varietyBonus = calculateVarietyBonus(
    recentTopics,
    recentPatterns,
    problem.topic,
    problem.pattern
  );
  score += varietyBonus;

  return { score, reason };
}

/**
 * Calculate priority score for a problem in revision cycles (cycle 2+)
 */
function calculateRevisionPriority(
  problem: Problem,
  topicMastery: number,
  patternMastery: number,
  recentProblems: Problem[]
): {
  score: number;
  reason: RecommendationReason;
} {
  let reason: RecommendationReason = 'scheduled-review';

  // 1. Weakness Score (0-100)
  const topicWeakness = calculateWeaknessScore(topicMastery) * 0.4; // 40% weight
  const patternWeakness = calculateWeaknessScore(patternMastery) * 0.4; // 40% weight

  // Problem's own mastery
  const problemMastery = calculateProblemMastery(problem) / 100; // Normalize to 0-1
  const problemWeakness = calculateWeaknessScore(problemMastery) * 0.2; // 20% weight

  const weaknessScore = topicWeakness + patternWeakness + problemWeakness;

  if (weaknessScore > 60) {
    reason = 'weak-area-focus';
  }

  // 2. Urgency Score (0-50)
  let urgencyScore = 0;
  if (problem.nextReviewDate) {
    const daysSince = problem.lastAttemptedAt ? daysBetween(problem.lastAttemptedAt) : 0;
    const recommendedInterval = problem.currentCycle || 1;
    urgencyScore = calculateReviewUrgency(daysSince, recommendedInterval);

    if (urgencyScore > 40) {
      reason = 'overdue-review';
    }
  }

  // 3. Variety Bonus (0-20)
  const recentTopics = recentProblems.map(p => p.topic);
  const recentPatterns = recentProblems.map(p => p.pattern);
  const varietyBonus = calculateVarietyBonus(
    recentTopics,
    recentPatterns,
    problem.topic,
    problem.pattern
  );

  // 4. Difficulty weight
  const difficultyWeight = getDifficultyWeight(problem.difficulty);
  const difficultyBonus = (difficultyWeight - 1.0) * 10; // -2 to +5 bonus

  const totalScore = weaknessScore + urgencyScore + varietyBonus + difficultyBonus;

  return { score: totalScore, reason };
}

/**
 * Generate problem recommendations
 */
export function getRecommendations(request: RecommendationRequest): RecommendationResponse {
  const { context, count, focusTopic, maxDifficulty, excludeProblems = [] } = request;

  // Get all problems (this would come from your data source)
  // For now, assuming they're in the context
  const allProblems: Problem[] = []; // TODO: Pass problems in request or context

  // Filter out excluded problems
  let candidateProblems = allProblems.filter(p => !excludeProblems.includes(p.id));

  // Apply optional filters
  if (focusTopic) {
    candidateProblems = candidateProblems.filter(p => p.topic === focusTopic);
  }

  if (maxDifficulty) {
    const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
    const maxLevel = difficultyOrder[maxDifficulty];
    candidateProblems = candidateProblems.filter(
      p => p.difficulty === null || difficultyOrder[p.difficulty] <= maxLevel
    );
  }

  // Get recent problems for variety calculation (last 10)
  const recentProblems = allProblems
    .filter(p => p.lastAttemptedAt)
    .sort((a, b) => {
      const dateA = a.lastAttemptedAt || '';
      const dateB = b.lastAttemptedAt || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 10);

  // Calculate priorities for each candidate
  const scoredProblems: Array<{
    problem: Problem;
    score: number;
    reason: RecommendationReason;
  }> = [];

  for (const problem of candidateProblems) {
    let priorityResult;

    if (context.currentCycle === 1) {
      // First pass
      priorityResult = calculateFirstPassPriority(problem, recentProblems);
    } else {
      // Revision cycles
      const topicMastery = calculateTopicMastery(allProblems, problem.topic);
      const patternMastery = calculatePatternMastery(allProblems, problem.pattern);
      priorityResult = calculateRevisionPriority(
        problem,
        topicMastery,
        patternMastery,
        recentProblems
      );
    }

    scoredProblems.push({
      problem,
      score: priorityResult.score,
      reason: priorityResult.reason
    });
  }

  // Sort by score descending
  scoredProblems.sort((a, b) => b.score - a.score);

  // Take top N, add some randomness within top candidates
  const topCandidates = scoredProblems.slice(0, Math.min(count * 2, scoredProblems.length));

  // Shuffle top candidates slightly for variety
  const shuffled = topCandidates.sort(() => Math.random() - 0.5);

  // Select final recommendations
  const recommendations: RecommendedProblem[] = shuffled.slice(0, count).map(item => ({
    problem: item.problem,
    reason: item.reason,
    priorityScore: item.score,
    estimatedDifficulty: estimateDifficulty(item.problem)
  }));

  // Build response with insights
  return {
    problems: recommendations,
    cycleProgress: buildCycleProgress(allProblems, context),
    insights: buildInsights(allProblems, context)
  };
}

/**
 * Estimate difficulty on 1-10 scale
 */
function estimateDifficulty(problem: Problem): number {
  const baseDifficulty = {
    Easy: 3,
    Medium: 6,
    Hard: 9
  };

  return baseDifficulty[problem.difficulty || 'Medium'];
}

/**
 * Build cycle progress information
 */
function buildCycleProgress(problems: Problem[], context: RecommendationContext) {
  const totalProblems = problems.length;
  const attemptedProblems = problems.filter(p => p.attemptCount > 0).length;
  const cycleCompletion = (attemptedProblems / totalProblems) * 100;

  // Categorize topics
  const topicsCompleted: Set<Topic> = new Set();
  const topicsInProgress: Set<Topic> = new Set();
  const topicsNotStarted: Set<Topic> = new Set();

  // Get unique topics from problems
  const allTopics = new Set(problems.map(p => p.topic));

  for (const topic of allTopics) {
    const topicProblems = problems.filter(p => p.topic === topic);
    const topicAttempted = topicProblems.filter(p => p.attemptCount > 0).length;

    if (topicAttempted === 0) {
      topicsNotStarted.add(topic);
    } else if (topicAttempted === topicProblems.length) {
      topicsCompleted.add(topic);
    } else {
      topicsInProgress.add(topic);
    }
  }

  return {
    currentCycle: context.currentCycle,
    cycleCompletion,
    topicsCompleted: Array.from(topicsCompleted),
    topicsInProgress: Array.from(topicsInProgress),
    topicsNotStarted: Array.from(topicsNotStarted)
  };
}

/**
 * Build insights about user's progress
 */
function buildInsights(problems: Problem[], context: RecommendationContext) {
  const allTopics: Topic[] = Array.from(new Set(problems.map(p => p.topic)));

  const strongestTopics = getStrongestTopics(problems, allTopics as any, 3);
  const weakestTopics = getWeakestTopics(problems, allTopics as any, 3);

  // Recommend focus on weakest topic
  const recommendedFocus = weakestTopics[0];

  // Calculate overall mastery
  const overallMastery =
    problems.reduce((sum, p) => sum + calculateProblemMastery(p), 0) /
    (problems.length * 100);

  return {
    strongestTopics,
    weakestTopics,
    recommendedFocus,
    overallMastery
  };
}

/**
 * Get single next recommendation (convenience function)
 */
export function getNextRecommendation(
  context: RecommendationContext,
  problems: Problem[]
): RecommendedProblem | null {
  const response = getRecommendations({
    context,
    count: 1
  });

  return response.problems[0] || null;
}

/**
 * Build recommendation context from problems
 */
export function buildRecommendationContext(
  userId: string,
  problems: Problem[],
  allTopics: readonly Topic[]
): RecommendationContext {
  const currentCycle = getCurrentCycle(problems);
  const totalProblemsAttempted = problems.filter(p => p.attemptCount > 0).length;
  const studyStreak = calculateStudyStreak(problems);

  // Get last study date
  const lastStudyDate = problems.reduce<string | null>((latest, problem) => {
    if (!problem.lastAttemptedAt) return latest;
    if (!latest) return problem.lastAttemptedAt;
    return problem.lastAttemptedAt > latest ? problem.lastAttemptedAt : latest;
  }, null);

  // Build topic masteries
  const topicMasteries = allTopics.map(topic => getTopicMasteryDetails(problems, topic));

  return {
    userId,
    currentCycle,
    topicMasteries,
    totalProblemsAttempted,
    totalProblems: problems.length,
    studyStreak,
    lastStudyDate
  };
}
