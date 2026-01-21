// Location and Maps functionality
document.addEventListener('DOMContentLoaded', function() {
    // This file would typically contain more advanced location features
    // For now, it's integrated with sos.js
    
    console.log('Location module loaded');
    
    // Function to get continuous location updates
    function watchLocation() {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    console.log('Location update:', position.coords);
                    // In a real app, you would send periodic updates to a backend
                },
                (error) => {
                    console.error('Error watching location:', error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 5000
                }
            );
            
            return watchId;
        }
        return null;
    }
    
    // Function to calculate distance between two coordinates
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance; // Distance in km
    }
    
    // Function to find nearest safe locations (mock data for demo)
    function findNearestSafeLocations(userLat, userLng) {
        // Mock safe locations
        const safeLocations = [
            { name: "Police Station", lat: 28.6140, lng: 77.2080, type: "police", distance: null },
            { name: "Hospital", lat: 28.6150, lng: 77.2100, type: "hospital", distance: null },
            { name: "Shopping Mall", lat: 28.6130, lng: 77.2070, type: "public", distance: null },
            { name: "Women's Shelter", lat: 28.6160, lng: 77.2095, type: "shelter", distance: null }
        ];
        
        // Calculate distances
        safeLocations.forEach(location => {
            location.distance = calculateDistance(userLat, userLng, location.lat, location.lng);
        });
        
        // Sort by distance
        safeLocations.sort((a, b) => a.distance - b.distance);
        
        return safeLocations;
    }
    
    // Make functions available globally for other scripts
    window.locationUtils = {
        watchLocation,
        calculateDistance,
        findNearestSafeLocations
    };
});