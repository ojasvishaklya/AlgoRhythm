/**
 * Example usage of the recommendation engine
 */

import type { Problem } from '../types/problem.js';
import { TOPICS, PATTERNS } from '../types/problem.js';
import {
  updateProblemAfterAttempt,
  buildRecommendationContext,
  getRecommendations
} from './recommender.js';
import {
  calculateTopicMastery,
  getWeakestTopics,
  getStrongestTopics,
  getOverdueProblems,
  calculateStudyStreak
} from './statistics.js';
import { migrateProblem } from '../utils/migration.js';

// ============================================================================
// EXAMPLE 1: User completes a problem
// ============================================================================

function example1_CompleteProblem() {
  console.log('=== Example 1: Complete a Problem ===\n');

  // Sample problem
  const problem: Problem = {
    id: 'leetcode-two-sum',
    title: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum/',
    platform: 'LeetCode',
    difficulty: 'Easy',
    topic: 'Array',
    pattern: 'Hash Maps',
    completed: false,
    bookmarked: false,
    attemptCount: 0,
    lastAttemptedAt: null,
    completedAt: null,
    notes: '',
    tags: [],
    easinessFactor: 2.5,
    nextReviewDate: null,
    reviewInterval: 1,
    lastRating: null,
    ratings: [],
    attempts: [],
    lastConfidenceScore: null,
    currentCycle: 1,
    masteryScore: 0
  };

  // User solves it confidently (rating 4)
  const updated = updateProblemAfterAttempt(
    problem,
    4, // confidence score
    15, // took 15 minutes
    'Used hash map to store complements'
  );

  console.log('Before:', {
    completed: problem.completed,
    attemptCount: problem.attemptCount,
    easinessFactor: problem.easinessFactor
  });

  console.log('\nAfter:', {
    completed: updated.completed,
    attemptCount: updated.attemptCount,
    easinessFactor: updated.easinessFactor.toFixed(2),
    nextReviewDate: updated.nextReviewDate?.split('T')[0],
    lastConfidenceScore: updated.lastConfidenceScore
  });

  console.log('\n✅ Problem marked as complete and scheduled for review\n');
}

// ============================================================================
// EXAMPLE 2: Get recommendations
// ============================================================================

function example2_GetRecommendations() {
  console.log('=== Example 2: Get Recommendations ===\n');

  // Sample problems (mix of attempted and unattempted)
  const problems: Problem[] = [
    // Completed problems
    createSampleProblem('p1', 'Two Sum', 'Array', 'Hash Maps', 'Easy', 4, 2),
    createSampleProblem('p2', 'Valid Parentheses', 'Stack & Queue', 'Hash Maps', 'Easy', 5, 1),
    createSampleProblem('p3', 'Merge Intervals', 'Intervals', 'Merge Intervals', 'Medium', 3, 1),

    // Partially attempted
    createSampleProblem('p4', 'LRU Cache', 'Design', 'Hash Maps', 'Medium', 2, 1),

    // Unattempted
    createSampleProblem('p5', 'Coin Change', 'Dynamic Programming', 'Dynamic Programming (DP)', 'Medium', null, 0),
    createSampleProblem('p6', 'Course Schedule', 'Graph', 'Topological Sort', 'Medium', null, 0),
    createSampleProblem('p7', 'Word Break', 'Dynamic Programming', 'Dynamic Programming (DP)', 'Medium', null, 0)
  ];

  // Build recommendation context
  const context = buildRecommendationContext('user-123', problems, TOPICS);

  console.log('User Context:');
  console.log(`- Current Cycle: ${context.currentCycle}`);
  console.log(`- Problems Attempted: ${context.totalProblemsAttempted}/${context.totalProblems}`);
  console.log(`- Study Streak: ${context.studyStreak} days\n`);

  // Get recommendations
  const response = getRecommendations({
    context,
    count: 5
  });

  console.log('Top 5 Recommendations:');
  response.problems.forEach((rec, i) => {
    console.log(`\n${i + 1}. ${rec.problem.title}`);
    console.log(`   Topic: ${rec.problem.topic}`);
    console.log(`   Priority: ${rec.priorityScore.toFixed(1)}`);
    console.log(`   Reason: ${rec.reason}`);
  });

  console.log('\n\nInsights:');
  console.log(`- Overall Mastery: ${(response.insights.overallMastery * 100).toFixed(1)}%`);
  console.log(`- Weakest Topics: ${response.insights.weakestTopics.join(', ')}`);
  console.log(`- Recommended Focus: ${response.insights.recommendedFocus}`);
  console.log(`- Strongest Topics: ${response.insights.strongestTopics.join(', ')}\n`);
}

// ============================================================================
// EXAMPLE 3: Calculate statistics
// ============================================================================

function example3_CalculateStatistics() {
  console.log('=== Example 3: Calculate Statistics ===\n');

  // Sample problems with various completion states
  const problems: Problem[] = [
    // Arrays - strong
    createSampleProblem('a1', 'Two Sum', 'Array', 'Hash Maps', 'Easy', 5, 2),
    createSampleProblem('a2', 'Best Time to Buy', 'Array', 'Sliding Window', 'Easy', 4, 2),
    createSampleProblem('a3', 'Container With Most Water', 'Array', 'Two Pointers', 'Medium', 4, 1),

    // DP - weak
    createSampleProblem('dp1', 'Climbing Stairs', 'Dynamic Programming', 'Dynamic Programming (DP)', 'Easy', 2, 1),
    createSampleProblem('dp2', 'Coin Change', 'Dynamic Programming', 'Dynamic Programming (DP)', 'Medium', 1, 1),
    createSampleProblem('dp3', 'Longest Increasing Subsequence', 'Dynamic Programming', 'Dynamic Programming (DP)', 'Medium', null, 0)
  ];

  // Calculate topic masteries
  const arrayMastery = calculateTopicMastery(problems, 'Array');
  const dpMastery = calculateTopicMastery(problems, 'Dynamic Programming');

  console.log('Topic Mastery:');
  console.log(`- Array: ${(arrayMastery * 100).toFixed(1)}%`);
  console.log(`- Dynamic Programming: ${(dpMastery * 100).toFixed(1)}%\n`);

  // Get weakest/strongest topics
  const weakest = getWeakestTopics(problems, TOPICS, 3);
  const strongest = getStrongestTopics(problems, TOPICS, 3);

  console.log(`Weakest Topics: ${weakest.join(', ')}`);
  console.log(`Strongest Topics: ${strongest.join(', ')}\n`);

  // Check for overdue problems
  const overdue = getOverdueProblems(problems);
  console.log(`Problems Due for Review: ${overdue.length}`);

  // Calculate streak
  const streak = calculateStudyStreak(problems);
  console.log(`Study Streak: ${streak} days\n`);
}

// ============================================================================
// EXAMPLE 4: Migration
// ============================================================================

function example4_Migration() {
  console.log('=== Example 4: Migrate Old Data ===\n');

  // Old format problem (with verbose progress tracking)
  const oldProblem = {
    id: 'leetcode-two-sum',
    title: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum/',
    primaryTopic: 'Array',
    pattern: 'Hash Maps',
    difficulty: 'Easy',
    progress: {
      completed: true,
      bookmarked: false,
      solvedOnce: true
    },
    userData: {
      attemptCount: 1,
      confidenceLevel: 4,
      timeTaken: 20,
      notes: 'Used hash map'
    },
    timestamps: {
      completedAt: '2024-01-15T10:30:00Z',
      lastAttemptedAt: '2024-01-15T10:30:00Z'
    }
  };

  console.log('Old format:', Object.keys(oldProblem));

  // Migrate to new format
  const newProblem = migrateProblem(oldProblem);

  console.log('\nNew format:', Object.keys(newProblem));
  console.log('\nMigrated fields:');
  console.log(`- easinessFactor: ${newProblem.easinessFactor}`);
  console.log(`- attempts: ${newProblem.attempts.length} records`);
  console.log(`- lastConfidenceScore: ${newProblem.lastConfidenceScore}`);
  console.log('✅ Migration complete\n');
}

// ============================================================================
// Helper function to create sample problems
// ============================================================================

function createSampleProblem(
  id: string,
  title: string,
  topic: any,
  pattern: any,
  difficulty: any,
  confidenceScore: number | null,
  attemptCount: number
): Problem {
  const now = new Date();
  const lastAttempt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const problem: Problem = {
    id,
    title,
    url: `https://leetcode.com/problems/${id}/`,
    platform: 'LeetCode',
    difficulty,
    topic,
    pattern,
    completed: confidenceScore !== null && confidenceScore >= 3,
    bookmarked: false,
    attemptCount,
    lastAttemptedAt: attemptCount > 0 ? lastAttempt.toISOString() : null,
    completedAt: confidenceScore !== null && confidenceScore >= 3 ? lastAttempt.toISOString() : null,
    notes: '',
    tags: [],
    easinessFactor: 2.5,
    nextReviewDate: attemptCount > 0 ? now.toISOString() : null,
    reviewInterval: 1,
    lastRating: null,
    ratings: [],
    attempts: [],
    lastConfidenceScore: confidenceScore,
    currentCycle: attemptCount,
    masteryScore: 0
  };

  // Add attempt records
  if (attemptCount > 0 && confidenceScore !== null) {
    problem.attempts = [
      {
        attemptedAt: lastAttempt.toISOString(),
        confidenceScore: confidenceScore as any
      }
    ];
    problem.ratings = [confidenceScore];
    problem.lastRating = confidenceScore;
  }

  return problem;
}

// ============================================================================
// Run all examples
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  example1_CompleteProblem();
  example2_GetRecommendations();
  example3_CalculateStatistics();
  example4_Migration();
}

export {
  example1_CompleteProblem,
  example2_GetRecommendations,
  example3_CalculateStatistics,
  example4_Migration
};
