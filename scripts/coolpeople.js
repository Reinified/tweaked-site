// Cool People data
const coolPeopleData = [
    { 
        name: 'gusto jose',
        file: 'kohrad',
        sound: 'kohrad.mp3', 
        toast: 'MY BEST FRIEND!111!!!!1',
        type: 'click'
    },
    { 
        name: 'obama',
        file: 'obamajuankinobi',
        sound: 'obama.mp3', 
        toast: 'grilled cheese obama sandwich',
        type: 'click',
        secret: true
    },
    { 
        name: 'twix bar',
        file: 'twixxty',
        type: 'link',
        url: 'https://twixxt.defautluser0.xyz/'
    },
    { 
        name: 'lamp',
        file: 'lampdelivery',
        type: 'link',
        url: 'https://lamp.delivery'
    },
    { 
        name: 'coco',             
        file: 'cocobo1',
        type: 'link',
        url: 'https://www.raincord.dev/'
    }
];

function loadCoolPeople() {
    const coolGrid = document.getElementById('cool-grid');
    if (!coolGrid) return;
    
    coolGrid.innerHTML = '';
    
    coolPeopleData.forEach(person => {
        const coolCard = document.createElement('div');
        coolCard.className = 'cool-card';
        coolCard.setAttribute('data-title', person.name);
        
        coolCard.innerHTML = `
            <div class="cool-avatar">
                <img src="../assets/profiles/${person.file}.png" 
                     loading="lazy"
                     onerror="this.src='../assets/profiles/default.png'">
            </div>
            <p class="cool-name">${person.name}</p>
        `;
        
        // Add click handler
        coolCard.addEventListener('click', (e) => {
            if (person.name === 'obama') {
                if (typeof playSoundRestart === 'function') {
                    playSoundRestart(person.sound);
                }
            } else {
                if (typeof playSound === 'function') {
                    playSound(person.sound);
                }
            }
            
            if (typeof showToast === 'function') {
                showToast(person.toast);
            }
            
            if (person.type === 'link' && person.url) {
                window.open(person.url, '_blank');
            }
        });
        
        coolGrid.appendChild(coolCard);
    });
}

// Start loading cool people when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCoolPeople);
} else {
    loadCoolPeople();
}