// avatars.js - 6 cowboy-tema avatarer som inline SVG
// Inkluder på alle sider (før side-spesifikk JS)

const COWBOY_AVATARS = [
    {
        label: 'Sheriff',
        svg: '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="40" cy="44" r="28" fill="#F4D9A0"/>' +
            '<ellipse cx="40" cy="26" rx="22" ry="10" fill="#8B4513"/>' +
            '<rect x="18" y="22" width="44" height="8" rx="2" fill="#8B4513"/>' +
            '<ellipse cx="40" cy="22" rx="32" ry="5" fill="#A0522D"/>' +
            '<circle cx="32" cy="46" r="3" fill="#333"/>' +
            '<circle cx="48" cy="46" r="3" fill="#333"/>' +
            '<path d="M35 55 Q40 60 45 55" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>' +
            '<polygon points="40,36 37,42 43,42" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>' +
            '</svg>'
    },
    {
        label: 'Bandit',
        svg: '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="40" cy="44" r="28" fill="#DEB887"/>' +
            '<ellipse cx="40" cy="26" rx="20" ry="10" fill="#222"/>' +
            '<rect x="20" y="22" width="40" height="8" rx="2" fill="#222"/>' +
            '<ellipse cx="40" cy="22" rx="30" ry="5" fill="#333"/>' +
            '<circle cx="32" cy="44" r="3" fill="#333"/>' +
            '<circle cx="48" cy="44" r="3" fill="#333"/>' +
            '<rect x="26" y="52" width="28" height="10" rx="3" fill="#C41E3A"/>' +
            '<line x1="26" y1="55" x2="54" y2="55" stroke="#A01830" stroke-width="1.5"/>' +
            '<line x1="26" y1="58" x2="54" y2="58" stroke="#A01830" stroke-width="1.5"/>' +
            '</svg>'
    },
    {
        label: 'Cowgirl',
        svg: '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="40" cy="44" r="28" fill="#FDBCB4"/>' +
            '<ellipse cx="40" cy="26" rx="21" ry="10" fill="#E75480"/>' +
            '<rect x="19" y="22" width="42" height="8" rx="2" fill="#E75480"/>' +
            '<ellipse cx="40" cy="22" rx="31" ry="5" fill="#FF69B4"/>' +
            '<circle cx="32" cy="46" r="3" fill="#333"/>' +
            '<circle cx="48" cy="46" r="3" fill="#333"/>' +
            '<path d="M35 56 Q40 61 45 56" stroke="#C44" stroke-width="2" fill="none" stroke-linecap="round"/>' +
            '<path d="M22 38 Q18 30 24 34" stroke="#FDBCB4" stroke-width="3" fill="none"/>' +
            '<path d="M58 38 Q62 30 56 34" stroke="#FDBCB4" stroke-width="3" fill="none"/>' +
            '</svg>'
    },
    {
        label: 'Ranger',
        svg: '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="40" cy="44" r="28" fill="#C68642"/>' +
            '<ellipse cx="40" cy="26" rx="22" ry="10" fill="#556B2F"/>' +
            '<rect x="18" y="22" width="44" height="8" rx="2" fill="#556B2F"/>' +
            '<ellipse cx="40" cy="22" rx="32" ry="5" fill="#6B8E23"/>' +
            '<circle cx="32" cy="46" r="3" fill="#222"/>' +
            '<circle cx="48" cy="46" r="3" fill="#222"/>' +
            '<path d="M34 56 L46 56" stroke="#222" stroke-width="2" stroke-linecap="round"/>' +
            '<path d="M20 52 Q16 44 22 48" stroke="#556B2F" stroke-width="4" fill="none"/>' +
            '</svg>'
    },
    {
        label: 'Prospector',
        svg: '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="40" cy="44" r="28" fill="#F5DEB3"/>' +
            '<ellipse cx="40" cy="26" rx="20" ry="10" fill="#DAA520"/>' +
            '<rect x="20" y="22" width="40" height="8" rx="2" fill="#DAA520"/>' +
            '<ellipse cx="40" cy="22" rx="30" ry="5" fill="#FFD700"/>' +
            '<circle cx="32" cy="44" r="3" fill="#333"/>' +
            '<circle cx="48" cy="44" r="3" fill="#333"/>' +
            '<path d="M33 56 Q40 62 47 56" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>' +
            '<path d="M26 60 Q24 72 40 68 Q56 72 54 60" fill="#AAA" stroke="#888" stroke-width="1.5"/>' +
            '</svg>'
    },
    {
        label: 'Outlaw',
        svg: '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="40" cy="44" r="28" fill="#D2A679"/>' +
            '<ellipse cx="40" cy="26" rx="22" ry="10" fill="#4A0E0E"/>' +
            '<rect x="18" y="22" width="44" height="8" rx="2" fill="#4A0E0E"/>' +
            '<ellipse cx="40" cy="22" rx="32" ry="5" fill="#6B1010"/>' +
            '<circle cx="32" cy="44" r="3" fill="#222"/>' +
            '<circle cx="48" cy="44" r="3" fill="#222"/>' +
            '<path d="M32 56 L48 56" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>' +
            '<line x1="28" y1="38" x2="36" y2="40" stroke="#222" stroke-width="2" stroke-linecap="round"/>' +
            '<line x1="52" y1="38" x2="44" y2="40" stroke="#222" stroke-width="2" stroke-linecap="round"/>' +
            '</svg>'
    }
];

function getAvatarSVG(index, size) {
    size = size || 40;
    const avatar = COWBOY_AVATARS[index] || COWBOY_AVATARS[0];
    return '<div class="avatar-svg" style="width:' + size + 'px;height:' + size + 'px;display:inline-flex;">' +
        avatar.svg + '</div>';
}
