// fab.js - Floating Action Bar + Slim Top Bar
// Loaded on all authenticated pages, before auth-guard.js

var FAB_NAV_ITEMS = [
    {
        page: 'dashboard',
        href: 'dashboard.html',
        label: 'Tilgjengelighet',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="4" x2="9" y2="10"/><line x1="15" y1="4" x2="15" y2="10"/></svg>'
    },
    {
        page: 'group',
        href: 'group.html',
        label: 'Gruppe',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/><circle cx="19" cy="7" r="3"/><path d="M22 21v-1.5a3 3 0 00-3-3h-1"/></svg>'
    },
    {
        page: 'sessions',
        href: 'sessions.html',
        label: 'Økter',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/></svg>'
    }
];

var FAB_SAVE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 13 9 17 19 7"/></svg>';

function fabDetectPage() {
    var path = window.location.pathname;
    if (path.indexOf('group') !== -1) return 'group';
    if (path.indexOf('sessions') !== -1) return 'sessions';
    return 'dashboard';
}

function fabBuildTopBar() {
    var bar = document.createElement('div');
    bar.className = 'top-bar';

    var brand = document.createElement('div');
    brand.className = 'top-bar-brand';
    brand.textContent = 'DnD Planner';
    bar.appendChild(brand);

    var userSection = document.createElement('div');
    userSection.className = 'top-bar-user';

    var userDisplay = document.createElement('span');
    userDisplay.id = 'userDisplay';
    userSection.appendChild(userDisplay);

    var editBtn = document.createElement('button');
    editBtn.id = 'editProfileBtn';
    editBtn.className = 'btn-nav-icon';
    editBtn.title = 'Rediger profil';
    editBtn.innerHTML = '&#9998;';
    userSection.appendChild(editBtn);

    var switchBtn = document.createElement('button');
    switchBtn.id = 'switchUserBtn';
    switchBtn.className = 'btn-logout-small';
    switchBtn.textContent = 'Bytt bruker';
    userSection.appendChild(switchBtn);

    bar.appendChild(userSection);
    return bar;
}

function fabBuildFAB(currentPage) {
    var fab = document.createElement('div');
    fab.className = 'fab';
    fab.id = 'fab';

    FAB_NAV_ITEMS.forEach(function(item) {
        var link = document.createElement('a');
        link.href = item.href;
        link.className = 'fab-item' + (item.page === currentPage ? ' active' : '');
        link.setAttribute('data-page', item.page);

        var iconWrap = document.createElement('span');
        iconWrap.className = 'fab-icon';
        iconWrap.innerHTML = item.icon;
        link.appendChild(iconWrap);

        var label = document.createElement('span');
        label.className = 'fab-label';
        label.textContent = item.label;
        link.appendChild(label);

        fab.appendChild(link);
    });

    // Divider (hidden by default, shown with save button)
    var divider = document.createElement('div');
    divider.className = 'fab-divider';
    divider.id = 'fabDivider';
    fab.appendChild(divider);

    // Save button (hidden by default)
    var saveBtn = document.createElement('button');
    saveBtn.className = 'fab-save';
    saveBtn.id = 'fabSaveBtn';
    saveBtn.setAttribute('aria-label', 'Lagre');

    var saveIcon = document.createElement('span');
    saveIcon.className = 'fab-icon';
    saveIcon.innerHTML = FAB_SAVE_ICON;
    saveBtn.appendChild(saveIcon);

    var saveLabel = document.createElement('span');
    saveLabel.className = 'fab-label';
    saveLabel.textContent = 'Lagre';
    saveBtn.appendChild(saveLabel);

    saveBtn.addEventListener('click', function() {
        document.dispatchEvent(new CustomEvent('fab:save'));
    });

    fab.appendChild(saveBtn);
    return fab;
}

// Public API for save indicator
window.fabShowSave = function() {
    var btn = document.getElementById('fabSaveBtn');
    var div = document.getElementById('fabDivider');
    if (btn) btn.classList.add('visible');
    if (div) div.classList.add('visible');
};

window.fabHideSave = function() {
    var btn = document.getElementById('fabSaveBtn');
    var div = document.getElementById('fabDivider');
    if (btn) btn.classList.remove('visible');
    if (div) div.classList.remove('visible');
};

document.addEventListener('DOMContentLoaded', function() {
    var currentPage = fabDetectPage();

    // Insert top bar at the start of body
    var topBar = fabBuildTopBar();
    document.body.insertBefore(topBar, document.body.firstChild);

    // Append FAB at end of body
    var fab = fabBuildFAB(currentPage);
    document.body.appendChild(fab);
});
