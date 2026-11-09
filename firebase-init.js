// FIREBASE SDK
import { initializeApp } from
"https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import { 
    getDatabase,
    ref,
    set,
    onValue, 
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuGgjcLE66ie5T1fqn_0dQ1RwaTpZ3UhI",
  authDomain: "heuristic-game-4a3a4.firebaseapp.com",
  databaseURL: "https://heuristic-game-4a3a4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "heuristic-game-4a3a4",
  storageBucket: "heuristic-game-4a3a4.firebasestorage.app",
  messagingSenderId: "82244625575",
  appId: "1:82244625575:web:4cd8493243663aa8ade782",
  measurementId: "G-B7XZ626PHE"
};


// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// EXPOSE FIREBASE SERVICES
window.firebaseServices = {
    app,
    auth,
    db,
    ref,
    set,
    onValue
};

// AUTHENTICATION INITIALIZATION
window.firebaseReady = new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
            unsubscribe();

            try {
                if (!user) {
                    const credential = await signInAnonymously(auth);
                    user = credential.user;
                }

                console.log("Firebase Authentication Ready!");
                console.log("User UID:", user.uid);

                resolve(user);

            } catch (error) {
                console.error("Firebase Auth Error:", error);
                reject(error);
            }
        },
        reject
    );
});

console.log("Heuristic Firebase Initialized!");