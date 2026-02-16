const days = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const hours = Array.from({ length: 15 }, (_, i) => i + 8);

let allProfiles = [];
let allAvailability = [];

// Hent data
async function loadData() {
    const { data: profiles } = await supabaseClient
        .from('profiles')
        .select('id, display_name, role');
    allProfiles = profiles || [];

    const { data: avail } = await supabaseClient
        .from('availability')
        .select('user_id, day_index, hour, is_available')
        .eq('is_available', true);
    allAvailability = avail || [];
}

/**
 * Finn anbefalte økter
 *
 * Algoritme:
 * 1. Bygg oppslag: (dag, time) -> sett med tilgjengelige brukere
 * 2. For hver dag, finn sammenhengende tidsblokker der nok spillere overlapper
 * 3. Ranger etter antall spillere, med bonus for kvelder og helger
 */
function findRecommendedSessions(minPlayers, sessionLength, requireDM) {
    // Bygg slot-kart
    const slotMap = {};
    allAvailability.forEach(a => {
        const key = `${a.day_index}-${a.hour}`;
        if (!slotMap[key]) slotMap[key] = new Set();
        slotMap[key].add(a.user_id);
    });

    // Finn DM-er
    const dmIds = new Set(allProfiles.filter(p => p.role === 'dm').map(p => p.id));

    const recommendations = [];

    for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        const maxStartHour = 22 - sessionLength + 1;

        for (let startHour = 8; startHour <= maxStartHour; startHour++) {
            // Finn brukere som er tilgjengelige for ALLE timer i blokken
            let commonUsers = null;

            for (let h = startHour; h < startHour + sessionLength; h++) {
                const key = `${dayIndex}-${h}`;
                const usersThisHour = slotMap[key] || new Set();

                if (commonUsers === null) {
                    commonUsers = new Set(usersThisHour);
                } else {
                    commonUsers = new Set([...commonUsers].filter(u => usersThisHour.has(u)));
                }
            }

            if (!commonUsers) commonUsers = new Set();

            // Sjekk DM-krav
            const hasDM = [...commonUsers].some(uid => dmIds.has(uid));
            if (requireDM && !hasDM) continue;

            // Sjekk minimum spillere
            if (commonUsers.size < minPlayers) continue;

            // Bygg spillerliste
            const availablePlayers = [...commonUsers].map(uid => {
                const profile = allProfiles.find(p => p.id === uid);
                return {
                    name: profile ? profile.display_name : 'Ukjent',
                    role: profile ? profile.role : 'player'
                };
            });

            // Poengberegning
            let score = commonUsers.size * 10;
            if (startHour >= 17) score += 5;  // Kveldbonus
            if (dayIndex >= 5) score += 3;     // Helgebonus

            recommendations.push({
                dayIndex,
                startHour,
                endHour: startHour + sessionLength,
                availablePlayers,
                playerCount: commonUsers.size,
                hasDM,
                score
            });
        }
    }

    recommendations.sort((a, b) => b.score - a.score);
    return recommendations;
}

// Vis resultater
function renderResults(recommendations) {
    const container = document.getElementById('sessionResults');
    container.innerHTML = '';

    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>Ingen passende økter funnet</h3>
                <p>Prøv å redusere minimum antall spillere eller økt-lengde.</p>
            </div>`;
        return;
    }

    const top = recommendations.slice(0, 10);

    top.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'session-card';

        const rankClass = index === 0 ? 'rank-gold' : index === 1 ? 'rank-silver' : index === 2 ? 'rank-bronze' : '';

        card.innerHTML = `
            <div class="session-rank ${rankClass}">#${index + 1}</div>
            <div class="session-info">
                <h3>${days[rec.dayIndex]} kl. ${rec.startHour}:00 - ${rec.endHour}:00</h3>
                <p class="player-count">${rec.playerCount} spillere tilgjengelige${rec.hasDM ? ' (DM inkludert)' : ''}</p>
                <div class="player-list">
                    ${rec.availablePlayers.map(p =>
                        `<span class="player-tag ${p.role === 'dm' ? 'dm-tag' : ''}">${p.name}${p.role === 'dm' ? ' (DM)' : ''}</span>`
                    ).join('')}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Init
document.addEventListener('DOMContentLoaded', async function() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    document.getElementById('userDisplay').textContent = currentUser.name;
    document.getElementById('switchUserBtn').addEventListener('click', switchUser);

    await loadData();

    // Vis DM-advarsel hvis ingen DM er registrert
    const hasDMs = allProfiles.some(p => p.role === 'dm');
    if (!hasDMs) {
        const container = document.getElementById('sessionResults');
        container.innerHTML = `
            <div class="no-results">
                <h3>Ingen DM registrert</h3>
                <p>Minst én spiller må registrere seg som Dungeon Master for å bruke DM-kravet.</p>
            </div>`;
    }

    document.getElementById('findSessionsBtn').addEventListener('click', function() {
        const minPlayers = parseInt(document.getElementById('minPlayers').value);
        const sessionLength = parseInt(document.getElementById('sessionLength').value);
        const requireDM = document.getElementById('requireDM').checked;

        const results = findRecommendedSessions(minPlayers, sessionLength, requireDM);
        renderResults(results);
    });

    // Kjør automatisk ved lasting
    document.getElementById('findSessionsBtn').click();
});
