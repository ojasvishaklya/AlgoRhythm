# AlgoRhythm Spring Boot + HTMX Implementation Plan
## Production-Ready Backend with Single Deployment

---

## Context

AlgoRhythm currently has a working vanilla HTML/CSS/JS frontend (v1) that displays 345 DSA problems with advanced filtering, search, and view toggles. The user wants to make it **production-ready** with:

- **Backend persistence** (PostgreSQL database)
- **Multi-user support** (authentication)
- **Recommendation system** (SM-2 spaced repetition)
- **Single deployment** (easier ops)

**Why Spring Boot + HTMX?**
- User is comfortable with Java, less familiar with React/JavaScript
- Current UI is simple (filters, search, sort) - perfect for HTMX
- Single JAR deployment = simpler operations
- Keep existing beautiful CSS/design
- Modern architecture pattern (HTMX gaining popularity)

**Current State:**
- ✅ V1 completed: `app/index.html`, `app/styles.css`, `app/app.js` (vanilla JS)
- ✅ TypeScript recommendation engine exists: `src/engine/` (needs porting to Java)
- ✅ Static problem data: `problem-set/*.json` (345 problems)
- ✅ Clean minimal UI with grid/list views
- ❌ No backend
- ❌ No database
- ❌ No user authentication
- ❌ localStorage only (not production-ready)

**Goal:** Migrate to Spring Boot + HTMX architecture while preserving the excellent UI design, add PostgreSQL persistence, implement user authentication, and port the recommendation engine to Java.

---

## Approach

### Architecture Overview

```
┌───────────────────────────────────────────────────────────┐
│  Spring Boot Application (Single JAR)                     │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Thymeleaf Templates (HTML)                         │ │
│  │  - index.html (main page)                           │ │
│  │  - fragments/problem-grid.html                      │ │
│  │  - fragments/confidence-modal.html                  │ │
│  │  + HTMX attributes (hx-get, hx-post, hx-target)    │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Static Assets                                       │ │
│  │  - styles.css (existing CSS preserved)              │ │
│  │  - htmx.min.js (16KB library)                       │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Spring MVC Controllers                              │ │
│  │  - ProblemController                                 │ │
│  │  - RecommendationController                          │ │
│  │  - AuthController                                    │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Services Layer                                      │ │
│  │  - ProblemService                                    │ │
│  │  - RecommendationEngine (ported from TypeScript)    │ │
│  │  - UserProgressService                               │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  JPA Repositories                                    │ │
│  │  - ProblemRepository                                 │ │
│  │  - UserProgressRepository                            │ │
│  │  - AttemptRepository                                 │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Spring Security                                     │ │
│  │  - Session-based authentication                      │ │
│  │  - BCrypt password hashing                           │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
                          │
                          ↓
                ┌────────────────────┐
                │  PostgreSQL        │
                │  Database          │
                └────────────────────┘
```

---

## Implementation Phases

### Phase 1: Project Setup & Database (Week 1)

#### 1.1 Create Spring Boot Project

**Using Spring Initializr:**
- **Group:** `com.algorhythm`
- **Artifact:** `algorhythm`
- **Dependencies:**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - PostgreSQL Driver
  - Thymeleaf
  - Validation
  - Lombok (optional)

**Project Structure:**
```
algorhythm/
├── src/main/java/com/algorhythm/
│   ├── AlgorhythmApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── WebConfig.java
│   ├── controller/
│   │   ├── HomeController.java
│   │   ├── ProblemController.java
│   │   ├── RecommendationController.java
│   │   └── AuthController.java
│   ├── service/
│   │   ├── ProblemService.java
│   │   ├── UserProgressService.java
│   │   └── RecommendationEngine.java
│   ├── repository/
│   │   ├── ProblemRepository.java
│   │   ├── UserRepository.java
│   │   ├── UserProgressRepository.java
│   │   └── AttemptRepository.java
│   ├── model/
│   │   ├── Problem.java
│   │   ├── User.java
│   │   ├── UserProgress.java
│   │   ├── Attempt.java
│   │   ├── Topic.java
│   │   └── Pattern.java
│   └── dto/
│       ├── ProblemFilterRequest.java
│       └── CompletionRequest.java
├── src/main/resources/
│   ├── templates/
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── fragments/
│   │   │   ├── problem-grid.html
│   │   │   ├── problem-card.html
│   │   │   ├── filter-bar.html
│   │   │   ├── confidence-modal.html
│   │   │   ├── recommendations.html
│   │   │   └── stats-bar.html
│   │   └── layouts/
│   │       └── main.html
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css (from app/styles.css)
│   │   └── js/
│   │       └── htmx.min.js
│   ├── db/migration/
│   │   ├── V1__create_schema.sql
│   │   └── V2__seed_problems.sql
│   └── application.yml
├── pom.xml
└── README.md
```

#### 1.2 Database Schema Setup

**PostgreSQL Schema:** (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/algorhythm
    username: algorhythm_user
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled: true
```

**Migration: V1__create_schema.sql**
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP,
    settings JSONB DEFAULT '{}'::JSONB
);

-- Problems table (static reference data)
CREATE TABLE problems (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    platform VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    primary_topic VARCHAR(100) NOT NULL,
    pattern VARCHAR(100) NOT NULL,
    notes TEXT,
    metadata_companies TEXT[],
    metadata_sources TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_topic ON problems(primary_topic);
CREATE INDEX idx_problems_pattern ON problems(pattern);

-- User progress table
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id VARCHAR(100) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    
    -- Status flags
    completed BOOLEAN DEFAULT FALSE,
    bookmarked BOOLEAN DEFAULT FALSE,
    attempt_count INTEGER DEFAULT 0,
    
    -- Timestamps
    first_attempted_at TIMESTAMP,
    last_attempted_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Spaced repetition (SM-2)
    last_confidence_score INTEGER CHECK (last_confidence_score BETWEEN 0 AND 5),
    easiness_factor DECIMAL(3,2) DEFAULT 2.5,
    next_review_date TIMESTAMP,
    current_cycle INTEGER DEFAULT 1,
    mastery_score INTEGER DEFAULT 0,
    
    -- User metadata
    notes TEXT,
    custom_tags TEXT[],
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, problem_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_completed ON user_progress(completed);
CREATE INDEX idx_user_progress_next_review ON user_progress(next_review_date);

-- Attempts table (audit trail)
CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id VARCHAR(100) NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confidence_score INTEGER NOT NULL CHECK (confidence_score BETWEEN 0 AND 5),
    time_taken_minutes INTEGER,
    notes TEXT
);

CREATE INDEX idx_attempts_user_problem ON attempts(user_id, problem_id);
CREATE INDEX idx_attempts_date ON attempts(attempted_at);
```

**Migration: V2__seed_problems.sql**
- Import 345 problems from `problem-set/*.json` files
- SQL INSERT statements generated from JSON

#### 1.3 JPA Entities

**Problem.java:**
```java
@Entity
@Table(name = "problems")
public class Problem {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String url;
    
    private String platform;
    
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;
    
    @Column(name = "primary_topic", nullable = false)
    private String primaryTopic;
    
    @Column(nullable = false)
    private String pattern;
    
    private String notes;
    
    @Column(name = "metadata_companies", columnDefinition = "text[]")
    @Type(type = "com.vladmihalcea.hibernate.type.array.StringArrayType")
    private String[] metadataCompanies;
    
    @Column(name = "metadata_sources", columnDefinition = "text[]")
    @Type(type = "com.vladmihalcea.hibernate.type.array.StringArrayType")
    private String[] metadataSources;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    // Getters, setters, constructors
}
```

**UserProgress.java:**
```java
@Entity
@Table(name = "user_progress")
public class UserProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
    
    private Boolean completed = false;
    private Boolean bookmarked = false;
    
    @Column(name = "attempt_count")
    private Integer attemptCount = 0;
    
    @Column(name = "first_attempted_at")
    private LocalDateTime firstAttemptedAt;
    
    @Column(name = "last_attempted_at")
    private LocalDateTime lastAttemptedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "last_confidence_score")
    private Integer lastConfidenceScore; // 0-5
    
    @Column(name = "easiness_factor")
    private BigDecimal easinessFactor = new BigDecimal("2.5"); // SM-2 default
    
    @Column(name = "next_review_date")
    private LocalDateTime nextReviewDate;
    
    @Column(name = "current_cycle")
    private Integer currentCycle = 1;
    
    @Column(name = "mastery_score")
    private Integer masteryScore = 0; // 0-100
    
    private String notes;
    
    @Column(name = "custom_tags", columnDefinition = "text[]")
    @Type(type = "com.vladmihalcea.hibernate.type.array.StringArrayType")
    private String[] customTags;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Getters, setters, constructors
}
```

**Attempt.java:**
```java
@Entity
@Table(name = "attempts")
public class Attempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
    
    @Column(name = "attempted_at", nullable = false)
    private LocalDateTime attemptedAt;
    
    @Column(name = "confidence_score", nullable = false)
    private Integer confidenceScore; // 0-5
    
    @Column(name = "time_taken_minutes")
    private Integer timeTakenMinutes;
    
    private String notes;
    
    // Getters, setters, constructors
}
```

---

### Phase 2: Core Features with HTMX (Week 2)

#### 2.1 Home Page & Problem Listing

**Controller: HomeController.java**
```java
@Controller
public class HomeController {
    
    @Autowired
    private ProblemService problemService;
    
    @GetMapping("/")
    public String index(Model model, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return "redirect:/login";
        }
        
        // Initial load shows all problems
        List<Problem> problems = problemService.findAll();
        model.addAttribute("problems", problems);
        model.addAttribute("totalCount", problems.size());
        
        // Populate filter dropdowns
        model.addAttribute("topics", problemService.getAllTopics());
        model.addAttribute("patterns", problemService.getAllPatterns());
        
        return "index";
    }
}
```

**Template: index.html**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" 
      xmlns:sec="http://www.thymeleaf.org/extras/spring-security">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AlgoRhythm — DSA Problem Set</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" th:href="@{/css/styles.css}">
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1 class="logo">AlgoRhythm</h1>
                <div class="search-wrapper">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input type="text" 
                           name="search"
                           class="search-input"
                           placeholder="Search problems..."
                           hx-get="/problems"
                           hx-trigger="keyup changed delay:300ms"
                           hx-target="#problem-grid"
                           hx-include="[name='topic'], [name='difficulty'], [name='pattern'], [name='view']">
                </div>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <section class="filter-section">
                <div class="filters">
                    <div class="filter-group">
                        <label for="topicFilter" class="filter-label">Topic</label>
                        <select name="topic" 
                                id="topicFilter" 
                                class="filter-select"
                                hx-get="/problems"
                                hx-trigger="change"
                                hx-target="#problem-grid"
                                hx-include="[name='difficulty'], [name='pattern'], [name='search'], [name='view']">
                            <option value="">All Topics</option>
                            <option th:each="topic : ${topics}" 
                                    th:value="${topic}" 
                                    th:text="${topic}">Array</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label for="difficultyFilter" class="filter-label">Difficulty</label>
                        <select name="difficulty" 
                                id="difficultyFilter" 
                                class="filter-select"
                                hx-get="/problems"
                                hx-trigger="change"
                                hx-target="#problem-grid"
                                hx-include="[name='topic'], [name='pattern'], [name='search'], [name='view']">
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label for="patternFilter" class="filter-label">Pattern</label>
                        <select name="pattern" 
                                id="patternFilter" 
                                class="filter-select"
                                hx-get="/problems"
                                hx-trigger="change"
                                hx-target="#problem-grid"
                                hx-include="[name='topic'], [name='difficulty'], [name='search'], [name='view']">
                            <option value="">All Patterns</option>
                            <option th:each="pattern : ${patterns}" 
                                    th:value="${pattern}" 
                                    th:text="${pattern}">Hash Maps</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label for="sortSelect" class="filter-label">Sort By</label>
                        <select name="sort" 
                                id="sortSelect" 
                                class="filter-select"
                                hx-get="/problems"
                                hx-trigger="change"
                                hx-target="#problem-grid"
                                hx-include="[name='topic'], [name='difficulty'], [name='pattern'], [name='search'], [name='view']">
                            <option value="title-asc">Title (A-Z)</option>
                            <option value="title-desc">Title (Z-A)</option>
                            <option value="difficulty-asc">Difficulty (Easy First)</option>
                            <option value="difficulty-desc">Difficulty (Hard First)</option>
                            <option value="topic-asc">Topic (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div class="active-filters" id="activeFilters"></div>
            </section>

            <section class="stats-section">
                <p class="stats-text" id="statsText">
                    Showing <span th:text="${totalCount}">345</span> problems
                </p>
                <div class="view-toggle">
                    <button class="view-toggle-btn active"
                            hx-get="/problems?view=grid"
                            hx-target="#problem-grid"
                            hx-include="[name='topic'], [name='difficulty'], [name='pattern'], [name='search']">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                    <button class="view-toggle-btn"
                            hx-get="/problems?view=list"
                            hx-target="#problem-grid"
                            hx-include="[name='topic'], [name='difficulty'], [name='pattern'], [name='search']">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </section>

            <!-- Problem grid loaded via HTMX -->
            <section class="problem-grid" id="problem-grid">
                <div th:replace="~{fragments/problem-grid :: problemCards}"></div>
            </section>
        </div>
    </main>
</body>
</html>
```

**Controller: ProblemController.java**
```java
@Controller
@RequestMapping("/problems")
public class ProblemController {
    
    @Autowired
    private ProblemService problemService;
    
    @GetMapping
    public String filterProblems(
        @RequestParam(required = false) String topic,
        @RequestParam(required = false) String difficulty,
        @RequestParam(required = false) String pattern,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String sort,
        @RequestParam(defaultValue = "grid") String view,
        Model model
    ) {
        List<Problem> problems = problemService.filter(topic, difficulty, pattern, search, sort);
        
        model.addAttribute("problems", problems);
        model.addAttribute("view", view);
        
        // Return appropriate fragment based on view
        return view.equals("list") 
            ? "fragments/problem-grid :: listView"
            : "fragments/problem-grid :: gridView";
    }
}
```

**Fragment: fragments/problem-grid.html**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
    <!-- Grid View -->
    <div th:fragment="gridView" class="problem-grid">
        <article class="problem-card" th:each="problem : ${problems}">
            <div class="problem-header">
                <h3 class="problem-title" th:text="${problem.title}">Two Sum</h3>
                <div class="problem-meta">
                    <span class="difficulty-badge" 
                          th:classappend="${#strings.toLowerCase(problem.difficulty)}"
                          th:text="${problem.difficulty}">Easy</span>
                    <span class="problem-topic" th:text="${problem.primaryTopic}">Array</span>
                </div>
            </div>
            
            <div class="problem-body">
                <span class="problem-pattern" th:text="${problem.pattern}">Hash Maps</span>
            </div>
            
            <div class="problem-footer">
                <span class="platform-tag" th:text="${problem.platform}">LeetCode</span>
                <a th:href="${problem.url}" target="_blank" class="problem-link">
                    View
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                </a>
            </div>
        </article>
    </div>

    <!-- List View -->
    <div th:fragment="listView" class="problem-grid list-view">
        <article class="problem-card" th:each="problem : ${problems}">
            <!-- Same structure as grid but with list-view class -->
        </article>
    </div>
</body>
</html>
```

#### 2.2 Service Layer

**ProblemService.java:**
```java
@Service
public class ProblemService {
    
    @Autowired
    private ProblemRepository problemRepository;
    
    @Cacheable("allProblems")
    public List<Problem> findAll() {
        return problemRepository.findAll();
    }
    
    public List<Problem> filter(String topic, String difficulty, String pattern, String search, String sort) {
        List<Problem> problems = findAll();
        
        // Apply filters
        if (topic != null && !topic.isEmpty()) {
            problems = problems.stream()
                .filter(p -> p.getPrimaryTopic().equals(topic))
                .collect(Collectors.toList());
        }
        
        if (difficulty != null && !difficulty.isEmpty()) {
            problems = problems.stream()
                .filter(p -> p.getDifficulty().toString().equals(difficulty))
                .collect(Collectors.toList());
        }
        
        if (pattern != null && !pattern.isEmpty()) {
            problems = problems.stream()
                .filter(p -> p.getPattern().equals(pattern))
                .collect(Collectors.toList());
        }
        
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            problems = problems.stream()
                .filter(p -> p.getTitle().toLowerCase().contains(searchLower))
                .collect(Collectors.toList());
        }
        
        // Apply sorting
        problems = sortProblems(problems, sort);
        
        return problems;
    }
    
    private List<Problem> sortProblems(List<Problem> problems, String sort) {
        if (sort == null || sort.isEmpty()) {
            sort = "title-asc";
        }
        
        String[] parts = sort.split("-");
        String field = parts[0];
        String direction = parts[1];
        
        Comparator<Problem> comparator = switch (field) {
            case "title" -> Comparator.comparing(Problem::getTitle);
            case "difficulty" -> Comparator.comparing(p -> getDifficultyOrder(p.getDifficulty()));
            case "topic" -> Comparator.comparing(Problem::getPrimaryTopic);
            default -> Comparator.comparing(Problem::getTitle);
        };
        
        if ("desc".equals(direction)) {
            comparator = comparator.reversed();
        }
        
        return problems.stream().sorted(comparator).collect(Collectors.toList());
    }
    
    private int getDifficultyOrder(Difficulty difficulty) {
        return switch (difficulty) {
            case EASY -> 1;
            case MEDIUM -> 2;
            case HARD -> 3;
            default -> 4;
        };
    }
    
    public List<String> getAllTopics() {
        return problemRepository.findAll().stream()
            .map(Problem::getPrimaryTopic)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }
    
    public List<String> getAllPatterns() {
        return problemRepository.findAll().stream()
            .map(Problem::getPattern)
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }
}
```

---

### Phase 3: Authentication (Week 2)

#### 3.1 Spring Security Configuration

**SecurityConfig.java:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/register", "/css/**", "/js/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login")
                .permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
            );
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**AuthController.java:**
```java
@Controller
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
    
    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }
    
    @PostMapping("/register")
    public String register(@Valid @ModelAttribute User user, BindingResult result) {
        if (result.hasErrors()) {
            return "register";
        }
        
        userService.registerUser(user);
        return "redirect:/login?registered";
    }
}
```

**login.html:**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Login - AlgoRhythm</title>
    <link rel="stylesheet" th:href="@{/css/styles.css}">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <h1>AlgoRhythm</h1>
            <h2>Login</h2>
            
            <div th:if="${param.error}" class="alert alert-error">
                Invalid username or password
            </div>
            
            <form th:action="@{/login}" method="post">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="btn-primary">Login</button>
            </form>
            
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    </div>
</body>
</html>
```

---

### Phase 4: Progress Tracking & Completion (Week 3)

#### 4.1 Mark Complete with Confidence Modal

**Updated fragments/problem-card.html:**
```html
<article class="problem-card" th:id="'problem-' + ${problem.id}">
    <div class="problem-header">
        <div class="card-actions">
            <input type="checkbox" 
                   class="complete-checkbox"
                   th:checked="${progress != null && progress.completed}"
                   hx-get="${'/problems/' + problem.id + '/complete-modal'}"
                   hx-target="#modal-container"
                   hx-swap="innerHTML">
        </div>
        <h3 class="problem-title" th:text="${problem.title}">Two Sum</h3>
        <div class="problem-meta">
            <span class="difficulty-badge" 
                  th:classappend="${#strings.toLowerCase(problem.difficulty)}"
                  th:text="${problem.difficulty}">Easy</span>
            <span class="problem-topic" th:text="${problem.primaryTopic}">Array</span>
            <span th:if="${progress != null && progress.completed}" class="completion-badge">
                ✓ Confidence: <span th:text="${progress.lastConfidenceScore}">4</span>/5
            </span>
        </div>
    </div>
    
    <!-- ... rest of card ... -->
</article>
```

**Controller endpoint:**
```java
@GetMapping("/{problemId}/complete-modal")
public String showConfidenceModal(@PathVariable String problemId, Model model) {
    Problem problem = problemService.findById(problemId);
    model.addAttribute("problem", problem);
    return "fragments/confidence-modal";
}

@PostMapping("/{problemId}/complete")
public String markComplete(
    @PathVariable String problemId,
    @RequestParam Integer confidence,
    @RequestParam(required = false) Integer timeTaken,
    @RequestParam(required = false) String notes,
    Authentication auth
) {
    User user = (User) auth.getPrincipal();
    
    // Update progress with recommendation engine
    UserProgress progress = userProgressService.markComplete(
        user.getId(), problemId, confidence, timeTaken, notes
    );
    
    // Return updated card + trigger recommendations refresh
    model.addAttribute("problem", progress.getProblem());
    model.addAttribute("progress", progress);
    
    response.addHeader("HX-Trigger", "recommendationsUpdated,statsUpdated");
    
    return "fragments/problem-card :: card";
}
```

**fragments/confidence-modal.html:**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
    <div th:fragment="modal" class="modal" style="display: flex;">
        <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3 class="modal-title">Rate Your Confidence: <span th:text="${problem.title}">Two Sum</span></h3>
            <p class="modal-subtitle">How confident are you with this solution?</p>
            
            <form th:action="@{'/problems/' + ${problem.id} + '/complete'}"
                  method="post"
                  hx-post th:attr="hx-post=@{'/problems/' + ${problem.id} + '/complete'}"
                  hx-target="${'#problem-' + problem.id}"
                  hx-swap="outerHTML"
                  class="confidence-form">
                
                <div class="confidence-scale">
                    <button type="submit" name="confidence" value="0" class="confidence-btn">
                        <span class="confidence-emoji">😰</span>
                        <span class="confidence-label">Couldn't Solve</span>
                        <span class="confidence-desc">No idea how to approach</span>
                    </button>
                    
                    <button type="submit" name="confidence" value="1" class="confidence-btn">
                        <span class="confidence-emoji">😕</span>
                        <span class="confidence-label">Looked at Solution</span>
                        <span class="confidence-desc">Solved with heavy hints</span>
                    </button>
                    
                    <button type="submit" name="confidence" value="2" class="confidence-btn">
                        <span class="confidence-emoji">😐</span>
                        <span class="confidence-label">Struggled</span>
                        <span class="confidence-desc">Many mistakes, inefficient</span>
                    </button>
                    
                    <button type="submit" name="confidence" value="3" class="confidence-btn">
                        <span class="confidence-emoji">🙂</span>
                        <span class="confidence-label">Some Difficulty</span>
                        <span class="confidence-desc">Minor issues, got there</span>
                    </button>
                    
                    <button type="submit" name="confidence" value="4" class="confidence-btn">
                        <span class="confidence-emoji">😊</span>
                        <span class="confidence-label">Confident</span>
                        <span class="confidence-desc">Solved cleanly</span>
                    </button>
                    
                    <button type="submit" name="confidence" value="5" class="confidence-btn">
                        <span class="confidence-emoji">🤩</span>
                        <span class="confidence-label">Trivial</span>
                        <span class="confidence-desc">Could explain to others</span>
                    </button>
                </div>
                
                <div class="modal-optional">
                    <label for="timeTaken">Time Taken (minutes):</label>
                    <input type="number" id="timeTaken" name="timeTaken" min="0" placeholder="Optional">
                    
                    <label for="notes">Notes (optional):</label>
                    <textarea id="notes" name="notes" placeholder="Key insights, mistakes made..."></textarea>
                </div>
            </form>
        </div>
    </div>
</body>
</html>
```

---

### Phase 5: Recommendation Engine (Week 4)

#### 5.1 Port TypeScript Algorithm to Java

**RecommendationEngine.java:**
```java
@Service
public class RecommendationEngine {
    
    // SM-2 Algorithm Implementation
    public BigDecimal updateEasinessFactor(BigDecimal currentEF, int rating) {
        // EF' = EF - 0.8 + 0.28×q - 0.02×q²
        BigDecimal result = currentEF
            .subtract(new BigDecimal("0.8"))
            .add(new BigDecimal("0.28").multiply(new BigDecimal(rating)))
            .subtract(new BigDecimal("0.02").multiply(new BigDecimal(rating * rating)));
        
        // Clamp to [1.3, 3.0]
        if (result.compareTo(new BigDecimal("1.3")) < 0) return new BigDecimal("1.3");
        if (result.compareTo(new BigDecimal("3.0")) > 0) return new BigDecimal("3.0");
        
        return result.setScale(2, RoundingMode.HALF_UP);
    }
    
    public int calculateNextInterval(int currentCycle, BigDecimal easinessFactor, int attemptCount, int rating) {
        // First attempt: 1 day
        if (attemptCount == 0 || rating < 3) {
            return 1;
        }
        
        // Second attempt: 3 days
        if (attemptCount == 1) {
            return 3;
        }
        
        // Subsequent: multiply by EF
        int previousInterval = calculatePreviousInterval(currentCycle, easinessFactor, attemptCount - 1);
        return (int) Math.round(previousInterval * easinessFactor.doubleValue());
    }
    
    public double calculateMemoryDecay(long daysSinceAttempt, double halfLife) {
        // Memory strength = e^(-days / halfLife)
        return Math.exp(-daysSinceAttempt / halfLife);
    }
    
    public double calculateHalfLife(BigDecimal easinessFactor) {
        // halfLife = 7 × EF
        return 7.0 * easinessFactor.doubleValue();
    }
    
    public int calculateMasteryScore(UserProgress progress) {
        if (progress.getAttemptCount() == 0) return 0;
        
        // Get all attempts for this problem
        List<Attempt> attempts = attemptRepository.findByUserAndProblem(
            progress.getUser().getId(), 
            progress.getProblem().getId()
        );
        
        // Calculate weighted average confidence with recency bias
        double weightedSum = 0;
        double weightSum = 0;
        LocalDateTime now = LocalDateTime.now();
        
        for (Attempt attempt : attempts) {
            long daysSince = ChronoUnit.DAYS.between(attempt.getAttemptedAt(), now);
            double recencyWeight = Math.exp(-daysSince / 30.0); // 30-day decay period
            double normalizedConfidence = attempt.getConfidenceScore() / 5.0 * 100;
            
            weightedSum += normalizedConfidence * recencyWeight;
            weightSum += recencyWeight;
        }
        
        double avgConfidence = weightedSum / weightSum;
        
        // Attempt factor (maxes at 3 attempts)
        double attemptFactor = Math.min(progress.getAttemptCount(), 3) / 3.0;
        
        // Memory strength (if review date exists)
        double memoryStrength = 1.0;
        if (progress.getLastAttemptedAt() != null) {
            long daysSince = ChronoUnit.DAYS.between(progress.getLastAttemptedAt(), now);
            double halfLife = calculateHalfLife(progress.getEasinessFactor());
            memoryStrength = calculateMemoryDecay(daysSince, halfLife);
        }
        
        // Final mastery = confidence × attempts × memory
        int mastery = (int) Math.round(avgConfidence * attemptFactor * memoryStrength);
        return Math.min(100, Math.max(0, mastery));
    }
    
    public List<RecommendedProblem> getRecommendations(UUID userId, int count) {
        List<Problem> allProblems = problemService.findAll();
        List<UserProgress> userProgress = userProgressRepository.findByUserId(userId);
        
        // Map progress by problem ID
        Map<String, UserProgress> progressMap = userProgress.stream()
            .collect(Collectors.toMap(
                up -> up.getProblem().getId(),
                up -> up
            ));
        
        // Determine current cycle
        int currentCycle = getCurrentCycle(userProgress);
        
        // Score and prioritize problems
        List<RecommendedProblem> scored = new ArrayList<>();
        
        for (Problem problem : allProblems) {
            UserProgress progress = progressMap.get(problem.getId());
            
            double priorityScore;
            String reason;
            
            if (progress == null || progress.getAttemptCount() == 0) {
                // First exposure
                priorityScore = calculateFirstPassPriority(problem);
                reason = "first-exposure";
            } else if (progress.getNextReviewDate() != null && 
                       progress.getNextReviewDate().isBefore(LocalDateTime.now())) {
                // Scheduled review
                long daysOverdue = ChronoUnit.DAYS.between(progress.getNextReviewDate(), LocalDateTime.now());
                priorityScore = calculateReviewUrgency(daysOverdue) + 50; // Boost overdue
                reason = daysOverdue > 3 ? "overdue-review" : "scheduled-review";
            } else if (progress.getMasteryScore() < 50) {
                // Weak area focus
                priorityScore = 100 - progress.getMasteryScore();
                reason = "weak-area-focus";
            } else {
                continue; // Skip mastered problems not due for review
            }
            
            scored.add(new RecommendedProblem(problem, priorityScore, reason));
        }
        
        // Sort by priority and return top N
        return scored.stream()
            .sorted(Comparator.comparingDouble(RecommendedProblem::getPriorityScore).reversed())
            .limit(count)
            .collect(Collectors.toList());
    }
    
    private double calculateFirstPassPriority(Problem problem) {
        double baseWeight = 100.0;
        
        // Difficulty weight (Medium preferred)
        double difficultyWeight = switch (problem.getDifficulty()) {
            case MEDIUM -> 1.5;
            case HARD -> 1.2;
            case EASY -> 0.8;
            default -> 1.0;
        };
        
        return baseWeight * difficultyWeight;
    }
    
    private double calculateReviewUrgency(long daysOverdue) {
        // Linear urgency up to 50 points
        return Math.min(50, daysOverdue * 5);
    }
    
    private int getCurrentCycle(List<UserProgress> userProgress) {
        long completedCount = userProgress.stream().filter(UserProgress::getCompleted).count();
        long totalProblems = problemService.count();
        
        return (int) (completedCount / totalProblems) + 1;
    }
}
```

#### 5.2 Recommendations UI

**RecommendationController.java:**
```java
@Controller
@RequestMapping("/recommendations")
public class RecommendationController {
    
    @Autowired
    private RecommendationEngine recommendationEngine;
    
    @GetMapping
    public String getRecommendations(Authentication auth, Model model) {
        User user = (User) auth.getPrincipal();
        
        List<RecommendedProblem> recommendations = recommendationEngine.getRecommendations(
            user.getId(), 
            10
        );
        
        if (recommendations.isEmpty()) {
            return ""; // Empty response
        }
        
        model.addAttribute("recommendations", recommendations);
        return "fragments/recommendations";
    }
}
```

**fragments/recommendations.html:**
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<body>
    <section th:fragment="recommendations" class="recommendations-section">
        <div class="section-header">
            <h2 class="section-title">Recommended for You</h2>
            <p class="section-subtitle">Based on your learning progress</p>
        </div>
        <div class="recommendations-carousel">
            <article class="recommendation-card" th:each="rec : ${recommendations}">
                <div class="recommendation-reason" th:text="${rec.formatReason()}">🆕 New Problem</div>
                <h4 class="recommendation-title" th:text="${rec.problem.title}">Two Sum</h4>
                <div class="recommendation-meta">
                    <span class="difficulty-badge" 
                          th:classappend="${#strings.toLowerCase(rec.problem.difficulty)}"
                          th:text="${rec.problem.difficulty}">Easy</span>
                    <span class="recommendation-topic" th:text="${rec.problem.primaryTopic}">Array</span>
                </div>
                <div class="recommendation-footer">
                    <a th:href="${rec.problem.url}" target="_blank" class="problem-link">
                        View
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </a>
                </div>
            </article>
        </div>
    </section>
</body>
</html>
```

**index.html update (add recommendations section):**
```html
<!-- Add before problem grid -->
<section id="recommendations-section"
         hx-get="/recommendations"
         hx-trigger="load, recommendationsUpdated from:body"
         hx-swap="innerHTML">
</section>
```

---

### Phase 6: Deployment (Week 5)

#### 6.1 Production Configuration

**application-prod.yml:**
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  flyway:
    enabled: true
    
server:
  port: 8080
  compression:
    enabled: true
    mime-types: text/html,text/css,application/javascript
    
logging:
  level:
    com.algorhythm: INFO
```

#### 6.2 Deployment Options

**Option A: Railway (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set DATABASE_URL=postgresql://...
railway variables set DB_USERNAME=algorhythm
railway variables set DB_PASSWORD=...

# Deploy
./mvnw clean package
railway up
```

**Cost:** ~$10/month (app + database)

**Option B: Heroku**
```bash
# Create Heroku app
heroku create algorhythm-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main
```

**Cost:** ~$12/month (Eco dyno + Mini Postgres)

**Option C: DigitalOcean App Platform**
- Connect GitHub repository
- Auto-deploy on push
- Add PostgreSQL database
- **Cost:** ~$12/month

---

## Critical Files

### Files to Create (New Spring Boot Project)

**Java Files (Backend Logic):**
1. `src/main/java/com/algorhythm/AlgorhythmApplication.java` - Main application
2. `src/main/java/com/algorhythm/config/SecurityConfig.java` - Security configuration
3. `src/main/java/com/algorhythm/controller/HomeController.java` - Home page
4. `src/main/java/com/algorhythm/controller/ProblemController.java` - Problem filtering
5. `src/main/java/com/algorhythm/controller/RecommendationController.java` - Recommendations
6. `src/main/java/com/algorhythm/controller/AuthController.java` - Authentication
7. `src/main/java/com/algorhythm/service/ProblemService.java` - Problem business logic
8. `src/main/java/com/algorhythm/service/UserProgressService.java` - Progress tracking
9. `src/main/java/com/algorhythm/service/RecommendationEngine.java` - SM-2 algorithm (ported from TypeScript)
10. `src/main/java/com/algorhythm/repository/ProblemRepository.java` - Problem data access
11. `src/main/java/com/algorhythm/repository/UserProgressRepository.java` - Progress data access
12. `src/main/java/com/algorhythm/repository/AttemptRepository.java` - Attempt data access
13. `src/main/java/com/algorhythm/model/Problem.java` - Problem entity
14. `src/main/java/com/algorhythm/model/UserProgress.java` - User progress entity
15. `src/main/java/com/algorhythm/model/Attempt.java` - Attempt entity
16. `src/main/java/com/algorhythm/model/User.java` - User entity

**Thymeleaf Templates:**
1. `src/main/resources/templates/index.html` - Main page (converted from app/index.html)
2. `src/main/resources/templates/login.html` - Login page
3. `src/main/resources/templates/fragments/problem-grid.html` - Problem cards grid
4. `src/main/resources/templates/fragments/problem-card.html` - Individual card
5. `src/main/resources/templates/fragments/confidence-modal.html` - Confidence rating modal
6. `src/main/resources/templates/fragments/recommendations.html` - Recommendations section
7. `src/main/resources/templates/fragments/review-queue.html` - Review queue section

**Static Assets:**
1. `src/main/resources/static/css/styles.css` - Copy from `app/styles.css` (ALL existing CSS preserved)
2. `src/main/resources/static/js/htmx.min.js` - HTMX library

**Configuration:**
1. `src/main/resources/application.yml` - Spring Boot configuration
2. `src/main/resources/application-prod.yml` - Production configuration
3. `src/main/resources/db/migration/V1__create_schema.sql` - Initial database schema
4. `src/main/resources/db/migration/V2__seed_problems.sql` - Import 345 problems from JSON
5. `pom.xml` - Maven dependencies

### Files to Reference (Not Modify)

- `/Users/oshaklya/Projects/personal/AlgoRhythm/app/styles.css` - Copy CSS verbatim
- `/Users/oshaklya/Projects/personal/AlgoRhythm/app/app.js` - Reference for porting logic to Java
- `/Users/oshaklya/Projects/personal/AlgoRhythm/problem-set/*.json` - Convert to SQL INSERT statements
- `/Users/oshaklya/Projects/personal/AlgoRhythm/src/engine/*.ts` - Port algorithms to Java

---

## Verification & Testing

### Manual Testing Checklist

**Phase 1: Setup**
- [ ] Spring Boot application starts without errors
- [ ] Database migrations run successfully (V1, V2)
- [ ] All 345 problems seeded in database
- [ ] Application accessible at http://localhost:8080

**Phase 2: Core Features**
- [ ] Home page loads with all 345 problems
- [ ] Filter by topic works (22 topics)
- [ ] Filter by difficulty works (Easy, Medium, Hard)
- [ ] Filter by pattern works (~30 patterns)
- [ ] Search works with 300ms debounce
- [ ] Sort by title (A-Z, Z-A) works
- [ ] Sort by difficulty works
- [ ] View toggle (grid/list) works
- [ ] All filters combine correctly (AND logic)
- [ ] Problem cards display correctly with all metadata

**Phase 3: Authentication**
- [ ] Register new user works
- [ ] Login works
- [ ] Session persists across page refresh
- [ ] Logout works
- [ ] Unauthenticated users redirected to login

**Phase 4: Progress Tracking**
- [ ] Checkbox marks problem complete
- [ ] Confidence modal appears after checking
- [ ] All 6 confidence levels work (0-5)
- [ ] Optional time/notes fields save correctly
- [ ] Completion persists across sessions
- [ ] Completion badge shows on card with confidence
- [ ] Can un-check to reverse completion

**Phase 5: Recommendations**
- [ ] Recommendations section appears after first completion
- [ ] Shows 5-10 recommended problems
- [ ] Each recommendation shows reason badge
- [ ] Recommendations prioritize weak areas
- [ ] Recommendations update after completing problems
- [ ] Overdue reviews appear in queue
- [ ] Review queue badge shows correct count

**Phase 6: Deployment**
- [ ] Production build completes (`./mvnw clean package`)
- [ ] JAR file runs successfully
- [ ] Database connection works in production
- [ ] Static assets served correctly
- [ ] HTTPS enabled
- [ ] Application accessible at production URL

### Performance Testing

**Database Queries:**
- [ ] All problems query: <100ms
- [ ] Filter query: <50ms
- [ ] User progress query: <50ms
- [ ] Recommendations calculation: <500ms

**Page Load Times:**
- [ ] Initial page load: <2 seconds
- [ ] Filter application: <200ms
- [ ] Problem card render: <100ms

---

## Migration Strategy

### Data Migration from localStorage

For users with existing v1 localStorage data:

**Step 1:** Add migration endpoint
```java
@PostMapping("/migrate-progress")
public ResponseEntity<?> migrateFromLocalStorage(
    @RequestBody LocalStorageData data,
    Authentication auth
) {
    User user = (User) auth.getPrincipal();
    migrationService.importProgress(user.getId(), data);
    return ResponseEntity.ok().build();
}
```

**Step 2:** Add JavaScript to detect localStorage
```javascript
// In index.html
window.addEventListener('load', () => {
    const progress = localStorage.getItem('algorhythm_progress');
    if (progress) {
        fetch('/migrate-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: progress
        }).then(() => {
            localStorage.removeItem('algorhythm_progress');
            location.reload();
        });
    }
});
```

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1: Setup** | Week 1 | Spring Boot project, PostgreSQL schema, 345 problems seeded |
| **Phase 2: Core Features** | Week 2 | Problem listing, filters, search, sort, view toggle with HTMX |
| **Phase 3: Authentication** | Week 2 | User registration, login, session management |
| **Phase 4: Progress Tracking** | Week 3 | Checkboxes, confidence modal, persistence |
| **Phase 5: Recommendations** | Week 4 | SM-2 algorithm ported, recommendations UI, review queue |
| **Phase 6: Deployment** | Week 5 | Production config, deploy to Railway/Heroku |

**Total:** 5 weeks for complete migration

---

## Summary

**What we're building:** Production-ready AlgoRhythm with Spring Boot + HTMX, replacing vanilla JS frontend with server-rendered Thymeleaf templates while preserving all existing CSS and design.

**Tech stack:** 
- Backend: Spring Boot + Spring Security + JPA
- Database: PostgreSQL
- Frontend: Thymeleaf + HTMX (16KB library)
- Styling: Existing styles.css (100% preserved)

**Key advantages:**
- Single JAR deployment
- No complex JavaScript state management
- Backend controls all logic
- Multi-user support with authentication
- PostgreSQL for production-grade persistence
- Recommendation engine ported to Java

**Files:** 16 Java classes, 7 Thymeleaf templates, 1 CSS file (copied), 5 configuration files

**Success criteria:** Fast loading, smooth interactions, working recommendations, multi-user support, <$15/month hosting cost
