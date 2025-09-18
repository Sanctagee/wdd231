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
    
    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.innerHTML = '<span class="toggle-icon">☀️</span>';
        } else {
            document.documentElement.removeAttribute('data-theme');
            darkModeToggle.innerHTML = '<span class="toggle-icon">🌙</span>';
        }
        
        // Toggle theme on button click
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                darkModeToggle.innerHTML = '<span class="toggle-icon">🌙</span>';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                darkModeToggle.innerHTML = '<span class="toggle-icon">☀️</span>';
            }
        });
    }
    
    // Preloader functionality
    window.addEventListener('load', () => {
        // Wait a minimum of 1 second before hiding preloader for better UX
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('hidden');
                
                // Remove preloader from DOM after animation completes
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }
        }, 1000);
    });
});