// scripts/join.js
document.addEventListener('DOMContentLoaded', () => {
    // Set timestamp when page loads
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const infoButtons = document.querySelectorAll('.info-btn');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modal
    infoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    // Close modal
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Form validation for title pattern
    const titleInput = document.querySelector('input[name="title"]');
    if (titleInput) {
        titleInput.addEventListener('input', () => {
            const pattern = /^[A-Za-z\s\-]{7,}$/;
            if (titleInput.value && !pattern.test(titleInput.value)) {
                titleInput.setCustomValidity('Title must be at least 7 characters and contain only letters, spaces, and hyphens');
            } else {
                titleInput.setCustomValidity('');
            }
        });
    }

    // Enhance form submission
    const form = document.getElementById('membership-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Additional validation can be added here if needed
            console.log('Form submitted successfully');
        });
    }

    // Trigger membership card animations after page load and preloader
    function triggerCardAnimations() {
        const membershipCards = document.querySelectorAll('.membership-card');
        membershipCards.forEach(card => {
            card.classList.add('animate-in');
        });
    }

    // Wait for page to fully load and preloader to complete
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', triggerCardAnimations);
    } else {
        // If DOM is already loaded, wait a bit for preloader
        setTimeout(triggerCardAnimations, 1200);
    }

    // Alternative: Listen for preloader removal
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (preloader.classList.contains('hidden')) {
                        setTimeout(triggerCardAnimations, 300);
                    }
                }
            });
        });
        
        observer.observe(preloader, { attributes: true });
    } else {
        // If no preloader found, trigger animations after a short delay
        setTimeout(triggerCardAnimations, 1000);
    }
});