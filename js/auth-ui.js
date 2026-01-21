// Authentication UI Updates
function updateAuthUI() {
    updateNavbarAuthUI();
    updateDashboardAuthUI();
    updateLoginPageUI();
    checkAndProtectRoutes();
}

// Update navbar based on auth state
function updateNavbarAuthUI() {
    const user = auth.currentUser;
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navMenu) return;
    
    // Find login/logout buttons
    const loginBtn = navMenu.querySelector('.login-btn');
    const logoutBtn = navMenu.querySelector('.logout-btn');
    
    if (user) {
        // User is logged in
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.email.split('@')[0]}`;
            loginBtn.href = 'dashboard.html';
            loginBtn.classList.remove('login-btn');
            loginBtn.classList.add('user-btn');
        }
        
        // Add logout button if not present
        if (!logoutBtn) {
            const logoutItem = document.createElement('li');
            logoutItem.innerHTML = `
                <a href="#" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
            navMenu.appendChild(logoutItem);
            
            // Add logout event listener
            logoutItem.querySelector('.logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                handleLogout();
            });
        }
    } else {
        // User is logged out
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            loginBtn.href = 'login.html';
            loginBtn.classList.add('login-btn');
            loginBtn.classList.remove('user-btn');
        }
        
        // Remove logout button if present
        if (logoutBtn) {
            logoutBtn.parentElement.remove();
        }
    }
}

// Update dashboard UI
function updateDashboardAuthUI() {
    const user = auth.currentUser;
    const localUser = JSON.parse(localStorage.getItem('rakshak_user') || '{}');
    
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    
    if (userAvatar) {
        const displayName = user ? user.displayName || user.email.split('@')[0] : localUser.displayName;
        userAvatar.textContent = displayName.charAt(0).toUpperCase();
    }
    
    if (userName) {
        userName.textContent = user ? user.displayName || user.email.split('@')[0] : localUser.displayName;
    }
    
    if (userEmail) {
        userEmail.textContent = user ? user.email : localUser.email;
    }
}

// Update login page UI
function updateLoginPageUI() {
    const user = auth.currentUser;
    
    // If user is already logged in and on login page, show message
    if (user && window.location.pathname.includes('login.html')) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.innerHTML = `
                <div class="already-logged-in">
                    <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Already Logged In</h3>
                    <p>You are already logged in as <strong>${user.email}</strong></p>
                    <div class="action-buttons">
                        <a href="dashboard.html" class="btn btn-success">
                            <i class="fas fa-tachometer-alt"></i> Go to Dashboard
                        </a>
                        <button id="logoutHere" class="btn btn-danger">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `;
            
            // Add logout functionality
            document.getElementById('logoutHere').addEventListener('click', () => {
                handleLogout();
            });
        }
    }
}

// Handle logout
async function handleLogout() {
    try {
        await auth.signOut();
        localStorage.removeItem('rakshak_user');
        showAuthAlert('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        showAuthAlert('Logout failed', 'danger');
    }
}

// Protect routes that require authentication
function checkAndProtectRoutes() {
    const user = auth.currentUser;
    const localUser = JSON.parse(localStorage.getItem('rakshak_user') || '{}');
    
    const protectedRoutes = ['dashboard.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    // If trying to access protected route without auth
    if (protectedRoutes.includes(currentPage) && !user && !localUser.email) {
        showAuthAlert('Please login to access this page', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    return true;
}

// Show auth status indicator
function showAuthStatus() {
    const user = auth.currentUser;
    
    // Remove existing status if any
    const existingStatus = document.getElementById('auth-status-indicator');
    if (existingStatus) existingStatus.remove();
    
    // Create status indicator
    const status = document.createElement('div');
    status.id = 'auth-status-indicator';
    status.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        z-index: 9999;
        background: ${user ? '#2ecc71' : '#e74c3c'};
        color: white;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    
    status.innerHTML = `
        <i class="fas fa-${user ? 'user-check' : 'user-times'}"></i>
        <span>${user ? 'Logged in' : 'Logged out'}</span>
    `;
    
    document.body.appendChild(status);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        status.style.opacity = '0.5';
    }, 5000);
}

// Initialize auth UI when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Listen for auth state changes
    auth.onAuthStateChanged(() => {
        updateAuthUI();
        showAuthStatus();
    });
    
    // Initial update
    updateAuthUI();
    showAuthStatus();
});