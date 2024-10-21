const users = JSON.parse(localStorage.getItem('users')) || [];

function encryptPassword(password) {
    return btoa(password);
}
// Login
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let username = document.getElementById('loginUsername').value;
    // encrypt password and compare
    let password = encryptPassword(document.getElementById('loginPassword').value);

    let user = users.find(user => user.username === username && user.password === password);

    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = '../customer/customer.html';
        
    } else {
        document.getElementById('loginMessage').textContent = "Invalid username or password.";
    }
});


