
// Declare constants
const url = 'https://byui-cse.github.io/cse121b-ww-course/resources/temples.json';
// Note: The instruction URL seems to be incorrect. The correct URL for prophets is:
// const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
// I'll use the correct URL for prophets data

const correctUrl = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');
const preloader = document.getElementById('preloader'); // Get preloader element

// Function to hide preloader
function hidePreloader() {
    preloader.classList.add('hidden');
}

// Async function to get prophet data
async function getProphetData() {
    try {
        const response = await fetch(correctUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // console.table(data.prophets); // For testing - comment out later
        displayProphets(data.prophets);

        setTimeout(hidePreloader, 1500); // 1.5 second delay to show preloader
    } catch (error) {
        console.error('Error fetching prophet data:', error);
        cards.innerHTML = `<p class="error">Sorry, we couldn't load the prophet data at this time. Please try again later.</p>`;

        // Still hide preloader even if there's an error
        hidePreloader();
    }
}

// Function to display prophets
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // Create elements
        const card = document.createElement('section');
        const fullName = document.createElement('h2');
        const portrait = document.createElement('img');
        const birthDate = document.createElement('p');
        const birthPlace = document.createElement('p');
        const deathDate = document.createElement('p');
        const numChildren = document.createElement('p');
        const yearsAsProphet = document.createElement('p');
        
        // Build the h2 content
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        
        // Build the image portrait
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname} - ${prophet.order}${getOrdinalSuffix(prophet.order)} Latter-day President`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');
        
        // Build additional information
        birthDate.innerHTML = `<strong>Date of Birth:</strong> ${prophet.birthdate}`;
        birthPlace.innerHTML = `<strong>Place of Birth:</strong> ${prophet.birthplace}`;
        
        // To Add death date if applicable
        if (prophet.death) {
            deathDate.innerHTML = `<strong>Date of Death:</strong> ${prophet.death}`;
        } else {
            deathDate.innerHTML = `<strong>Status:</strong> Still living`;
        }
        
        // Add number of children if available
        if (prophet.numofchildren) {
            numChildren.innerHTML = `<strong>Children:</strong> ${prophet.numofchildren}`;
        } else {
            numChildren.innerHTML = `<strong>Children:</strong> Information not available`;
        }
        
        // Calculate years as prophet
        if (prophet.length) {
            yearsAsProphet.innerHTML = `<strong>Years as President:</strong> ${prophet.length}`;
        }
        
        // Append elements to the card
        card.appendChild(fullName);
        card.appendChild(portrait);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(deathDate);
        card.appendChild(numChildren);
        
        // Only add years as prophet if available
        if (prophet.length) {
            card.appendChild(yearsAsProphet);
        }
        
        // Add class for styling
        card.classList.add('card');
        card.style.padding = '1rem';
        
        // Append card to the cards div
        cards.appendChild(card);
    });
};

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(number) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = number % 100;
    
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
}

// Call the function to get and display data
getProphetData();