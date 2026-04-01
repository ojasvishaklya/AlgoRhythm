/**
 * Pure mathematical formulas for the recommendation system
 * Based on SM-2 algorithm and spaced repetition research
 */

/**
 * Update Easiness Factor based on confidence rating (0-5 scale)
 * Adapted from SM-2: EF' = EF - 0.8 + 0.28*q - 0.02*q²
 * @param currentEF - Current easiness factor (1.3-3.0)
 * @param rating - Confidence rating (0-5)
 * @returns New easiness factor clamped to [1.3, 3.0]
 */
export function updateEasinessFactor(currentEF: number, rating: number): number {
  // Validate inputs
  const ef = Math.max(1.3, Math.min(3.0, currentEF));
  const q = Math.max(0, Math.min(5, rating));

  // SM-2 formula adaptation
  const newEF = ef - 0.8 + 0.28 * q - 0.02 * q * q;

  // Clamp to valid range
  return Math.max(1.3, Math.min(3.0, newEF));
}

/**
 * Calculate next review interval in days
 * @param currentInterval - Current interval in days
 * @param ef - Easiness factor
 * @param attemptCount - Number of times attempted
 * @param rating - Most recent confidence rating
 * @returns Next interval in days
 */
export function calculateNextInterval(
  currentInterval: number,
  ef: number,
  attemptCount: number,
  rating: number
): number {
  // If rating < 3, reset to day 1 (restart learning)
  if (rating < 3) {
    return 1;
  }

  // First successful attempt: 1 day
  if (attemptCount === 1) {
    return 1;
  }

  // Second attempt: 3 days
  if (attemptCount === 2) {
    return 3;
  }

  // Subsequent attempts: multiply by EF
  return Math.round(currentInterval * ef);
}

/**
 * Calculate memory strength decay over time
 * Strength = e^(-days_elapsed / half_life)
 * @param daysSinceAttempt - Days since last attempt
 * @param halfLife - Half-life in days (typically 7 * EF)
 * @returns Memory strength (0-1)
 */
export function calculateMemoryDecay(daysSinceAttempt: number, halfLife: number): number {
  if (daysSinceAttempt <= 0) return 1.0;
  if (halfLife <= 0) return 0.0;

  return Math.exp(-daysSinceAttempt / halfLife);
}

/**
 * Calculate half-life based on easiness factor
 * @param ef - Easiness factor (1.3-3.0)
 * @returns Half-life in days
 */
export function calculateHalfLife(ef: number): number {
  return 7 * ef; // Ranges from ~9 days (hard) to ~21 days (easy)
}

/**
 * Calculate weakness score from mastery level (inverted)
 * @param mastery - Mastery score (0-1)
 * @returns Weakness score (0-100)
 */
export function calculateWeaknessScore(mastery: number): number {
  return (1 - Math.max(0, Math.min(1, mastery))) * 100;
}

/**
 * Calculate urgency score based on review schedule
 * @param daysSinceAttempt - Days since last attempt
 * @param recommendedInterval - Recommended interval from algorithm
 * @returns Urgency score (0-50)
 */
export function calculateReviewUrgency(
  daysSinceAttempt: number,
  recommendedInterval: number
): number {
  if (daysSinceAttempt < recommendedInterval) {
    return 0; // Not yet due
  }

  // Calculate how overdue the review is
  const overdueRatio = daysSinceAttempt / recommendedInterval;
  const urgency = 50 * Math.min(overdueRatio, 2.0); // Cap at 2x overdue = max urgency

  return Math.min(50, urgency);
}

/**
 * Calculate variety bonus to prevent repetition
 * @param recentTopics - Array of recent problem topics
 * @param recentPatterns - Array of recent problem patterns
 * @param candidateTopic - Topic of candidate problem
 * @param candidatePattern - Pattern of candidate problem
 * @returns Variety bonus (0-20)
 */
export function calculateVarietyBonus(
  recentTopics: string[],
  recentPatterns: string[],
  candidateTopic: string,
  candidatePattern: string
): number {
  let bonus = 0;

  // Check last 3 problems for topic diversity
  const last3Topics = recentTopics.slice(-3);
  if (last3Topics.length === 3 && last3Topics.every(t => t === last3Topics[0])) {
    // All 3 are same topic
    if (candidateTopic !== last3Topics[0]) {
      bonus += 10; // Reward different topic
    }
  }

  // Check last 3 problems for pattern diversity
  const last3Patterns = recentPatterns.slice(-3);
  if (last3Patterns.length === 3 && last3Patterns.every(p => p === last3Patterns[0])) {
    // All 3 are same pattern
    if (candidatePattern !== last3Patterns[0]) {
      bonus += 10; // Reward different pattern
    }
  }

  return bonus;
}

/**
 * Calculate difficulty weight based on user preference (Medium > Hard > Easy)
 * @param difficulty - Problem difficulty
 * @returns Weight multiplier
 */
export function getDifficultyWeight(difficulty: 'Easy' | 'Medium' | 'Hard' | null): number {
  switch (difficulty) {
    case 'Medium':
      return 1.5;
    case 'Hard':
      return 1.2;
    case 'Easy':
      return 0.8;
    default:
      return 1.0;
  }
}

/**
 * Calculate recency weight for mastery contribution
 * Recent attempts contribute more to mastery than old ones
 * @param daysSinceAttempt - Days since attempt
 * @param decayPeriod - Period in days (default 30)
 * @returns Recency weight (0-1)
 */
export function calculateRecencyWeight(daysSinceAttempt: number, decayPeriod: number = 30): number {
  return Math.exp(-daysSinceAttempt / decayPeriod);
}

/**
 * Calculate attempt factor for mastery contribution
 * More attempts = more weight (maxes out at 3 attempts)
 * @param attemptCount - Number of attempts
 * @returns Attempt factor (0-1)
 */
export function calculateAttemptFactor(attemptCount: number): number {
  return Math.min(attemptCount, 3) / 3;
}

/**
 * Convert mastery score (0-1) to level name
 * @param mastery - Mastery score (0-1)
 * @returns Level name
 */
export function getMasteryLevel(mastery: number): string {
  if (mastery >= 0.85) return 'Master';
  if (mastery >= 0.7) return 'Proficient';
  if (mastery >= 0.5) return 'Intermediate';
  if (mastery >= 0.3) return 'Learning';
  return 'Beginner';
}

/**
 * Convert mastery score to color code
 * @param mastery - Mastery score (0-1)
 * @returns Color name
 */
export function getMasteryColor(mastery: number): string {
  if (mastery >= 0.85) return 'dark-green';
  if (mastery >= 0.7) return 'light-green';
  if (mastery >= 0.5) return 'yellow';
  if (mastery >= 0.3) return 'orange';
  return 'red';
}

/**
 * Calculate days elapsed between two ISO date strings
 * @param from - Earlier date (ISO 8601)
 * @param to - Later date (ISO 8601), defaults to now
 * @returns Days elapsed (can be fractional)
 */
export function daysBetween(from: string | null, to?: string): number {
  if (!from) return 0;

  const fromDate = new Date(from);
  const toDate = to ? new Date(to) : new Date();

  const msPerDay = 24 * 60 * 60 * 1000;
  return (toDate.getTime() - fromDate.getTime()) / msPerDay;
}
