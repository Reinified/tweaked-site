// Friends 
const friendsData = [
    { name: 'kohrad', sound: 'kohrad.mp3' },
    { name: 'obama', sound: 'obama.mp3', secret: true },
    { name: 'twixxty', sound: 'twixxty.mp3' },
    { name: 'lamp', sound: 'lamp.mp3' },
    { name: 'coco', sound: 'coco.mp3' }
];

function loadFriends() {
    const friendsList = document.getElementById('friends-list');
    if (!friendsList) return;
    
    friendsList.innerHTML = '';
    
    friendsData.forEach(friend => {
        const friendDiv = document.createElement('div');
        friendDiv.className = 'friend-item p-3 flex items-center gap-3';
        friendDiv.setAttribute('data-friend', friend.name);
        
        friendDiv.innerHTML = `
            <img src="./assets/profiles/${friend.name}.png" class="friend-avatar" loading="lazy">
            <div class="flex-1">
                <div class="flex items-center gap-2">
                    <span class="friend-name">${friend.name}</span>
                </div>
            </div>
            <span class="text-gray-500 text-xs">→</span>
        `;
        
        // Add click handler (reuses existing playSound function from scripts.js)
        friendDiv.addEventListener('click', () => {
            if (typeof playSound === 'function') {
                playSound(`${friend.name}.mp3`);
            }
            showToast(`Clicked on ${friend.name}`);
        });
        
        friendsList.appendChild(friendDiv);
    });
}

// Start loading friends when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFriends);
} else {
    loadFriends();
}