import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// 🔐 ALL PROTECTED PAGES (ADD EVERYTHING HERE)
const protectedRoutes = [
    "/dashboard",
    "/tools",
    "/games",
    "/movies",
    "/apks",
    "/movie",
    "/apk",
    "/settings",
    "/profile"
];

// 🌐 PUBLIC PAGES
const publicRoutes = [
    "/login",
    "/register",
    "/"
];

onAuthStateChanged(auth, (user) => {

    const path = window.location.pathname;

    // =========================
    // ❌ NOT LOGGED IN
    // =========================
    if (!user) {

        if (protectedRoutes.includes(path)) {

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
                    <h1>🚫 Access Denied</h1>
                    <p>You must sign in first to access this content.</p>
                    <p style="opacity:0.7;">Movies, APKs, Tools are locked 🔒</p>

                    <a href="/login" style="
                        margin-top:20px;
                        padding:12px 25px;
                        background:#00d4ff;
                        color:black;
                        text-decoration:none;
                        border-radius:10px;
                        font-weight:bold;
                    ">Go to Login</a>
                </div>
            `;

        }

        return;
    }

    // =========================
    // ✅ LOGGED IN USER
    // =========================

    // Prevent login/register access after login
    if (publicRoutes.includes(path)) {
        window.location.href = "/dashboard";
    }

});
