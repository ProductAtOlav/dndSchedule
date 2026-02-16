// Sjekk om bruker allerede er valgt
const currentUserId = localStorage.getItem('currentUserId');
if (currentUserId) {
    window.location.href = 'dashboard.html';
}

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
            (isDM ? '<span class="avatar-dm-badge">DM</span>' : '');

        grid.appendChild(card);
    });
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
