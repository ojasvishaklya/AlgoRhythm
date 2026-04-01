# DSA Problem Recommendation Engine

An adaptive recommendation system for DSA problem practice, inspired by spaced repetition algorithms (SM-2, Duolingo) and educational research.

## Overview

The recommendation engine helps users:
- **Systematically cover all problems** in the first pass
- **Focus on weak areas** (topics, patterns, difficulty) in revision cycles
- **Optimize retention** through spaced repetition scheduling
- **Track mastery** at multiple levels (topic, pattern, difficulty)

## Core Algorithm

### Priority Formula

**First Pass (Cycle 1):**
```
Priority = BaseWeight × DifficultyWeight + VarietyBonus

Where:
- BaseWeight: 100 (unattempted), 50 (attempted with rating < 3), 10 (attempted with rating ≥ 3)
- DifficultyWeight: Medium (1.5x), Hard (1.2x), Easy (0.8x)
- VarietyBonus: 0-20 points for topic/pattern diversity
```

**Revision Cycles (Cycle 2+):**
```
Priority = WeaknessScore + UrgencyScore + VarietyBonus + DifficultyBonus

Where:
- WeaknessScore (0-100): Based on topic (40%), pattern (40%), problem (20%) mastery
- UrgencyScore (0-50): Based on days overdue for review
- VarietyBonus (0-20): Rewards different topics/patterns
- DifficultyBonus: -2 to +5 based on difficulty preference
```

### Mastery Calculation

For each problem:
```
Mastery = WeightedAvgConfidence × AttemptFactor × MemoryStrength

Where:
- WeightedAvgConfidence: Recent attempts weighted more (exponential decay over 30 days)
- AttemptFactor: min(attemptCount, 3) / 3 (maxes out at 3 attempts)
- MemoryStrength: e^(-daysSince / halfLife), halfLife = 7 × EF
```

For topics/patterns:
```
TopicMastery = Σ(ProblemMastery) / (TotalProblems × 100)
```

### Easiness Factor (EF)

Adapted from SM-2 algorithm:
```
EF' = EF - 0.8 + 0.28×rating - 0.02×rating²

Range: [1.3, 3.0]
Initial: 2.5
```

### Review Intervals

```
Interval(1) = 1 day
Interval(2) = 3 days
Interval(n) = Interval(n-1) × EF

Reset to 1 day if rating < 3
```

## Confidence Rating Scale (0-5)

- **0**: Couldn't solve, no idea
- **1**: Solved with heavy hints/solution
- **2**: Solved but struggled significantly
- **3**: Solved with some difficulty
- **4**: Solved confidently
- **5**: Trivial, can solve in sleep

## Usage

### 1. Update Problem After Attempt

```typescript
import { updateProblemAfterAttempt } from './engine/recommender.js';

// User completes a problem with confidence rating
const updatedProblem = updateProblemAfterAttempt(
  problem,
  4, // confidence score (0-5)
  25, // time taken in minutes (optional)
  'Used two pointers approach' // notes (optional)
);

// updatedProblem now has:
// - Updated easinessFactor
// - New nextReviewDate
// - Attempt record added
// - completed flag updated if confidence >= 3
```

### 2. Get Recommendations

```typescript
import { buildRecommendationContext, getRecommendations } from './engine/recommender.js';
import { TOPICS } from './types/problem.js';

// Build context from current state
const context = buildRecommendationContext(
  'user-123',
  allProblems,
  TOPICS
);

// Get recommendations
const response = getRecommendations({
  context,
  count: 10, // Number of recommendations
  focusTopic: 'Dynamic Programming', // Optional: focus on specific topic
  maxDifficulty: 'Medium', // Optional: cap difficulty
  excludeProblems: ['problem-123'] // Optional: exclude certain problems
});

// response contains:
// - problems: Array of RecommendedProblem with priority scores and reasons
// - cycleProgress: Current cycle info and topic completion status
// - insights: Strongest/weakest topics, recommended focus, overall mastery
```

### 3. Calculate Statistics

```typescript
import {
  calculateTopicMastery,
  getWeakestTopics,
  getOverdueProblems,
  calculateStudyStreak
} from './engine/statistics.js';

// Get mastery for a specific topic
const arrayMastery = calculateTopicMastery(allProblems, 'Array');
console.log(`Array mastery: ${(arrayMastery * 100).toFixed(1)}%`);

// Find weakest topics
const weakTopics = getWeakestTopics(allProblems, TOPICS, 3);
console.log('Focus on:', weakTopics);

// Get problems due for review
const overdueProblems = getOverdueProblems(allProblems);
console.log(`${overdueProblems.length} problems overdue`);

// Calculate study streak
const streak = calculateStudyStreak(allProblems);
console.log(`${streak} day streak!`);
```

### 4. Migrate Old Data

```typescript
import { migrateProblem, migrateProblems } from './utils/migration.js';

// Migrate single problem
const newProblem = migrateProblem(oldProblemData);

// Migrate array of problems
const newProblems = migrateProblems(oldProblemsArray);

// Migrate topic file
import { migrateTopicFile } from './utils/migration.js';
const newTopicFile = migrateTopicFile(oldTopicFile);
```

## Mastery Levels

| Score | Level | Color | Description |
|-------|-------|-------|-------------|
| 0.85-1.0 | Master | Dark Green | Fully mastered, can explain to others |
| 0.7-0.85 | Proficient | Light Green | Confident, minimal review needed |
| 0.5-0.7 | Intermediate | Yellow | Decent understanding, regular practice helps |
| 0.3-0.5 | Learning | Orange | Building foundations, frequent practice needed |
| 0.0-0.3 | Beginner | Red | Just starting, needs significant practice |

## Recommendation Reasons

- **`first-exposure`**: New problem, never attempted before
- **`scheduled-review`**: Due for spaced repetition review
- **`weak-area-focus`**: Problem in a weak topic/pattern
- **`overdue-review`**: Past the scheduled review date
- **`confidence-recovery`**: Previously scored low confidence (< 3)
- **`pattern-reinforcement`**: Similar patterns to high-confidence problems
- **`difficulty-progression`**: Progressive difficulty increase

## Research Background

The algorithm combines insights from:
1. **SM-2 (SuperMemo)**: Easiness factor and interval calculations
2. **Duolingo's Half-Life Regression**: Memory decay modeling
3. **DAS3H**: Multi-skill tracking (topic + pattern)
4. **User Preference**: Medium > Hard > Easy difficulty prioritization

## Testing

See `../engine/README.md` for test scenarios and verification checklist.

## Files

- `formulas.ts`: Pure mathematical functions (EF, intervals, decay)
- `statistics.ts`: Mastery calculations and progress tracking
- `recommender.ts`: Main recommendation logic
- `../utils/migration.ts`: Data migration utilities
- `../types/problem.ts`: TypeScript type definitions
