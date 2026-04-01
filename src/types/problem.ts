/**
 * DSA Problem Schema - Simplified TypeScript Definitions
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export const PLATFORMS = [
  'LeetCode',
  'GeeksforGeeks',
  'Codeforces',
  'HackerRank',
  'InterviewBit',
  'CodeChef',
  'Other'
] as const;
export type Platform = typeof PLATFORMS[number];

export const TOPICS = [
  'Array',
  'String',
  'Hash Map & Set',
  'Two Pointers',
  'Sliding Window',
  'Linked List',
  'Stack & Queue',
  'Binary Search',
  'Sorting',
  'Bit Manipulation',
  'Math & Number Theory',
  'Tree & BST',
  'Trie',
  'Graph',
  'Heap / Priority Queue',
  'Dynamic Programming',
  'Greedy',
  'Backtracking & Recursion',
  'Intervals',
  'Matrix',
  'Design',
  'Advanced Algorithms'
] as const;
export type Topic = typeof TOPICS[number];

export const PATTERNS = [
  'Sliding Window',
  'Two Pointers',
  'Fast and Slow Pointers',
  'Merge Intervals',
  'Cyclic Sort',
  'In-Place Linked List Reversal',
  'Binary Search',
  'Backtracking',
  'Breadth-First Search (BFS)',
  'Depth-First Search (DFS)',
  'Topological Sort',
  'Union-Find',
  'Greedy',
  'Dynamic Programming (DP)',
  'Bit Manipulation',
  'Matrix Traversal',
  'Heap / Priority Queue',
  'Divide and Conquer',
  'Prefix Sum',
  "Kadane's Algorithm",
  'Trie',
  'Segment Tree',
  'Graph Traversal',
  'Flood Fill',
  'Monotonic Stack/Queue',
  'Hash Maps',
  'Subsets',
  'K-way Merge',
  'Top K Elements',
  'Two Heaps'
] as const;
export type Pattern = typeof PATTERNS[number];

// ============================================================================
// LEARNING & SPACED REPETITION
// ============================================================================

export const CONFIDENCE_LEVELS = [0, 1, 2, 3, 4, 5] as const;
export type ConfidenceLevel = typeof CONFIDENCE_LEVELS[number];

export interface AttemptRecord {
  attemptedAt: string; // ISO 8601
  confidenceScore: ConfidenceLevel;
  timeTakenMinutes?: number;
  notes?: string;
}

// ============================================================================
// CORE PROBLEM INTERFACE
// ============================================================================

export interface Problem {
  // Identity
  id: string;
  title: string;
  url: string;

  // Categorization
  platform: Platform | null;
  difficulty: Difficulty | null;
  topic: Topic;
  pattern: Pattern;

  // Status (simplified from 24 booleans to just essentials)
  completed: boolean;
  bookmarked: boolean;
  attemptCount: number;

  // Timestamps (reduced from 5 to 2)
  lastAttemptedAt: string | null; // ISO 8601
  completedAt: string | null;

  // Notes & Tags
  notes: string;
  tags: string[];

  // Optional metadata
  companies?: string[];
  importance?: 'IMP' | 'VVI' | 'VVVI' | 'VVVVI';

  // Spaced Repetition & Learning Progress
  attempts: AttemptRecord[]; // History of all attempts
  lastConfidenceScore: ConfidenceLevel | null; // Most recent confidence
  easinessFactor: number; // SM-2 algorithm factor (1.3-2.5)
  nextReviewDate: string | null; // ISO 8601 - when to review next
  currentCycle: number; // Which learning cycle (1 = first exposure, 2+ = revisions)
  masteryScore: number; // Calculated score 0-100 indicating mastery level
}

// ============================================================================
// COLLECTION STRUCTURES
// ============================================================================

export interface TopicCollection {
  topic: Topic;
  problems: Problem[];
  stats: {
    total: number;
    completed: number;
    byDifficulty: {
      Easy: number;
      Medium: number;
      Hard: number;
    };
  };
}

export interface ProblemIndex {
  totalProblems: number;
  lastUpdated: string;
  topics: Array<{
    name: Topic;
    file: string;
    count: number;
  }>;
}

// ============================================================================
// RECOMMENDATION SYSTEM
// ============================================================================

export interface TopicMastery {
  topic: Topic;
  totalProblems: number;
  attemptedProblems: number;
  averageMastery: number; // 0-100
  averageConfidence: number; // 0-5
  weakestPatterns: Pattern[];
  lastPracticedAt: string | null;
}

export interface RecommendationContext {
  userId: string;
  currentCycle: number; // Global cycle across all topics
  topicMasteries: TopicMastery[];
  totalProblemsAttempted: number;
  totalProblems: number;
  studyStreak: number; // days
  lastStudyDate: string | null;
}

export interface RecommendedProblem {
  problem: Problem;
  reason: RecommendationReason;
  priorityScore: number;
  estimatedDifficulty: number; // 1-10 scale
}

export type RecommendationReason =
  | 'first-exposure' // Cycle 1: New problem
  | 'scheduled-review' // Due for spaced repetition
  | 'weak-area-focus' // Low mastery in this topic/pattern
  | 'overdue-review' // Past due date
  | 'confidence-recovery' // Previously scored low confidence
  | 'pattern-reinforcement' // Similar to problems with high confidence
  | 'difficulty-progression'; // Progressive difficulty increase

export interface RecommendationRequest {
  context: RecommendationContext;
  count: number; // How many problems to recommend
  focusTopic?: Topic; // Optional: focus on specific topic
  maxDifficulty?: Difficulty; // Optional: cap difficulty
  excludeProblems?: string[]; // Problem IDs to exclude
}

export interface RecommendationResponse {
  problems: RecommendedProblem[];
  cycleProgress: {
    currentCycle: number;
    cycleCompletion: number; // 0-100%
    topicsCompleted: Topic[];
    topicsInProgress: Topic[];
    topicsNotStarted: Topic[];
  };
  insights: {
    strongestTopics: Topic[];
    weakestTopics: Topic[];
    recommendedFocus: Topic;
    overallMastery: number; // 0-100
  };
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isProblem(obj: any): obj is Problem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.topic === 'string' &&
    typeof obj.pattern === 'string'
  );
}
