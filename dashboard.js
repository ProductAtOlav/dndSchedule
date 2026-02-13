// Sjekk om bruker er logget inn
const isLoggedIn = localStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
    window.location.href = 'index.html';
}

// Konfigurasjon
const days = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 til 22:00
let availability = {};
let isDragging = false;
let dragMode = null; // 'available' eller 'unavailable'

// Generer kalender-grid
function generateCalendar() {
    const calendar = document.getElementById('calendar');

    // Legg til header-rad med dager
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-row header-row';

    const cornerCell = document.createElement('div');
    cornerCell.className = 'time-cell corner';
    headerRow.appendChild(cornerCell);

    days.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        headerRow.appendChild(dayCell);
    });

    calendar.appendChild(headerRow);

    // Legg til tidslots
    hours.forEach(hour => {
        const row = document.createElement('div');
        row.className = 'calendar-row';

        const timeCell = document.createElement('div');
        timeCell.className = 'time-cell';
        timeCell.textContent = `${hour}:00`;
        row.appendChild(timeCell);

        days.forEach((day, dayIndex) => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.dataset.day = dayIndex;
            slot.dataset.hour = hour;

            // Event listeners for klikk og drag
            slot.addEventListener('mousedown', handleMouseDown);
            slot.addEventListener('mouseenter', handleMouseEnter);
            slot.addEventListener('mouseup', handleMouseUp);

            row.appendChild(slot);
        });

        calendar.appendChild(row);
    });

    // Initialiser tilgjengelighet fra localStorage
    loadAvailability();
}

// Håndter museevents for drag-funksjonalitet
function handleMouseDown(e) {
    isDragging = true;
    const slot = e.target;
    const isAvailable = slot.classList.contains('available');

    // Sett dragMode basert på nåværende tilstand
    dragMode = isAvailable ? 'unavailable' : 'available';

    toggleSlot(slot);
}

function handleMouseEnter(e) {
    if (isDragging) {
        toggleSlot(e.target, dragMode);
    }
}

function handleMouseUp() {
    isDragging = false;
    dragMode = null;
}

// Toggle tilgjengelighet for en slot
function toggleSlot(slot, mode = null) {
    const day = slot.dataset.day;
    const hour = slot.dataset.hour;
    const key = `${day}-${hour}`;

    if (mode === 'available') {
        slot.classList.add('available');
        slot.classList.remove('unavailable');
        availability[key] = true;
    } else if (mode === 'unavailable') {
        slot.classList.remove('available');
        slot.classList.add('unavailable');
        availability[key] = false;
    } else {
        // Toggle
        if (slot.classList.contains('available')) {
            slot.classList.remove('available');
            slot.classList.add('unavailable');
            availability[key] = false;
        } else {
            slot.classList.add('available');
            slot.classList.remove('unavailable');
            availability[key] = true;
        }
    }
}

// Forhåndsinnstillinger
function applyPreset(preset) {
    const slots = document.querySelectorAll('.time-slot');

    slots.forEach(slot => {
        const day = parseInt(slot.dataset.day);
        const hour = parseInt(slot.dataset.hour);

        switch(preset) {
            case 'work':
                // Mandag-Fredag, 09:00-17:00
                if (day < 5 && hour >= 9 && hour < 17) {
                    toggleSlot(slot, 'available');
                } else {
                    toggleSlot(slot, 'unavailable');
                }
                break;

            case 'evening':
                // Alle dager, 18:00-22:00
                if (hour >= 18 && hour < 22) {
                    toggleSlot(slot, 'available');
                } else {
                    toggleSlot(slot, 'unavailable');
                }
                break;

            case 'all':
                // Alle tider tilgjengelige
                toggleSlot(slot, 'available');
                break;

            case 'clear':
                // Fjern alt
                toggleSlot(slot, 'unavailable');
                break;
        }
    });
}

// Lagre tilgjengelighet
function saveAvailability() {
    localStorage.setItem('availability', JSON.stringify(availability));
    showNotification('Tilgjengelighet lagret!', 'success');
}

// Last inn tilgjengelighet
function loadAvailability() {
    const saved = localStorage.getItem('availability');
    if (saved) {
        availability = JSON.parse(saved);

        // Oppdater UI
        Object.keys(availability).forEach(key => {
            const [day, hour] = key.split('-');
            const slot = document.querySelector(`[data-day="${day}"][data-hour="${hour}"]`);
            if (slot) {
                if (availability[key]) {
                    slot.classList.add('available');
                } else {
                    slot.classList.add('unavailable');
                }
            }
        });
    }
}

// Vis notifikasjon
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();

    // Forhåndsinnstillinger
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const preset = this.dataset.preset;
            applyPreset(preset);
        });
    });

    // Lagre-knapp
    document.getElementById('saveBtn').addEventListener('click', saveAvailability);

    // Logg ut-knapp
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'index.html';
    });

    // Forhindre drag-standard oppførsel
    document.addEventListener('mouseup', handleMouseUp);
});

// Forhindre tekst-seleksjon under dragging
document.addEventListener('selectstart', function(e) {
    if (isDragging) {
        e.preventDefault();
    }
});
