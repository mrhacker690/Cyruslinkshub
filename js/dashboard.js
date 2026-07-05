import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const emailVerified = document.getElementById("emailVerified");
const creationTime = document.getElementById("creationTime");
const userPhoto = document.getElementById("userPhoto");
const userId = document.getElementById("userId");
const userStatus = document.getElementById("userStatus");

const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login";
        return;
    }

    // Name
    userName.textContent = user.displayName || "User";

    // Email
    userEmail.textContent = user.email || "Not available";

    // Email verification
    emailVerified.textContent = user.emailVerified
        ? "Verified ✅"
        : "Not Verified ❌";

    // Creation date
    if (user.metadata?.creationTime) {
        creationTime.textContent =
            new Date(user.metadata.creationTime).toLocaleDateString();
    } else {
        creationTime.textContent = "Unknown";
    }

    // User ID
    userId.textContent = user.uid;

    // Profile picture
    if (user.photoURL) {
        userPhoto.src = user.photoURL;
    } else {
        userPhoto.src =
            "https://ui-avatars.com/api/?name=" +
            (user.displayName || "User");
    }

    // Online status
    userStatus.textContent = "● Online";
    userStatus.style.color = "#00ff88";

});

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login";

    } catch (error) {

        alert("Logout failed: " + error.message);

    }

});
