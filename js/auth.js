// SIGNUP
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const user = {
            name: document.getElementById("signup-name").value,
            email: document.getElementById("signup-email").value,
            password: document.getElementById("signup-password").value
        };

        localStorage.setItem("user", JSON.stringify(user));
        alert("Signup successful! Please login.");
        window.location.href = "login.html";
    });
}

// LOGIN
// LOGIN
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const savedUser = JSON.parse(localStorage.getItem("user"));
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        if (!savedUser) {
            alert("No user found. Please signup first.");
            return;
        }

        if (email === savedUser.email && password === savedUser.password) {
            alert("Login successful!");
            localStorage.setItem("loggedIn", "true");

            // ✅ IMPORTANT PART YOU MISSED
            const redirectTo = localStorage.getItem("redirectAfterLogin");
            if (redirectTo) {
                localStorage.removeItem("redirectAfterLogin");
                window.location.href = redirectTo;
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert("Invalid email or password");
        }
    });
}
// LOGOUT + NAVBAR TOGGLE
const logoutLink = document.getElementById("logout-link");
const loginLink = document.getElementById("login-link");

// Show / Hide links based on login status
if (localStorage.getItem("loggedIn")) {
    if (logoutLink) logoutLink.style.display = "inline";
    if (loginLink) loginLink.style.display = "none";
}

// Logout click
if (logoutLink) {
    logoutLink.addEventListener("click", function () {
        localStorage.removeItem("loggedIn");
        alert("Logged out successfully");
        window.location.href = "index.html";
    });
}
