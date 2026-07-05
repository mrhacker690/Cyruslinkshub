import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// =============================
// ⚡ AUTH STATE LOCK SYSTEM
// =============================
let authChecked = false;

const protectedRoutes = [
    "/dashboard",
    "/tools",
    "/games",
    "/movies",
    "/apks"
];

const publicRoutes = [
    "/login",
    "/register",
    "/"
];

// =============================
// 🚀 SHOW LOADING SCREEN FIRST
// =============================
createLoadingScreen();

// =============================
// 🔐 MAIN AUTH LISTENER
// =============================
onAuthStateChanged(auth, (user) => {

    authChecked = true;

    const path = window.location.pathname;

    removeLoadingScreen();

    // =========================
    // ❌ NOT LOGGED IN USER
    // =========================
    if (!user) {

        if (protectedRoutes.includes(path)) {
            showAccessDenied();
        }

        return;
    }

    // =========================
    // ✅ LOGGED IN USER
    // =========================
    if (user && (path === "/login" || path === "/register")) {
        window.location.replace("/dashboard");
    }

});


// =============================
// 🚫 ACCESS DENIED UI
// =============================
function showAccessDenied() {

    document.body.innerHTML = `
        <div style="
            height:100vh;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            background:#0b0f1a;
            color:white;
            font-family:sans-serif;
            text-align:center;
        ">
            <h1>🔒 Access Locked</h1>
            <p>You must sign in to continue.</p>

            <a href="/login" style="
                margin-top:20px;
                padding:12px 25px;
                background:#00d4ff;
                color:black;
                text-decoration:none;
                border-radius:10px;
                font-weight:bold;
            ">
                Login Now
            </a>
        </div>
    `;
}


// =============================
// ⏳ LOADING SCREEN
// =============================
function createLoadingScreen() {

    const loader = document.createElement("div");
    loader.id = "authLoader";

    loader.innerHTML = `
        <div style="
            height:100vh;
            width:100%;
            display:flex;
            justify-content:center;
            align-items:center;
            flex-direction:column;
            background:#0b0f1a;
            color:white;
            position:fixed;
            top:0;
            left:0;
            z-index:99999;
            font-family:sans-serif;
        ">
            <div class="spinner"></div>
            <p style="margin-top:15px;">Checking session...</p>
        </div>
    `;

    document.body.appendChild(loader);
}


// =============================
// ❌ REMOVE LOADING SCREEN
// =============================
function removeLoadingScreen() {

    const loader = document.getElementById("authLoader");

    if (loader) {
        loader.remove();
    }

}
