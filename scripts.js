// --- DISCORD LANYARD STATUS & ACTIVITY ---
const USER_ID = "587156686612201482";

async function fetchStatus() {
    const nameEl = document.getElementById('global-name');
    if (!nameEl) return; 

    try {
        const res = await fetch(`https://api.lanyard.sakurajima.cloud/v1/users/${USER_ID}`);
        const { data } = await res.json();
        
        // Update Basic Profile Info
        nameEl.innerText = data.discord_user.global_name || data.discord_user.username;
        document.getElementById('username').innerText = `@${data.discord_user.username}`;
        document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${USER_ID}/${data.discord_user.avatar}?size=256`;
        document.getElementById('banner').src = `https://cdn.discordapp.com/banners/${USER_ID}/a_7dac1d4010494399d68ca8695933ff09?size=1024`;
        document.getElementById('status-dot').className = `status-dot scale-75 status-${data.discord_status}`;
        
        const avatarUrl = `https://cdn.discordapp.com/avatars/${USER_ID}/${data.discord_user.avatar}?size=32`;
        document.getElementById('favicon').href = avatarUrl;
        
        // Update Custom Status (Type 4)
        const customStatus = data.activities.find(a => a.type === 4);
        if(customStatus) {
            document.getElementById('status-text').innerText = customStatus.state || data.discord_status;
            if(customStatus.emoji) {
                const emoji = document.getElementById('status-emoji');
                emoji.src = customStatus.emoji.id ? `https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.webp` : `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${customStatus.emoji.name.codePointAt(0).toString(16)}.png`;
                emoji.classList.remove('hidden');
            }
        } else {
            document.getElementById('status-text').innerText = data.discord_status;
        }

        // Remove initial loading opacity
        document.getElementById('app').classList.remove('opacity-0');

        // SEND DATA TO ACTIVITY MODULE 
        const activityData = {
            activities: data.activities,
            discord_status: data.discord_status
        };
        
        const activityBlock = document.getElementById('activity-module');
        if (activityBlock) {
            window.postMessage({ type: 'UPDATE_ACTIVITY', payload: activityData }, '*');
        }

    } catch (e) { 
        console.error("Lanyard fetch error:", e); 
    }
}

// Update status every 30 seconds
setInterval(fetchStatus, 30000);
fetchStatus();

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

    // Add 1 to the counter
    obamaClickCount++;

    // Definitely don't click it 10 times!
    if (obamaClickCount >= 10) {
        window.location.href = "./secret/obama.html";
    }
}