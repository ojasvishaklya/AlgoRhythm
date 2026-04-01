# Agent Task: Assign Primary Topics to All Problems

## 🎯 Objective

Read all JSON files in `/sheets/` directory, analyze each problem, and assign ONE primary topic from our standardized 22-topic taxonomy. Update each JSON file with the new structure.

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
  "topics": ["Array", "Hash Map"],  // ← REMOVE THIS
  "url": "https://leetcode.com/problems/two-sum/",
  "notes": "...",
  "metadata": {
    "companies": [],
    "frequency": null,
    "pattern": "Hash Map"
  }
}
```

### New Structure:
```json
{
  "title": "Two Sum",
  "platform": "LeetCode",
  "difficulty": "Easy",
  "primaryTopic": "Array",  // ← ADD THIS (ONE topic only)
  "url": "https://leetcode.com/problems/two-sum/",
  "notes": "...",
  "metadata": {
    "companies": [],
    "frequency": null,
    "pattern": "Hash Map"
  }
}
```

---

## 📋 The 22 Standardized Topics

Assign **EXACTLY ONE** of these topics to each problem:

```
1.  Array
2.  String
3.  Hash Map & Set
4.  Two Pointers
5.  Sliding Window
6.  Linked List
7.  Stack & Queue
8.  Binary Search
9.  Sorting
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
```

---

## 🧠 Topic Assignment Rules

### Rule 1: Primary Data Structure/Algorithm
- Assign based on the **primary** data structure or algorithm used
- If multiple topics apply, choose the most fundamental one

### Rule 2: Topic Priority Order (when multiple apply)

**Data Structures** (prefer more specific):
1. Tree & BST > Array
2. Graph > Array
3. Trie > String
4. Linked List > Array
5. Stack & Queue > Array
6. Heap / Priority Queue > Array
7. Matrix > Array

**Algorithmic Patterns** (prefer pattern over data structure):
1. Dynamic Programming (if DP is core approach)
2. Binary Search (if binary search is the key technique)
3. Backtracking & Recursion (if backtracking is main approach)
4. Greedy (if greedy is the key insight)
5. Two Pointers (if two pointers is the technique)
6. Sliding Window (if sliding window is the technique)

**Special Categories**:
- **Intervals**: If problem is about intervals/meetings/ranges
- **Design**: If problem is about designing a data structure (LRU Cache, etc.)
- **Matrix**: If problem specifically about 2D arrays/matrices
- **Bit Manipulation**: If bitwise operations are core
- **Sorting**: If sorting algorithm itself is the focus
- **Math & Number Theory**: If mathematical insight is core
- **Advanced Algorithms**: Segment trees, suffix arrays, etc.

### Rule 3: Decision Examples

| Problem Title | Old Topics | Primary Topic | Reasoning |
|--------------|-----------|---------------|-----------|
| Two Sum | Array, Hash Map | **Array** | Core problem is array search |
| Valid Anagram | String, Hash Map | **String** | String manipulation is primary |
| Binary Tree Inorder Traversal | Tree, DFS | **Tree & BST** | Tree structure is fundamental |
| Course Schedule | Graph, Topological Sort | **Graph** | Graph problem at core |
| LRU Cache | Hash Map, Linked List, Design | **Design** | Design problem category |
| Merge Intervals | Array, Intervals | **Intervals** | Interval-specific pattern |
| Longest Substring Without Repeating | String, Sliding Window, Hash Set | **Sliding Window** | Sliding window is the technique |
| Maximum Subarray | Array, Dynamic Programming | **Dynamic Programming** | DP (Kadane's) is the solution |
| Trapping Rain Water | Array, Two Pointers, Stack | **Two Pointers** | Two pointers is the key technique |
| Word Search II | Backtracking, Trie, Matrix | **Trie** | Trie is the key optimization |
| Serialize and Deserialize Binary Tree | Tree, Design | **Design** | Design problem |
| Rotate Image | Matrix, Array | **Matrix** | Matrix-specific operation |
| Single Number | Array, Bit Manipulation | **Bit Manipulation** | Bit trick is the solution |
| Kth Largest Element | Array, Heap, QuickSelect | **Heap / Priority Queue** | Heap is standard approach |

---

## 🔍 Analysis Guidelines

For each problem, consider:

1. **Read the title carefully** - Often hints at primary topic
   - "Binary Tree" → Tree & BST
   - "Substring" → String or Sliding Window
   - "Meeting Rooms" → Intervals
   - "Cache" → Design
   - "Matrix" → Matrix
   - "Graph" → Graph

2. **Check existing topics array** - Use as hints, but apply priority rules

3. **Check metadata.pattern** - Helps determine if technique-based topic applies

4. **Use problem knowledge** - If you know the problem, use that knowledge

5. **When in doubt**:
   - Prefer **data structure** over technique
   - Prefer **more specific** over general
   - Array is the fallback for generic array problems

---

## 🚫 Common Mistakes to Avoid

❌ **DON'T** assign multiple topics (only ONE primaryTopic)
❌ **DON'T** create new topic names
❌ **DON'T** use old topic names not in the 22-topic list
❌ **DON'T** keep the old "topics" array field
❌ **DON'T** modify any other fields

✅ **DO** assign exactly one topic from the list
✅ **DO** remove the "topics" field completely
✅ **DO** preserve all other fields unchanged
✅ **DO** maintain JSON formatting
✅ **DO** keep the same problem order

---

## 📝 Step-by-Step Process

For each JSON file:

1. **Read the file**
2. **For each problem in the array:**
   - Analyze the title
   - Consider existing topics (as hints)
   - Consider the pattern in metadata
   - Apply topic assignment rules
   - Choose ONE primary topic
3. **Transform the problem:**
   - Remove "topics" field
   - Add "primaryTopic" field with chosen topic
   - Keep everything else unchanged
4. **Write the updated file back**
5. **Verify:** Count problems before and after (should be same)

---

## ✅ Validation Checklist

After processing each file:

- [ ] Total problem count unchanged
- [ ] All problems have "primaryTopic" field
- [ ] No problems have "topics" field
- [ ] All primaryTopic values are from the 22-topic list
- [ ] No null or empty primaryTopic values
- [ ] JSON is valid and properly formatted
- [ ] All other fields preserved

---

## 📊 Expected Output

After completion, provide summary:

```
File: Aryan-dsa-160.json
- Problems processed: 118
- Topic distribution:
  - Array: 25
  - String: 10
  - Tree & BST: 15
  - Dynamic Programming: 20
  - ...

File: neetcode-150.json
- Problems processed: 150
- Topic distribution:
  ...

TOTAL:
- Files processed: 6
- Total problems: 673
- All problems categorized: ✅
```

---

## 🎯 Success Criteria

1. ✅ All 673 problems have primaryTopic assigned
2. ✅ All primaryTopic values are from the 22-topic list
3. ✅ No "topics" field remains in any problem
4. ✅ All files are valid JSON
5. ✅ Topic distribution is reasonable (no topic has >200 or <5 problems)
6. ✅ Similar problems get same topic

---

## 🚀 Start Command

**For Agent:**
```
Process all 6 JSON files in /sheets/ directory.
For each problem, assign ONE primaryTopic from the 22-topic taxonomy.
Remove the old "topics" field.
Save updated files.
Provide summary statistics.
```

---

## 💡 Examples

### Example 1: Array Problem
```json
// BEFORE
{
  "title": "Two Sum",
  "topics": ["Array", "Hash Map"],
  "metadata": {"pattern": "Hash Map"}
}

// AFTER
{
  "title": "Two Sum",
  "primaryTopic": "Array",
  "metadata": {"pattern": "Hash Map"}
}
```

### Example 2: Tree Problem
```json
// BEFORE
{
  "title": "Binary Tree Level Order Traversal",
  "topics": ["Tree", "BFS"],
  "metadata": {"pattern": "BFS"}
}

// AFTER
{
  "title": "Binary Tree Level Order Traversal",
  "primaryTopic": "Tree & BST",
  "metadata": {"pattern": "BFS"}
}
```

### Example 3: Technique-Based Problem
```json
// BEFORE
{
  "title": "Longest Substring Without Repeating Characters",
  "topics": ["String", "Sliding Window", "Hash Set"],
  "metadata": {"pattern": "Sliding Window"}
}

// AFTER
{
  "title": "Longest Substring Without Repeating Characters",
  "primaryTopic": "Sliding Window",
  "metadata": {"pattern": "Sliding Window"}
}
```

### Example 4: DP Problem
```json
// BEFORE
{
  "title": "Coin Change",
  "topics": ["Array", "Dynamic Programming"],
  "metadata": {"pattern": "Dynamic Programming"}
}

// AFTER
{
  "title": "Coin Change",
  "primaryTopic": "Dynamic Programming",
  "metadata": {"pattern": "Dynamic Programming"}
}
```

---

## ⚠️ Edge Cases

**Case 1: Graph on Matrix**
- Example: "Number of Islands"
- Decision: **Graph** (graph traversal is the core algorithm)

**Case 2: DP on Trees**
- Example: "Binary Tree Maximum Path Sum"
- Decision: **Tree & BST** (tree structure is primary)

**Case 3: Binary Search on Answer Space**
- Example: "Koko Eating Bananas"
- Decision: **Binary Search** (binary search is the key technique)

**Case 4: Stack for Tree Traversal**
- Example: "Binary Tree Inorder Traversal"
- Decision: **Tree & BST** (tree is primary, stack is just implementation)

---

## 📞 Need Help?

If uncertain about a problem's primary topic:
1. Check if it's a well-known problem (use your knowledge)
2. Consider what makes the problem challenging
3. Apply the priority rules
4. Use the most specific applicable topic
5. Document edge cases for review

---

**Ready to start? Process all 6 files and update them with primaryTopic assignments!**
