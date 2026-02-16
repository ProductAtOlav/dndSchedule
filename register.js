const registerForm = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');
let selectedAvatar = 0;

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => { messageDiv.style.display = 'none'; }, 5000);
}

// Bygg avatar-velger
function renderAvatarPicker() {
    const picker = document.getElementById('avatarPicker');
    COWBOY_AVATARS.forEach(function(avatar, index) {
        const option = document.createElement('div');
        option.className = 'avatar-option' + (index === 0 ? ' selected' : '');
        option.innerHTML = getAvatarSVG(index, 44);
        option.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option').forEach(function(el) {
                el.classList.remove('selected');
            });
            option.classList.add('selected');
            selectedAvatar = index;
        });
        picker.appendChild(option);
    });
}

renderAvatarPicker();

registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const displayName = document.getElementById('displayName').value.trim();
    const isDM = document.getElementById('isDM').checked;

    if (displayName.length < 2) {
        showMessage('Navnet må være minst 2 tegn', 'error');
        return;
    }

    // Sjekk om navnet er tatt
    const { data: existing } = await supabaseClient
        .from('profiles')
        .select('display_name')
        .eq('display_name', displayName);

    if (existing && existing.length > 0) {
        showMessage('Dette navnet er allerede tatt', 'error');
        return;
    }

    // Opprett profil direkte i databasen
    const { data, error } = await supabaseClient
        .from('profiles')
        .insert({
            display_name: displayName,
            role: isDM ? 'dm' : 'player',
            avatar: selectedAvatar
        })
        .select()
        .single();

    if (error) {
        showMessage('Opprettelse feilet: ' + error.message, 'error');
        return;
    }

    // Logg inn som den nye brukeren
    localStorage.setItem('currentUserId', data.id);
    localStorage.setItem('currentUserName', data.display_name);
    localStorage.setItem('currentUserRole', data.role);
    localStorage.setItem('currentUserAvatar', data.avatar);

    showMessage('Profil opprettet! Omdirigerer...', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
});
