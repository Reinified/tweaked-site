// Friends data (all functionality from original block)
const friendsData = [
    { 
        name: 'kohrad', 
        sound: 'kohrad.mp3', 
        toast: 'MY BEST FRIEND!111!!!!1',
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

function loadFriends() {
    const friendsGrid = document.getElementById('friends-grid');
    if (!friendsGrid) return;
    
    friendsGrid.innerHTML = '';
    
    friendsData.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = 'friend-card';
        friendCard.setAttribute('data-title', friend.name);
        
        // Build inner HTML
        friendCard.innerHTML = `
            <div class="friend-avatar">
                <img src="./assets/profiles/${friend.name}.png" 
                     loading="lazy"
                     onerror="this.src='./assets/profiles/default.png'">
            </div>
            <p class="friend-name">${friend.name}</p>
        `;
        
        // Add click handler based on type
        friendCard.addEventListener('click', (e) => {
            // Play sound (use playSoundRestart for Obama to trigger secret)
            if (friend.name === 'obama') {
                if (typeof playSoundRestart === 'function') {
                    playSoundRestart(friend.sound);
                }
            } else {
                if (typeof playSound === 'function') {
                    playSound(friend.sound);
                }
            }
            
            // Show toast
            if (typeof showToast === 'function') {
                showToast(friend.toast);
            }
            
            // Handle link or regular click
            if (friend.type === 'link' && friend.url) {
                window.open(friend.url, '_blank');
            }
        });
        
        friendsGrid.appendChild(friendCard);
    });
}

// Start loading friends when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFriends);
} else {
    loadFriends();
}