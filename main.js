// Sjekk om bruker allerede er valgt
const currentUserId = localStorage.getItem('currentUserId');
if (currentUserId) {
    window.location.href = 'dashboard.html';
}

let editingProfileId = null;

// Hent og vis alle profiler som avatar-kort
async function loadProfiles() {
    const { data: profiles, error } = await supabaseClient
        .from('profiles')
        .select('id, display_name, role, avatar')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Feil ved henting av profiler:', error);
        return;
    }

    const grid = document.getElementById('avatarGrid');
    const emptyState = document.getElementById('emptyState');

    if (!profiles || profiles.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.innerHTML = '';
    profiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'avatar-card';
        card.addEventListener('click', () => selectUser(profile));

        const isDM = profile.role === 'dm';

        card.innerHTML =
            getAvatarSVG(profile.avatar || 0, 50) +
            '<div class="avatar-name">' + profile.display_name + '</div>' +
            (isDM ? '<span class="avatar-dm-badge">DM</span>' : '') +
            '<button class="btn-edit-avatar" title="Endre avatar">&#9998;</button>';

        card.querySelector('.btn-edit-avatar').addEventListener('click', function(e) {
            e.stopPropagation();
            openAvatarEditor(profile);
        });

        grid.appendChild(card);
    });
}

// Åpne avatar-endring
function openAvatarEditor(profile) {
    closeAvatarEditor();
    editingProfileId = profile.id;

    const overlay = document.createElement('div');
    overlay.id = 'avatarEditorOverlay';
    overlay.className = 'avatar-editor-overlay';
    overlay.addEventListener('click', closeAvatarEditor);

    const editor = document.createElement('div');
    editor.id = 'avatarEditor';
    editor.className = 'avatar-editor';
    editor.addEventListener('click', function(e) { e.stopPropagation(); });

    var title = document.createElement('div');
    title.className = 'avatar-editor-title';
    title.textContent = 'Velg avatar for ' + profile.display_name;
    editor.appendChild(title);

    var picker = document.createElement('div');
    picker.className = 'avatar-picker';

    COWBOY_AVATARS.forEach(function(avatar, index) {
        var option = document.createElement('div');
        option.className = 'avatar-option' + (index === (profile.avatar || 0) ? ' selected' : '');
        option.innerHTML = getAvatarSVG(index, 44);
        option.addEventListener('click', function() {
            saveAvatarChange(profile, index);
        });
        picker.appendChild(option);
    });

    editor.appendChild(picker);

    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete-player';
    deleteBtn.textContent = 'Slett spiller';
    deleteBtn.addEventListener('click', function() {
        deletePlayer(profile);
    });
    editor.appendChild(deleteBtn);

    overlay.appendChild(editor);
    document.body.appendChild(overlay);
}

function closeAvatarEditor() {
    var overlay = document.getElementById('avatarEditorOverlay');
    if (overlay) overlay.remove();
    editingProfileId = null;
}

async function deletePlayer(profile) {
    if (!confirm('Er du sikker på at du vil slette ' + profile.display_name + '? Dette kan ikke angres.')) {
        return;
    }

    var { error } = await supabaseClient
        .from('profiles')
        .delete()
        .eq('id', profile.id);

    if (error) {
        console.error('Feil ved sletting av spiller:', error);
        showMessage('Kunne ikke slette spiller', 'error');
        return;
    }

    closeAvatarEditor();
    loadProfiles();
}

async function saveAvatarChange(profile, avatarIndex) {
    var { error } = await supabaseClient
        .from('profiles')
        .update({ avatar: avatarIndex })
        .eq('id', profile.id);

    if (error) {
        console.error('Feil ved endring av avatar:', error);
        showMessage('Kunne ikke endre avatar', 'error');
        return;
    }

    closeAvatarEditor();
    loadProfiles();
}

function showMessage(text, type) {
    var messageDiv = document.getElementById('message');
    if (!messageDiv) return;
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
    setTimeout(function() { messageDiv.style.display = 'none'; }, 3000);
}

// Velg bruker og gå videre
function selectUser(profile) {
    localStorage.setItem('currentUserId', profile.id);
    localStorage.setItem('currentUserName', profile.display_name);
    localStorage.setItem('currentUserRole', profile.role);
    localStorage.setItem('currentUserAvatar', profile.avatar || 0);
    window.location.href = 'dashboard.html';
}

loadProfiles();
