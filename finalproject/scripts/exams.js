// Exams page functionality
import { ExamAPI } from './modules/api.js';
import { Utils } from './modules/utils.js';

// Global variables
let allExams = [];
let filteredExams = [];
let currentSort = 'name';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeExamsPage();
});

// Initialize exams page
async function initializeExamsPage() {
    await loadAllExams();
    initializeFilters();
    initializeSearch();
    initializeSorting();
    populateSubjectFilter();
    displayExams(allExams);
}

// Load all exams from API
async function loadAllExams() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const examsGrid = document.getElementById('examsGrid');
    
    try {
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        if (examsGrid) examsGrid.innerHTML = '';
        
        const data = await ExamAPI.fetchExams();
        allExams = data.exams;
        filteredExams = [...allExams];
        
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
    } catch (error) {
        console.error('Error loading exams:', error);
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        if (examsGrid) {
            examsGrid.innerHTML = `
                <div class="error-message">
                    <h3>Error Loading Exams</h3>
                    <p>Unable to load exams. Please check your connection and try again.</p>
                    <button class="btn-primary" onclick="initializeExamsPage()">Retry</button>
                </div>
            `;
        }
    }
}

// Initialize filter functionality
function initializeFilters() {
    const examTypeFilter = document.getElementById('examType');
    const subjectFilter = document.getElementById('subject');
    const difficultyFilter = document.getElementById('difficulty');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    if (examTypeFilter) {
        examTypeFilter.addEventListener('change', applyFilters);
    }
    
    if (subjectFilter) {
        subjectFilter.addEventListener('change', applyFilters);
    }
    
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', applyFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchExams');
    const searchBtn = document.getElementById('searchBtn');
    
    const debouncedSearch = Utils.debounce(performSearch, 300);
    
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch();
        });
    }
}

// Initialize sorting functionality
function initializeSorting() {
    const sortSelect = document.getElementById('sortExams');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortExams();
            displayExams(filteredExams);
        });
    }
}

// Populate subject filter with unique subjects
function populateSubjectFilter() {
    const subjectFilter = document.getElementById('subject');
    if (!subjectFilter) return;
    
    // Get unique subjects from all exams
    const subjects = [...new Set(allExams.map(exam => exam.subject))].sort();
    
    const optionsHTML = subjects.map(subject => 
        `<option value="${subject}">${subject}</option>`
    ).join('');
    
    subjectFilter.innerHTML = `
        <option value="all">All Subjects</option>
        ${optionsHTML}
    `;
}

// Apply all active filters
function applyFilters() {
    const examType = document.getElementById('examType')?.value || 'all';
    const subject = document.getElementById('subject')?.value || 'all';
    const difficulty = document.getElementById('difficulty')?.value || 'all';
    
    filteredExams = allExams.filter(exam => {
        // Exam type filter
        if (examType !== 'all' && exam.type !== examType) {
            return false;
        }
        
        // Subject filter
        if (subject !== 'all' && exam.subject !== subject) {
            return false;
        }
        
        // Difficulty filter
        if (difficulty !== 'all' && exam.difficulty !== difficulty) {
            return false;
        }
        
        return true;
    });
    
    sortExams();
    displayExams(filteredExams);
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchExams');
    const query = searchInput?.value.trim() || '';
    
    if (query === '') {
        // If search is empty, show filtered exams
        applyFilters();
        return;
    }
    
    // Search through all exams (not just filtered ones)
    ExamAPI.searchExams(query).then(results => {
        filteredExams = results;
        sortExams();
        displayExams(filteredExams);
    });
}

// Sort exams based on current sort criteria
function sortExams() {
    filteredExams.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'difficulty':
                const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            case 'duration':
                return a.duration - b.duration;
            case 'popularity':
                return b.popularity - a.popularity;
            default:
                return 0;
        }
    });
}

// Reset all filters
function resetFilters() {
    const examTypeFilter = document.getElementById('examType');
    const subjectFilter = document.getElementById('subject');
    const difficultyFilter = document.getElementById('difficulty');
    const searchInput = document.getElementById('searchExams');
    
    if (examTypeFilter) examTypeFilter.value = 'all';
    if (subjectFilter) subjectFilter.value = 'all';
    if (difficultyFilter) difficultyFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    
    filteredExams = [...allExams];
    sortExams();
    displayExams(filteredExams);
}

// Display exams in the grid
function displayExams(exams) {
    const examsGrid = document.getElementById('examsGrid');
    const noResults = document.getElementById('noResults');
    const examsCount = document.getElementById('examsCount');
    
    if (!examsGrid) return;
    
    // Update exams count
    if (examsCount) {
        examsCount.textContent = `Available Tests (${exams.length})`;
    }
    
    // Show/hide no results message
    if (noResults) {
        if (exams.length === 0) {
            noResults.classList.remove('hidden');
            examsGrid.innerHTML = '';
        } else {
            noResults.classList.add('hidden');
        }
    }
    
    if (exams.length === 0) return;
    
    // Generate exams HTML
    const examsHTML = exams.map(exam => createExamCard(exam)).join('');
    examsGrid.innerHTML = examsHTML;
    
    // Add event listeners to exam cards
    addExamCardEventListeners();
}

// Create exam card HTML
function createExamCard(exam) {
    return `
        <div class="exam-card" data-exam-id="${exam.id}">
            <div class="exam-header">
                <span class="exam-badge">${exam.type.toUpperCase()}</span>
                <span class="exam-difficulty" style="color: ${Utils.getDifficultyColor(exam.difficulty)}">
                    ${Utils.getDifficultyText(exam.difficulty)}
                </span>
            </div>
            <h3 class="exam-title">${Utils.sanitizeHTML(exam.name)}</h3>
            <p class="exam-description">${Utils.sanitizeHTML(exam.description)}</p>
            
            <div class="exam-meta">
                <div class="meta-item">⏱️ ${Utils.formatDuration(exam.duration)}</div>
                <div class="meta-item">❓ ${exam.questions} questions</div>
                <div class="meta-item">⭐ ${exam.popularity}%</div>
                <div class="meta-item">📚 ${exam.subject}</div>
            </div>
            
            <div class="exam-topics">
                <strong>Topics:</strong> ${exam.topics.slice(0, 3).join(', ')}
                ${exam.topics.length > 3 ? `... (+${exam.topics.length - 3} more)` : ''}
            </div>
            
            <div class="exam-features">
                ${exam.features.map(feature => 
                    `<span class="feature-tag">${feature}</span>`
                ).join('')}
            </div>
            
            <div class="exam-actions">
                <button class="btn-primary btn-small start-exam-btn" data-exam-id="${exam.id}">
                    Start Test
                </button>
                <button class="btn-secondary btn-small details-btn" data-exam-id="${exam.id}">
                    View Details
                </button>
            </div>
        </div>
    `;
}

// Add event listeners to exam cards
function addExamCardEventListeners() {
    // Start exam buttons
    const startButtons = document.querySelectorAll('.start-exam-btn');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const examId = this.getAttribute('data-exam-id');
            startExam(examId);
        });
    });
    
    // Details buttons
    const detailsButtons = document.querySelectorAll('.details-btn');
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const examId = this.getAttribute('data-exam-id');
            showExamDetails(examId);
        });
    });
    
    // Whole card click (for mobile)
    const examCards = document.querySelectorAll('.exam-card');
    examCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons
            if (!e.target.closest('.exam-actions')) {
                const examId = this.getAttribute('data-exam-id');
                showExamDetails(examId);
            }
        });
    });
}

// Start exam function
function startExam(examId) {
    // Check if user is logged in
    const auth = new Auth();
    if (!auth.isLoggedIn()) {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            window.openModal(loginModal);
        } else {
            alert('Please log in to start an exam.');
            window.location.href = 'form-action.html';
        }
        return;
    }
    
    const exam = allExams.find(e => e.id == examId);
    if (!exam) return;
    
    // Store exam in localStorage for the test interface
    localStorage.setItem('currentExam', JSON.stringify(exam));
    
    // Show confirmation modal
    const modal = document.getElementById('examModal');
    if (modal) {
        document.getElementById('examModalTitle').textContent = 'Start Exam';
        document.getElementById('examModalContent').innerHTML = `
            <div class="exam-confirmation">
                <h3>${Utils.sanitizeHTML(exam.name)}</h3>
                <div class="exam-info">
                    <p><strong>Duration:</strong> ${Utils.formatDuration(exam.duration)}</p>
                    <p><strong>Questions:</strong> ${exam.questions}</p>
                    <p><strong>Difficulty:</strong> ${Utils.getDifficultyText(exam.difficulty)}</p>
                    <p><strong>Subject:</strong> ${exam.subject}</p>
                </div>
                <div class="exam-instructions">
                    <h4>Instructions:</h4>
                    <ul>
                        <li>You have ${Utils.formatDuration(exam.duration)} to complete the exam</li>
                        <li>Once started, the timer cannot be paused</li>
                        <li>Answers are automatically saved</li>
                        <li>You can review your answers before submitting</li>
                    </ul>
                </div>
            </div>
        `;
        
        const startBtn = document.getElementById('startExamBtn');
        if (startBtn) {
            startBtn.textContent = 'Start Exam';
            startBtn.onclick = () => {
                // In a real app, this would redirect to the exam interface
                alert(`Starting ${exam.name}. This would redirect to the exam interface in a real implementation.`);
                window.closeModal(modal);
            };
        }
        
        window.openModal(modal);
    } else {
        // Fallback if modal doesn't exist
        alert(`Starting ${exam.name}`);
    }
}

// Show exam details in modal
function showExamDetails(examId) {
    const exam = allExams.find(e => e.id == examId);
    if (!exam) return;
    
    const modal = document.getElementById('examModal');
    if (modal) {
        document.getElementById('examModalTitle').textContent = 'Exam Details';
        document.getElementById('examModalContent').innerHTML = `
            <div class="exam-details">
                <div class="detail-header">
                    <h3>${Utils.sanitizeHTML(exam.name)}</h3>
                    <span class="exam-type-badge">${exam.type.toUpperCase()}</span>
                </div>
                
                <p class="exam-description">${Utils.sanitizeHTML(exam.description)}</p>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <strong>Subject:</strong>
                        <span>${exam.subject}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong>
                        <span>${Utils.formatDuration(exam.duration)}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Questions:</strong>
                        <span>${exam.questions}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Difficulty:</strong>
                        <span style="color: ${Utils.getDifficultyColor(exam.difficulty)}">
                            ${Utils.getDifficultyText(exam.difficulty)}
                        </span>
                    </div>
                    <div class="detail-item">
                        <strong>Popularity:</strong>
                        <span>${exam.popularity}%</span>
                    </div>
                    <div class="detail-item">
                        <strong>Price:</strong>
                        <span>${exam.price === 0 ? 'Free' : `₦${exam.price}`}</span>
                    </div>
                </div>
                
                <div class="topics-section">
                    <h4>Topics Covered:</h4>
                    <div class="topics-list">
                        ${exam.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                    </div>
                </div>
                
                <div class="features-section">
                    <h4>Features:</h4>
                    <ul>
                        ${exam.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        const startBtn = document.getElementById('startExamBtn');
        if (startBtn) {
            startBtn.textContent = 'Start This Exam';
            startBtn.onclick = () => {
                window.closeModal(modal);
                startExam(examId);
            };
        }
        
        window.openModal(modal);
    }
}

// Close exam modal
document.addEventListener('DOMContentLoaded', function() {
    const closeExamModal = document.getElementById('closeExamModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (closeExamModal) {
        closeExamModal.addEventListener('click', function() {
            const modal = document.getElementById('examModal');
            if (modal) window.closeModal(modal);
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            const modal = document.getElementById('examModal');
            if (modal) window.closeModal(modal);
        });
    }
});

// Import Auth class dynamically
let Auth;
import('./auth.js').then(module => {
    Auth = module.Auth;
}).catch(error => {
    console.error('Error loading auth module:', error);
    // Fallback Auth class
    Auth = class {
        isLoggedIn() { return false; }
    };
});

// Add CSS for new elements
const additionalStyles = `
    .exam-topics {
        font-size: 0.875rem;
        color: var(--dark-gray);
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    
    .exam-features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .feature-tag {
        background-color: var(--light-gray);
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
        color: var(--dark-gray);
    }
    
    .exam-confirmation,
    .exam-details {
        max-height: 60vh;
        overflow-y: auto;
    }
    
    .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 1rem;
    }
    
    .exam-type-badge {
        background-color: var(--primary-yellow);
        color: var(--dark-blue);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    
    .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin: 1.5rem 0;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-gray);
    }
    
    .topics-section,
    .features-section {
        margin: 1.5rem 0;
    }
    
    .topics-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .topic-tag {
        background-color: var(--dark-blue);
        color: var(--white);
        padding: 0.375rem 0.75rem;
        border-radius: 16px;
        font-size: 0.75rem;
    }
    
    .features-section ul {
        list-style-type: none;
        padding-left: 0;
    }
    
    .features-section li {
        padding: 0.25rem 0;
        position: relative;
        padding-left: 1rem;
    }
    
    .features-section li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: var(--success-green);
    }
    
    .error-message {
        text-align: center;
        padding: 2rem;
        color: var(--dark-gray);
    }
    
    .btn-small {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);