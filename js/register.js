import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    registerMessage.style.color = "#00d4ff";
    registerMessage.textContent = "Creating account...";

    if (password !== confirmPassword) {

        registerMessage.style.color = "#ff4d4d";
        registerMessage.textContent = "Passwords do not match.";

        return;

    }

    if (password.length < 6) {

        registerMessage.style.color = "#ff4d4d";
        registerMessage.textContent = "Password must be at least 6 characters.";

        return;

    }

    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(userCredential.user, {
            displayName: username
        });

        await sendEmailVerification(userCredential.user);

        registerMessage.style.color = "#00ff88";

        registerMessage.innerHTML =
            "Account created successfully!<br>Please verify your email before logging in.";

        setTimeout(() => {

            window.location.href = "login.html";

        }, 3000);

    } catch (error) {

        let message = "Registration failed.";

        switch (error.code) {

            case "auth/email-already-in-use":
                message = "This email is already registered.";
                break;

            case "auth/invalid-email":
                message = "Invalid email address.";
                break;

            case "auth/weak-password":
                message = "Password is too weak.";
                break;

            default:
                message = error.message;

        }

        registerMessage.style.color = "#ff4d4d";
        registerMessage.textContent = message;

    }

});
