function submitlogin() {

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    // Check email
    if (email === "") {
        alert("Please enter your email.");
        return false;
    }

    // Validate email format
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Check password
    if (password === "") {
        alert("Please enter your password.");
        return false;
    }

    // Check password length
    if (password.length < 8) {
        alert("Password must have at least 8 characters.");
        return false;
    }

    // Login successful
    alert("Login successful!");

    window.location.href = "main.html";

    return false;
}