// Course data array - modified to reflect your completed courses
const courses = [
    { code: "CSE110", name: "Introduction to Programming", credits: 2, completed: true },
    { code: "WDD130", name: "Web Fundamentals", credits: 2, completed: true },
    { code: "CSE111", name: "Programming with Functions", credits: 2, completed: false },
    { code: "CSE121B", name: "JavaScript Language", credits: 2, completed: false },
    { code: "WDD231", name: "Frontend Web Development I", credits: 2, completed: false },
    { code: "WDD131", name: "Dynamic Web Fundamentals", credits: 2, completed: true }, // Assuming you completed this
    { code: "WDD330", name: "Frontend Web Development II", credits: 3, completed: false },
    { code: "CSE210", name: "Programming with Classes", credits: 2, completed: false }
];

// Display courses based on filter
function displayCourses(filter = 'all') {
    const courseList = document.querySelector('.course-list');
    courseList.innerHTML = '';
    
    const filteredCourses = filter === 'all' 
        ? courses 
        : courses.filter(course => course.code.startsWith(filter.toUpperCase()));
    
    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        if (course.completed) {
            courseCard.classList.add('completed');
        }
        
        courseCard.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p>Credits: ${course.credits}</p>
            <p>Status: ${course.completed ? 'Completed' : 'Not Completed'}</p>
        `;
        
        courseList.appendChild(courseCard);
    });
    
    // Update total credits
    updateTotalCredits(filteredCourses);
}

// Calculate and display total credits
function updateTotalCredits(courses) {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById('total-credits').textContent = totalCredits;
}

// Set up filter buttons
document.getElementById('all').addEventListener('click', () => {
    displayCourses('all');
    setActiveButton('all');
});

document.getElementById('wdd').addEventListener('click', () => {
    displayCourses('wdd');
    setActiveButton('wdd');
});

document.getElementById('cse').addEventListener('click', () => {
    displayCourses('cse');
    setActiveButton('cse');
});

// Helper function to set active button
function setActiveButton(activeId) {
    document.querySelectorAll('.filter-buttons button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
}

// Initialize page with all courses displayed
document.addEventListener('DOMContentLoaded', () => {
    displayCourses('all');
    setActiveButton('all');
});