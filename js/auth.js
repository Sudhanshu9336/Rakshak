// Firebase Authentication with Login/Logout
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth state listener
    initAuthState();
    
    // Setup login form if exists
    setupLoginForm();
    
    // Setup logout buttons
    setupLogoutButtons();
    
    // Setup registration
    setupRegistration();
    
    // Check and update UI based on auth state
    updateAuthUI();
});

// ========== AUTH STATE LISTENER ==========
function initAuthState() {
    auth.onAuthStateChanged((user) => {
        console.log("Auth state changed. User:", user ? user.email : "No user");
        
        if (user) {
            // User is signed in
            handleUserSignedIn(user);
        } else {
            // User is signed out
            handleUserSignedOut();
        }
        
        // Update UI elements
        updateAuthUI();
        
        // Redirect if needed
        handlePageRedirect(user);
    });
}

// ========== LOGIN FUNCTIONALITY ==========
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember') ? document.getElementById('remember').checked : false;
        
        // Validation
        if (!email || !password) {
            showAuthAlert('Please enter both email and password', 'danger');
            return;
        }
        
        if (!validateEmail(email)) {
            showAuthAlert('Please enter a valid email address', 'danger');
            return;
        }
        
        // Show loading
        showAuthAlert('Logging in...', 'info');
        
        try {
            // Set persistence based on remember me
            const persistence = rememberMe ? 
                firebase.auth.Auth.Persistence.LOCAL : 
                firebase.auth.Auth.Persistence.SESSION;
            
            await auth.setPersistence(persistence);
            
            // Sign in with Firebase
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Save user info
            await saveUserToFirestore(user);
            
            // Show success
            showAuthAlert('Login successful! Redirecting...', 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle specific errors
            let errorMessage = 'Login failed. Please try again.';
            
            switch(error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Try again later.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Check your connection.';
                    break;
            }
            
            showAuthAlert(errorMessage, 'danger');
            
            // For demo/portfolio: Create demo account on user-not-found
            if (error.code === 'auth/user-not-found') {
                setTimeout(() => {
                    offerDemoAccount(email);
                }, 2000);
            }
        }
    });
}

// ========== LOGOUT FUNCTIONALITY ==========
function setupLogoutButtons() {
    // Find all logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"], .nav-logout');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const confirmed = confirm('Are you sure you want to logout?');
            if (!confirmed) return;
            
            try {
                // Show loading
                showAuthAlert('Logging out...', 'info');
                
                // Sign out from Firebase
                await auth.signOut();
                
                // Clear local storage
                localStorage.removeItem('rakshak_user');
                localStorage.removeItem('rakshak_sos_events');
                localStorage.removeItem('rakshak_preferences');
                
                // Show success
                showAuthAlert('Logged out successfully!', 'success');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
            } catch (error) {
                console.error('Logout error:', error);
                showAuthAlert('Logout failed. Please try again.', 'danger');
            }
        });
    });
}

// ========== REGISTRATION FUNCTIONALITY ==========
function setupRegistration() {
    const registerLink = document.getElementById('registerLink');
    const registerForm = document.getElementById('registerForm');
    
    // Registration link click
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegistrationModal();
        });
    }
    
    // Registration form submit
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleRegistration();
        });
    }
}

// ========== HELPER FUNCTIONS ==========
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function saveUserToFirestore(user) {
    try {
        await db.collection('users').doc(user.uid).set({
            email: user.email,
            lastLogin: new Date().toISOString(),
            createdAt: user.metadata.creationTime,
            loginCount: firebase.firestore.FieldValue.increment(1)
        }, { merge: true });
        
        console.log('User data saved to Firestore');
    } catch (error) {
        console.error('Error saving user to Firestore:', error);
    }
}

function showAuthAlert(message, type) {
    // Try to find alert container
    let alertContainer = document.getElementById('authAlert');
    
    if (!alertContainer) {
        // Create one if it doesn't exist
        alertContainer = document.createElement('div');
        alertContainer.id = 'authAlert';
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
        `;
        document.body.appendChild(alertContainer);
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        margin-bottom: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add styles for animation
    if (!document.querySelector('#alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    alert.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px;">
            <i class="fas fa-${getAlertIcon(type)}"></i>
            <div style="flex: 1;">
                <strong>${getAlertTitle(type)}</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9em;">${message}</p>
            </div>
            <button class="close-alert" style="background: none; border: none; color: inherit; cursor: pointer;">
                &times;
            </button>
        </div>
    `;
    
    alertContainer.appendChild(alert);
    
    // Add close functionality
    alert.querySelector('.close-alert').addEventListener('click', () => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

function getAlertIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'danger': return 'exclamation-triangle';
        case 'warning': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

function getAlertTitle(type) {
    switch(type) {
        case 'success': return 'Success!';
        case 'danger': return 'Error!';
        case 'warning': return 'Notice!';
        default: return 'Info';
    }
}

// ========== AUTH STATE HANDLERS ==========
function handleUserSignedIn(user) {
    console.log('User signed in:', user.email);
    
    // Save user data to localStorage for offline access
    localStorage.setItem('rakshak_user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
    }));
    
    // Update user profile in Firestore
    updateUserProfile(user);
}

function handleUserSignedOut() {
    console.log('User signed out');
    
    // Clear sensitive data from localStorage
    localStorage.removeItem('rakshak_user');
    localStorage.removeItem('rakshak_sos_events');
}

function handlePageRedirect(user) {
    const currentPage = window.location.pathname.split('/').pop();
    
    // If on login page and user is signed in, redirect to dashboard
    if (user && currentPage === 'login.html') {
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
    
    // If on dashboard and no user, redirect to login
    if (!user && currentPage === 'dashboard.html') {
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// ========== DEMO ACCOUNT (For Portfolio) ==========
function offerDemoAccount(email) {
    const useDemo = confirm(`No account found with "${email}".\n\nWould you like to use a demo account for testing?`);
    
    if (useDemo) {
        // Create demo user in localStorage
        const demoUser = {
            uid: 'demo-' + Date.now(),
            email: email,
            displayName: email.split('@')[0],
            isDemo: true,
            lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('rakshak_user', JSON.stringify(demoUser));
        
        showAuthAlert('Demo account created! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

// ========== REGISTRATION MODAL ==========
function showRegistrationModal() {
    const modalHTML = `
        <div class="modal-overlay" id="registerModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Create Account</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="registrationForm">
                        <div class="form-group">
                            <label for="regName">Full Name</label>
                            <input type="text" id="regName" class="form-input" placeholder="Enter your name" required>
                        </div>
                        <div class="form-group">
                            <label for="regEmail">Email Address</label>
                            <input type="email" id="regEmail" class="form-input" placeholder="Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label for="regPassword">Password</label>
                            <input type="password" id="regPassword" class="form-input" placeholder="Create a password" minlength="6" required>
                            <small>Minimum 6 characters</small>
                        </div>
                        <div class="form-group">
                            <label for="regConfirmPassword">Confirm Password</label>
                            <input type="password" id="regConfirmPassword" class="form-input" placeholder="Confirm password" required>
                        </div>
                        <div class="form-group">
                            <input type="checkbox" id="regTerms" required>
                            <label for="regTerms">I agree to the Terms & Conditions</label>
                        </div>
                        <button type="submit" class="btn btn-success btn-block">
                            <i class="fas fa-user-plus"></i> Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles if not already present
    addModalStyles();
    
    // Setup modal functionality
    const modal = document.getElementById('registerModal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = document.getElementById('registrationForm');
    
    // Close modal on X click
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRegistration();
    });
}

async function handleRegistration() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const terms = document.getElementById('regTerms').checked;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showAuthAlert('Please fill all fields', 'danger');
        return;
    }
    
    if (!validateEmail(email)) {
        showAuthAlert('Please enter a valid email', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showAuthAlert('Password must be at least 6 characters', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthAlert('Passwords do not match', 'danger');
        return;
    }
    
    if (!terms) {
        showAuthAlert('Please accept the terms and conditions', 'danger');
        return;
    }
    
    try {
        // Show loading
        showAuthAlert('Creating account...', 'info');
        
        // Create user with Firebase
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile with name
        await user.updateProfile({
            displayName: name
        });
        
        // Save additional user data to Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            name: name,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true
        });
        
        // Show success
        showAuthAlert('Account created successfully! Logging you in...', 'success');
        
        // Close modal
        const modal = document.getElementById('registerModal');
        if (modal) modal.remove();
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    } catch (error) {
        console.error('Registration error:', error);
        
        let errorMessage = 'Registration failed. Please try again.';
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled.';
                break;
        }
        
        showAuthAlert(errorMessage, 'danger');
    }
}

function addModalStyles() {
    if (document.querySelector('#modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #2c3e50;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #7f8c8d;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .btn-block {
            width: 100%;
            margin-top: 1rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
}

// ========== INITIALIZE ON LOAD ==========
// Call updateAuthUI initially
updateAuthUI();