# AlgoRhythm

An intelligent DSA (Data Structures & Algorithms) practice app that uses spaced repetition and adaptive difficulty to optimize interview preparation.

## 📊 Database Overview

- **345 unique problems** (deduplicated from 673 original problems)
- **22 topic categories** (Array, String, Graph, DP, etc.)
- **30 algorithmic patterns** (Sliding Window, Two Pointers, DFS, etc.)
- **100% URL coverage** (original or Google search fallback)

## 🏗️ Project Structure

```
dsa-sheet/
├── src/
│   ├── types/
│   │   └── problem.ts          # TypeScript schema & types
│   ├── utils/
│   │   └── defaults.ts         # Default values & helper functions
│   ├── scripts/
│   │   └── migrate-topics.ts   # Migration script for existing data
│   ├── styles/
│   │   └── main.css            # Application styles
│   └── app.ts                  # Main application code
│
├── topics/                      # App database (22 JSON files)
│   ├── 01-array.json
│   ├── 02-string.json
│   ├── ...
│   ├── 22-advanced-algorithms.json
│   └── index.json
│
├── master-data/                 # Archive (source of truth)
│   ├── sheets/                 # Original 6 sheets (transformed)
│   ├── merged/                 # 345 deduplicated problems
│   └── agent-prompts/          # 4 reusable prompts
│
├── index.html                   # App entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Problem Schema

Each problem has the following structure:

### Core Fields
```typescript
{
  id: string;                    // Unique identifier
  title: string;                 // Problem title
  platform: string | null;       // LeetCode, GeeksforGeeks, etc.
  difficulty: string | null;     // Easy, Medium, Hard
  url: string;                   // Problem URL
  urlGenerated: boolean;         // True if auto-generated
  primaryTopic: string;          // One of 22 topics
  pattern: string;               // One of 30 patterns
  notes: string | null;          // Original notes
}
```

### Metadata
```typescript
{
  metadata: {
    companies: string[];         // Companies that ask this
    frequency: string | null;    // How often asked
    importance: string | null;   // VVI, VVVI, etc.
    sources: string[];           // Which sheets included this
    day: number | null;          // Day number (if applicable)
  }
}
```

### User Progress (Booleans)
```typescript
{
  progress: {
    // Completion Status
    completed: boolean;
    attemptedButNotSolved: boolean;

    // Solution Status
    hasSolution: boolean;
    hasOptimalSolution: boolean;

    // Understanding Level
    understoodCompletely: boolean;
    needsReview: boolean;

    // Practice & Repetition
    solvedOnce: boolean;
    solvedTwice: boolean;
    solvedThreePlus: boolean;

    // Bookmarks & Favorites
    bookmarked: boolean;
    isFavorite: boolean;

    // Learning Status
    watchedVideoSolution: boolean;
    readEditorialSolution: boolean;

    // Time Tracking
    solvedInTime: boolean;
    needsSpeedImprovement: boolean;

    // Interview Ready
    canExplainToOthers: boolean;
    interviewReady: boolean;

    // Revision Flags
    markedForRevision: boolean;
    revisedOnce: boolean;
    revisedMultipleTimes: boolean;

    // Difficulty Perception
    easierThanRated: boolean;
    harderThanRated: boolean;

    // Notes & Custom Tags
    hasNotes: boolean;
    hasCustomTags: boolean;
  }
}
```

### Timestamps
```typescript
{
  timestamps: {
    firstAttemptedAt: string | null;
    lastAttemptedAt: string | null;
    completedAt: string | null;
    lastReviewedAt: string | null;
    addedToFavoritesAt: string | null;
  }
}
```

### User Data
```typescript
{
  userData: {
    notes: string;               // User's personal notes
    customTags: string[];        // Custom tags
    timeTaken: number | null;    // Time in minutes
    attemptCount: number;        // Number of attempts
    personalDifficultyRating: number | null; // 1-5
    confidenceLevel: number | null;          // 1-5
    solutionLinks: string[];     // Links to solutions
    resourceLinks: string[];     // Helpful resources
    mistakesMade: string[];      // Common mistakes
    keyInsights: string[];       // Key learnings
  }
}
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Migrate Existing Data (One-time)

This adds the new schema fields (progress, timestamps, userData) to all existing problems:

```bash
# Create backup and migrate
npm run migrate

# Validate migration
npm run validate

# Rollback if needed
npm run rollback
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Build for Production

```bash
npm run build
```

## 🛠️ Development

### Type Checking

```bash
npm run type-check
```

### Watch Mode (Auto-compile TypeScript)

```bash
npm run watch
```

## 📚 Key Features

### ✅ Progress Tracking
- Mark problems as completed
- Track multiple attempts
- Monitor time taken
- Set confidence levels

### 🔖 Bookmarks & Favorites
- Bookmark important problems
- Mark favorites for quick access

### 📝 Notes & Tags
- Add personal notes
- Create custom tags
- Track mistakes and insights
- Save helpful resource links

### 📊 Statistics
- Total completed
- Problems by difficulty
- Problems by topic
- Streak tracking

### 🔍 Filtering & Search
- Filter by topic, difficulty, pattern
- Filter by company
- Show only completed/unsolved
- Show bookmarked/needs review
- Search by title

### 📱 Responsive Design
- Works on desktop and mobile
- Dark mode support
- Clean, minimal UI

## 🗂️ Topic Categories (22)

1. Array
2. String
3. Hash Map & Set
4. Two Pointers
5. Sliding Window
6. Linked List
7. Stack & Queue
8. Binary Search
9. Sorting
10. Bit Manipulation
11. Math & Number Theory
12. Tree & BST
13. Trie
14. Graph
15. Heap / Priority Queue
16. Dynamic Programming
17. Greedy
18. Backtracking & Recursion
19. Intervals
20. Matrix
21. Design
22. Advanced Algorithms

## 🧩 Algorithmic Patterns (30)

1. Sliding Window
2. Two Pointers
3. Fast and Slow Pointers
4. Merge Intervals
5. Cyclic Sort
6. In-Place Linked List Reversal
7. Binary Search
8. Backtracking
9. Breadth-First Search (BFS)
10. Depth-First Search (DFS)
11. Topological Sort
12. Union-Find
13. Greedy
14. Dynamic Programming (DP)
15. Bit Manipulation
16. Matrix Traversal
17. Heap / Priority Queue
18. Divide and Conquer
19. Prefix Sum
20. Kadane's Algorithm
21. Trie
22. Segment Tree
23. Graph Traversal
24. Flood Fill
25. Monotonic Stack/Queue
26. Hash Maps
27. Subsets
28. K-way Merge
29. Top K Elements
30. Two Heaps

## 💾 Data Storage

### Client-Side (localStorage)
User progress, bookmarks, notes, and custom tags are stored in the browser's localStorage.

### JSON Database
The `/topics/` directory serves as the static database with 22 JSON files.

### Future: Backend Integration
The schema is designed to easily integrate with a backend API:
- REST API for CRUD operations
- User authentication
- Cloud sync
- Analytics

## 🔄 Adding New Problems

Use the prompts in `master-data/agent-prompts/` to add new problems:

1. **01-assign-primary-topics.md** - Assign topics
2. **02-assign-primary-pattern.md** - Assign patterns
3. **03-deduplicate-problems.md** - Deduplicate
4. **04-generate-topic-sheets.md** - Generate topic files

## 📈 Database Statistics

- **Total Problems:** 345
- **Easy:** 50 (14.5%)
- **Medium:** 112 (32.5%)
- **Hard:** 40 (11.6%)
- **Top Pattern:** DFS (47 problems)
- **Top Company:** Amazon (101 problems)
- **Top Topic:** Tree & BST (46 problems)

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

## 📄 License

MIT

---

**Built with ❤️ using Vanilla JS + TypeScript**
# AlgoRhythm
