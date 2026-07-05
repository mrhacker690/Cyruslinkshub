import { auth, googleProvider, githubProvider } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// =========================
// 🔐 AUTO LOGIN CHECK
// =========================
onAuthStateChanged(auth, (user) => {

    if (user) {
        window.location.href = "/dashboard";
    }

});


// =========================
// 📧 EMAIL LOGIN
// =========================
window.handleLogin = async function (e) {

    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const password = document.getElementById("loginPasswordInput").value;

    try {

        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/dashboard";

    } catch (error) {

        alert("Login Failed: " + error.message);

    }
};


// =========================
// 🌐 GOOGLE LOGIN
// =========================
document.querySelector(".google-provider").addEventListener("click", async () => {

    try {

        await signInWithPopup(auth, googleProvider);
        window.location.href = "/dashboard";

    } catch (error) {

        alert("Google Login Failed: " + error.message);

    }

});


// =========================
// 🐙 GITHUB LOGIN
// =========================
document.querySelector(".github-provider").addEventListener("click", async () => {

    try {

        await signInWithPopup(auth, githubProvider);
        window.location.href = "/dashboard";

    } catch (error) {

        alert("GitHub Login Failed: " + error.message);

    }

});
