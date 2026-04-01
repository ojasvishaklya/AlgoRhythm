# Agent Task: Assign Primary Pattern to All Problems

## 🎯 Objective

Read all JSON files in `/sheets/` directory (after primary topics have been assigned), analyze each problem, and assign ONE primary pattern from our standardized 30-pattern taxonomy. Update each JSON file with the pattern field.

---

## 📂 Input Files

Process these JSON files in order:
1. `sheets/Aryan-dsa-160.json`
2. `sheets/neetcode-150.json`
3. `sheets/blind-75.json`
4. `sheets/grind-75.json`
5. `sheets/dsa-patterns-cheat-sheet.json`
6. `sheets/amazon-sde-riddhi-dutta.json`

---

## 🎨 Required Transformation

### Current Structure:
```json
{
  "title": "Two Sum",
  "platform": "LeetCode",
  "difficulty": "Easy",
  "primaryTopic": "Array",
  "url": "https://leetcode.com/problems/two-sum/",
  "notes": "...",
  "metadata": {
    "companies": [],
    "frequency": null,
    "pattern": "Hash Map"  // ← Old pattern field (may vary)
  }
}
```

### New Structure:
```json
{
  "title": "Two Sum",
  "platform": "LeetCode",
  "difficulty": "Easy",
  "primaryTopic": "Array",
  "pattern": "Hash Maps",  // ← ADD THIS (ONE pattern only, standardized)
  "url": "https://leetcode.com/problems/two-sum/",
  "notes": "...",
  "metadata": {
    "companies": [],
    "frequency": null
    // pattern removed from metadata
  }
}
```

---

## 📋 The 30 Standardized Patterns

Assign **EXACTLY ONE** of these patterns to each problem:

```
1.  Sliding Window
2.  Two Pointers
3.  Fast and Slow Pointers
4.  Merge Intervals
5.  Cyclic Sort
6.  In-Place Linked List Reversal
7.  Binary Search
8.  Backtracking
9.  Breadth-First Search (BFS)
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
```

---

## 🧠 Pattern Assignment Rules

### Rule 1: The Most Fundamental Algorithm/Technique

- Assign based on the **primary algorithmic approach** or **key technique** that solves the problem
- If multiple patterns apply, choose the one that is most essential to solving it

### Rule 2: Pattern Priority Order

**Algorithmic Techniques** (prefer technique over data structure):
1. **Dynamic Programming** - If DP is the core solution approach
2. **Binary Search** - If binary search is the key technique (including answer space binary search)
3. **Backtracking** - If exhaustive search with pruning is the approach
4. **Greedy** - If greedy choice property is the solution
5. **Divide and Conquer** - If problem is recursively broken down

**Specialized Patterns** (prefer specific pattern over general):
1. **Sliding Window** - Window technique on arrays/strings
2. **Two Pointers** - Two pointer technique
3. **Fast and Slow Pointers** - Cycle detection, finding middle
4. **Merge Intervals** - Interval merging/overlapping problems
5. **Cyclic Sort** - Finding missing/duplicate numbers in [1..n]
6. **Kadane's Algorithm** - Maximum subarray problems
7. **Prefix Sum** - Subarray sum queries
8. **Monotonic Stack/Queue** - Next greater/smaller element

**Graph/Tree Patterns**:
1. **Topological Sort** - Dependency ordering problems
2. **Union-Find** - Connected components, cycle detection in undirected graphs
3. **BFS** - Level-order traversal, shortest path in unweighted graphs
4. **DFS** - Path finding, connected components
5. **Graph Traversal** - General graph exploration
6. **Flood Fill** - Connected region problems (islands, etc.)

**Data Structure Patterns**:
1. **Trie** - Prefix-based string problems
2. **Heap / Priority Queue** - K-th largest/smallest, merge sorted
3. **Segment Tree** - Range queries with updates
4. **Hash Maps** - O(1) lookup problems
5. **Two Heaps** - Find median in stream

**Special Categories**:
1. **Matrix Traversal** - Specific 2D matrix problems
2. **In-Place Linked List Reversal** - Reversing linked list segments
3. **Subsets** - Generating combinations/permutations
4. **K-way Merge** - Merging K sorted lists/arrays
5. **Top K Elements** - Finding K largest/smallest elements
6. **Bit Manipulation** - Bitwise operations are core

### Rule 3: Pattern Decision Examples

| Problem Title | Primary Topic | Pattern | Reasoning |
|--------------|---------------|---------|-----------|
| Two Sum | Array | **Hash Maps** | Hash map for O(1) lookup |
| Maximum Subarray | Array | **Kadane's Algorithm** | Kadane's is the technique |
| Longest Substring Without Repeating | String | **Sliding Window** | Window technique is key |
| Container With Most Water | Array | **Two Pointers** | Two pointer approach |
| Linked List Cycle | Linked List | **Fast and Slow Pointers** | Floyd's cycle detection |
| Merge Intervals | Intervals | **Merge Intervals** | Interval merging pattern |
| Find Missing Number | Array | **Cyclic Sort** | Cyclic sort technique |
| Reverse Linked List | Linked List | **In-Place Linked List Reversal** | In-place reversal |
| Binary Search | Array | **Binary Search** | Binary search algorithm |
| Permutations | Array | **Backtracking** | Backtracking approach |
| Binary Tree Level Order Traversal | Tree & BST | **BFS** | Level-order = BFS |
| Number of Islands | Graph | **DFS** or **Flood Fill** | Connected components/flood fill |
| Course Schedule | Graph | **Topological Sort** | Dependency ordering |
| Number of Connected Components | Graph | **Union-Find** | Connected components |
| Coin Change | Dynamic Programming | **Dynamic Programming (DP)** | DP is the solution |
| Jump Game | Greedy | **Greedy** | Greedy approach |
| Trapping Rain Water | Array | **Two Pointers** | Two pointer technique |
| Implement Trie | Trie | **Trie** | Trie data structure |
| Kth Largest Element | Heap / Priority Queue | **Top K Elements** | Top K pattern |
| Merge K Sorted Lists | Linked List | **K-way Merge** | Merging K lists |
| Find Median from Data Stream | Heap / Priority Queue | **Two Heaps** | Two heap technique |
| Valid Sudoku | Matrix | **Matrix Traversal** | Matrix validation |
| Single Number | Bit Manipulation | **Bit Manipulation** | XOR trick |
| Range Sum Query | Array | **Prefix Sum** or **Segment Tree** | Depends on mutability |
| Largest Rectangle in Histogram | Stack & Queue | **Monotonic Stack/Queue** | Monotonic stack |

---

## 🔍 Analysis Guidelines

For each problem, consider:

1. **Read the title carefully** - Often hints at pattern
   - "Substring" → Sliding Window
   - "Intervals" → Merge Intervals
   - "Cycle" → Fast and Slow Pointers
   - "Tree Level Order" → BFS
   - "Permutations" → Backtracking or Subsets
   - "Kth Largest" → Top K Elements or Heap

2. **Check primaryTopic** - Helps narrow down patterns
   - Tree & BST → Likely DFS/BFS
   - Graph → Likely DFS/BFS/Topological Sort/Union-Find
   - Dynamic Programming → Likely DP
   - Intervals → Likely Merge Intervals

3. **Check old metadata.pattern** - Use as a hint, but standardize
   - "Hash Map" → **Hash Maps**
   - "DP" → **Dynamic Programming (DP)**
   - "DFS" → **DFS**
   - "Sliding Window" → **Sliding Window**

4. **Use problem knowledge** - If you know the problem, use that knowledge

5. **When in doubt**:
   - Prefer **specific pattern** over general (Sliding Window > Array techniques)
   - Prefer **algorithmic technique** over data structure (DP > Array)
   - If truly ambiguous, use the most commonly taught solution pattern

---

## 🚫 Common Mistakes to Avoid

❌ **DON'T** assign multiple patterns (only ONE pattern)
❌ **DON'T** create new pattern names
❌ **DON'T** use old pattern names not in the 30-pattern list
❌ **DON'T** leave pattern as null
❌ **DON'T** keep the pattern in metadata

✅ **DO** assign exactly one pattern from the list
✅ **DO** remove pattern from metadata if present
✅ **DO** preserve all other fields unchanged
✅ **DO** maintain JSON formatting
✅ **DO** use the exact pattern name from the list (case-sensitive)

---

## 📝 Step-by-Step Process

For each JSON file:

1. **Read the file**
2. **For each problem in the array:**
   - Analyze the title
   - Consider the primaryTopic
   - Check metadata.pattern (if present) as a hint
   - Consider notes field
   - Apply pattern assignment rules
   - Choose ONE pattern from the 30 patterns
3. **Transform the problem:**
   - Add "pattern" field at root level with chosen pattern
   - Remove "pattern" from metadata if present
   - Keep everything else unchanged
4. **Write the updated file back**
5. **Verify:** Count problems before and after (should be same)

---

## ✅ Validation Checklist

After processing each file:

- [ ] Total problem count unchanged
- [ ] All problems have "pattern" field at root level
- [ ] No problems have pattern in metadata
- [ ] All pattern values are from the 30-pattern list
- [ ] No null or empty pattern values
- [ ] Pattern names match exactly (case-sensitive)
- [ ] JSON is valid and properly formatted
- [ ] All other fields preserved

---

## 📊 Expected Output

After completion, provide summary:

```
File: Aryan-dsa-160.json
- Problems processed: 118
- Pattern distribution:
  - Hash Maps: 15
  - Two Pointers: 12
  - Sliding Window: 10
  - Dynamic Programming (DP): 18
  - BFS: 8
  - DFS: 12
  - ...

File: neetcode-150.json
- Problems processed: 150
- Pattern distribution:
  ...

TOTAL:
- Files processed: 6
- Total problems: 673
- All problems have patterns: ✅
- Pattern distribution summary:
  Top 5 patterns:
    1. Dynamic Programming (DP): 85
    2. Hash Maps: 62
    3. Two Pointers: 48
    4. DFS: 45
    5. BFS: 42
```

---

## 🎯 Success Criteria

1. ✅ All 673 problems have pattern assigned
2. ✅ All pattern values are from the 30-pattern list
3. ✅ No "pattern" field in metadata
4. ✅ All files are valid JSON
5. ✅ Pattern distribution is reasonable
6. ✅ Similar problems get same pattern

---

## 💡 Edge Case Examples

### Edge Case 1: DP on Trees
```json
// Problem: Binary Tree Maximum Path Sum
// primaryTopic: "Tree & BST"
// Pattern: DFS (not DP)
// Reasoning: Tree traversal is primary, DP is optimization
```

### Edge Case 2: Graph + DP
```json
// Problem: Longest Increasing Path in Matrix
// primaryTopic: "Graph"
// Pattern: DFS (not DP)
// Reasoning: Graph traversal with memoization, but DFS is the pattern
```

### Edge Case 3: Array with Binary Search
```json
// Problem: Search in Rotated Sorted Array
// primaryTopic: "Array"
// Pattern: Binary Search
// Reasoning: Binary search is the key technique
```

### Edge Case 4: Design Problems
```json
// Problem: LRU Cache
// primaryTopic: "Design"
// Pattern: Hash Maps
// Reasoning: Hash map + doubly linked list, hash map is primary
```

### Edge Case 5: Multiple Valid Patterns
```json
// Problem: Merge K Sorted Lists
// primaryTopic: "Linked List"
// Pattern: K-way Merge (NOT Heap, though heap is used)
// Reasoning: K-way merge is the specific pattern, heap is implementation
```

---

## 🚀 Pattern Mapping from Old Names

If old metadata.pattern exists, map to new names:

| Old Pattern | New Pattern |
|------------|-------------|
| "Hash Map", "Hashing", "Hash Table" | **Hash Maps** |
| "DP", "Dynamic Programming" | **Dynamic Programming (DP)** |
| "DFS", "Depth First Search" | **DFS** or **Depth-First Search (DFS)** |
| "BFS", "Breadth First Search" | **BFS** or **Breadth-First Search (BFS)** |
| "Binary Search", "Binary Search Tree" | **Binary Search** |
| "Two Pointer", "Two-Pointer" | **Two Pointers** |
| "Sliding Window" | **Sliding Window** |
| "Backtrack", "Backtracking" | **Backtracking** |
| "Greedy Algorithm", "Greedy" | **Greedy** |
| "Intervals", "Merge Interval" | **Merge Intervals** |
| "Heap", "Min Heap", "Max Heap", "Priority Queue" | **Heap / Priority Queue** |
| "Trie", "Prefix Tree" | **Trie** |
| "Topological Sort", "Topo Sort" | **Topological Sort** |
| "Union Find", "DSU", "Disjoint Set" | **Union-Find** |
| "Bit Manipulation", "Bitwise" | **Bit Manipulation** |
| "Divide & Conquer", "Divide and Conquer" | **Divide and Conquer** |
| "Prefix Sum", "Cumulative Sum" | **Prefix Sum** |
| "Kadane", "Kadane's Algorithm" | **Kadane's Algorithm** |
| "Fast & Slow Pointer", "Floyd's Cycle" | **Fast and Slow Pointers** |
| "Cyclic Sort" | **Cyclic Sort** |
| "Linked List Reversal" | **In-Place Linked List Reversal** |
| "Monotonic Stack", "Monotonic Queue" | **Monotonic Stack/Queue** |
| "Segment Tree" | **Segment Tree** |
| "Flood Fill" | **Flood Fill** |
| "Subsets", "Permutations", "Combinations" | **Subsets** or **Backtracking** |
| "Top K", "K-th Largest" | **Top K Elements** |
| "K-way Merge", "Merge K" | **K-way Merge** |
| "Two Heaps", "Median Heap" | **Two Heaps** |
| "Matrix", "Matrix Traversal" | **Matrix Traversal** |
| "Graph Traversal", "Graph" | **Graph Traversal** or **DFS** or **BFS** |

---

## 📞 Decision Process

For EACH problem:

1. **Look at title** → Identify obvious patterns (substring → sliding window)
2. **Check primaryTopic** → Narrow down likely patterns (Graph → DFS/BFS/etc.)
3. **Read old pattern** → Use as hint, translate to new name
4. **Apply priority rules** → Choose most specific/fundamental pattern
5. **Make decision** → Assign ONE pattern
6. **Document edge cases** → If truly ambiguous, document reasoning

---

**Ready to start? Process all 6 files and update them with pattern assignments!**
