import { auth, googleProvider, githubProvider } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// ================================
// 🔐 AUTO REDIRECT IF LOGGED IN
// ================================
onAuthStateChanged(auth, (user) => {

    const loader = document.getElementById("authLoader");

    if (user) {
        window.location.href = "/dashboard";
    } else {
        if (loader) loader.style.display = "none";
    }

});


// ================================
// 📧 EMAIL LOGIN
// ================================
document.getElementById("loginBtn").addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {

        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/dashboard";

    } catch (error) {

        alert("Login Failed: " + error.message);

    }

});


// ================================
// 🌐 GOOGLE LOGIN
// ================================
document.getElementById("googleLogin").addEventListener("click", async () => {

    try {

        await signInWithPopup(auth, googleProvider);
        window.location.href = "/dashboard";

    } catch (error) {

        alert("Google Login Failed: " + error.message);

    }

});


// ================================
// 🐙 GITHUB LOGIN
// ================================
document.getElementById("githubLogin").addEventListener("click", async () => {

    try {

        await signInWithPopup(auth, githubProvider);
        window.location.href = "/dashboard";

    } catch (error) {

        alert("GitHub Login Failed: " + error.message);

    }

});


// ================================
// 🔑 FORGOT PASSWORD
// ================================
document.getElementById("forgotPassword").addEventListener("click", async () => {

    const email = document.getElementById("email").value;

    if (!email) {
        alert("Enter your email first");
        return;
    }

    try {

        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent!");

    } catch (error) {

        alert("Error: " + error.message);

    }

});


// ================================
// ⚡ DEBUG (optional)
// ================================
console.log("Login system loaded successfully 🚀");
