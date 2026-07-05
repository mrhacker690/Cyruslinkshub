import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const publicPages = ["/login", "/register", "/"];

onAuthStateChanged(auth, (user) => {

    const path = window.location.pathname;

    // If user is logged in
    if (user) {

        // Prevent logged-in users from going to login page
        if (path === "/login" || path === "/register") {
            window.location.href = "/dashboard";
        }

    } else {

        // Block dashboard if not logged in
        if (path === "/dashboard") {
            window.location.href = "/login";
        }

    }

});
