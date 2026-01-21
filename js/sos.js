// SOS and Silent SOS functionality
document.addEventListener('DOMContentLoaded', function() {
    const emergencySOS = document.getElementById('emergencySOS');
    const silentSOS = document.getElementById('silentSOS');
    const copyLocationBtn = document.getElementById('copyLocation');
    const locationText = document.getElementById('locationText');
    const locationDisplay = document.getElementById('locationDisplay');
    
    let userLocation = null;
    
    // Get user location on page load
    getLocation();
    
    if (emergencySOS) {
        emergencySOS.addEventListener('click', function() {
            triggerEmergencySOS();
        });
    }
    
    if (silentSOS) {
        silentSOS.addEventListener('click', function() {
            triggerSilentSOS();
        });
    }
    
    if (copyLocationBtn) {
        copyLocationBtn.addEventListener('click', function() {
            copyLocationToClipboard();
        });
    }
    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    userLocation = {
                        latitude: lat,
                        longitude: lng,
                        timestamp: new Date().toISOString()
                    };
                    
                    // For demo, we'll use a fixed location if reverse geocoding fails
                    locationText.textContent = `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
                    locationDisplay.style.display = 'flex';
                    
                    // Try to get address from coordinates (mock for demo)
                    getAddressFromCoordinates(lat, lng);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Use mock location for demo
                    userLocation = {
                        latitude: 28.6139,
                        longitude: 77.2090,
                        address: "New Delhi, India",
                        timestamp: new Date().toISOString()
                    };
                    
                    locationText.textContent = "New Delhi, India (Demo Location)";
                    locationDisplay.style.display = 'flex';
                }
            );
        } else {
            console.error('Geolocation not supported');
            // Use mock location for demo
            userLocation = {
                latitude: 28.6139,
                longitude: 77.2090,
                address: "New Delhi, India",
                timestamp: new Date().toISOString()
            };
            
            locationText.textContent = "New Delhi, India (Demo Location)";
            locationDisplay.style.display = 'flex';
        }
    }
    
    function getAddressFromCoordinates(lat, lng) {
        // In a real app, you would use a reverse geocoding API
        // For demo, we'll simulate with a timeout
        setTimeout(() => {
            locationText.textContent = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)} (Demo Address: New Delhi, India)`;
        }, 500);
    }
    
    function triggerEmergencySOS() {
        if (!userLocation) {
            alert('Getting your location... Please try again in a moment.');
            return;
        }
        
        // Show confirmation
        const confirmed = confirm('EMERGENCY SOS\n\nThis will trigger a loud alarm and share your location with emergency contacts. Are you sure?');
        
        if (!confirmed) return;
        
        // Create alarm sound
        playAlarmSound();
        
        // Show visual alert
        document.body.style.backgroundColor = '#e74c3c';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
        }, 500);
        
        // Show alert message
        alert('🚨 EMERGENCY SOS ACTIVATED!\n\nYour location has been shared with emergency contacts.\nEmergency numbers have been highlighted.\n\nPress OK to continue.');
        
        // Highlight emergency numbers
        highlightEmergencyNumbers();
        
        // Log the SOS event
        console.log('Emergency SOS activated:', userLocation);
        
        // In a real app, you would send this to a backend
        // For demo, we'll store in localStorage
        const sosEvents = JSON.parse(localStorage.getItem('rakshak_sos_events') || '[]');
        sosEvents.push({
            type: 'emergency',
            location: userLocation,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('rakshak_sos_events', JSON.stringify(sosEvents));
    }
    
    function triggerSilentSOS() {
        if (!userLocation) {
            alert('Getting your location... Please try again in a moment.');
            return;
        }
        
        // Silent SOS - no confirmation, no sound
        const locationString = `I need help! My location is: ${JSON.stringify(userLocation)}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(locationString).then(() => {
            // Show discreet notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2c3e50;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                font-family: 'Poppins', sans-serif;
            `;
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check-circle" style="color: #2ecc71;"></i>
                    <div>
                        <strong>Silent SOS Activated</strong><br>
                        <small>Location copied to clipboard</small>
                    </div>
                </div>
            `;
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
            
            // Log the Silent SOS event
            console.log('Silent SOS activated:', userLocation);
            
            // In a real app, you would send this to a backend
            // For demo, we'll store in localStorage
            const sosEvents = JSON.parse(localStorage.getItem('rakshak_sos_events') || '[]');
            sosEvents.push({
                type: 'silent',
                location: userLocation,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('rakshak_sos_events', JSON.stringify(sosEvents));
            
        }).catch(err => {
            console.error('Failed to copy location:', err);
            alert('Silent SOS activated but could not copy location. Please note it down manually.');
        });
    }
    
    function copyLocationToClipboard() {
        if (!userLocation) return;
        
        const locationString = `My current location: ${JSON.stringify(userLocation)}`;
        
        navigator.clipboard.writeText(locationString).then(() => {
            alert('Location copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy location:', err);
            alert('Failed to copy location. Please try again.');
        });
    }
    
    function playAlarmSound() {
        // Create an audio context for the alarm sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) {
            console.log('Audio context not supported, using fallback');
            // Fallback: Just flash the screen
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    document.body.style.backgroundColor = i % 2 === 0 ? '#e74c3c' : '';
                }, i * 200);
            }
        }
    }
    
    function highlightEmergencyNumbers() {
        const emergencyNumbers = document.querySelectorAll('.emergency-number');
        emergencyNumbers.forEach((num, index) => {
            setTimeout(() => {
                num.style.transform = 'scale(1.1)';
                num.style.boxShadow = '0 0 20px rgba(231, 76, 60, 0.8)';
                num.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    num.style.transform = 'scale(1)';
                    num.style.boxShadow = '';
                }, 1000);
            }, index * 300);
        });
    }
});