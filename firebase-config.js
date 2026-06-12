// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4rIxR3Kba6wSEoxDBi1BmmRDbQmMsfME",
    authDomain: "sendyquiz.firebaseapp.com",
    databaseURL: "https://gabutan-alfread-default-rtdb.firebaseio.com",
    projectId: "sendyquiz",
    storageBucket: "sendyquiz.firebasestorage.app",
  messagingSenderId: "578193115625",
  appId: "1:578193115625:web:18abfd77cbf67c9a75a378",
  measurementId: "G-ELW2TEPL4B"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Game Configuration
const GAME_CONFIG = {
    QUESTION_TIME: 10,
    TOTAL_QUESTIONS: 5,
    MAX_PLAYERS: 8,
    POINTS_CORRECT: 100,
    POINTS_FAST_BONUS: 50,
    MAX_ROOM_AGE: 24 * 60 * 60 * 1000 // 24 hours
};

// Admin Credentials
const ADMIN_CREDENTIALS = {
    'admin': 'admin123',
    'developer': 'dev123'
};

// Default Categories
const DEFAULT_CATEGORIES = [
    { id: 'umum', name: 'Umum', icon: 'fa-globe', questionCount: 0 },
    { id: 'sains', name: 'Sains', icon: 'fa-flask', questionCount: 0 },
    { id: 'sejarah', name: 'Sejarah', icon: 'fa-landmark', questionCount: 0 },
    { id: 'olahraga', name: 'Olahraga', icon: 'fa-futbol', questionCount: 0 },
    { id: 'hiburan', name: 'Hiburan', icon: 'fa-film', questionCount: 0 },
    { id: 'teknologi', name: 'Teknologi', icon: 'fa-laptop-code', questionCount: 0 }
];
// Auto-clean old rooms
function setupRoomAutoCleanup() {
    setInterval(async () => {
        try {
            const roomsRef = database.ref('rooms');
            const snapshot = await roomsRef.once('value');
            
            if (!snapshot.exists()) return;
            
            const rooms = snapshot.val();
            const now = Date.now();
            
            for (const roomCode in rooms) {
                const room = rooms[roomCode];
                const roomAge = now - (room.createdAt || 0);
                
                // Delete rooms older than 24 hours
                if (roomAge > GAME_CONFIG.MAX_ROOM_AGE) {
                    await roomsRef.child(roomCode).remove();
                    console.log(`Deleted old room: ${roomCode}`);
                }
            }
        } catch (error) {
            console.error('Error cleaning up rooms:', error);
        }
    }, 60 * 60 * 1000); // Run every hour
}

// Panggil di init
setupRoomAutoCleanup(); 


// Export for use in other files
window.firebaseConfig = {
    app,
    database,
    GAME_CONFIG,
    ADMIN_CREDENTIALS,
    DEFAULT_CATEGORIES
};

