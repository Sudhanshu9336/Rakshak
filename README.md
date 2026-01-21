# 🛡️ Rakshak - Women Safety Companion

Rakshak is a comprehensive web application designed to enhance women's safety by providing tools and resources for before, during, and after safety incidents. Unlike traditional SOS apps, Rakshak focuses on prevention, response, and recovery.

## 🎯 Unique Selling Proposition

**"Rakshak is different because it focuses on safety before, during, and after an incident, not just emergency response."**

## ✨ Features

### 🟢 Pre-Journey Safety Check
- **Time-based analysis** (Day/Evening/Night)
- **Location assessment** (Known/Unknown area)
- **Personalized safety checklist**
- **Risk level assessment**

### 🔴 Silent SOS Mode
- **Discreet emergency alerts** without sound
- **Automatic location copying** to clipboard
- **No visible alerts** that could escalate danger
- **Emergency number highlighting**

### 🟠 After-Incident Help
- **Step-by-step checklist** for immediate action
- **Emergency helpline directory**
- **Incident report template**
- **Support organization contacts**

## 🗂️ Project Structure
rakshak-web/
├── index.html → Home page with overview
├── login.html → User authentication
├── dashboard.html → User dashboard with activity
├── sos.html → Emergency SOS + Silent SOS
├── awareness.html → Pre-Journey safety + Tips
├── resources.html → Helplines + After-Incident help
│
├── css/
│ └── style.css → All styling (green/red theme)
│
├── js/
│ ├── auth.js → Login logic
│ ├── sos.js → SOS + Silent SOS logic
│ ├── location.js → Location & Maps logic
│ └── helpers.js → Helper functions
│
├── images/ → Image assets
└── README.md → This file


## 🚀 How to Use

1. **Pre-Journey Planning**: Visit `awareness.html` before traveling
2. **Emergency Response**: Use `sos.html` for SOS or Silent SOS
3. **After Incident**: Go to `resources.html` for step-by-step guidance
4. **Dashboard**: Check `dashboard.html` for your safety history

## 🎨 Design Philosophy

- **Green** for safety, prevention, and positive actions
- **Red** for emergencies, alerts, and warnings
- **Clean, intuitive interface** for stress-free use during emergencies
- **Mobile-responsive** design for accessibility anywhere

## 🔧 Technical Implementation

- Pure HTML, CSS, and JavaScript (No frameworks)
- LocalStorage for user data persistence
- Geolocation API for location services
- Responsive design with Flexbox and Grid
- Font Awesome icons for visual cues

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktop computers (1024px and up)

## 🔐 Privacy & Security

- All data stored locally in browser
- No backend server required
- Location data never leaves device without explicit permission
- Transparent about what data is accessed

## 🚨 Emergency Features

1. **Emergency SOS**: Loud alarm + location sharing
2. **Silent SOS**: Discreet location copying
3. **One-tap calling** to emergency numbers
4. **Location sharing** with trusted contacts

## 🏆 Why This Project Stands Out

1. **Holistic Approach**: Covers prevention, response, and recovery
2. **Psychological Understanding**: Silent SOS for situations where alerting attacker is dangerous
3. **Practical Implementation**: Works without internet/backend
4. **Interview Ready**: Clear, explainable architecture

## 📄 License

© 2026 Rakshak. Created by Sudhanshu Gupta. All rights reserved.

## 👨‍💻 Developer

**Sudhanshu Gupta**  
[Your Portfolio/LinkedIn/GitHub links here]

---

*For demonstration purposes only. In a real-world scenario, this would connect to emergency services and have proper backend infrastructure.*



RAKSHAK - IMPORTANT PRECAUTIONS & DISCLAIMERS

================================================================================
CRITICAL IMPORTANCE
================================================================================

⚠️  DISCLAIMER: This is a DEMONSTRATION PROJECT only
   - Not connected to real emergency services
   - Not a replacement for professional safety measures
   - For educational and portfolio purposes only

⚠️  REAL EMERGENCY: Dial 100 (Police), 102 (Ambulance), 1091 (Women Helpline)

================================================================================
PROJECT LIMITATIONS
================================================================================

1. NO REAL-TIME MONITORING
   - Location sharing is simulated
   - No actual messages are sent to contacts
   - Emergency services are not alerted

2. NO BACKEND INTEGRATION
   - All data stored locally in browser
   - No user accounts or cloud storage
   - Data lost if browser cache cleared

3. NO GUARANTEES
   - App may fail in low-network areas
   - Location accuracy depends on device
   - Browser permissions required

================================================================================
SAFETY PRECAUTIONS FOR USERS
================================================================================

1. ALWAYS HAVE BACKUP
   - Memorize important phone numbers
   - Carry a physical safety device
   - Know your local emergency procedures

2. TEST IN SAFE ENVIRONMENT
   - Understand app limitations
   - Practice using features when safe
   - Don't rely solely on technology

3. REAL-WORLD SAFETY MEASURES
   - Share travel plans with trusted people
   - Stay in well-lit, populated areas
   - Trust your instincts - if uncomfortable, leave

================================================================================
DEVELOPER NOTES
================================================================================

1. FOR INTERVIEW EXPLANATION
   - This demonstrates UI/UX and frontend skills
   - Backend would be added in production
   - Focus on unique features: Pre/During/Post incident

2. TECHNICAL LIMITATIONS
   - Browser geolocation accuracy varies
   - LocalStorage has size limits
   - No offline functionality beyond cached pages

3. IMPROVEMENTS FOR PRODUCTION
   - Add Firebase/backend for real alerts
   - Implement push notifications
   - Add offline capability with Service Workers
   - Encrypt sensitive data

================================================================================
ETHICAL USE
================================================================================

1. DO NOT MISREPRESENT
   - Clearly state this is a demo
   - Don't claim it connects to real services
   - Explain limitations to users

2. RESPONSIBLE DEVELOPMENT
   - Privacy-first design
   - Clear user consent for location
   - Transparent data usage

3. LEGAL COMPLIANCE
   - Follow local regulations
   - Respect user privacy laws
   - Include proper disclaimers

================================================================================
FIREBASE INTEGRATION GUIDE
================================================================================

To convert this to a real app:

1. Create Firebase project at console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Add Firebase config to auth.js:

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

5. Update SOS functions to write to Firestore
6. Implement Cloud Functions for notifications
7. Add Security Rules for data protection

================================================================================
GITHUB DEPLOYMENT TIPS
================================================================================

1. Create repository on GitHub
2. Ensure all files are in root (not in subfolder)
3. Push code to GitHub
4. Enable GitHub Pages in repository settings
5. Set source to "main branch" or "master branch"
6. Your site will be at: username.github.io/repository-name

================================================================================
FINAL REMINDER
================================================================================

This project demonstrates:
✅ Unique safety approach (Before/During/After)
✅ Clean, professional UI/UX
✅ Practical JavaScript implementation
✅ Interview-ready explanation

NOT a production-ready safety app.
Always prioritize real-world safety measures over digital tools.

© 2023 Rakshak - Created by Sudhanshu Gupta
For portfolio and demonstration purposes only.
