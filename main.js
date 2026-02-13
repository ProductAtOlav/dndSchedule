// Hent elementer fra DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const messageDiv = document.getElementById('message');

// Funksjon for å vise meldinger
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    // Skjul melding etter 5 sekunder
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Funksjon for å validere innlogging
function validateLogin(username, password) {
    // Her kan du legge til ekte validering mot en backend senere
    // For nå bruker vi dummy-data
    const validUsers = {
        'admin': 'admin123',
        'bruker': 'passord123'
    };

    return validUsers[username] === password;
}

// Håndter innlogging
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;

    // Enkel validering
    if (!username || !password) {
        showMessage('Vennligst fyll ut alle feltene', 'error');
        return;
    }

    // Valider innlogging
    if (validateLogin(username, password)) {
        showMessage('Innlogging vellykket! Omdirigerer...', 'success');

        // Lagre brukernavn hvis "Husk meg" er valgt
        if (remember) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Lagre innloggingsstatus
        localStorage.setItem('isLoggedIn', 'true');

        // Omdiriger til dashboard etter 2 sekunder
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    } else {
        showMessage('Feil brukernavn eller passord', 'error');
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Sjekk om brukernavn er lagret når siden lastes
window.addEventListener('DOMContentLoaded', function() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        usernameInput.value = rememberedUser;
        rememberCheckbox.checked = true;
        passwordInput.focus();
    }
});

// Legg til animasjon på input-felt
[usernameInput, passwordInput].forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.2s';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});
