# AlgoRhythm

An intelligent DSA practice app using spaced repetition and adaptive difficulty for interview preparation.

**345 curated problems** • **22 topics** • **30 patterns** • **Smart recommendations**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
cd /path/to/AlgoRhythm

# Start local server (required to avoid CORS issues)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/app/
```

Or use the convenience script:
```bash
./start-server.sh
```

### GitHub Pages Deployment

Deploy to GitHub Pages for free hosting:

```bash
# Push to GitHub
git add .
git commit -m "Deploy v1"
git push origin main

# Enable GitHub Pages in repository settings
# Set source to: main branch / root directory
# Your app will be live at: https://yourusername.github.io/AlgoRhythm/app/
```

**Note**: No CORS issues with GitHub Pages! All files are served via HTTPS from the same origin.

## ✨ Features

### V1 (Current)
- 🎨 **Clean Minimal UI** - Refined design with Outfit & DM Sans typography
- 🔍 **Advanced Filtering** - Filter by topic (22), difficulty, and pattern (30+)
- 🔎 **Live Search** - Debounced search with instant results
- 📊 **Multiple Views** - Toggle between grid and list layouts
- 📱 **Fully Responsive** - Mobile-first design (1-4 column grid)
- ⚡ **Fast Loading** - Parallel data loading, efficient rendering
- 💾 **Persistent Preferences** - View mode saved to localStorage
- 🎯 **Direct Links** - One-click access to problems on LeetCode, GeeksforGeeks, etc.

### V2 (Planned)
- 🎯 **Smart Recommendations** - SM-2 spaced repetition algorithm
- 📊 **Progress Tracking** - Track attempts, time, confidence levels, and mastery
- 🧠 **Adaptive Learning** - Focuses on weak areas while maintaining topic variety
- 📈 **Mastery Tracking** - Monitors progress at topic, pattern, and difficulty levels
- 📝 **Personal Notes** - Add insights, mistakes, and custom tags

## 📂 Project Structure

```
AlgoRhythm/
├── app/                        # V1 Frontend Application
│   ├── index.html             # Main HTML structure
│   ├── styles.css             # Complete styling system
│   └── app.js                 # Application logic
├── problem-set/               # Problem Database (345 problems)
│   ├── index.json            # Topic metadata
│   └── [01-22]-*.json        # Topic-specific problem files
├── src/                       # Recommendation Engine (TypeScript)
│   ├── engine/               # SM-2 algorithm implementation
│   ├── types/                # Type definitions
│   └── utils/                # Migration utilities
├── master-data/              # Source data aggregation
│   ├── sheets/               # Original problem sheets
│   ├── topics/               # Generated topic files
│   └── merged/               # Deduplicated data
└── index.html                # Legacy table view (reference)
```

## 🎨 Design Philosophy

**Refined Technical Minimalism** - A sophisticated interface inspired by high-end engineering journals and modern developer tools.

- **Typography**: Outfit (display) + DM Sans (body) for distinctive, professional aesthetic
- **Colors**: Blue primary (#3b82f6), difficulty badges (green/amber/red), light gray backgrounds
- **Layout**: Generous whitespace, rounded corners, subtle shadows, smooth transitions
- **Interactions**: Card hover effects with gradient reveals, debounced search, filter chips

## 🔧 Technology Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Data**: JSON files (345 problems across 22 topics)
- **Styling**: CSS custom properties, mobile-first responsive design
- **Future**: TypeScript recommendation engine (SM-2 algorithm)

## 📊 Data Sources

Problems curated from popular DSA sheets:
- Blind 75
- NeetCode 150
- Grind 75
- Striver's SDE Sheet
- Amazon SDE (Riddhi Dutta)
- Aryan DSA 160
- DSA Patterns Cheat Sheet

## 🛠️ Development

### File Organization

**V1 Application** (`app/`):
- Semantic HTML5 structure
- CSS with custom properties (variables)
- Modular JavaScript (data loading, filtering, rendering)
- DocumentFragment for efficient DOM updates
- Debounced search (300ms delay)
- LocalStorage for view preferences

**Problem Data** (`problem-set/`):
- 22 topic files with 345 total problems
- Schema: id, title, platform, difficulty, url, primaryTopic, pattern, notes, metadata
- Parallel loading with Promise.all()
- No build step required for v1

### Adding New Problems

1. Add to appropriate topic file in `problem-set/`
2. Follow existing schema format
3. Update `index.json` metadata if needed
4. Refresh app - new problems load automatically

## 🚀 Future Roadmap

### V2: Recommendation Engine Integration
- [ ] Transpile TypeScript engine to JavaScript
- [ ] Add "Recommended for You" section
- [ ] Progress tracking (checkboxes on cards)
- [ ] Confidence rating modal after completion
- [ ] LocalStorage/IndexedDB for user data
- [ ] Mastery scores and review dates
- [ ] Study streak tracking

### V3: Enhanced Features
- [ ] Dark mode toggle
- [ ] Bookmark problems
- [ ] Custom tags and notes
- [ ] Filter by company tags
- [ ] Export progress reports
- [ ] Share study plans

## 📖 Documentation

- **PRD**: [PRD.md](PRD.md) - Product requirements and specifications
- **Recommendation System**: [RECOMMENDATION_SYSTEM.md](RECOMMENDATION_SYSTEM.md) - SM-2 algorithm details
- **Engine API**: [src/engine/README.md](src/engine/README.md) - TypeScript engine documentation

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Open an issue to discuss potential improvements.

## 📝 License

MIT License - Feel free to use this for your own interview prep!

---

**Built with ❤️ for efficient DSA practice**

