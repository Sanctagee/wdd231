// scripts/discover.js
document.addEventListener('DOMContentLoaded', () => {
    // Load discover data from JSON
    loadDiscoverData();
    
    // Handle visit message
    handleVisitMessage();
    
    // Close message functionality
    document.getElementById('close-message').addEventListener('click', () => {
        document.getElementById('visit-message').style.display = 'none';
    });
});

// Load discover data from JSON file
async function loadDiscoverData() {
    try {
        const response = await fetch('data/discover.json');
        const data = await response.json();
        displayDiscoverCards(data.places);
    } catch (error) {
        console.error('Error loading discover data:', error);
        document.querySelector('.discover-container').innerHTML = 
            '<p class="error-message">Unable to load discover data. Please try again later.</p>';
    }
}

// Display discover cards
function displayDiscoverCards(places) {
    const container = document.querySelector('.discover-container');
    
    places.forEach((place, index) => {
        const card = document.createElement('div');
        card.className = 'discover-card';
        card.style.gridArea = `card${index + 1}`;
        
        card.innerHTML = `
            <figure>
                <img src="${place.image}" alt="${place.name}" class="discover-image" loading="lazy">
            </figure>
            <div class="discover-info">
                <h2>${place.name}</h2>
                <address class="discover-address">${place.address}</address>
                <p class="discover-description">${place.description}</p>
                <button class="learn-more-btn">Learn More</button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Handle visit message using localStorage
function handleVisitMessage() {
    const visitMessage = document.getElementById('visit-text');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = Date.now();
    
    if (!lastVisit) {
        // First visit
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysBetween = Math.floor((currentVisit - lastVisit) / (1000 * 60 * 60 * 24));
        
        if (daysBetween < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else {
            const dayText = daysBetween === 1 ? "day" : "days";
            visitMessage.textContent = `You last visited ${daysBetween} ${dayText} ago.`;
        }
    }
    
    // Store current visit
    localStorage.setItem('lastVisit', currentVisit);
}