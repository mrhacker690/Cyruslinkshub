// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
