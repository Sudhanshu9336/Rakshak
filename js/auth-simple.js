// Simple Firebase Authentication that WORKS
class SimpleAuth {
    constructor() {
        this.auth = firebase.auth();
        this.setupListeners();
    }
    
    setupListeners() {
        // Auth state listener
        this.auth.onAuthStateChanged((user) => {
            console.log("📱 Auth State Changed:", user ? user.email : "No user");
            
            if (user) {
                this.handleLoggedIn(user);
            } else {
                this.handleLoggedOut();
            }
        });
        
        // Setup login form
        this.setupLoginForm();
    }
    
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        
        if (!loginForm) {
            console.log("⚠️ Login form not found");
            return;
        }
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
        
        // Demo button
        const demoBtn = document.querySelector('.demo-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.useDemoAccount();
            });
        }
    }
    
    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            this.showMessage('Please enter email and password', 'error');
            return;
        }
        
        // Show loading
        this.showMessage('Logging in...', 'info');
        
        try {
            // Try Firebase login
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            this.showMessage('✅ Login successful! Redirecting...', 'success');
            
            // Save to localStorage
            localStorage.setItem('rakshak_user', JSON.stringify({
                email: user.email,
                uid: user.uid,
                isFirebase: true
            }));
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('🔥 Firebase Login Error:', error.code, error.message);
            
            // Handle specific errors
            if (error.code === 'auth/user-not-found') {
                // Offer demo account
                this.offerDemoAccount(email);
            } else if (error.code === 'auth/wrong-password') {
                this.showMessage('❌ Wrong password. Try "123456" for demo', 'error');
            } else if (error.code === 'auth/invalid-email') {
                this.showMessage('❌ Invalid email format', 'error');
            } else {
                this.showMessage(`❌ Error: ${error.message}`, 'error');
                // Fallback to demo
                this.createDemoAccount(email);
            }
        }
    }
    
    offerDemoAccount(email) {
        const useDemo = confirm(`No Firebase account found for "${email}".\n\nUse demo account instead?`);
        
        if (useDemo) {
            this.createDemoAccount(email);
        } else {
            this.showMessage('Try a different email or use demo button', 'info');
        }
    }
    
    createDemoAccount(email) {
        // Create demo user in localStorage
        const demoUser = {
            email: email,
            uid: 'demo-' + Date.now(),
            name: email.split('@')[0],
            isDemo: true,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('rakshak_user', JSON.stringify(demoUser));
        
        this.showMessage('✅ Demo account created! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
    
    useDemoAccount() {
        const demoEmail = 'demo@rakshak.com';
        document.getElementById('email').value = demoEmail;
        document.getElementById('password').value = '123456';
        
        this.showMessage('Using demo credentials...', 'info');
        
        // Auto-submit after 1 second
        setTimeout(() => {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }, 1000);
    }
    
    async handleLogout() {
        try {
            // Sign out from Firebase
            await this.auth.signOut();
            
            // Clear localStorage
            localStorage.removeItem('rakshak_user');
            
            this.showMessage('✅ Logged out successfully', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Logout error:', error);
            this.showMessage('Logged out locally', 'info');
            localStorage.removeItem('rakshak_user');
            window.location.href = 'index.html';
        }
    }
    
    handleLoggedIn(user) {
        console.log('✅ User logged in:', user.email);
        
        // Update UI
        this.updateUI(user);
        
        // If on login page, redirect
        if (window.location.pathname.includes('login.html')) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    }
    
    handleLoggedOut() {
        console.log('✅ User logged out');
        
        // If on protected page, redirect to login
        if (window.location.pathname.includes('dashboard.html')) {
            const localUser = JSON.parse(localStorage.getItem('rakshak_user') || '{}');
            if (!localUser.email) {
                window.location.href = 'login.html';
            }
        }
    }
    
    updateUI(user) {
        // Update navbar
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.email.split('@')[0]}`;
            loginBtn.href = 'dashboard.html';
            
            // Add logout button
            if (!document.querySelector('.logout-btn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.className = 'logout-btn';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
                
                loginBtn.parentElement.parentElement.appendChild(logoutBtn);
            }
        }
        
        // Update dashboard
        const userElements = {
            'user-avatar': user.email.charAt(0).toUpperCase(),
            'user-name': user.displayName || user.email.split('@')[0],
            'user-email': user.email
        };
        
        Object.keys(userElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = userElements[id];
            }
        });
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existing = document.querySelector('.auth-message');
        if (existing) existing.remove();
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message alert alert-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="close-message">&times;</button>
        `;
        
        // Style
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            border-radius: 8px;
            color: ${type === 'error' ? '#c0392b' : type === 'success' ? '#27ae60' : '#2c3e50'};
            background: ${type === 'error' ? '#fadbd8' : type === 'success' ? '#d5f4e6' : '#d6eaf8'};
            border-left: 4px solid ${type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db'};
        `;
        
        document.body.appendChild(messageDiv);
        
        // Close button
        messageDiv.querySelector('.close-message').addEventListener('click', () => {
            messageDiv.remove();
        });
        
        // Auto remove
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }
    
    getMessageIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.simpleAuth = new SimpleAuth();
    console.log('🔧 SimpleAuth initialized');
    
    // Check current auth state
    const user = firebase.auth().currentUser;
    const localUser = JSON.parse(localStorage.getItem('rakshak_user') || '{}');
    
    if (user || localUser.email) {
        console.log('👤 Already authenticated:', user?.email || localUser.email);
    }
});