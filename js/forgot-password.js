import { auth } from "./firebase-config.js";

import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const forgotForm = document.getElementById("forgotPasswordForm");
const forgotMessage = document.getElementById("forgotMessage");

forgotForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("resetEmail").value.trim();

    forgotMessage.style.color = "#00d4ff";
    forgotMessage.textContent = "Sending password reset email...";

    try {

        await sendPasswordResetEmail(auth, email);

        forgotMessage.style.color = "#00ff88";
        forgotMessage.innerHTML =
            "Password reset email sent successfully!<br>Please check your inbox and spam folder.";

        forgotForm.reset();

    } catch (error) {

        let message = "Unable to send password reset email.";

        switch (error.code) {

            case "auth/invalid-email":
                message = "Invalid email address.";
                break;

            case "auth/user-not-found":
                message = "No account exists with this email.";
                break;

            case "auth/missing-email":
                message = "Please enter your email address.";
                break;

            case "auth/too-many-requests":
                message = "Too many requests. Please try again later.";
                break;

            default:
                message = error.message;
        }

        forgotMessage.style.color = "#ff4d4d";
        forgotMessage.textContent = message;

    }

});
