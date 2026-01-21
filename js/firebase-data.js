// Extended Firebase Data Operations
class ExtendedFirebaseData {
    constructor() {
        this.db = firebase.firestore();
    }
    
    // ========== ALL PUBLIC DATA ==========
    async getAllPublicData() {
        try {
            const [tips, emergencyContacts, ambulance, cyberCrime, domesticViolence] = await Promise.all([
                this.db.collection('safety_tips').get(),
                this.db.collection('emergency_contacts').get(),
                this.db.collection('ambulance').get(),
                this.db.collection('cyber_crime').get(),
                this.db.collection('domestic_violence').get()
            ]);
            
            return {
                safety_tips: this.formatSnapshot(tips),
                emergency_contacts: this.formatSnapshot(emergencyContacts),
                ambulance: this.formatSnapshot(ambulance),
                cyber_crime: this.formatSnapshot(cyberCrime),
                domestic_violence: this.formatSnapshot(domesticViolence)
            };
        } catch (error) {
            console.error('Error fetching public data:', error);
            return null;
        }
    }
    
    // ========== SPECIFIC COLLECTIONS ==========
    async getAmbulanceContacts() {
        return this.getCollectionData('ambulance');
    }
    
    async getCyberCrimeResources() {
        return this.getCollectionData('cyber_crime');
    }
    
    async getDomesticViolenceResources() {
        return this.getCollectionData('domestic_violence');
    }
    
    // ========== USER SOS EVENTS ==========
    async saveSOSEvent(eventType, locationData, additionalInfo = {}) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const eventData = {
                type: eventType,
                location: locationData,
                userId: user.uid,
                userEmail: user.email,
                timestamp: new Date().toISOString(),
                status: 'activated',
                ...additionalInfo
            };
            
            const docRef = await this.db.collection('sos_events').add(eventData);
            console.log('SOS Event saved with ID:', docRef.id);
            
            // Also update user's lastSOS timestamp
            await this.updateUserLastSOS(user.uid);
            
            return docRef.id;
        } catch (error) {
            console.error('Error saving SOS event:', error);
            throw error;
        }
    }
    
    async getUserSOSEvents(limit = 20) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return [];
            
            const snapshot = await this.db.collection('sos_events')
                .where('userId', '==', user.uid)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            return this.formatSnapshot(snapshot);
        } catch (error) {
            console.error('Error fetching SOS events:', error);
            return [];
        }
    }
    
    // ========== USER PROFILE MANAGEMENT ==========
    async createOrUpdateUserProfile(profileData) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const profile = {
                ...profileData,
                email: user.email,
                lastUpdated: new Date().toISOString(),
                isActive: true
            };
            
            await this.db.collection('profiles').doc(user.uid).set(profile, { merge: true });
            console.log('User profile updated');
            
            return true;
        } catch (error) {
            console.error('Error updating user profile:', error);
            return false;
        }
    }
    
    async getUserProfile() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return null;
            
            const doc = await this.db.collection('profiles').doc(user.uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }
    
    // ========== EMERGENCY CONTACTS MANAGEMENT ==========
    async saveEmergencyContact(contactData) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('User not authenticated');
            
            const contact = {
                ...contactData,
                userId: user.uid,
                createdAt: new Date().toISOString()
            };
            
            const docRef = await this.db.collection('user_contacts').add(contact);
            return docRef.id;
        } catch (error) {
            console.error('Error saving emergency contact:', error);
            throw error;
        }
    }
    
    async getUserEmergencyContacts() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return [];
            
            const snapshot = await this.db.collection('user_contacts')
                .where('userId', '==', user.uid)
                .orderBy('createdAt', 'desc')
                .get();
            
            return this.formatSnapshot(snapshot);
        } catch (error) {
            console.error('Error fetching user contacts:', error);
            return [];
        }
    }
    
    // ========== HELPER METHODS ==========
    async getCollectionData(collectionName, whereClause = null) {
        try {
            let query = this.db.collection(collectionName);
            
            if (whereClause) {
                query = query.where(whereClause.field, whereClause.operator, whereClause.value);
            }
            
            const snapshot = await query.get();
            return this.formatSnapshot(snapshot);
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
            return [];
        }
    }
    
    formatSnapshot(snapshot) {
        const data = [];
        snapshot.forEach(doc => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return data;
    }
    
    async updateUserLastSOS(userId) {
        try {
            await this.db.collection('users').doc(userId).set({
                lastSOS: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error('Error updating user lastSOS:', error);
        }
    }
    
    // ========== REAL-TIME LISTENERS ==========
    setupSOSListener(callback) {
        const user = firebase.auth().currentUser;
        if (!user) return () => {};
        
        return this.db.collection('sos_events')
            .where('userId', '==', user.uid)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .onSnapshot(snapshot => {
                callback(this.formatSnapshot(snapshot));
            }, error => {
                console.error('SOS listener error:', error);
            });
    }
}

// Create global instance
window.firebaseExtended = new ExtendedFirebaseData();