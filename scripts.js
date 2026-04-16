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
        document.getElementById('banner').src = `https://cdn.discordapp.com/banners/${USER_ID}/a_7dac1d4010494399d68ca8695933ff09?size=1024`;
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

// Update status every 30 seconds
setInterval(fetchStatus, 30000);
fetchStatus();

// --- load blocks ---
document.querySelectorAll('[id^="load-"]').forEach(container => {
    const fileName = container.id.replace('load-', '');
    fetch(`./blocks/${fileName}.html`)
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;
        })
        .catch(err => console.error(`Failed to load module: ${fileName}`, err));
});

// --- TOAST NOTIFICATION ---
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

// --- sounds ---
function playSound(file) {
    const sound = new Audio('./sounds/' + file);
    sound.play();
}