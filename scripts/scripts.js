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
        document.getElementById('banner').src = `https://cdn.discordapp.com/banners/${USER_ID}/a_301562bacb3bdffe15204cf2e19b5ed0?size=1024`;
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

// Obama
let obamaClickCount = 0;

function playSoundRestart(file) {
    if (window.currentSound) {
        window.currentSound.pause();
        window.currentSound.currentTime = 0;
    }

    window.currentSound = new Audio('./sounds/' + file);
    window.currentSound.play();

    obamaClickCount++;

    if (obamaClickCount >= 10) {
        window.location.href = "./secret/obama.html";
    }
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
        });
    }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupActionButtons);
} else {
    setupActionButtons();
}