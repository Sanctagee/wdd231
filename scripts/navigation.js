// Toggle mobile navigation
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.navigation ul');

hamburger.addEventListener('click', () => {
    navList.classList.toggle('show');
});

// Close navigation when a link is clicked (for mobile)
const navLinks = document.querySelectorAll('.navigation a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            navList.classList.remove('show');
        }
    });
});