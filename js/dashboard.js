import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const emailVerified = document.getElementById("emailVerified");
const creationTime = document.getElementById("creationTime");

const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    userName.textContent =
        user.displayName || "User";

    userEmail.textContent =
        user.email;

    emailVerified.textContent =
        user.emailVerified ? "Verified ✅" : "Not Verified ❌";

    creationTime.textContent =
        new Date(user.metadata.creationTime).toLocaleDateString();

});

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    }

    catch(error){

        alert(error.message);

    }

});
