import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    GoogleAuthProvider,
    GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "cyruslinkshub0.firebaseapp.com",
    projectId: "cyruslinkshub0",
    storageBucket: "cyruslinkshub0.appspot.com",
    messagingSenderId: "70455757879",
    appId: "1:70455757879:web:287137f5ab576d901d03b2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔥 FIX: Persistent login (MOST IMPORTANT)
setPersistence(auth, browserLocalPersistence);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
