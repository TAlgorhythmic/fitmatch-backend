const numberRegex = /\d/;

// Validación de Gmail
function isValidGmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}

// Validación de contraseña: caracter especial, número y mayúscula
function isValidPassword(password) {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    return specialCharRegex.test(password) && numberRegex.test(password) && uppercaseRegex.test(password);
}

// Validación de si el texto proporcionado tiene algún número
function hasNumber(input) {
    return numberRegex.test(input);
}