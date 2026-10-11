function signup() {

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    // Validate name
    if (name === "") {
        alert("Please enter your name.");
        return false;
    }

    let namePattern = /^[A-Za-z ]+$/;

    if (!namePattern.test(name)) {
        alert("Name must contain only letters and spaces.");
        return false;
    }

    // Validate email
    if (email === "") {
        alert("Please enter your email.");
        return false;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Validate password
    if (password === "") {
        alert("Please enter your password.");
        return false;
    }

    if (password.length < 8) {
        alert("Password must have at least 8 characters.");
        return false;
    }

    // Signup successful
    alert("Account created successfully!");

    window.location.href = "main.html";

    return false;
}