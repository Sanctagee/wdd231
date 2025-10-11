// Contact page functionality
import { Utils } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeContactForm();
    initializeAnimations();
    initializeWhatsAppButton();
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

// Handle contact form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateContactForm(formDataObj)) {
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call - in real app, this would send to your backend
        await simulateContactFormSubmission(formDataObj);
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            window.openModal(successModal);
        }
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        alert('Sorry, there was an error sending your message. Please try again or contact us via WhatsApp.');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Validate contact form
function validateContactForm(data) {
    if (!data.fullName || !data.email || !data.inquiryType || !data.subject || !data.message) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (!Utils.validateEmail(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

// Simulate form submission
function simulateContactFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Contact form submitted:', data);
            
            // In a real app, you would:
            // 1. Send data to your backend
            // 2. Send email notification
            // 3. Store in database
            
            resolve({ success: true });
        }, 2000);
    });
}

// Initialize animations
function initializeAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.contact-method, .faq-item, .contact-form-container, .whatsapp-direct');
    
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        
        // Add staggered delay
        element.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Initialize intersection observer for scroll animations
    initScrollAnimations();
}

// Initialize scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize WhatsApp button functionality
function initializeWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-link');
    if (whatsappButton) {
        // Add click tracking (optional)
        whatsappButton.addEventListener('click', function() {
            // You can add analytics here
            console.log('WhatsApp button clicked');
        });
    }
}

// Add animation styles to existing elements on other pages
function enhanceExistingPagesWithAnimations() {
    // This function can be called from main.js to add animations to existing pages
    const sectionsToAnimate = document.querySelectorAll('.feature-card, .exam-card, .stat-card, .hero-content, .hero-visual');
    
    sectionsToAnimate.forEach((section, index) => {
        section.classList.add('fade-in');
        section.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Initialize observer for these elements too
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sectionsToAnimate.forEach(el => observer.observe(el));
}

// Export for use in main.js
window.enhanceExistingPagesWithAnimations = enhanceExistingPagesWithAnimations;