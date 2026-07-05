onAuthStateChanged(auth, (user) => {

    const loader = document.getElementById("authLoader");

    if (!user) {
        window.location.href = "/login";
        return;
    }

    // Hide loader ONLY when auth is confirmed
    if (loader) loader.style.display = "none";

    document.getElementById("userName").textContent =
        user.displayName || "User";

    document.getElementById("userEmail").textContent =
        user.email;

    document.getElementById("userId").textContent =
        user.uid;

    document.getElementById("userPhoto").src =
        user.photoURL || "https://ui-avatars.com/api/?name=User";

});
