/**
 * Authentication Module
 * Handles user login, registration, and authentication
 */

class AuthService {
    constructor() {
        this.validationRules = {
            username: (val) => val.length >= 3 && val.length <= 20,
            email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            password: (val) => val.length >= 6,
            passwordMatch: (pwd, confirm) => pwd === confirm
        };
    }

    /**
     * Validate input
     */
    validate(data, type = 'login') {
        const errors = {};

        if (type === 'login') {
            if (!data.username) errors.username = 'Username or email is required';
            if (!data.password) errors.password = 'Password is required';
        } else if (type === 'register') {
            if (!data.username) {
                errors.username = 'Username is required';
            } else if (!this.validationRules.username(data.username)) {
                errors.username = 'Username must be 3-20 characters';
            }

            if (!data.email) {
                errors.email = 'Email is required';
            } else if (!this.validationRules.email(data.email)) {
                errors.email = 'Invalid email format';
            }

            if (!data.password) {
                errors.password = 'Password is required';
            } else if (!this.validationRules.password(data.password)) {
                errors.password = 'Password must be at least 6 characters';
            }

            if (data.password && data.confirmPassword) {
                if (!this.validationRules.passwordMatch(data.password, data.confirmPassword)) {
                    errors.confirmPassword = 'Passwords do not match';
                }
            } else if (!data.confirmPassword) {
                errors.confirmPassword = 'Please confirm your password';
            }

            if (!data.terms) {
                errors.terms = 'You must agree to the terms';
            }
        }

        return errors;
    }

    /**
     * Hash password (simple client-side, should be done server-side in production)
     */
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Login user
     */
    async login(username, password) {
        try {
            // Get users from storage
            const users = this.getAllUsers();
            const hashedPassword = this.hashPassword(password);

            // Find user
            const user = users.find(u => 
                (u.username === username || u.email === username) && 
                u.password === hashedPassword
            );

            if (!user) {
                throw new Error('Invalid username or password');
            }

            // Remove password from stored user object
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Register user
     */
    async register(userData) {
        try {
            // Validate
            const errors = this.validate(userData, 'register');
            if (Object.keys(errors).length > 0) {
                throw { validationErrors: errors };
            }

            // Get existing users
            const users = this.getAllUsers();

            // Check if user already exists
            if (users.find(u => u.username === userData.username || u.email === userData.email)) {
                throw new Error('Username or email already exists');
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                username: userData.username,
                email: userData.email,
                password: this.hashPassword(userData.password),
                createdAt: new Date().toISOString(),
                level: 1,
                playtime: 0,
                friends: [],
                games: []
            };

            // Save user
            users.push(newUser);
            this.saveAllUsers(users);

            // Return user without password
            const { password: _, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all users from storage
     */
    getAllUsers() {
        const usersStr = localStorage.getItem('kssteam_users');
        return usersStr ? JSON.parse(usersStr) : [];
    }

    /**
     * Save all users to storage
     */
    saveAllUsers(users) {
        localStorage.setItem('kssteam_users', JSON.stringify(users));
    }

    /**
     * Update user data
     */
    updateUser(userId, userData) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) throw new Error('User not found');
        
        users[userIndex] = { ...users[userIndex], ...userData };
        this.saveAllUsers(users);
        return users[userIndex];
    }
}

// Create global auth service
const authService = new AuthService();

// Handle login form submission
async function handleLogin() {
    const form = document.getElementById('loginForm');
    const username = form.elements['username'].value;
    const password = form.elements['password'].value;

    try {
        const user = await authService.login(username, password);
        
        // Save user to app
        app.user = user;
        app.saveUser();
        app.updateUI();
        app.closeModal('loginModal');
        
        // Show success message
        showNotification('Welcome back!', 'success');
        
        // Navigate to library
        setTimeout(() => app.navigateToSection('library'), 500);
    } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
    }
}

// Handle register form submission
async function handleRegister() {
    const form = document.getElementById('registerForm');
    const data = {
        username: form.elements['username'].value,
        email: form.elements['email'].value,
        password: form.elements['password'].value,
        confirmPassword: form.elements['confirmPassword'].value,
        terms: form.elements['terms'].checked
    };

    try {
        const user = await authService.register(data);
        
        // Save user to app
        app.user = user;
        app.saveUser();
        app.updateUI();
        app.closeModal('registerModal');
        
        // Show success message
        showNotification('Account created successfully!', 'success');
        
        // Navigate to library
        setTimeout(() => app.navigateToSection('library'), 500);
    } catch (error) {
        if (error.validationErrors) {
            const firstError = Object.values(error.validationErrors)[0];
            showNotification(firstError, 'error');
        } else {
            showNotification(error.message || 'Registration failed', 'error');
        }
    }
}

// Notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.zIndex = '3000';
    notification.style.maxWidth = '400px';
    notification.innerHTML = `
        <div class="alert-content">
            <div class="alert-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
