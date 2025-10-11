// Dashboard functionality
import { ExamAPI } from './modules/api.js';
import { Utils } from './modules/utils.js';

// Global variables
let userData = null;
let userProgress = [];
let recommendedExams = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// Initialize dashboard
async function initializeDashboard() {
    await checkAuthentication();
    await loadUserData();
    await loadDashboardData();
    initializeDashboardEvents();
    updateDashboardUI();
}

// Check if user is authenticated
async function checkAuthentication() {
    const auth = new Auth();
    if (!auth.isLoggedIn()) {
        // Redirect to login if not authenticated
        window.location.href = 'form-action.html';
        return;
    }
    
    userData = auth.getUser();
}

// Load user data from localStorage
async function loadUserData() {
    if (!userData) return;
    
    // Load user progress from localStorage
    const storedProgress = localStorage.getItem(`userProgress_${userData.id}`);
    if (storedProgress) {
        userProgress = JSON.parse(storedProgress);
    } else {
        // Generate mock progress data for new users
        userProgress = generateMockProgress();
        localStorage.setItem(`userProgress_${userData.id}`, JSON.stringify(userProgress));
    }
    
    // Load user preferences
    const storedPreferences = localStorage.getItem(`userPreferences_${userData.id}`);
    if (storedPreferences) {
        userData.preferences = { ...userData.preferences, ...JSON.parse(storedPreferences) };
    }
}

// Load dashboard data
async function loadDashboardData() {
    await loadRecommendedExams();
    await loadRecentActivity();
    updateStatistics();
    renderProgressChart();
    renderStudyPlan();
}

// Initialize dashboard event listeners
function initializeDashboardEvents() {
    // User menu
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', toggleUserMenu);
    }
    
    // Settings modal
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const cancelSettings = document.getElementById('cancelSettings');
    const settingsForm = document.getElementById('settingsForm');
    
    if (settingsModal) {
        if (closeSettingsModal) {
            closeSettingsModal.addEventListener('click', () => window.closeModal(settingsModal));
        }
        if (cancelSettings) {
            cancelSettings.addEventListener('click', () => window.closeModal(settingsModal));
        }
        if (settingsForm) {
            settingsForm.addEventListener('submit', handleSettingsSave);
        }
    }
    
    // Generate study plan button
    const generatePlanBtn = document.getElementById('generatePlan');
    if (generatePlanBtn) {
        generatePlanBtn.addEventListener('click', generateStudyPlan);
    }
    
    // View all progress button
    const viewAllProgressBtn = document.getElementById('viewAllProgress');
    if (viewAllProgressBtn) {
        viewAllProgressBtn.addEventListener('click', () => {
            alert('This would show all progress history in a real implementation');
        });
    }
}

// Toggle user menu dropdown
function toggleUserMenu() {
    const userMenu = document.querySelector('.user-dropdown');
    if (userMenu) {
        userMenu.classList.toggle('show');
        
        // Close menu when clicking outside
        document.addEventListener('click', function closeMenu(e) {
            if (!e.target.closest('.user-menu')) {
                userMenu.classList.remove('show');
                document.removeEventListener('click', closeMenu);
            }
        });
    }
}

// Load recommended exams based on user preferences
async function loadRecommendedExams() {
    try {
        recommendedExams = await ExamAPI.getRecommendedExams(userData);
        renderRecommendedExams();
    } catch (error) {
        console.error('Error loading recommended exams:', error);
    }
}

// Load recent activity
async function loadRecentActivity() {
    // In a real app, this would come from an API
    // For now, we'll use the userProgress data
    renderRecentActivity();
}

// Update dashboard statistics
function updateStatistics() {
    updateStat('completedTests', userProgress.length);
    updateStat('averageScore', calculateAverageScore());
    updateStat('studyTime', calculateTotalStudyTime());
    updateStat('weakAreas', countWeakAreas());
    
    // Update user name in dashboard header
    const dashboardUserName = document.getElementById('dashboardUserName');
    if (dashboardUserName && userData.firstName) {
        dashboardUserName.textContent = userData.firstName;
    }
}

// Update a single statistic
function updateStat(statId, value) {
    const statElement = document.getElementById(statId);
    if (statElement) {
        // Animate the counter
        animateValue(statElement, 0, value, 1000);
    }
}

// Animate value counter
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        let currentValue;
        if (typeof end === 'number') {
            currentValue = Math.floor(progress * (end - start) + start);
        } else {
            currentValue = end;
        }
        
        element.textContent = currentValue + (typeof end === 'number' ? '' : '');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Calculate average score
function calculateAverageScore() {
    if (userProgress.length === 0) return 0;
    
    const totalScore = userProgress.reduce((sum, progress) => sum + progress.score, 0);
    return Math.round(totalScore / userProgress.length);
}

// Calculate total study time
function calculateTotalStudyTime() {
    const totalMinutes = userProgress.reduce((sum, progress) => sum + progress.duration, 0);
    return Math.round(totalMinutes / 60); // Convert to hours
}

// Count weak areas (scores below 60%)
function countWeakAreas() {
    const weakSubjects = new Set();
    userProgress.forEach(progress => {
        if (progress.score < 60) {
            weakSubjects.add(progress.subject);
        }
    });
    return weakSubjects.size;
}

// Render progress chart
function renderProgressChart() {
    const progressChart = document.getElementById('progressChart');
    if (!progressChart) return;
    
    if (userProgress.length === 0) {
        progressChart.innerHTML = `
            <div class="no-data-message">
                <h3>No Progress Data Yet</h3>
                <p>Start taking exams to see your progress chart</p>
                <a href="exams.html" class="btn-primary">Browse Exams</a>
            </div>
        `;
        return;
    }
    
    // Simple bar chart implementation
    const recentProgress = userProgress.slice(-6); // Last 6 attempts
    const chartHTML = `
        <div class="progress-bars">
            ${recentProgress.map(progress => `
                <div class="progress-bar">
                    <div class="bar-label">${progress.examName}</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${progress.score}%; background-color: ${getScoreColor(progress.score)}"></div>
                    </div>
                    <div class="bar-value">${progress.score}%</div>
                </div>
            `).join('')}
        </div>
    `;
    
    progressChart.innerHTML = chartHTML;
}

// Get color based on score
function getScoreColor(score) {
    if (score >= 80) return '#38a169'; // green
    if (score >= 60) return '#d69e2e'; // yellow
    return '#e53e3e'; // red
}

// Render recent activity
function renderRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    if (userProgress.length === 0) {
        activityList.innerHTML = `
            <div class="no-activity">
                <p>No recent activity</p>
                <p>Start your first exam to see activity here</p>
            </div>
        `;
        return;
    }
    
    const recentActivities = userProgress
        .slice(-5)
        .reverse()
        .map(progress => createActivityItem(progress));
    
    activityList.innerHTML = recentActivities.join('');
}

// Create activity item HTML
function createActivityItem(progress) {
    const timeAgo = getTimeAgo(progress.date);
    const scoreColor = getScoreColor(progress.score);
    
    return `
        <div class="activity-item">
            <div class="activity-icon" style="background-color: ${scoreColor}">
                ${progress.score}%
            </div>
            <div class="activity-content">
                <div class="activity-title">Completed ${progress.examName}</div>
                <div class="activity-meta">
                    ${progress.subject} • ${Utils.formatDuration(progress.duration)} • ${timeAgo}
                </div>
            </div>
        </div>
    `;
}

// Get time ago string
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

// Render recommended exams
function renderRecommendedExams() {
    const recommendedGrid = document.getElementById('recommendedGrid');
    if (!recommendedGrid) return;
    
    if (recommendedExams.length === 0) {
        recommendedGrid.innerHTML = `
            <div class="no-recommendations">
                <p>No recommendations available</p>
                <p>Complete some exams to get personalized recommendations</p>
            </div>
        `;
        return;
    }
    
    const recommendedHTML = recommendedExams.map(exam => `
        <div class="recommended-card" data-exam-id="${exam.id}">
            <h3>${Utils.sanitizeHTML(exam.name)}</h3>
            <p>${Utils.sanitizeHTML(exam.description)}</p>
            <div class="recommended-meta">
                <span>${Utils.formatDuration(exam.duration)}</span>
                <span>${exam.questions} questions</span>
            </div>
            <button class="btn-primary btn-small start-recommended" data-exam-id="${exam.id}">
                Start Now
            </button>
        </div>
    `).join('');
    
    recommendedGrid.innerHTML = recommendedHTML;
    
    // Add event listeners to recommended exam buttons
    const startButtons = document.querySelectorAll('.start-recommended');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const examId = this.getAttribute('data-exam-id');
            startRecommendedExam(examId);
        });
    });
}

// Start recommended exam
function startRecommendedExam(examId) {
    // Redirect to exams page or start exam directly
    window.location.href = `exams.html#exam-${examId}`;
}

// Render study plan
function renderStudyPlan() {
    const studyPlan = document.getElementById('studyPlan');
    if (!studyPlan) return;
    
    const planItems = generateStudyPlanItems();
    
    if (planItems.length === 0) {
        studyPlan.innerHTML = `
            <div class="no-plan">
                <p>No study plan generated</p>
                <p>Click "Generate New Plan" to create a personalized study schedule</p>
            </div>
        `;
        return;
    }
    
    studyPlan.innerHTML = planItems.map(item => `
        <div class="plan-item">
            <div class="plan-checkbox ${item.completed ? 'checked' : ''}"></div>
            <div class="plan-content">
                <div class="plan-title">${item.title}</div>
                <div class="plan-meta">${item.meta}</div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to checkboxes
    const checkboxes = document.querySelectorAll('.plan-checkbox');
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            // In a real app, this would update the completion status
        });
    });
}

// Generate study plan items
function generateStudyPlanItems() {
    if (userProgress.length === 0) {
        return [
            { title: 'Take your first diagnostic test', meta: '30 minutes', completed: false },
            { title: 'Review basic mathematics concepts', meta: '45 minutes', completed: false },
            { title: 'Practice English comprehension', meta: '40 minutes', completed: false },
            { title: 'Study physics formulas', meta: '35 minutes', completed: false }
        ];
    }
    
    // Generate personalized plan based on user progress
    const weakSubjects = getWeakSubjects();
    
    return weakSubjects.map(subject => ({
        title: `Practice ${subject} questions`,
        meta: '45 minutes',
        completed: false
    })).slice(0, 4);
}

// Get weak subjects from progress data
function getWeakSubjects() {
    const subjectScores = {};
    
    userProgress.forEach(progress => {
        if (!subjectScores[progress.subject]) {
            subjectScores[progress.subject] = { total: 0, count: 0 };
        }
        subjectScores[progress.subject].total += progress.score;
        subjectScores[progress.subject].count++;
    });
    
    return Object.entries(subjectScores)
        .map(([subject, data]) => ({
            subject,
            average: data.total / data.count
        }))
        .filter(item => item.average < 70)
        .sort((a, b) => a.average - b.average)
        .map(item => item.subject);
}

// Generate new study plan
function generateStudyPlan() {
    // Show loading state
    const generatePlanBtn = document.getElementById('generatePlan');
    if (generatePlanBtn) {
        const originalText = generatePlanBtn.textContent;
        generatePlanBtn.textContent = 'Generating...';
        generatePlanBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            renderStudyPlan();
            generatePlanBtn.textContent = originalText;
            generatePlanBtn.disabled = false;
            alert('New study plan generated based on your recent performance!');
        }, 1500);
    }
}

// Handle settings save
function handleSettingsSave(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const settings = {
        userName: formData.get('userName'),
        studyGoal: formData.get('studyGoal'),
        emailNotifications: formData.get('emailNotifications') === 'on'
    };
    
    // Update user data
    if (settings.userName) {
        userData.firstName = settings.userName;
        const auth = new Auth();
        auth.setUser(userData, true);
    }
    
    // Save preferences
    localStorage.setItem(`userPreferences_${userData.id}`, JSON.stringify({
        studyGoal: settings.studyGoal,
        emailNotifications: settings.emailNotifications
    }));
    
    // Update UI
    updateDashboardUI();
    
    // Close modal
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        window.closeModal(settingsModal);
    }
    
    alert('Settings saved successfully!');
}

// Update dashboard UI with current data
function updateDashboardUI() {
    // Update user name in header
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userData.firstName) {
        userNameElement.textContent = userData.firstName;
    }
    
    // Update settings form with current values
    const userNameInput = document.getElementById('userNameInput');
    const studyGoalSelect = document.getElementById('studyGoal');
    const emailNotifications = document.getElementById('emailNotifications');
    
    if (userNameInput) userNameInput.value = userData.firstName || '';
    if (studyGoalSelect) studyGoalSelect.value = userData.preferences?.studyGoal || '60';
    if (emailNotifications) {
        emailNotifications.checked = userData.preferences?.emailNotifications || false;
    }
}

// Generate mock progress data for new users
function generateMockProgress() {
    const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'];
    const exams = ['WAEC', 'JAMB', 'NECO'];
    
    return Array.from({ length: 5 }, (_, i) => ({
        id: Utils.generateId(),
        examName: `${exams[i % exams.length]} ${subjects[i % subjects.length]} Practice`,
        subject: subjects[i % subjects.length],
        score: Math.floor(Math.random() * 30) + 50, // 50-80%
        duration: Math.floor(Math.random() * 60) + 60, // 60-120 minutes
        date: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)).toISOString() // 2 days apart
    }));
}

// Import Auth class dynamically
let Auth;
import('./auth.js').then(module => {
    Auth = module.Auth;
}).catch(error => {
    console.error('Error loading auth module:', error);
});

// Add CSS for dashboard elements
const dashboardStyles = `
    .progress-bars {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .progress-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .bar-label {
        width: 150px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .bar-container {
        flex: 1;
        height: 20px;
        background-color: var(--border-gray);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .bar-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 0.5s ease;
    }
    
    .bar-value {
        width: 50px;
        text-align: right;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .no-data-message,
    .no-activity,
    .no-recommendations,
    .no-plan {
        text-align: center;
        padding: 2rem;
        color: var(--dark-gray);
    }
    
    .no-activity p,
    .no-recommendations p,
    .no-plan p {
        margin: 0.5rem 0;
    }
    
    @media (max-width: 768px) {
        .progress-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
        }
        
        .bar-label {
            width: auto;
        }
        
        .bar-value {
            width: auto;
            text-align: left;
        }
    }
`;

// Inject dashboard styles
const dashboardStyleSheet = document.createElement('style');
dashboardStyleSheet.textContent = dashboardStyles;
document.head.appendChild(dashboardStyleSheet);