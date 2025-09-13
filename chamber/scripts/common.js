// scripts/common.js
// Common functions used across the site
document.addEventListener('DOMContentLoaded', () => {
    // Set copyright year
    document.getElementById('currentyear').textContent = new Date().getFullYear();
    
    // Set last modified date
    document.getElementById('lastmodified').textContent = document.lastModified;
    
    // Mobile menu toggle with animation
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const nav = document.getElementById('primary-nav');
            nav.classList.toggle('show');
            
            // Toggle between hamburger and X icon
            if (nav.classList.contains('show')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const nav = document.getElementById('primary-nav');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (nav && menuToggle && nav.classList.contains('show') && 
            !nav.contains(e.target) && e.target !== menuToggle) {
            nav.classList.remove('show');
            menuToggle.textContent = '☰';
        }
    });
});