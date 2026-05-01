const USER_ID = "587156686612201482";

// --- DISCORD LANYARD STATUS ---
async function fetchStatus() {
    // Safety check: only run if the Lanyard elements are on the page
    if (!document.getElementById('global-name')) return; 
    
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
        const { data } = await res.json();
        
        document.getElementById('global-name').innerText = data.discord_user.global_name || data.discord_user.username;
        document.getElementById('username').innerText = `@${data.discord_user.username}`;
        document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${USER_ID}/${data.discord_user.avatar}?size=256`;
        document.getElementById('banner').src = `https://dcdn.dstn.to/banners/${USER_ID}?size=1024`;
        document.getElementById('status-dot').className = `status-dot scale-75 status-${data.discord_status}`;
        
        const act = data.activities.find(a => a.type === 4);
        const avatarUrl = `https://cdn.discordapp.com/avatars/${USER_ID}/${data.discord_user.avatar}?size=32`;
        document.getElementById('favicon').href = avatarUrl;
        
        if(act) {
            document.getElementById('status-text').innerText = act.state || data.discord_status;
            if(act.emoji) {
                const emoji = document.getElementById('status-emoji');
                emoji.src = act.emoji.id ? `https://cdn.discordapp.com/emojis/${act.emoji.id}.webp` : `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${act.emoji.name.codePointAt(0).toString(16)}.png`;
                emoji.classList.remove('hidden');
            }
        }
        document.getElementById('app').classList.remove('opacity-0');
    } catch (e) { 
        console.error("Lanyard fetch error:", e); 
    }
}

// Only fetch when tab is visible, every 60 seconds
let statusInterval;

function startStatusPolling() {
    if (statusInterval) clearInterval(statusInterval);
    statusInterval = setInterval(() => {
        if (!document.hidden) fetchStatus();
    }, 60000);
}

function stopStatusPolling() {
    if (statusInterval) {
        clearInterval(statusInterval);
        statusInterval = null;
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopStatusPolling();
    } else {
        fetchStatus(); // fetch immediately when returning
        startStatusPolling();
    }
});

// Start polling
fetchStatus();
startStatusPolling();

// Blocks
document.querySelectorAll('[id^="load-"]').forEach(container => {
    const fileName = container.id.replace('load-', '');
    fetch(`./blocks/${fileName}.html`)
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;
        })
        .catch(err => console.error(`Failed to load module: ${fileName}`, err));
});

// Toasts
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return; // Stop if toast doesn't exist on page
    
    toast.innerText = message;
    clearTimeout(toastTimeout);
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2000);
}

// SFX
function playSound(file) {
    const sound = new Audio('./sounds/' + file);
    sound.play();
}

function playSoundRestart(file) {
    if (window.currentSound) {
        window.currentSound.pause();
        window.currentSound.currentTime = 0;
    }

    window.currentSound = new Audio('./sounds/' + file);
    window.currentSound.play();
}

// Action Buttons
function setupActionButtons() {
    // Cats button
    const catsBtn = document.getElementById('cats-btn');
    if (catsBtn) {
        catsBtn.addEventListener('click', function() {
            if (typeof playSound === 'function') {
                try { playSound('click.mp3'); } catch(e) {}
            }
            window.open('https://photos.google.com/share/AF1QipNMMGGcN46RUtQ2-Ron0lV4t5JL7lpWP7gIbTMN-fgILGXcRNyS0x2duTROPvdg8w?key=d01uNllWYXdDMlJlbUVjU2VmeFpkajBaQmVIbm5B', '_blank');
        });
    }
    
// Cool People button
const coolpeopleBtn = document.getElementById('coolpeople-btn');
if (coolpeopleBtn) {
    coolpeopleBtn.addEventListener('click', function() {
        if (typeof playSound === 'function') {
            try { playSound('click.mp3'); } catch(e) {}
        }
        window.location.href = './coolpeople.html';
    });
}
    
// Reviews button
const reviewsBtn = document.getElementById('reviews-btn');
if (reviewsBtn) {
    reviewsBtn.addEventListener('click', function() {
        if (typeof playSound === 'function') {
            try { playSound('click.mp3'); } catch(e) {}
        }
        window.location.href = './reviews.html';
    })};
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupActionButtons);
} else {
    setupActionButtons();
}

// ========== CLOCK UPDATE (Eastern Time - auto DST) ==========
function updateClock() {
    const now = new Date();
    
    // Use Intl.DateTimeFormat to get Eastern Time (auto handles DST)
    const easternTime = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    // Get just the hour for the emoji (in Eastern Time)
    const easternHour = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: true
    });
    
    // Parse hour for emoji (1-12)
    let hourNum = parseInt(easternHour);
    if (easternHour.includes('PM') && hourNum !== 12) hourNum += 12;
    if (easternHour.includes('AM') && hourNum === 12) hourNum = 0;
    
    // Convert to 12-hour format for emoji (1-12)
    let emojiHour = hourNum % 12;
    if (emojiHour === 0) emojiHour = 12;
    
    // Clock emojis mapping
    const clockEmojis = {
        1: '🕐', 2: '🕑', 3: '🕒', 4: '🕓', 5: '🕔', 6: '🕕',
        7: '🕖', 8: '🕗', 9: '🕘', 10: '🕙', 11: '🕚', 12: '🕛'
    };
    const emoji = clockEmojis[emojiHour] || '🕐';
    
    // Determine if EST or EDT
    const isDST = isDaylightSaving();
    const tzLabel = isDST ? 'EDT' : 'EST';
    
    const clockEmojiSpan = document.getElementById('clock-emoji');
    const clockTimeSpan = document.getElementById('clock-time');
    const tzSpan = document.getElementById('timezone-label');
    
    if (clockEmojiSpan) clockEmojiSpan.textContent = emoji;
    if (clockTimeSpan) clockTimeSpan.textContent = easternTime;
    if (tzSpan) tzSpan.textContent = tzLabel;
}

// Function to check if Daylight Saving Time is active in Eastern Time
function isDaylightSaving() {
    // Get March 8 and November 1 (DST boundaries for Eastern Time)
    const now = new Date();
    const year = now.getFullYear();
    
    // DST starts: Second Sunday in March (March 8-14)
    const dstStart = new Date(year, 2, 8);
    dstStart.setDate(8 + (7 - dstStart.getDay()) % 7);
    
    // DST ends: First Sunday in November (November 1-7)
    const dstEnd = new Date(year, 10, 1);
    dstEnd.setDate(1 + (7 - dstEnd.getDay()) % 7);
    
    // Check if current date is between DST start and end (in Eastern Time)
    const easternNow = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const compareDate = new Date(easternNow);
    
    return compareDate >= dstStart && compareDate < dstEnd;
}

// Update clock immediately and every minute
updateClock();
setInterval(updateClock, 60000);