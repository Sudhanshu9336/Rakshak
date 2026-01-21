// Helper functions for various features
document.addEventListener('DOMContentLoaded', function() {
    console.log('Helpers module loaded');
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize form validation
    initFormValidation();
    
    // Load user preferences if available
    loadUserPreferences();
    
    // Function to show notification
    function showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add styles for animation
        const style = document.createElement('style');
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
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <i class="fas fa-${getIconForType(type)}" style="margin-top: 2px;"></i>
                <div style="flex: 1;">
                    <strong>${getTitleForType(type)}</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em;">${message}</p>
                </div>
                <button class="close-notification" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2em;">
                    &times;
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add close button functionality
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        return notification;
    }
    
    function getIconForType(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'danger': return 'exclamation-triangle';
            case 'warning': return 'exclamation-circle';
            default: return 'info-circle';
        }
    }
    
    function getTitleForType(type) {
        switch(type) {
            case 'success': return 'Success!';
            case 'danger': return 'Important!';
            case 'warning': return 'Notice!';
            default: return 'Information';
        }
    }
    
    // Function to format date
    function formatDate(date, includeTime = true) {
        const d = new Date(date);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        
        let formatted = d.toLocaleDateString('en-US', options);
        
        if (includeTime) {
            const timeOptions = { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            };
            formatted += ' at ' + d.toLocaleTimeString('en-US', timeOptions);
        }
        
        return formatted;
    }
    
    // Function to save user preference
    function savePreference(key, value) {
        const preferences = JSON.parse(localStorage.getItem('rakshak_preferences') || '{}');
        preferences[key] = value;
        localStorage.setItem('rakshak_preferences', JSON.stringify(preferences));
    }
    
    // Function to get user preference
    function getPreference(key, defaultValue = null) {
        const preferences = JSON.parse(localStorage.getItem('rakshak_preferences') || '{}');
        return preferences[key] || defaultValue;
    }
    
    // Initialize tooltips
    function initTooltips() {
        // Add tooltip functionality to elements with data-tooltip attribute
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                tooltip.style.cssText = `
                    position: absolute;
                    background: #2c3e50;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    z-index: 1000;
                    white-space: nowrap;
                    pointer-events: none;
                    transform: translateY(-100%);
                    margin-top: -5px;
                `;
                
                document.body.appendChild(tooltip);
                
                // Position tooltip
                const rect = this.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = (rect.top - 5) + 'px';
                
                // Store reference to remove later
                this._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.remove();
                    this._tooltip = null;
                }
            });
        });
    }
    
    // Initialize form validation
    function initFormValidation() {
        // Add validation to forms with class 'needs-validation'
        document.querySelectorAll('form.needs-validation').forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!this.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                this.classList.add('was-validated');
            });
        });
    }
    
    // Load user preferences
    function loadUserPreferences() {
        // Example: Set theme if saved
        const theme = getPreference('theme', 'light');
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Example: Load saved emergency contacts
        const contacts = JSON.parse(localStorage.getItem('rakshak_emergency_contacts') || '[]');
        if (contacts.length > 0) {
            console.log('Loaded emergency contacts:', contacts);
        }
    }
    
    // Function to share location with contact
    function shareLocationWithContact(contactName, contactNumber) {
        if (!navigator.geolocation) {
            showNotification('Geolocation is not supported by your browser', 'danger');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: new Date().toISOString()
                };
                
                // In a real app, you would send this via SMS or API
                const message = `I'm sharing my location with you via Rakshak: ${JSON.stringify(location)}`;
                
                // For demo, show what would happen
                showNotification(`Location shared with ${contactName} (${contactNumber})`, 'success');
                console.log('Location shared:', { contactName, contactNumber, location });
                
                // Save to history
                const shareHistory = JSON.parse(localStorage.getItem('rakshak_share_history') || '[]');
                shareHistory.push({
                    contactName,
                    contactNumber,
                    location,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('rakshak_share_history', JSON.stringify(shareHistory));
            },
            (error) => {
                showNotification('Failed to get location: ' + error.message, 'danger');
            }
        );
    }
    
    // Function to generate safety report
    function generateSafetyReport() {
        const sosEvents = JSON.parse(localStorage.getItem('rakshak_sos_events') || '[]');
        const shareHistory = JSON.parse(localStorage.getItem('rakshak_share_history') || '[]');
        const preferences = JSON.parse(localStorage.getItem('rakshak_preferences') || '{}');
        
        const report = {
            generatedAt: new Date().toISOString(),
            sosEvents: sosEvents.length,
            lastSOSEvent: sosEvents[sosEvents.length - 1] || null,
            locationShares: shareHistory.length,
            preferences: preferences,
            safetyScore: calculateSafetyScore(sosEvents, shareHistory)
        };
        
        return report;
    }
    
    function calculateSafetyScore(sosEvents, shareHistory) {
        // Simple scoring algorithm for demo
        let score = 100;
        
        // Deduct for SOS events (more recent = more deduction)
        sosEvents.forEach(event => {
            const daysAgo = (new Date() - new Date(event.timestamp)) / (1000 * 60 * 60 * 24);
            if (daysAgo < 7) score -= 10; // Recent SOS
            else if (daysAgo < 30) score -= 5; // Within month
        });
        
        // Add for regular location sharing
        const recentShares = shareHistory.filter(share => {
            const daysAgo = (new Date() - new Date(share.timestamp)) / (1000 * 60 * 60 * 24);
            return daysAgo < 7;
        }).length;
        
        score += Math.min(recentShares * 2, 10); // Max 10 points for sharing
        
        return Math.max(0, Math.min(100, score));
    }
    
    // Make functions available globally
    window.helpers = {
        showNotification,
        formatDate,
        savePreference,
        getPreference,
        shareLocationWithContact,
        generateSafetyReport
    };
    
    // Add a global function for the Pre-Journey Safety Check
    window.generateSafetyChecklist = function(time, area) {
        // This function is called from awareness.html
        return window.generateSafetyChecklist ? window.generateSafetyChecklist(time, area) : "Checklist generation not available";
    };
});