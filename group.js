const days = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const hours = Array.from({ length: 15 }, (_, i) => i + 8);

let allProfiles = [];
let allAvailability = [];
let selectedUserIds = new Set();

// Hent alle profiler og tilgjengelighet
async function loadGroupData() {
    const { data: profiles, error: pError } = await supabaseClient
        .from('profiles')
        .select('id, display_name, role');

    if (pError) {
        console.error('Feil ved henting av profiler:', pError);
        return;
    }
    allProfiles = profiles || [];

    const { data: avail, error: aError } = await supabaseClient
        .from('availability')
        .select('user_id, day_index, hour, is_available')
        .eq('is_available', true);

    if (aError) {
        console.error('Feil ved henting av tilgjengelighet:', aError);
        return;
    }
    allAvailability = avail || [];

    selectedUserIds = new Set(allProfiles.map(p => p.id));

    renderMemberCheckboxes();
    renderGroupCalendar();
    document.getElementById('memberCount').textContent = allProfiles.length;
}

// Vis avkrysningsbokser for filtrering
function renderMemberCheckboxes() {
    const container = document.getElementById('memberCheckboxes');
    container.innerHTML = '';

    allProfiles.forEach(profile => {
        const label = document.createElement('label');
        label.className = 'member-checkbox-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.dataset.userId = profile.id;
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedUserIds.add(profile.id);
            } else {
                selectedUserIds.delete(profile.id);
            }
            renderGroupCalendar();
        });

        const roleTag = profile.role === 'dm' ? ' (DM)' : '';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${profile.display_name}${roleTag}`));
        container.appendChild(label);
    });
}

// Bygg gruppekalender med varmekart
function renderGroupCalendar() {
    const calendar = document.getElementById('groupCalendar');
    calendar.innerHTML = '';

    // Bygg oppslag: "dayIndex-hour" -> liste med user_ids
    const slotMap = {};
    allAvailability
        .filter(a => selectedUserIds.has(a.user_id))
        .forEach(a => {
            const key = `${a.day_index}-${a.hour}`;
            if (!slotMap[key]) slotMap[key] = [];
            slotMap[key].push(a.user_id);
        });

    const totalSelected = selectedUserIds.size;

    // Header-rad
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-row header-row';
    const corner = document.createElement('div');
    corner.className = 'time-cell corner';
    headerRow.appendChild(corner);
    days.forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.textContent = day;
        headerRow.appendChild(cell);
    });
    calendar.appendChild(headerRow);

    // Tidslots
    hours.forEach(hour => {
        const row = document.createElement('div');
        row.className = 'calendar-row';

        const timeCell = document.createElement('div');
        timeCell.className = 'time-cell';
        timeCell.textContent = `${hour}:00`;
        row.appendChild(timeCell);

        days.forEach((day, dayIndex) => {
            const slot = document.createElement('div');
            slot.className = 'time-slot group-slot';
            const key = `${dayIndex}-${hour}`;
            const availableUsers = slotMap[key] || [];
            const count = availableUsers.length;

            let heatLevel;
            if (count === 0) heatLevel = 0;
            else if (count <= 2) heatLevel = 1;
            else if (count <= 4) heatLevel = 2;
            else heatLevel = 3;

            slot.classList.add(`heat-${heatLevel}`);
            slot.textContent = count > 0 ? count : '';
            slot.title = `${count} av ${totalSelected} tilgjengelige`;

            slot.addEventListener('click', () => showSlotDetail(dayIndex, hour, availableUsers));

            row.appendChild(slot);
        });

        calendar.appendChild(row);
    });
}

// Vis detaljer for en tidsluke
function showSlotDetail(dayIndex, hour, userIds) {
    const detailDiv = document.getElementById('slotDetail');
    const titleEl = document.getElementById('slotDetailTitle');
    const listEl = document.getElementById('slotDetailList');

    titleEl.textContent = `${days[dayIndex]} kl. ${hour}:00`;
    listEl.innerHTML = '';

    if (userIds.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Ingen tilgjengelige';
        listEl.appendChild(li);
    } else {
        userIds.forEach(uid => {
            const profile = allProfiles.find(p => p.id === uid);
            if (profile) {
                const li = document.createElement('li');
                const roleTag = profile.role === 'dm' ? ' (DM)' : '';
                li.textContent = `${profile.display_name}${roleTag}`;
                listEl.appendChild(li);
            }
        });
    }

    detailDiv.style.display = 'block';
}

// Init
document.addEventListener('DOMContentLoaded', async function() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    document.getElementById('userDisplay').textContent = currentUser.name;
    document.getElementById('switchUserBtn').addEventListener('click', switchUser);

    await loadGroupData();
});
