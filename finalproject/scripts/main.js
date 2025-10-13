// Main JavaScript file - Entry point for the application
import { Utils } from './modules/utils.js';
import { Auth } from './auth.js';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// To add the current year to the footer section
document.getElementById('currentyear').textContent = new Date().getFullYear();

// TO initialize the Applications
function initializeApp() {
    initializeNavigation();
    initializeModals();
    initializeEventListeners();
    initializeMultiStepForm();
    initializeAnimations();
    loadDynamicContent();
    
    // Check if user is logged in
    const auth = new Auth();
    if (auth.isLoggedIn()) {
        updateUIForLoggedInUser(auth.getUser());
    }
}

// To initialize Animations
function initializeAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.feature-card, .exam-card, .stat-card, .hero-content, .hero-visual');
    
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Initialize intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate statistics when they come into view
                if (entry.target.classList.contains('stat-number')) {
                    animateStatistics();
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated elements
    const allAnimatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stat-number');
    allAnimatedElements.forEach(el => observer.observe(el));
}


// Initialize navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.setAttribute('data-visible', !isExpanded);
            
            // Update hamburger animation
            if (!isExpanded) {
                this.classList.add('active');
            } else {
                this.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    navMenu.setAttribute('data-visible', 'false');
                    hamburger.classList.remove('active');
                }
            });
        });
    }
}


// Initialize modal functionality
function initializeModals() {
    // Login modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
        closeLoginModal?.addEventListener('click', () => closeModal(loginModal));
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[aria-hidden="false"]');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

// Modal utility functions
function openModal(modal) {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus trap for accessibility
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function closeModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
}

// Initialize global event listeners
function initializeEventListeners() {
    // Hero section buttons
    const startLearningBtn = document.getElementById('startLearning');
    const watchDemoBtn = document.getElementById('watchDemo');
    
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', () => {
            window.location.href = 'form-action.html';
        });
    }
    
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', () => {
            alert('Video demonstration would play here in a real implementation');
        });
    }
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
}

// Update password strength indicator
function updatePasswordStrength() {
    const password = this.value;
    const strength = Utils.calculatePasswordStrength(password);
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (strengthBar && strengthText) {
        const width = (strength / 5) * 100;
        strengthBar.style.width = `${width}%`;
        strengthBar.style.backgroundColor = Utils.getPasswordStrengthColor(strength);
        strengthText.textContent = Utils.getPasswordStrengthText(strength);
    }
}

// Load dynamic content for home page
async function loadDynamicContent() {
    // Animate statistics counters
    animateStatistics();
    
    // Load features
    await loadFeatures();
    
    // Load featured exams
    await loadFeaturedExams();
}

// Animate statistics counters
function animateStatistics() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = getCounterTarget(counter.id);
        animateCounter(counter, target);
    });
}

function getCounterTarget(id) {
    const targets = {
        'studentsCount': 12500,
        'examsCount': 150,
        'successRate': 92
    };
    return targets[id] || 0;
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 20);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Load features from data
async function loadFeatures() {
    const featuresGrid = document.getElementById('featuresGrid');
    if (!featuresGrid) return;
    
    try {
        const response = await fetch('./data/exams.json');
        const data = await response.json();
        
        const featuresHTML = data.features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">${feature.icon}</div>
                <h3>${Utils.sanitizeHTML(feature.title)}</h3>
                <p>${Utils.sanitizeHTML(feature.description)}</p>
            </div>
        `).join('');
        
        featuresGrid.innerHTML = featuresHTML;
    } catch (error) {
        console.error('Error loading features:', error);
        featuresGrid.innerHTML = '<p>Error loading features. Please try again later.</p>';
    }
}

// To make the form section a multi-page section

// Add to main.js in initializeEventListeners function
function initializeMultiStepForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    const steps = form.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    
    // Navigation between steps
    form.addEventListener('click', function(e) {
        if (e.target.matches('[data-next]')) {
            const nextStep = e.target.dataset.next;
            navigateToStep(nextStep);
        } else if (e.target.matches('[data-prev]')) {
            const prevStep = e.target.dataset.prev;
            navigateToStep(prevStep);
        }
    });
    
    function navigateToStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Show current step
        const currentStep = form.querySelector(`[data-step="${stepNumber}"]`);
        const currentIndicator = document.querySelector(`[data-step="${stepNumber}"]`);
        
        if (currentStep) {
            currentStep.classList.add('active');
        }
        if (currentIndicator) {
            currentIndicator.classList.add('active');
        }
        
        // Update confirmation data on last step
        if (stepNumber === '3') {
            updateConfirmationData();
        }
    }
    
    function updateConfirmationData() {
        const formData = new FormData(form);
        const confirmationDiv = document.getElementById('confirmationData');
        
        if (confirmationDiv) {
            confirmationDiv.innerHTML = `
                <p><strong>Name:</strong> ${formData.get('fullName')}</p>
                <p><strong>Email:</strong> ${formData.get('email')}</p>
                <p><strong>Phone:</strong> ${formData.get('phone')}</p>
                <p><strong>Education Level:</strong> ${formData.get('educationLevel')}</p>
            `;
        }
    }
}



// Load featured exams for home page
async function loadFeaturedExams() {
    const examsCarousel = document.getElementById('examsCarousel');
    if (!examsCarousel) return;
    
    try {
        const { ExamAPI } = await import('./modules/api.js');
        const featuredExams = await ExamAPI.getFeaturedExams(6);
        
        const examsHTML = featuredExams.map(exam => `
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
                <div class="exam-actions">
                    <button class="btn-primary btn-small" onclick="startExam(${exam.id})">Start Test</button>
                    <button class="btn-secondary btn-small" onclick="viewExamDetails(${exam.id})">Details</button>
                </div>
            </div>
        `).join('');
        
        examsCarousel.innerHTML = examsHTML;
    } catch (error) {
        console.error('Error loading featured exams:', error);
        examsCarousel.innerHTML = '<p>Error loading exams. Please try again later.</p>';
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userName = document.getElementById('userName');
    
    if (loginBtn) {
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = () => {
            const auth = new Auth();
            auth.logout();
            window.location.reload();
        };
    }
    
    if (userName) {
        userName.textContent = user.firstName || 'User';
    }
}

// Global functions for exam actions
window.startExam = function(examId) {
    const auth = new Auth();
    if (!auth.isLoggedIn()) {
        openModal(document.getElementById('loginModal'));
        return;
    }
    alert(`Starting exam ${examId}. This would redirect to the exam interface in a real implementation.`);
};

window.viewExamDetails = function(examId) {
    // This would open a modal with exam details
    alert(`Viewing details for exam ${examId}`);
};

// Export for use in other modules
window.Utils = Utils;
window.openModal = openModal;
window.closeModal = closeModal;



