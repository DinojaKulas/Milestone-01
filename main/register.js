const users = JSON.parse(localStorage.getItem('users')) || [];
// password encryption 
function encryptPassword(password) {
    return btoa(password);
}
// User 
document.getElementById('userCreationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let username = document.getElementById('createUsername').value;
    let password = encryptPassword(document.getElementById('createPassword').value);
    let Email = document.getElementById('createEmail').value;
    let PhoneNumber = document.getElementById('createPhoneNumber').value;
    let ConfirmPassword = encryptPassword(document.getElementById('createConfirmPassword').value);
    let LicenseNumber = document.getElementById('createLicenseNumber').value;


    // Check username already exists
    if (users.find(user => user.username === username && user.password === ConfirmPassword)) {

        document.getElementById('creationMessage').textContent = "Username already exits.";
        return;
    }

    users.push({ username, password, Email, PhoneNumber, ConfirmPassword, LicenseNumber });
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById('creationMessage').textContent = "User created successfully!";
    document.getElementById('userCreationForm').reset();

});


