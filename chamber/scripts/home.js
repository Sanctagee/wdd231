// scripts/home.js
// Weather API and Spotlight functionality for home page
document.addEventListener('DOMContentLoaded', () => {
    // Get weather data
    getWeatherData();
    
    // Load company spotlights
    loadSpotlights();
});

// Weather API functionality
async function getWeatherData() {
    const apiKey = '5a9a5cc50d290da3e0fe457f4a12e46f';
    const city = 'Abakaliki';
    const country = 'NG';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&appid=${apiKey}`;
    
    try {
        // Get current weather
        const currentResponse = await fetch(url);
        if (!currentResponse.ok) {
            throw new Error(`Weather API error: ${currentResponse.status}`);
        }
        const currentData = await currentResponse.json();
        
        // Display current weather
        displayCurrentWeather(currentData);
        
        // Get forecast
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }
        const forecastData = await forecastResponse.json();
        
        // Display forecast
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('current-temp').textContent = 'Weather data unavailable';
        document.getElementById('weather-desc').textContent = 'Please check back later';
    }
}

function displayCurrentWeather(data) {
    const currentTemp = document.getElementById('current-temp');
    const weatherDesc = document.getElementById('weather-desc');
    const weatherHumidity = document.getElementById('weather-humidity');
    
    currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    weatherHumidity.textContent = `Humidity: ${data.main.humidity}%`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter to get one forecast per day at noon (or closest available)
    const dailyForecasts = {};
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        // Only include forecasts for the next 3 days (excluding today)
        if (date > today && Object.keys(dailyForecasts).length < 3) {
            // Use noon forecast or the first available for the day
            if (!dailyForecasts[dateString] || date.getHours() === 12) {
                dailyForecasts[dateString] = item;
            }
        }
    });
    
    // Create forecast elements
    forecastContainer.innerHTML = '<div class="forecast-days"></div>';
    const forecastDays = document.querySelector('.forecast-days');
    
    Object.values(dailyForecasts).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        
        dayElement.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;
        
        forecastDays.appendChild(dayElement);
    });
}

// Company Spotlights functionality
async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Filter for gold and silver members
        const premiumMembers = data.members.filter(member => 
            member.membership === 2 || member.membership === 3
        );
        
        // Randomly select 2-3 members
        const selectedMembers = getRandomMembers(premiumMembers, 3);
        
        // Display the selected members
        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error('Error loading company spotlights:', error);
        document.getElementById('spotlight-container').innerHTML = `
            <p class="info-message">Unable to load company spotlights at this time.</p>
        `;
    }
}

function getRandomMembers(members, count) {
    // Shuffle array and get first 'count' elements
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displaySpotlights(members) {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';
    
    if (members.length === 0) {
        container.innerHTML = '<p class="info-message">No premium members found.</p>';
        return;
    }
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'spotlight-card';
        
        // Handle image path
        let imageHtml = '';
        if (member.image && member.image.trim() !== '') {
            imageHtml = `<img class="spotlight-image" src="images/directory/${member.image}" alt="${member.name}" loading="lazy">`;
        } else {
            imageHtml = `<div class="spotlight-image placeholder">No Image</div>`;
        }
        
        // Get membership level text and class
        const membershipText = member.membership === 3 ? 'Gold Member' : 'Silver Member';
        const membershipClass = member.membership === 3 ? 'membership-gold' : 'membership-silver';
        
        card.innerHTML = `
            ${imageHtml}
            <div class="spotlight-info">
                <h3>${member.name || 'Unnamed Business'}</h3>
                <p class="spotlight-address">${member.address || 'Address not available'}</p>
                <p class="spotlight-phone">${member.phone || 'Phone not available'}</p>
                <span class="spotlight-membership ${membershipClass}">
                    ${membershipText}
                </span>
                ${member.website ? `<a href="${member.website}" target="_blank" rel="noopener" class="spotlight-website">Visit Website</a>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}