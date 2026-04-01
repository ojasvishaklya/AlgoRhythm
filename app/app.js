// ============================================
// State Management
// ============================================

const state = {
    allProblems: [],
    filteredProblems: [],
    filters: {
        topic: '',
        difficulty: '',
        pattern: '',
        search: ''
    },
    sort: {
        by: 'title',
        direction: 'asc'
    },
    view: 'grid' // 'grid' or 'list'
};

// ============================================
// Data Loading
// ============================================

async function loadData() {
    try {
        // Load index to get list of topic files
        const indexResponse = await fetch('../problem-set/index.json');
        const index = await indexResponse.json();

        // Load all topic files in parallel
        const topicPromises = index.topics.map(topic =>
            fetch(`../problem-set/${topic.file}`)
                .then(response => response.json())
                .catch(err => {
                    console.error(`Failed to load ${topic.file}:`, err);
                    return { problems: [] };
                })
        );

        const topicData = await Promise.all(topicPromises);

        // Flatten all problems into single array
        state.allProblems = topicData.flatMap(data => data.problems || []);

        // Initialize UI
        populateFilterDropdowns();
        applyFiltersAndRender();

    } catch (error) {
        console.error('Failed to load data:', error);
        showError('Failed to load problems. Please refresh the page.');
    }
}

// ============================================
// Filter Dropdown Population
// ============================================

function populateFilterDropdowns() {
    // Extract unique topics
    const topics = [...new Set(state.allProblems.map(p => p.primaryTopic).filter(Boolean))].sort();
    const topicSelect = document.getElementById('topicFilter');
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicSelect.appendChild(option);
    });

    // Extract unique patterns
    const patterns = [...new Set(state.allProblems.map(p => p.pattern).filter(Boolean))].sort();
    const patternSelect = document.getElementById('patternFilter');
    patterns.forEach(pattern => {
        const option = document.createElement('option');
        option.value = pattern;
        option.textContent = pattern;
        patternSelect.appendChild(option);
    });
}

// ============================================
// Filtering & Sorting
// ============================================

function applyFiltersAndRender() {
    // Start with all problems
    let filtered = [...state.allProblems];

    // Apply topic filter
    if (state.filters.topic) {
        filtered = filtered.filter(p => p.primaryTopic === state.filters.topic);
    }

    // Apply difficulty filter
    if (state.filters.difficulty) {
        filtered = filtered.filter(p => p.difficulty === state.filters.difficulty);
    }

    // Apply pattern filter
    if (state.filters.pattern) {
        filtered = filtered.filter(p => p.pattern === state.filters.pattern);
    }

    // Apply search filter
    if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchLower)
        );
    }

    // Apply sorting
    filtered = sortProblems(filtered);

    state.filteredProblems = filtered;

    // Render
    renderProblemCards();
    renderStats();
    renderActiveFilters();
}

function sortProblems(problems) {
    const { by, direction } = state.sort;
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...problems].sort((a, b) => {
        let aVal, bVal;

        switch (by) {
            case 'title':
                aVal = a.title.toLowerCase();
                bVal = b.title.toLowerCase();
                break;

            case 'difficulty':
                const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                aVal = difficultyOrder[a.difficulty] || 999;
                bVal = difficultyOrder[b.difficulty] || 999;
                break;

            case 'topic':
                aVal = (a.primaryTopic || '').toLowerCase();
                bVal = (b.primaryTopic || '').toLowerCase();
                break;

            default:
                return 0;
        }

        if (aVal < bVal) return -1 * multiplier;
        if (aVal > bVal) return 1 * multiplier;
        return 0;
    });
}

// ============================================
// Rendering
// ============================================

function renderProblemCards() {
    const grid = document.getElementById('problemGrid');

    if (state.filteredProblems.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3>No problems found</h3>
                <p>Try adjusting your filters or search query</p>
            </div>
        `;
        return;
    }

    // Use DocumentFragment for efficient rendering
    const fragment = document.createDocumentFragment();

    state.filteredProblems.forEach(problem => {
        const card = createProblemCard(problem);
        fragment.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
}

function createProblemCard(problem) {
    const card = document.createElement('article');
    card.className = 'problem-card';
    card.setAttribute('role', 'listitem');

    const difficultyClass = (problem.difficulty || 'unknown').toLowerCase();
    const difficultyText = problem.difficulty || 'Unknown';

    card.innerHTML = `
        <div class="problem-header">
            <h3 class="problem-title">${escapeHtml(problem.title)}</h3>
            <div class="problem-meta">
                <span class="difficulty-badge ${difficultyClass}">${difficultyText}</span>
                ${problem.primaryTopic ? `<span class="problem-topic">${escapeHtml(problem.primaryTopic)}</span>` : ''}
            </div>
        </div>

        <div class="problem-body">
            ${problem.pattern ? `<span class="problem-pattern">${escapeHtml(problem.pattern)}</span>` : ''}
        </div>

        <div class="problem-footer">
            <span class="platform-tag">${escapeHtml(problem.platform || 'Platform')}</span>
            <a href="${escapeHtml(problem.url)}" target="_blank" rel="noopener noreferrer" class="problem-link">
                View
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
            </a>
        </div>
    `;

    return card;
}

function renderStats() {
    const statsText = document.getElementById('statsText');
    const total = state.allProblems.length;
    const filtered = state.filteredProblems.length;

    if (filtered === total) {
        statsText.textContent = `${total} problems`;
    } else {
        statsText.textContent = `Showing ${filtered} of ${total} problems`;
    }
}

function renderActiveFilters() {
    const container = document.getElementById('activeFilters');
    container.innerHTML = '';

    const activeFilters = [];

    if (state.filters.topic) {
        activeFilters.push({ type: 'topic', label: state.filters.topic });
    }
    if (state.filters.difficulty) {
        activeFilters.push({ type: 'difficulty', label: state.filters.difficulty });
    }
    if (state.filters.pattern) {
        activeFilters.push({ type: 'pattern', label: state.filters.pattern });
    }

    if (activeFilters.length === 0) return;

    // Create chips
    activeFilters.forEach(filter => {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.innerHTML = `
            ${escapeHtml(filter.label)}
            <button class="filter-chip-remove" data-filter-type="${filter.type}" aria-label="Remove ${filter.label} filter">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
        container.appendChild(chip);
    });

    // Add "Clear All" button
    if (activeFilters.length > 1) {
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'clear-all-btn';
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.addEventListener('click', clearAllFilters);
        container.appendChild(clearAllBtn);
    }

    // Add event listeners to remove buttons
    container.querySelectorAll('.filter-chip-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterType = e.currentTarget.dataset.filterType;
            removeFilter(filterType);
        });
    });
}

// ============================================
// Event Handlers
// ============================================

function initializeEventListeners() {
    // Topic filter
    document.getElementById('topicFilter').addEventListener('change', (e) => {
        state.filters.topic = e.target.value;
        applyFiltersAndRender();
    });

    // Difficulty filter
    document.getElementById('difficultyFilter').addEventListener('change', (e) => {
        state.filters.difficulty = e.target.value;
        applyFiltersAndRender();
    });

    // Pattern filter
    document.getElementById('patternFilter').addEventListener('change', (e) => {
        state.filters.pattern = e.target.value;
        applyFiltersAndRender();
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        const [by, direction] = e.target.value.split('-');
        state.sort.by = by;
        state.sort.direction = direction;
        applyFiltersAndRender();
    });

    // Search (debounced)
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.filters.search = e.target.value.trim();
            applyFiltersAndRender();
        }, 300);
    });

    // View toggle
    document.getElementById('gridViewBtn').addEventListener('click', () => {
        setView('grid');
    });

    document.getElementById('listViewBtn').addEventListener('click', () => {
        setView('list');
    });

    // Load saved view preference from localStorage
    const savedView = localStorage.getItem('algoRhythmView');
    if (savedView && (savedView === 'grid' || savedView === 'list')) {
        setView(savedView);
    }
}

function removeFilter(filterType) {
    state.filters[filterType] = '';

    // Update the corresponding select element
    const selectMap = {
        topic: 'topicFilter',
        difficulty: 'difficultyFilter',
        pattern: 'patternFilter'
    };

    const selectId = selectMap[filterType];
    if (selectId) {
        document.getElementById(selectId).value = '';
    }

    applyFiltersAndRender();
}

function clearAllFilters() {
    state.filters.topic = '';
    state.filters.difficulty = '';
    state.filters.pattern = '';

    document.getElementById('topicFilter').value = '';
    document.getElementById('difficultyFilter').value = '';
    document.getElementById('patternFilter').value = '';

    applyFiltersAndRender();
}

function setView(viewMode) {
    state.view = viewMode;

    // Update grid class
    const grid = document.getElementById('problemGrid');
    if (viewMode === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }

    // Update button states
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');

    if (viewMode === 'grid') {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    }

    // Save preference to localStorage
    localStorage.setItem('algoRhythmView', viewMode);
}

// ============================================
// Utility Functions
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const grid = document.getElementById('problemGrid');
    grid.innerHTML = `
        <div class="empty-state">
            <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3>Error Loading Data</h3>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadData();
});
