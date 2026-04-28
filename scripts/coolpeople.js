// coolpeople data (all functionality from original block)
const coolpeopleData = [
    { 
        name: 'kohrad', 
        sound: 'kohrad.mp3', 
        toast: 'MY BEST coolpeople!111!!!!1',
        type: 'click'
    },
    { 
        name: 'obama', 
        sound: 'obama.mp3', 
        toast: 'grilled cheese obama sandwich',
        type: 'click',
        secret: true
    },
    { 
        name: 'twixxty', 
        sound: 'twixxty.mp3',
        type: 'link',
        url: 'https://twixxt.defautluser0.xyz/'
    },
    { 
        name: 'lamp', 
        sound: 'lamp.mp3',
        type: 'link',
        url: 'https://lamp.delivery'
    },
    { 
        name: 'coco', 
        sound: 'coco.mp3',
        type: 'link',
        url: 'https://www.raincord.dev/'
    }
];

function loadcoolpeople() {
    const coolpeopleGrid = document.getElementById('coolpeople-grid');
    if (!coolpeopleGrid) return;
    
    coolpeopleGrid.innerHTML = '';
    
    coolpeopleData.forEach(coolpeople => {
        const coolpeopleCard = document.createElement('div');
        coolpeopleCard.className = 'coolpeople-card';
        coolpeopleCard.setAttribute('data-title', coolpeople.name);
        
        // Build inner HTML
        coolpeopleCard.innerHTML = `
            <div class="coolpeople-avatar">
                <img src="./assets/profiles/${coolpeople.name}.png" 
                     loading="lazy"
                     onerror="this.src='./assets/profiles/default.png'">
            </div>
            <p class="coolpeople-name">${coolpeople.name}</p>
        `;
        
        // Add click handler based on type
        coolpeopleCard.addEventListener('click', (e) => {
            // Play sound (use playSoundRestart for Obama to trigger secret)
            if (coolpeople.name === 'obama') {
                if (typeof playSoundRestart === 'function') {
                    playSoundRestart(coolpeople.sound);
                }
            } else {
                if (typeof playSound === 'function') {
                    playSound(coolpeople.sound);
                }
            }
            
            // Show toast
            if (typeof showToast === 'function') {
                showToast(coolpeople.toast);
            }
            
            // Handle link or regular click
            if (coolpeople.type === 'link' && coolpeople.url) {
                window.open(coolpeople.url, '_blank');
            }
        });
        
        coolpeopleGrid.appendChild(coolpeopleCard);
    });
}

// Start loading coolpeople when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadcoolpeople);
} else {
    loadcoolpeople();
}