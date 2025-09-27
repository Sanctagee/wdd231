// scripts/thankyou.js
document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Display form data
    const fields = [
        'firstName',
        'lastName', 
        'email',
        'phone',
        'businessName',
        'timestamp'
    ];
    
    fields.forEach(field => {
        const value = urlParams.get(field);
        const element = document.getElementById(`summary-${field}`);
        
        if (element && value) {
            if (field === 'timestamp') {
                // Format the timestamp
                const date = new Date(value);
                element.textContent = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } else {
                element.textContent = decodeURIComponent(value);
            }
        }
    });
    
    // If no form data is present (direct access), show a message
    if (!urlParams.toString()) {
        const summary = document.querySelector('.application-summary');
        if (summary) {
            summary.innerHTML = `
                <h2>Application Summary</h2>
                <p class="info-message">No application data found. Please submit your application through the join page.</p>
            `;
        }
    }
});