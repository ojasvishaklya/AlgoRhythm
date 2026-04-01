# Product Requirements Document: AlgoRhythm

## 1. Overview

A simple, personal web application for maintaining and reviewing a curated database of Data Structures & Algorithms (DSA) interview questions.

**Problem Statement**: After solving many DSA problems, it's easy to forget solutions and patterns when out of practice. There's a need for a personalized, consolidated database that aggregates popular DSA question sheets with consistent metadata for efficient revision.

**Target User**: Software engineers preparing for technical interviews who have already solved many problems and need a streamlined revision tool.

---

## 2. Goals

### Primary Goals
- Create a unified database by aggregating famous DSA question sheets
- Provide a simple interface to browse and filter questions
- Enable quick access to original problem links and metadata
- Support efficient revision workflows

### Success Metrics
- All questions from popular sheets successfully imported
- Ability to filter questions by data structure, pattern, and difficulty
- Sub-2 second page load times
- Zero learning curve - immediately usable

---

## 3. Non-Goals (Keeping It Simple)

- ❌ No user authentication or multi-user support
- ❌ No code editor or submission functionality
- ❌ No progress tracking or statistics
- ❌ No spaced repetition algorithms
- ❌ No social features or sharing
- ❌ No mobile app (responsive web is sufficient)
- ❌ No AI-powered features

---

## 4. User Stories

1. **As a user**, I want to import multiple DSA question sheets so I can have a consolidated database
2. **As a user**, I want to see all questions in a clean list/table view so I can browse easily
3. **As a user**, I want to filter questions by data structure (e.g., Arrays, Trees, Graphs) so I can focus on specific topics
4. **As a user**, I want to filter questions by pattern (e.g., Sliding Window, Two Pointers) so I can practice similar problems
5. **As a user**, I want to filter questions by difficulty (Easy/Medium/Hard) so I can adjust my practice intensity
6. **As a user**, I want to click on a question and open the LeetCode link directly so I can solve it
7. **As a user**, I want to search questions by name or keyword so I can find specific problems quickly

---

## 5. Data Model

### Question Schema

```json
{
  "id": "unique_id",
  "title": "Two Sum",
  "leetcode_number": 1,
  "leetcode_url": "https://leetcode.com/problems/two-sum/",
  "difficulty": "Easy",
  "data_structures": ["Array", "Hash Table"],
  "patterns": ["Hash Map", "Two Pass"],
  "topics": ["Array", "Hash Table"],
  "companies": ["Google", "Amazon", "Facebook"],
  "source_sheets": ["Blind 75", "NeetCode 150"],
  "notes": "Classic problem - always remember O(n) hash map solution"
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| title | string | Yes | Problem title |
| leetcode_number | number | No | LeetCode problem number |
| leetcode_url | string | Yes | Direct link to problem |
| difficulty | enum | Yes | Easy, Medium, Hard |
| data_structures | array | Yes | DS used (Array, LinkedList, Tree, Graph, etc.) |
| patterns | array | Yes | Common patterns (Sliding Window, DFS, BFS, etc.) |
| topics | array | No | General topics/tags |
| companies | array | No | Companies that asked this |
| source_sheets | array | Yes | Which sheets this came from |
| notes | string | No | Personal notes/hints |

---

## 6. Features

### Phase 1: Core Functionality (MVP)

#### 6.1 Data Import
- **Manual Import**: Support JSON file upload for batch import
- **Sheet Parser**: Scripts to parse popular DSA sheets (Blind 75, NeetCode 150, Striver's SDE Sheet, etc.)
- **Deduplication**: Automatically merge duplicate questions from different sheets

#### 6.2 Question List View
- **Table/Card Layout**: Display all questions with key metadata
- **Columns**: Title, Difficulty, Data Structures, Patterns, Sources
- **Sortable**: Sort by any column
- **Responsive**: Works on desktop and tablet

#### 6.3 Filtering & Search
- **Multi-select Filters**:
  - Difficulty (Easy/Medium/Hard)
  - Data Structures (multi-select checkboxes)
  - Patterns (multi-select checkboxes)
  - Source Sheets (multi-select checkboxes)
- **Search Bar**: Filter by title or keyword
- **Active Filter Display**: Show currently active filters with clear/remove options

#### 6.4 Question Details
- **Click to Expand**: Show full details inline or in modal
- **Quick Link**: One-click to open LeetCode problem in new tab
- **Notes Section**: Display personal notes if any

### Phase 2: Nice-to-Haves (Future)

- Export filtered results to JSON/CSV
- Dark mode toggle
- Add/edit questions via UI
- Bulk edit capabilities
- Random question picker for practice

---

## 7. Technical Stack Recommendations

### Option A: Minimal Setup (Static Site)
- **Frontend**: React + Vite
- **Data Storage**: JSON file in `/src/data/`
- **Styling**: Tailwind CSS
- **Hosting**: GitHub Pages / Vercel
- **Pros**: Simple, fast, no backend needed

### Option B: With Backend (For Future Growth)
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite / PostgreSQL
- **Hosting**: Vercel (frontend) + Railway (backend)
- **Pros**: Easier CRUD operations, scalable

**Recommendation**: Start with **Option A** for MVP

---

## 8. Project Structure

```
dsa-sheet/
├── sheets/                    # Raw DSA sheets from internet
│   ├── blind-75.json
│   ├── neetcode-150.json
│   ├── striver-sde.json
│   └── README.md             # Sources and credits
├── scripts/                   # Data processing scripts
│   ├── parse-sheets.js       # Parse different formats
│   └── merge-data.js         # Create unified database
├── src/                       # React app
│   ├── data/
│   │   └── questions.json    # Unified question database
│   ├── components/
│   │   ├── QuestionList.jsx
│   │   ├── Filters.jsx
│   │   └── QuestionCard.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
└── README.md
```

---

## 9. User Interface Mockup

### Main View Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🧠 My DSA Revision Sheet                         🔍 Search  │
├─────────────────────────────────────────────────────────────┤
│  Filters:                                                    │
│  [Difficulty ▾] [Data Structure ▾] [Pattern ▾] [Sheet ▾]   │
│  Active: Medium, Array × | Clear All                        │
├─────────────────────────────────────────────────────────────┤
│  Showing 42 of 350 questions                    [Sort by ▾] │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Two Sum                                    Easy  🔗  │   │
│  │ Array • Hash Table | Hash Map Pattern              │   │
│  │ Sources: Blind 75, NeetCode 150                    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Best Time to Buy & Sell Stock         Medium  🔗   │   │
│  │ Array • DP | Kadane's Algorithm                    │   │
│  │ Sources: Blind 75, Striver SDE                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Implementation Phases

### Week 1: Data Collection & Processing
- Collect popular DSA sheets (JSON/CSV format)
- Write parser scripts
- Create unified database
- Define final schema

### Week 2: Frontend Foundation
- Set up React + Vite project
- Build basic components (QuestionList, QuestionCard)
- Implement data loading from JSON

### Week 3: Filtering & Search
- Implement all filter controls
- Add search functionality
- Add sorting capabilities

### Week 4: Polish & Deploy
- Styling and responsive design
- Testing across devices
- Deploy to hosting platform

---

## 11. Popular DSA Sheets to Include

1. **Blind 75** (curated by Blind community)
2. **NeetCode 150** (expansion of Blind 75)
3. **Striver's SDE Sheet** (180 questions)
4. **LeetCode Top 100 Liked**
5. **LeetCode Top Interview Questions**
6. **Grind 75** (by creator of Blind 75)
7. **AlgoMonster Core 125**

---

## 12. Common Data Structures List

- Array
- String
- Linked List
- Stack
- Queue
- Hash Table / Hash Map
- Heap / Priority Queue
- Tree (Binary Tree, BST, N-ary Tree)
- Graph
- Trie
- Union Find / Disjoint Set

---

## 13. Common Patterns List

- Two Pointers
- Sliding Window
- Fast & Slow Pointers
- Merge Intervals
- Cyclic Sort
- In-place Reversal of Linked List
- Tree BFS / Level Order Traversal
- Tree DFS
- Graph BFS / DFS
- Topological Sort
- Binary Search
- Backtracking
- Dynamic Programming
- Greedy
- Divide and Conquer
- Monotonic Stack
- Prefix Sum
- Kadane's Algorithm

---

## 14. Open Questions / Decisions Needed

1. Should we allow editing questions through the UI or keep it file-based?
2. Do we need any form of progress tracking (even simple checkmarks)?
3. Should we include video solution links (like NeetCode YouTube)?
4. Preferred styling approach - minimal or more visual?

---

## 15. Success Criteria

- [ ] Successfully aggregate 300+ unique questions
- [ ] All filters work correctly and intuitively
- [ ] Page loads in under 2 seconds
- [ ] Mobile-responsive design works smoothly
- [ ] Can find any question in under 3 clicks
- [ ] Personal usage for 2 weeks validates the workflow

---

**Version**: 1.0
**Created**: March 29, 2026
**Status**: Draft - Ready for Review
