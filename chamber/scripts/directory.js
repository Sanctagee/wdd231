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
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayMembers(data.members);
        } catch (error) {
            console.error('Error fetching member data:', error);
            directoryContainer.innerHTML = '<p>Sorry, we are unable to load the directory at this time.</p>';
        }
    }
    
    function displayMembers(members) {
        directoryContainer.innerHTML = ''; // Clear any existing content
    
        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card';
            
            card.innerHTML = `
                <img class="member-image" src="images/directory/${member.image}" alt="${member.name}">
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <span class="membership-level membership-${member.membership}">
                        ${getMembershipLevelText(member.membership)}
                    </span>
                    <a href="${member.website}" target="_blank" class="member-website">Visit Website</a>
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