// scripts/common.js
// Common functions used across the site
document.addEventListener('DOMContentLoaded', () => {
    // Set copyright year
    document.getElementById('currentyear').textContent = new Date().getFullYear();
    
    // Set last modified date
    document.getElementById('lastmodified').textContent = document.lastModified;
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const nav = document.getElementById('primary-nav');
            nav.classList.toggle('show');
        });
    }
});