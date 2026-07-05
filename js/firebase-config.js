// Firebase Configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Your Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCpPP-1g0y9j8AMhnK4CZ0_982BojFqrnE",
  authDomain: "cyruslinkshub0.firebaseapp.com",
  projectId: "cyruslinkshub0",
  storageBucket: "cyruslinkshub0.firebasestorage.app",
  messagingSenderId: "70455757879",
  appId: "1:70455757879:web:287137f5ab576d901d03b2",
  measurementId: "G-98NWRYX8B6"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Authentication

const auth = getAuth(app);

// Keep users signed in

await setPersistence(auth, browserLocalPersistence);

// Export Authentication

export { auth };
