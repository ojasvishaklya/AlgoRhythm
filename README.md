# AlgoRhythm

An intelligent DSA practice app using spaced repetition and adaptive difficulty for interview preparation.

**345 curated problems** • **22 topics** • **30 patterns** • **Smart recommendations**

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## What It Does

- 🎯 **Smart Recommendations** - Spaced repetition (SM-2 algorithm) prioritizes what you need to practice
- 📊 **Progress Tracking** - Track attempts, time, confidence levels, and mastery
- 🔍 **Filter & Search** - By topic, pattern, difficulty, company, or completion status
- 📝 **Personal Notes** - Add insights, mistakes, and custom tags to each problem

## Key Features

- **Adaptive Learning** - Focuses on weak areas while maintaining topic variety
- **Confidence-Based** - Rate each attempt from 0 (no idea) to 5 (trivial)
- **Mastery Tracking** - Monitors progress at topic, pattern, and difficulty levels
- **Flexible Practice** - Works during first pass and review phases

## Documentation

- [PRD.md](PRD.md) - Product requirements and goals
- [RECOMMENDATION_SYSTEM.md](RECOMMENDATION_SYSTEM.md) - How the recommendation engine works
- [SETUP.md](SETUP.md) - Detailed setup instructions
- [src/types/problem.ts](src/types/problem.ts) - Full problem schema

## Project Structure

```
├── src/engine/          # Recommendation engine & statistics
├── master-data/         # 345 problems across 22 topics
├── problem-set/         # Generated topic-based problem sets
└── agent-prompts/       # AI prompts for data management
```

## License

MIT

