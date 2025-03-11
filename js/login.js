function login() {
    // Get values from the form
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Send a POST request to the server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (response.ok) {
            // Redirect to home.html on successful login
            window.location.href = 'home';
        } else {
            // Show an alert for incorrect login
            alert('Invalid email or password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}