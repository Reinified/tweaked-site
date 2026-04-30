// Cool People - loads individual modules from blocks/coolpeople/
const coolPeopleList = [
    'kohrad',
    'obamajuankinobi',
    'twixxty',
    'lampdelivery',
    'cocobo1',
    'omawr',
    'eminem',
    'amaroreo',
    'apoc'
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
                // Create a temporary container
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Get the card element
                const newCard = tempDiv.firstElementChild;
                
                // Extract and execute any scripts
                const scripts = tempDiv.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    document.body.appendChild(newScript);
                    document.body.removeChild(newScript);
                });
                
                if (newCard) {
                    // Copy over the click event from the original card's script
                    // Instead, let's re-attach the click handler manually
                    const coolAvatar = newCard.querySelector('.cool-avatar');
                    const coolName = newCard.querySelector('.cool-name');
                    const dataTitle = newCard.getAttribute('data-title');
                    
                    // Re-create click handler based on data-title
                    newCard.addEventListener('click', (e) => {
                        handlePersonClick(personId, dataTitle);
                    });
                    
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

// Centralized click handler
function handlePersonClick(personId, displayName) {
    console.log(`Clicked: ${personId} (${displayName})`);
    
    // Define actions for each person
    const actions = {
        'kohrad': () => {
            if (typeof playSound === 'function') playSound('kohrad.mp3');
            if (typeof showToast === 'function') showToast('MY BEST FRIEND!111!!!!1');
        },
        'obamajuankinobi': () => {
            if (typeof playSoundRestart === 'function') playSoundRestart('obama.mp3');
            if (typeof showToast === 'function') showToast('grilled cheese obama sandwich');
        },
        'twixxty': () => {
            window.open('https://twixxt.defautluser0.xyz/', '_blank');
        },
        'lampdelivery': () => {
            window.open('https://lamp.delivery', '_blank');
        },
        'cocobo1': () => {
            window.open('https://www.raincord.dev/', '_blank');
        },
        'omawr': () => {
            window.open('https://omardotdev.github.io/', '_blank');
        },
        'eminem': () => {
            window.open('https://www.eminem.com/', '_blank');
        },
        'amaroreo': () => {
            window.open('https://amarkherala.github.io', '_blank');
        },
        'apoc': () => {
            window.open('https://www.smashintopieces.com/apoc-epk', '_blank');
        }
    };
    
    if (actions[personId]) {
        actions[personId]();
    } else {
        console.warn(`No action defined for ${personId}`);
        if (typeof showToast === 'function') showToast(displayName);
    }
}

// Start loading cool people when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCoolPeople);
} else {
    loadCoolPeople();
}