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
