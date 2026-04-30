// Cool People - loads individual modules from blocks/coolpeople/
const coolPeopleList = [
    'kohrad',
    'obamajuankinobi',
    'twixxty',
    'lampdelivery',
    'cocobo1',
    'omawr',
    'eminem'
];

function loadCoolPeople() {
    const coolGrid = document.getElementById('cool-grid');
    if (!coolGrid) return;
    
    coolGrid.innerHTML = '';
    
    coolPeopleList.forEach(personId => {
        // Create placeholder card
        const coolCard = document.createElement('div');
        coolCard.className = 'cool-card';
        coolCard.setAttribute('data-person', personId);
        
        // Show skeleton while loading
        coolCard.innerHTML = `
            <div class="cool-avatar cool-skeleton"></div>
            <p class="cool-name cool-skeleton-text">Loading...</p>
        `;
        coolGrid.appendChild(coolCard);
        
        // Load individual HTML file
        fetch(`../blocks/coolpeople/${personId}.html`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load ${personId}`);
                return res.text();
            })
            .then(html => {
                // Replace the placeholder with loaded content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const newCard = tempDiv.firstElementChild;
                
                if (newCard) {
                    coolCard.parentNode.replaceChild(newCard, coolCard);
                }
            })
            .catch(err => {
                console.error(err);
                coolCard.innerHTML = `
                    <div class="cool-avatar" style="background:#330000;">
                        <img src="../../assets/profiles/default.png" loading="lazy">
                    </div>
                    <p class="cool-name" style="color:#ff6666;">${personId}</p>
                `;
            });
    });
}

// Start loading cool people when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCoolPeople);
} else {
    loadCoolPeople();
}