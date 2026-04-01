# DSA Problem Recommendation System

## Overview

An intelligent recommendation system for DSA practice that uses spaced repetition and adaptive difficulty to optimize learning and retention.

## Key Features

✅ **Spaced Repetition** - Uses SM-2 algorithm for optimal review timing
✅ **Multi-Level Mastery Tracking** - Tracks progress at topic, pattern, and difficulty levels
✅ **Adaptive Prioritization** - Focuses on weak areas while maintaining variety
✅ **Confidence-Based Learning** - 0-5 scale rating after each attempt
✅ **Flexible First Pass** - Allows reviews even during initial exposure
✅ **Difficulty Preference** - Prioritizes Medium > Hard > Easy per user preference
✅ **Topic Interleaving** - Mixes topics from the start for better retention

## Quick Start

### 1. Complete a Problem

```typescript
import { updateProblemAfterAttempt } from './src/engine/recommender.js';

const updatedProblem = updateProblemAfterAttempt(
  problem,
  4, // confidence: 0=no idea, 5=trivial
  20, // minutes spent (optional)
  'Used hash map approach' // notes (optional)
);
```

### 2. Get Recommendations

```typescript
import { buildRecommendationContext, getRecommendations } from './src/engine/recommender.js';
import { TOPICS } from './src/types/problem.js';

const context = buildRecommendationContext('user-id', allProblems, TOPICS);

const recommendations = getRecommendations({
  context,
  count: 10
});

// Use recommendations.problems[0] for next problem to solve
```

### 3. View Progress

```typescript
import { calculateTopicMastery, getWeakestTopics } from './src/engine/statistics.js';

const arrayMastery = calculateTopicMastery(allProblems, 'Array');
console.log(`Array: ${(arrayMastery * 100).toFixed(1)}%`);

const weakTopics = getWeakestTopics(allProblems, TOPICS, 3);
console.log('Focus on:', weakTopics);
```

## Confidence Rating Scale

After each problem attempt, rate your confidence:

| Rating | Meaning |
|--------|---------|
| **0** | Couldn't solve, no idea how to approach |
| **1** | Solved with heavy hints or looking at solution |
| **2** | Solved but struggled significantly |
| **3** | Solved with some difficulty (marks as complete) |
| **4** | Solved confidently with minor issues |
| **5** | Trivial, could solve in sleep |

## Algorithm

### Priority Score

**First Pass:**
```
Priority = BaseWeight × DifficultyWeight + VarietyBonus
- New problems: 100 points
- Medium difficulty: 1.5x multiplier
- Variety bonus: +10 for different topic/pattern
```

**Revision Cycles:**
```
Priority = WeaknessScore + UrgencyScore + VarietyBonus
- WeaknessScore: 0-100 based on mastery
- UrgencyScore: 0-50 based on days overdue
- VarietyBonus: 0-20 for diversity
```

### Mastery Calculation

```
Problem Mastery = AvgConfidence × AttemptFactor × MemoryDecay
Topic Mastery = Σ(Problem Masteries) / Total Problems
```

### Review Scheduling

```
Interval 1: 1 day
Interval 2: 3 days
Interval n: Previous × EasinessFactor

EF ranges 1.3-3.0 (harder to easier)
EF updates based on confidence ratings
```

## File Structure

```
src/
├── types/
│   └── problem.ts              # TypeScript type definitions
├── engine/
│   ├── formulas.ts            # Pure math functions (EF, intervals, decay)
│   ├── statistics.ts          # Mastery calculations
│   ├── recommender.ts         # Main recommendation logic
│   ├── example.ts             # Usage examples
│   ├── README.md              # Detailed documentation
│   └── index.ts               # Module exports
└── utils/
    └── migration.ts           # Migrate old problem format
```

## Examples

Run the examples:

```bash
# If you have a TypeScript runner (tsx, ts-node, etc.)
tsx src/engine/example.ts
```

See `src/engine/example.ts` for:
1. Completing a problem with rating
2. Getting recommendations
3. Calculating statistics
4. Migrating old data

## Mastery Levels

| Score | Level | Description |
|-------|-------|-------------|
| 85-100% | 🟢 Master | Fully mastered |
| 70-85% | 🟢 Proficient | Confident, minimal review |
| 50-70% | 🟡 Intermediate | Decent understanding |
| 30-50% | 🟠 Learning | Building foundations |
| 0-30% | 🔴 Beginner | Just starting |

## Research Basis

Algorithm inspired by:
- **SM-2 (SuperMemo)**: Easiness factor and interval calculations
- **Duolingo**: Half-life regression and memory decay
- **DAS3H**: Multi-skill tracking (topic + pattern)
- **Educational Research**: Spaced repetition and interleaving benefits

## Testing

Key test scenarios (see plan for details):
1. ✅ Cold start → recommends Medium problems from diverse topics
2. ✅ Weak area detection → prioritizes low-mastery topics
3. ✅ Review urgency → surfaces overdue problems
4. ✅ Variety enforcement → prevents topic repetition
5. ✅ Difficulty preference → respects Medium > Hard > Easy
6. ✅ Rating impact → updates EF and intervals correctly
7. ✅ Mastery calculation → accounts for recency and attempts

## Migration

To migrate existing problems from old format:

```typescript
import { migrateProblem, migrateTopicFile } from './src/utils/migration.js';

// Single problem
const newProblem = migrateProblem(oldProblem);

// Topic file with problems array
const newTopicFile = migrateTopicFile(oldTopicFile);
```

## Documentation

- **`src/engine/README.md`**: Detailed algorithm documentation
- **`src/engine/example.ts`**: Usage examples
- **Plan file**: Implementation plan and test scenarios

## Next Steps

1. Load problem data from JSON files
2. Build UI to show recommendations
3. Add rating prompt after marking complete
4. Display mastery dashboard
5. Add filters (topic, difficulty, bookmarked)
6. Export progress reports

## Support

For issues or questions, refer to:
- Implementation plan: `.claude/plans/melodic-singing-book.md`
- Type definitions: `src/types/problem.ts`
- Algorithm details: `src/engine/README.md`
