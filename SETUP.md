# Quick Setup Guide

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

This installs:
- TypeScript
- ts-node (for running migration scripts)
- Vite (dev server)
- @types/node (TypeScript types for Node.js)

### 2. Migrate Existing Data

**IMPORTANT:** This is a one-time operation that adds the new schema fields to your existing topic JSON files.

```bash
# This will:
# 1. Create a backup in /topics-backup/
# 2. Add progress, timestamps, and userData fields to all problems
# 3. Generate unique IDs for each problem
npm run migrate
```

**Expected output:**
```
🚀 Starting migration...
📦 Creating backup of existing files...
✅ Backup created at: /topics-backup/

📂 Found 22 topic files to migrate

📄 Processing: 01-array.json
  ✅ Migrated 65 problems
📄 Processing: 02-string.json
  ✅ Migrated 38 problems
...

============================================================
✅ Migration Complete!
============================================================
Total problems processed: 345
Total problems migrated: 345
Backup location: /topics-backup/
============================================================
```

### 3. Validate Migration

```bash
npm run validate
```

This checks:
- All problems have `id` field
- All problems have `progress` field
- All problems have `timestamps` field
- All problems have `userData` field
- All JSON files are valid

### 4. Start Dev Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser 🎉

---

## 🔧 What the Migration Does

### Before Migration
```json
{
  "title": "Two Sum",
  "platform": "LeetCode",
  "difficulty": "Easy",
  "primaryTopic": "Array",
  "pattern": "Hash Maps",
  "url": "https://leetcode.com/problems/two-sum/",
  "urlGenerated": false,
  "notes": null,
  "metadata": {
    "companies": ["Amazon", "Google"],
    "frequency": "Very High",
    "importance": "VVI",
    "sources": ["neetcode-150", "blind-75"],
    "day": null
  }
}
```

### After Migration
```json
{
  "id": "leetcode-two-sum",  // ← ADDED
  "title": "Two Sum",
  "platform": "LeetCode",
  "difficulty": "Easy",
  "primaryTopic": "Array",
  "pattern": "Hash Maps",
  "url": "https://leetcode.com/problems/two-sum/",
  "urlGenerated": false,
  "notes": null,
  "metadata": {
    "companies": ["Amazon", "Google"],
    "frequency": "Very High",
    "importance": "VVI",
    "sources": ["neetcode-150", "blind-75"],
    "day": null
  },
  "progress": {  // ← ADDED (all false by default)
    "completed": false,
    "attemptedButNotSolved": false,
    "hasSolution": false,
    "hasOptimalSolution": false,
    "understoodCompletely": false,
    "needsReview": false,
    "solvedOnce": false,
    "solvedTwice": false,
    "solvedThreePlus": false,
    "bookmarked": false,
    "isFavorite": false,
    "watchedVideoSolution": false,
    "readEditorialSolution": false,
    "solvedInTime": false,
    "needsSpeedImprovement": false,
    "canExplainToOthers": false,
    "interviewReady": false,
    "markedForRevision": false,
    "revisedOnce": false,
    "revisedMultipleTimes": false,
    "easierThanRated": false,
    "harderThanRated": false,
    "hasNotes": false,
    "hasCustomTags": false
  },
  "timestamps": {  // ← ADDED (all null by default)
    "firstAttemptedAt": null,
    "lastAttemptedAt": null,
    "completedAt": null,
    "lastReviewedAt": null,
    "addedToFavoritesAt": null
  },
  "userData": {  // ← ADDED (empty by default)
    "notes": "",
    "customTags": [],
    "timeTaken": null,
    "attemptCount": 0,
    "personalDifficultyRating": null,
    "confidenceLevel": null,
    "solutionLinks": [],
    "resourceLinks": [],
    "mistakesMade": [],
    "keyInsights": []
  }
}
```

---

## 🛡️ Safety Features

### Automatic Backup
- Every migration creates a backup in `/topics-backup/`
- Original files are preserved
- You can rollback at any time

### Rollback
If something goes wrong:

```bash
npm run rollback
```

This restores all files from the backup.

### Validation
After migration, run validation to ensure everything is correct:

```bash
npm run validate
```

---

## 📝 Development Commands

```bash
# Run migration (one-time)
npm run migrate

# Validate migration
npm run validate

# Rollback migration
npm run rollback

# Start dev server
npm run dev

# Build for production
npm run build

# Type check (no compilation)
npm run type-check

# Watch TypeScript files (auto-compile)
npm run watch
```

---

## 🎯 Next Steps After Setup

1. **Open the app** at http://localhost:5173
2. **Browse problems** by topic
3. **Mark problems as completed** to track progress
4. **Add notes and bookmarks** as you solve
5. **Use filters** to find problems
6. **Track your stats** in the sidebar

---

## 🐛 Troubleshooting

### Migration fails with "file not found"
- Make sure you're in the project root directory
- Check that `/topics/` directory exists
- Try: `ls topics/` to see if files are there

### TypeScript errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript cache
rm -rf dist/
npm run build
```

### Vite dev server won't start
```bash
# Kill any existing Vite processes
pkill -f vite

# Try again
npm run dev
```

### Problems not loading in browser
- Check browser console for errors (F12)
- Make sure migration completed successfully
- Verify `/topics/index.json` exists
- Check Network tab to see if JSON files are loading

---

## 💡 Tips

1. **Always run migration before starting dev server** (one-time only)
2. **Keep the backup** until you've verified everything works
3. **Use TypeScript** to catch errors early
4. **Check the browser console** for helpful debug info
5. **User progress is saved in localStorage** - it persists across sessions

---

## 📚 File Overview

```
Key Files You'll Work With:
├── src/app.ts              # Main application logic
├── src/types/problem.ts    # TypeScript schema
├── src/utils/defaults.ts   # Helper functions
├── src/styles/main.css     # Styling
└── index.html              # App entry point

Key Directories:
├── topics/                 # Your database (after migration)
├── topics-backup/          # Backup created by migration
└── master-data/            # Archive (don't modify)
```

---

**Need help? Check the main README.md for detailed documentation.**
