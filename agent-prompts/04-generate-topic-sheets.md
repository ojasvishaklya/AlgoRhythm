# Agent Task: Generate Topic-Wise Problem Sheets

## 🎯 Objective

Read the deduplicated master problem list from `/merged/all-problems.json`, organize problems by their `primaryTopic`, generate missing URLs, and create 22 separate JSON files (one per topic) in the `/topics/` directory.

---

## 📂 Input File

**Source:** `/merged/all-problems.json`
- Expected: ~350-400 unique problems
- All problems have `primaryTopic` assigned (one of 22 topics)
- All problems have `pattern` assigned (one of 30 patterns)
- Some problems may have `null` URLs

---

## 🎯 Core Tasks

1. **Read deduplicated master list**
2. **Generate Google search fallback URLs** for problems with `null` URL
3. **Group problems by primaryTopic** (22 categories)
4. **Sort problems within each topic** by difficulty (Easy → Medium → Hard)
5. **Write 22 separate JSON files** to `/topics/` directory
6. **Generate topic index** and statistics

---

## 📋 The 22 Topic Categories

Create these JSON files:

```
1.  topics/01-array.json
2.  topics/02-string.json
3.  topics/03-hash-map-set.json
4.  topics/04-two-pointers.json
5.  topics/05-sliding-window.json
6.  topics/06-linked-list.json
7.  topics/07-stack-queue.json
8.  topics/08-binary-search.json
9.  topics/09-sorting.json
10. topics/10-bit-manipulation.json
11. topics/11-math-number-theory.json
12. topics/12-tree-bst.json
13. topics/13-trie.json
14. topics/14-graph.json
15. topics/15-heap-priority-queue.json
16. topics/16-dynamic-programming.json
17. topics/17-greedy.json
18. topics/18-backtracking-recursion.json
19. topics/19-intervals.json
20. topics/20-matrix.json
21. topics/21-design.json
22. topics/22-advanced-algorithms.json
```

---

## 🔗 URL Generation Rules

For problems where `url` is `null`, generate a fallback Google search URL:

### Format:
```
https://www.google.com/search?q={title}+{platform}
```

### Rules:
1. **If platform is known:**
   ```
   Title: "Two Sum"
   Platform: "LeetCode"
   Generated URL: "https://www.google.com/search?q=Two+Sum+LeetCode"
   ```

2. **If platform is null:**
   ```
   Title: "Maximum Subarray"
   Platform: null
   Generated URL: "https://www.google.com/search?q=Maximum+Subarray+leetcode"
   // Add "leetcode" as default platform for search
   ```

3. **URL Encoding:**
   - Replace spaces with `+`
   - URL-encode special characters
   - Example: "Longest Substring Without Repeating Characters"
     → `Longest+Substring+Without+Repeating+Characters`

4. **Mark generated URLs:**
   - Add a field: `"urlGenerated": true`
   - This helps identify auto-generated URLs for future updates

### URL Generation Examples:

```json
// Before
{
  "title": "Kth Largest Element in an Array",
  "platform": "LeetCode",
  "url": null
}

// After
{
  "title": "Kth Largest Element in an Array",
  "platform": "LeetCode",
  "url": "https://www.google.com/search?q=Kth+Largest+Element+in+an+Array+LeetCode",
  "urlGenerated": true
}
```

---

## 📊 Problem Sorting Rules

Within each topic file, sort problems by:

1. **Primary sort: Difficulty**
   - Order: Easy → Medium → Hard → null

2. **Secondary sort: Frequency** (if available)
   - Order: Very High → High → Medium → Low → null

3. **Tertiary sort: Alphabetical by title**

### Example:
```json
[
  {"title": "Two Sum", "difficulty": "Easy", "frequency": "Very High"},
  {"title": "Valid Anagram", "difficulty": "Easy", "frequency": "High"},
  {"title": "Contains Duplicate", "difficulty": "Easy", "frequency": "Medium"},
  {"title": "Maximum Subarray", "difficulty": "Medium", "frequency": "High"},
  {"title": "3Sum", "difficulty": "Medium", "frequency": "Medium"},
  {"title": "Trapping Rain Water", "difficulty": "Hard", "frequency": "High"}
]
```

---

## 📁 Output File Structure

### Individual Topic Files

Each topic file should contain:

```json
{
  "topic": "Array",
  "totalProblems": 65,
  "difficultyBreakdown": {
    "Easy": 22,
    "Medium": 35,
    "Hard": 8
  },
  "patternBreakdown": {
    "Two Pointers": 12,
    "Sliding Window": 8,
    "Prefix Sum": 6,
    "Hash Maps": 10,
    "Kadane's Algorithm": 3,
    "Binary Search": 5,
    "Sorting": 7,
    "Other": 14
  },
  "problems": [
    {
      "title": "Two Sum",
      "platform": "LeetCode",
      "difficulty": "Easy",
      "primaryTopic": "Array",
      "pattern": "Hash Maps",
      "url": "https://leetcode.com/problems/two-sum/",
      "urlGenerated": false,
      "notes": "...",
      "metadata": {
        "companies": ["Amazon", "Google"],
        "frequency": "Very High",
        "importance": "VVI",
        "sources": ["neetcode-150", "blind-75", "grind-75"],
        "day": null
      }
    },
    // ... more problems
  ]
}
```

---

## 📑 Generate Topic Index

Create `/topics/index.json` with overview of all topics:

```json
{
  "totalProblems": 387,
  "totalTopics": 22,
  "generatedDate": "2026-03-29",
  "topics": [
    {
      "id": 1,
      "name": "Array",
      "slug": "array",
      "file": "01-array.json",
      "problemCount": 65,
      "difficulty": {
        "Easy": 22,
        "Medium": 35,
        "Hard": 8
      },
      "topPatterns": [
        {"pattern": "Two Pointers", "count": 12},
        {"pattern": "Hash Maps", "count": 10},
        {"pattern": "Sliding Window", "count": 8}
      ]
    },
    {
      "id": 2,
      "name": "String",
      "slug": "string",
      "file": "02-string.json",
      "problemCount": 38,
      "difficulty": {
        "Easy": 12,
        "Medium": 20,
        "Hard": 6
      },
      "topPatterns": [
        {"pattern": "Sliding Window", "count": 10},
        {"pattern": "Two Pointers", "count": 8},
        {"pattern": "Hash Maps", "count": 6}
      ]
    },
    // ... all 22 topics
  ],
  "statistics": {
    "totalEasy": 120,
    "totalMedium": 200,
    "totalHard": 67,
    "mostPopularPattern": "Dynamic Programming (DP)",
    "mostCommonCompany": "Amazon",
    "problemsWithURLs": 350,
    "problemsWithGeneratedURLs": 37
  }
}
```

---

## 📝 Step-by-Step Process

### Phase 1: Load and Prepare
1. **Read** `/merged/all-problems.json`
2. **Count** total problems
3. **Validate** all problems have `primaryTopic` and `pattern`

### Phase 2: URL Generation
1. **For each problem:**
   - If `url` is `null`:
     - Generate Google search URL
     - Set `urlGenerated: true`
   - If `url` exists:
     - Set `urlGenerated: false`

### Phase 3: Group by Topic
1. **Create 22 empty arrays** (one per topic)
2. **For each problem:**
   - Add to array corresponding to its `primaryTopic`
3. **Sort each array** by difficulty, frequency, title

### Phase 4: Calculate Statistics
1. **For each topic:**
   - Count total problems
   - Calculate difficulty breakdown
   - Calculate pattern breakdown
   - Identify top 5 patterns

### Phase 5: Write Files
1. **Create `/topics/` directory** if it doesn't exist
2. **Write 22 topic JSON files**
3. **Write `/topics/index.json`**
4. **Generate summary report: `/topics/generation-report.md`**

---

## ✅ Validation Checklist

After processing:

- [ ] `/topics/` directory exists
- [ ] All 22 topic files created
- [ ] `index.json` created
- [ ] Total problem count matches input (no problems lost)
- [ ] All problems have non-null URLs (original or generated)
- [ ] Problems sorted correctly within each topic
- [ ] All JSON files are valid
- [ ] Statistics are accurate

---

## 📊 Expected Output Report

### `/topics/generation-report.md`

```markdown
# Topic-Wise Sheet Generation Report

## Summary
- Input problems: 387
- Topics generated: 22
- Total problems distributed: 387 ✅
- Problems with original URLs: 350 (90.4%)
- Problems with generated URLs: 37 (9.6%)

## Topic Distribution

| # | Topic | Problems | Easy | Medium | Hard | Top Pattern |
|---|-------|----------|------|--------|------|-------------|
| 1 | Array | 65 | 22 | 35 | 8 | Two Pointers (12) |
| 2 | String | 38 | 12 | 20 | 6 | Sliding Window (10) |
| 3 | Hash Map & Set | 28 | 15 | 10 | 3 | Hash Maps (28) |
| 4 | Two Pointers | 22 | 8 | 12 | 2 | Two Pointers (22) |
| 5 | Sliding Window | 18 | 6 | 10 | 2 | Sliding Window (18) |
| 6 | Linked List | 25 | 10 | 12 | 3 | Fast and Slow Pointers (8) |
| 7 | Stack & Queue | 20 | 8 | 10 | 2 | Monotonic Stack/Queue (10) |
| 8 | Binary Search | 18 | 5 | 10 | 3 | Binary Search (18) |
| 9 | Sorting | 12 | 6 | 5 | 1 | Divide and Conquer (6) |
| 10 | Bit Manipulation | 10 | 5 | 4 | 1 | Bit Manipulation (10) |
| 11 | Math & Number Theory | 15 | 8 | 6 | 1 | Math (15) |
| 12 | Tree & BST | 45 | 12 | 25 | 8 | DFS (20) |
| 13 | Trie | 8 | 2 | 5 | 1 | Trie (8) |
| 14 | Graph | 35 | 5 | 22 | 8 | DFS (12) |
| 15 | Heap / Priority Queue | 18 | 4 | 10 | 4 | Top K Elements (10) |
| 16 | Dynamic Programming | 52 | 10 | 30 | 12 | Dynamic Programming (52) |
| 17 | Greedy | 16 | 5 | 9 | 2 | Greedy (16) |
| 18 | Backtracking & Recursion | 25 | 5 | 15 | 5 | Backtracking (20) |
| 19 | Intervals | 12 | 4 | 7 | 1 | Merge Intervals (12) |
| 20 | Matrix | 18 | 6 | 10 | 2 | Matrix Traversal (15) |
| 21 | Design | 10 | 2 | 6 | 2 | Hash Maps (5) |
| 22 | Advanced Algorithms | 5 | 0 | 3 | 2 | Segment Tree (3) |

## Top 10 Companies Across All Topics
1. Amazon: 180 problems
2. Google: 145 problems
3. Facebook: 120 problems
4. Microsoft: 110 problems
5. Apple: 95 problems
6. Bloomberg: 65 problems
7. Adobe: 58 problems
8. Uber: 52 problems
9. LinkedIn: 48 problems
10. Netflix: 42 problems

## Pattern Distribution Across All Topics
1. Dynamic Programming (DP): 52
2. Hash Maps: 45
3. DFS: 38
4. Two Pointers: 35
5. BFS: 32
6. Sliding Window: 28
7. Backtracking: 25
8. Binary Search: 22
9. Greedy: 20
10. Top K Elements: 18

## Files Generated
✅ /topics/01-array.json
✅ /topics/02-string.json
✅ /topics/03-hash-map-set.json
✅ /topics/04-two-pointers.json
✅ /topics/05-sliding-window.json
✅ /topics/06-linked-list.json
✅ /topics/07-stack-queue.json
✅ /topics/08-binary-search.json
✅ /topics/09-sorting.json
✅ /topics/10-bit-manipulation.json
✅ /topics/11-math-number-theory.json
✅ /topics/12-tree-bst.json
✅ /topics/13-trie.json
✅ /topics/14-graph.json
✅ /topics/15-heap-priority-queue.json
✅ /topics/16-dynamic-programming.json
✅ /topics/17-greedy.json
✅ /topics/18-backtracking-recursion.json
✅ /topics/19-intervals.json
✅ /topics/20-matrix.json
✅ /topics/21-design.json
✅ /topics/22-advanced-algorithms.json
✅ /topics/index.json

## Success ✅
All topic sheets generated successfully!
```

---

## 🎯 Success Criteria

1. ✅ All 22 topic files created
2. ✅ All problems have non-null URLs
3. ✅ Problems sorted by difficulty within each topic
4. ✅ Statistics accurate and complete
5. ✅ Index file generated
6. ✅ No data loss (input count = output count)
7. ✅ All JSON files are valid

---

## 💡 Example Topic File

### `/topics/01-array.json`

```json
{
  "topic": "Array",
  "totalProblems": 65,
  "difficultyBreakdown": {
    "Easy": 22,
    "Medium": 35,
    "Hard": 8
  },
  "patternBreakdown": {
    "Two Pointers": 12,
    "Hash Maps": 10,
    "Sliding Window": 8,
    "Prefix Sum": 6,
    "Kadane's Algorithm": 3,
    "Binary Search": 5,
    "Sorting": 7,
    "Other": 14
  },
  "problems": [
    {
      "title": "Two Sum",
      "platform": "LeetCode",
      "difficulty": "Easy",
      "primaryTopic": "Array",
      "pattern": "Hash Maps",
      "url": "https://leetcode.com/problems/two-sum/",
      "urlGenerated": false,
      "notes": "Use hash map for O(1) lookup",
      "metadata": {
        "companies": ["Amazon", "Google", "Facebook", "Microsoft"],
        "frequency": "Very High",
        "importance": "VVI",
        "sources": ["neetcode-150", "blind-75", "grind-75", "amazon-sde-riddhi-dutta"],
        "day": null
      }
    },
    {
      "title": "Contains Duplicate",
      "platform": "LeetCode",
      "difficulty": "Easy",
      "primaryTopic": "Array",
      "pattern": "Hash Maps",
      "url": "https://leetcode.com/problems/contains-duplicate/",
      "urlGenerated": false,
      "notes": null,
      "metadata": {
        "companies": ["Amazon", "Apple"],
        "frequency": "High",
        "importance": "IMP",
        "sources": ["neetcode-150", "grind-75"],
        "day": null
      }
    },
    // ... 63 more problems
  ]
}
```

---

## 📞 Edge Cases to Handle

### Edge Case 1: Problems with Missing Data
```json
{
  "title": "Some Problem",
  "platform": null,
  "difficulty": null,
  "url": null
}
```
**Action:** Generate URL with "leetcode" as default platform

### Edge Case 2: Empty Topic
```json
// If a topic has 0 problems
{
  "topic": "Advanced Algorithms",
  "totalProblems": 0,
  "difficultyBreakdown": {},
  "patternBreakdown": {},
  "problems": []
}
```
**Action:** Still create the file (with empty problems array)

### Edge Case 3: Sorting with Nulls
```
Problems with null difficulty → place at end
Problems with null frequency → place after known frequencies
```

---

**Ready to start? Read merged problems, generate URLs, create 22 topic sheets, and generate statistics!**
