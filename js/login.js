import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    const loader = document.getElementById("authLoader");

    if (user) {
        window.location.href = "/dashboard";
    } else {
        if (loader) loader.style.display = "none";
    }

});
