/**
 * Migration utilities to convert old problem format to new schema
 */

import type { Problem } from '../types/problem.js';

/**
 * Default values for new recommendation fields
 */
const DEFAULTS = {
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

/**
 * Migrate old problem format (with verbose progress tracking) to new simplified format
 */
export function migrateProblem(oldProblem: any): Problem {
  // Check if problem already has new fields
  if ('easinessFactor' in oldProblem && 'attempts' in oldProblem) {
    return oldProblem as Problem; // Already migrated
  }

  // Extract basic fields
  const migrated: Problem = {
    // Core identity
    id: oldProblem.id,
    title: oldProblem.title,
    url: oldProblem.url,

    // Categorization
    platform: oldProblem.platform || null,
    difficulty: oldProblem.difficulty || null,
    topic: oldProblem.primaryTopic || oldProblem.topic,
    pattern: oldProblem.pattern,

    // Status - migrate from old verbose format
    completed: oldProblem.progress?.completed || oldProblem.completed || false,
    bookmarked: oldProblem.progress?.bookmarked || oldProblem.bookmarked || false,
    attemptCount: oldProblem.userData?.attemptCount || oldProblem.attemptCount || 0,

    // Timestamps
    lastAttemptedAt: oldProblem.timestamps?.lastAttemptedAt || oldProblem.lastAttemptedAt || null,
    completedAt: oldProblem.timestamps?.completedAt || oldProblem.completedAt || null,

    // Notes & Tags
    notes: oldProblem.userData?.notes || oldProblem.notes || '',
    tags: oldProblem.userData?.customTags || oldProblem.tags || [],

    // Metadata
    companies: oldProblem.metadata?.companies || oldProblem.companies,
    importance: oldProblem.metadata?.importance || oldProblem.importance,

    // New fields with defaults
    ...DEFAULTS
  };

  // Try to infer initial values from old data
  if (oldProblem.userData?.confidenceLevel) {
    // Old confidence level (1-5) maps to our confidence score (0-5)
    migrated.lastConfidenceScore = oldProblem.userData.confidenceLevel;
    migrated.ratings = [oldProblem.userData.confidenceLevel];
  }

  // If problem was completed, create an attempt record
  if (migrated.completed && migrated.completedAt) {
    migrated.attempts = [
      {
        attemptedAt: migrated.completedAt,
        confidenceScore: migrated.lastConfidenceScore || 4, // Assume good confidence if completed
        timeTakenMinutes: oldProblem.userData?.timeTaken || undefined,
        notes: oldProblem.userData?.notes || undefined
      }
    ];
  }

  // Infer cycle based on attempt count
  if (migrated.attemptCount > 0) {
    migrated.currentCycle = migrated.attemptCount;
  }

  return migrated;
}

/**
 * Migrate an array of problems
 */
export function migrateProblems(oldProblems: any[]): Problem[] {
  return oldProblems.map(migrateProblem);
}

/**
 * Check if a problem needs migration
 */
export function needsMigration(problem: any): boolean {
  return !('easinessFactor' in problem) || !('attempts' in problem);
}

/**
 * Migrate a topic file (containing array of problems)
 */
export function migrateTopicFile(topicFile: any): any {
  if (!topicFile.problems) {
    return topicFile;
  }

  return {
    ...topicFile,
    problems: migrateProblems(topicFile.problems)
  };
}

/**
 * Create a default/empty problem with all required fields
 */
export function createEmptyProblem(
  id: string,
  title: string,
  topic: any,
  pattern: any,
  url: string = ''
): Problem {
  return {
    id,
    title,
    url,
    platform: null,
    difficulty: null,
    topic,
    pattern,
    completed: false,
    bookmarked: false,
    attemptCount: 0,
    lastAttemptedAt: null,
    completedAt: null,
    notes: '',
    tags: [],
    ...DEFAULTS
  };
}
