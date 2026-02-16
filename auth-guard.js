// auth-guard.js - Enkel brukersjekk via localStorage
// Inkluder på alle sider som trenger en valgt bruker (etter supabase-config.js)

function getCurrentUser() {
    const id = localStorage.getItem('currentUserId');
    const name = localStorage.getItem('currentUserName');
    const role = localStorage.getItem('currentUserRole');
    const avatar = parseInt(localStorage.getItem('currentUserAvatar') || '0');
    if (!id || !name) {
        window.location.href = 'index.html';
        return null;
    }
    return { id, name, role: role || 'player', avatar: avatar };
}

function switchUser() {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('currentUserAvatar');
    window.location.href = 'index.html';
}

// Profil-redigering (avatar, DM-toggle, slett)
function openProfileEditor() {
    var user = getCurrentUser();
    if (!user) return;

    closeProfileEditor();

    var overlay = document.createElement('div');
    overlay.id = 'profileEditorOverlay';
    overlay.className = 'avatar-editor-overlay';
    overlay.addEventListener('click', closeProfileEditor);

    var editor = document.createElement('div');
    editor.className = 'avatar-editor';
    editor.addEventListener('click', function(e) { e.stopPropagation(); });

    // Tittel
    var title = document.createElement('div');
    title.className = 'avatar-editor-title';
    title.textContent = 'Rediger profil';
    editor.appendChild(title);

    // Avatar-velger
    var pickerLabel = document.createElement('div');
    pickerLabel.className = 'profile-editor-label';
    pickerLabel.textContent = 'Avatar';
    editor.appendChild(pickerLabel);

    var picker = document.createElement('div');
    picker.className = 'avatar-picker';

    COWBOY_AVATARS.forEach(function(avatar, index) {
        var option = document.createElement('div');
        option.className = 'avatar-option' + (index === user.avatar ? ' selected' : '');
        option.innerHTML = getAvatarSVG(index, 44);
        option.addEventListener('click', function() {
            picker.querySelectorAll('.avatar-option').forEach(function(el) {
                el.classList.remove('selected');
            });
            option.classList.add('selected');
        });
        picker.appendChild(option);
    });
    editor.appendChild(picker);

    // DM-toggle
    var dmRow = document.createElement('label');
    dmRow.className = 'profile-editor-checkbox';
    var dmCheckbox = document.createElement('input');
    dmCheckbox.type = 'checkbox';
    dmCheckbox.id = 'profileDMToggle';
    dmCheckbox.checked = user.role === 'dm';
    var dmLabel = document.createElement('span');
    dmLabel.textContent = 'Dungeon Master (DM)';
    dmRow.appendChild(dmCheckbox);
    dmRow.appendChild(dmLabel);
    editor.appendChild(dmRow);

    // Lagre-knapp
    var saveBtn = document.createElement('button');
    saveBtn.className = 'btn-login';
    saveBtn.textContent = 'Lagre';
    saveBtn.style.marginTop = '15px';
    saveBtn.addEventListener('click', function() {
        var selectedIndex = 0;
        picker.querySelectorAll('.avatar-option').forEach(function(el, i) {
            if (el.classList.contains('selected')) selectedIndex = i;
        });
        var isDM = document.getElementById('profileDMToggle').checked;
        saveProfileChanges(user, selectedIndex, isDM);
    });
    editor.appendChild(saveBtn);

    // Slett-knapp
    var deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete-player';
    deleteBtn.textContent = 'Slett spiller';
    deleteBtn.addEventListener('click', function() {
        deleteCurrentPlayer(user);
    });
    editor.appendChild(deleteBtn);

    overlay.appendChild(editor);
    document.body.appendChild(overlay);
}

function closeProfileEditor() {
    var overlay = document.getElementById('profileEditorOverlay');
    if (overlay) overlay.remove();
}

async function saveProfileChanges(user, avatarIndex, isDM) {
    var newRole = isDM ? 'dm' : 'player';

    var { error } = await supabaseClient
        .from('profiles')
        .update({ avatar: avatarIndex, role: newRole })
        .eq('id', user.id);

    if (error) {
        console.error('Feil ved lagring av profil:', error);
        return;
    }

    localStorage.setItem('currentUserAvatar', avatarIndex);
    localStorage.setItem('currentUserRole', newRole);

    closeProfileEditor();
    window.location.reload();
}

async function deleteCurrentPlayer(user) {
    if (!confirm('Er du sikker på at du vil slette ' + user.name + '? Dette kan ikke angres.')) {
        return;
    }

    var { error } = await supabaseClient
        .from('profiles')
        .delete()
        .eq('id', user.id);

    if (error) {
        console.error('Feil ved sletting av spiller:', error);
        return;
    }

    switchUser();
}

// Koble edit-knapp hvis den finnes
document.addEventListener('DOMContentLoaded', function() {
    var editBtn = document.getElementById('editProfileBtn');
    if (editBtn) {
        editBtn.addEventListener('click', openProfileEditor);
    }
});
