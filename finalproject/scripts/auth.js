// Authentication module
import { Utils } from './modules/utils.js';

export class Auth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Load user from localStorage
        this.loadUser();
    }

    // Login functionality
    async login(email, password, rememberMe = false) {
        try {
            // Simulate API call - in real app, this would be a server request
            await this.simulateLoginRequest(email, password);
            
            const user = {
                id: Utils.generateId(),
                email: email,
                firstName: 'Student', // In real app, this would come from server
                lastName: 'User',
                joinDate: new Date().toISOString(),
                preferences: {}
            };

            this.setUser(user, rememberMe);
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Signup functionality
    async signup(userData) {
        try {
            // Validate user data
            if (!this.validateSignupData(userData)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Simulate API call
            await this.simulateSignupRequest(userData);
            
            const user = {
                id: Utils.generateId(),
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
                educationLevel: userData.educationLevel,
                targetExam: userData.targetExam,
                joinDate: new Date().toISOString(),
                preferences: {
                    newsletter: userData.newsletter || false
                }
            };

            this.setUser(user, true);
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Validate signup data
    validateSignupData(data) {
        if (!data.firstName || !data.lastName || !data.email || !data.password) {
            return false;
        }

        if (!Utils.validateEmail(data.email)) {
            return false;
        }

        if (!Utils.validatePassword(data.password)) {
            return false;
        }

        if (data.password !== data.confirmPassword) {
            return false;
        }

        if (!data.agreeTerms) {
            return false;
        }

        return true;
    }

    // Set user in localStorage and state
    setUser(user, remember = true) {
        this.currentUser = user;
        
        if (remember) {
            localStorage.setItem('cinqueStelleUser', JSON.stringify(user));
            localStorage.setItem('cinqueStelleToken', 'simulated-token-' + user.id);
        } else {
            sessionStorage.setItem('cinqueStelleUser', JSON.stringify(user));
            sessionStorage.setItem('cinqueStelleToken', 'simulated-token-' + user.id);
        }
    }

    // Get current user
    getUser() {
        if (this.currentUser) {
            return this.currentUser;
        }

        // Try to load from storage
        const userData = localStorage.getItem('cinqueStelleUser') || sessionStorage.getItem('cinqueStelleUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            return this.currentUser;
        }

        return null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getUser() !== null;
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('cinqueStelleUser');
        localStorage.removeItem('cinqueStelleToken');
        sessionStorage.removeItem('cinqueStelleUser');
        sessionStorage.removeItem('cinqueStelleToken');
    }

    // Load user from storage
    loadUser() {
        this.currentUser = this.getUser();
    }

    // Update user preferences
    updatePreferences(preferences) {
        if (!this.currentUser) return;

        this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
        
        // Update in storage
        const userData = localStorage.getItem('cinqueStelleUser') || sessionStorage.getItem('cinqueStelleUser');
        if (userData) {
            const storedUser = JSON.parse(userData);
            storedUser.preferences = this.currentUser.preferences;
            
            if (localStorage.getItem('cinqueStelleUser')) {
                localStorage.setItem('cinqueStelleUser', JSON.stringify(storedUser));
            } else {
                sessionStorage.setItem('cinqueStelleUser', JSON.stringify(storedUser));
            }
        }
    }

    // Simulated API calls (replace with real API in production)
    async simulateLoginRequest(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate validation
                if (email && password) {
                    resolve({ token: 'simulated-token', user: { email } });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    }

    async simulateSignupRequest(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if email already exists (simulated)
                const existingUsers = JSON.parse(localStorage.getItem('cinqueStelleUsers') || '[]');
                const emailExists = existingUsers.some(user => user.email === userData.email);
                
                if (emailExists) {
                    reject(new Error('Email already exists'));
                } else {
                    // Store user in simulated database
                    existingUsers.push({
                        id: Utils.generateId(),
                        ...userData,
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('cinqueStelleUsers', JSON.stringify(existingUsers));
                    resolve({ success: true });
                }
            }, 1500);
        });
    }
}

// Form handling for login and signup
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthForms();
});

function initializeAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Google login/signup
    const googleLoginBtn = document.getElementById('googleLogin');
    const googleSignupBtn = document.getElementById('googleSignup');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleAuth);
    }
    
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', handleGoogleAuth);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('remember') === 'on';

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    const auth = new Auth();
    const result = await auth.login(email, password, rememberMe);

    if (result.success) {
        // Show success message
        alert('Login successful!');
        
        // Close modal if exists
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            window.closeModal(loginModal);
        }
        
        // Redirect or update UI
        window.location.href = 'dashboard.html';
    } else {
        // Show error message
        alert('Login failed: ' + result.error);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        educationLevel: formData.get('educationLevel'),
        targetExam: formData.get('targetExam'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        agreeTerms: formData.get('agreeTerms') === 'on',
        newsletter: formData.get('newsletter') === 'on'
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    const auth = new Auth();
    const result = await auth.signup(userData);

    if (result.success) {
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            window.openModal(successModal);
        } else {
            window.location.href = 'dashboard.html';
        }
    } else {
        // Show error message
        alert('Signup failed: ' + result.error);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function handleGoogleAuth() {
    // Simulate Google OAuth flow
    alert('Google authentication would open in a real implementation');
    
    // In a real app, this would redirect to Google OAuth
    // For demo purposes, we'll simulate a successful login
    const auth = new Auth();
    auth.setUser({
        id: Utils.generateId(),
        email: 'demo@cinquestelle.com',
        firstName: 'Google',
        lastName: 'User',
        joinDate: new Date().toISOString(),
        preferences: {}
    }, true);
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}