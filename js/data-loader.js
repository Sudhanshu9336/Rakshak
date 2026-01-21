// Unified Data Loader for Rakshak
class DataLoader {
    constructor() {
        this.cache = {
            safety_tips: null,
            emergency_contacts: null,
            ambulance: null,
            cyber_crime: null,
            domestic_violence: null
        };
    }
    
    // Load all public data at once
    async loadAllPublicData() {
        try {
            const data = await firebaseExtended.getAllPublicData();
            
            if (data) {
                this.cache = { ...this.cache, ...data };
                
                // Update UI with loaded data
                this.updateSafetyTipsUI(data.safety_tips);
                this.updateEmergencyContactsUI(data.emergency_contacts);
                this.updateAmbulanceUI(data.ambulance);
                this.updateCyberCrimeUI(data.cyber_crime);
                this.updateDomesticViolenceUI(data.domestic_violence);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading public data:', error);
            this.loadFallbackData();
            return false;
        }
    }
    
    // Update Safety Tips in UI
    updateSafetyTipsUI(tips) {
        const container = document.getElementById('safetyTipsContainer');
        if (!container || !tips) return;
        
        let html = '<div class="section-title">Safety Tips</div>';
        html += '<div class="tips-grid">';
        
        tips.forEach(tip => {
            html += `
                <div class="tip-card">
                    <h4><i class="fas fa-lightbulb"></i> ${tip.title || 'Safety Tip'}</h4>
                    <p>${tip.description || 'Important safety information'}</p>
                    ${tip.category ? `<span class="badge">${tip.category}</span>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    // Update Emergency Contacts in UI
    updateEmergencyContactsUI(contacts) {
        const container = document.getElementById('emergencyContactsContainer');
        if (!container || !contacts) return;
        
        let html = '<div class="section-title">Emergency Contacts</div>';
        html += '<div class="contacts-grid">';
        
        contacts.forEach(contact => {
            html += `
                <div class="contact-card">
                    <div class="contact-icon">
                        <i class="fas fa-phone-alt"></i>
                    </div>
                    <div class="contact-info">
                        <h4>${contact.name || 'Emergency'}</h4>
                        <p class="contact-number">${contact.number || 'N/A'}</p>
                        <p class="contact-desc">${contact.description || 'Emergency contact'}</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    // Update Ambulance Contacts
    updateAmbulanceUI(ambulanceData) {
        const container = document.getElementById('ambulanceContainer');
        if (!container || !ambulanceData) return;
        
        let html = '<div class="section-title">Ambulance Services</div>';
        html += '<div class="ambulance-grid">';
        
        ambulanceData.forEach(item => {
            html += `
                <div class="service-card">
                    <i class="fas fa-ambulance"></i>
                    <h4>${item.name || 'Ambulance'}</h4>
                    <p class="service-number">${item.number || 'Call for help'}</p>
                    <p>${item.description || '24/7 ambulance service'}</p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    // Update Cyber Crime Resources
    updateCyberCrimeUI(cyberData) {
        const container = document.getElementById('cyberCrimeContainer');
        if (!container || !cyberData) return;
        
        let html = '<div class="section-title">Cyber Crime Help</div>';
        html += '<div class="cyber-grid">';
        
        cyberData.forEach(item => {
            html += `
                <div class="resource-card">
                    <i class="fas fa-shield-alt"></i>
                    <h4>${item.name || 'Cyber Help'}</h4>
                    <p class="resource-number">${item.number || 'Report cyber crime'}</p>
                    <p>${item.description || item.content || 'Cyber security resource'}</p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    // Update Domestic Violence Resources
    updateDomesticViolenceUI(dvData) {
        const container = document.getElementById('domesticViolenceContainer');
        if (!container || !dvData) return;
        
        let html = '<div class="section-title">Domestic Violence Support</div>';
        html += '<div class="dv-grid">';
        
        dvData.forEach(item => {
            html += `
                <div class="support-card">
                    <i class="fas fa-hands-helping"></i>
                    <h4>${item.name || 'Support'}</h4>
                    <p class="support-number">${item.number || 'Get help'}</p>
                    <p>${item.description || 'Domestic violence support'}</p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    // Fallback data if Firebase fails
    loadFallbackData() {
        const fallbackTips = [
            { title: "Stay Safe", description: "Always be aware of your surroundings", category: "general" }
        ];
        
        const fallbackContacts = [
            { name: "Police", number: "100", description: "Emergency police" }
        ];
        
        this.updateSafetyTipsUI(fallbackTips);
        this.updateEmergencyContactsUI(fallbackContacts);
    }
    
    // Initialize on page load
    init() {
        // Wait for Firebase to initialize
        setTimeout(() => {
            this.loadAllPublicData();
            
            // Set up real-time listeners if user is logged in
            if (firebase.auth().currentUser) {
                this.setupUserListeners();
            }
        }, 1000);
    }
    
    setupUserListeners() {
        // Listen for SOS events
        firebaseExtended.setupSOSListener((events) => {
            this.updateSOSHistoryUI(events);
        });
    }
    
    updateSOSHistoryUI(events) {
        const container = document.getElementById('sosHistoryContainer');
        if (!container) return;
        
        if (events.length === 0) {
            container.innerHTML = '<p>No SOS events yet</p>';
            return;
        }
        
        let html = '<div class="section-title">Recent SOS Events</div>';
        html += '<div class="sos-history">';
        
        events.forEach(event => {
            const time = new Date(event.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            html += `
                <div class="sos-event ${event.type}">
                    <i class="fas fa-${event.type === 'emergency' ? 'bell' : 'user-secret'}"></i>
                    <div>
                        <h5>${event.type === 'emergency' ? 'Emergency SOS' : 'Silent SOS'}</h5>
                        <p>${time} • ${event.location ? 'Location shared' : 'No location'}</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataLoader = new DataLoader();
    window.dataLoader.init();
});