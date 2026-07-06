// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your verified CyrusLinksHub Web App Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpPP-1g0y9j8AMhnK4CZ0_982BojFqrnE",
  authDomain: "cyruslinkshub0.firebaseapp.com",
  projectId: "cyruslinkshub0",
  storageBucket: "cyruslinkshub0.firebasestorage.app",
  messagingSenderId: "70455757879",
  appId: "1:70455757879:web:287137f5ab576d901d03b2",
  measurementId: "G-98NWRYX8B6"
};

// Initialize Firebase Core Systems
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Bind modules to the global window scope for your HTML forms to intercept
window.auth = auth;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.sendPasswordResetEmail = sendPasswordResetEmail;

console.log("🔒 CyrusLinksHub Global Security Vector: Firebase Operations Online.");
