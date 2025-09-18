// scripts/directory.js
// Fetch member data and display directory
document.addEventListener('DOMContentLoaded', () => {
    // View toggle functionality
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const directoryContainer = document.getElementById('directory-container');
    
    gridViewBtn.addEventListener('click', () => {
        directoryContainer.className = 'grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });
    
    listViewBtn.addEventListener('click', () => {
        directoryContainer.className = 'list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });
    
    // Fetch and display member data
    async function getMembers() {
        try {
            const response = await fetch('data/members.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Check if we have valid data
            if (!data.members || !Array.isArray(data.members)) {
                throw new Error('Invalid data format in members.json');
            }
            
            displayMembers(data.members);
        } catch (error) {
            console.error('Error fetching member data:', error);
            directoryContainer.innerHTML = `
                <div class="error-message">
                    <p>Sorry, we are unable to load the directory at this time.</p>
                    <p>Error: ${error.message}</p>
                    <p>Please check the browser console for more details.</p>
                </div>
            `;

            // Even if there's an error, hide the preloader
            hidePreloader();
        }
    }
    
    function displayMembers(members) {
        directoryContainer.innerHTML = ''; // Clear any existing content
        
        if (members.length === 0) {
            directoryContainer.innerHTML = '<p class="info-message">No members found in the directory.</p>';
            return;
        }
    
        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card';
            
            // Handle missing or incorrect image paths
            let imageHtml = '';
            if (member.image && member.image.trim() !== '') {
                imageHtml = `<img class="member-image" src="images/directory/${member.image}" alt="${member.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200.png?text=Image+Not+Found'">`;
            } else {
                imageHtml = `<div class="member-image placeholder">No Image</div>`;
            }
            
            card.innerHTML = `
                ${imageHtml}
                <div class="member-info">
                    <h3>${member.name || 'Unnamed Business'}</h3>
                    <p class="member-address">${member.address || 'Address not available'}</p>
                    <p class="member-phone">${member.phone || 'Phone not available'}</p>
                    <p class="member-description">${member.description || 'No description available'}</p>
                    <span class="membership-level membership-${member.membership || 1}">
                        ${getMembershipLevelText(member.membership)}
                    </span>
                    ${member.website ? `<a href="${member.website}" target="_blank" rel="noopener" class="member-website">Visit Website</a>` : ''}
                </div>
            `;
            
            directoryContainer.appendChild(card);
        });
    }
    
    function getMembershipLevelText(level) {
        switch(level) {
            case 1: return 'Member';
            case 2: return 'Silver Member';
            case 3: return 'Gold Member';
            default: return 'Member';
        }
    }
    
    // Initialize the directory
    getMembers();
});