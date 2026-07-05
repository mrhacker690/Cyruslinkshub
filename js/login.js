import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.style.color = "#00d4ff";
    loginMessage.textContent = "Signing in...";

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        loginMessage.style.color = "#00ff88";
        loginMessage.textContent = "Login successful! Redirecting...";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        let message = "Login failed.";

        switch (error.code) {

            case "auth/invalid-email":
                message = "Invalid email address.";
                break;

            case "auth/user-not-found":
                message = "No account found with this email.";
                break;

            case "auth/wrong-password":
                message = "Incorrect password.";
                break;

            case "auth/invalid-credential":
                message = "Incorrect email or password.";
                break;

            case "auth/too-many-requests":
                message = "Too many login attempts. Try again later.";
                break;

            default:
                message = error.message;
        }

        loginMessage.style.color = "#ff4d4d";
        loginMessage.textContent = message;

    }

});
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{

    if(user){

        window.location.href="dashboard.html";

    }

});
