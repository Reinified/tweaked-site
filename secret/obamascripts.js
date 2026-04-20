// --- CUSTOM OBAMA PROFILE ---
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('global-name').innerText = "Barack Obama";
    document.getElementById('username').innerText = "@obamajuankinobi";
    document.getElementById('avatar').src = "./assets/obamna.png"; // Change to your image path
    document.getElementById('banner').src = "./assets/banner.gif"; // Change to your image path
    document.getElementById('status-dot').className = `status-dot scale-75 status-online`;
    document.getElementById('app').classList.remove('opacity-0');
});

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

function playSoundRestart(file) {
    if (window.currentSound) {
        window.currentSound.pause();
        window.currentSound.currentTime = 0;
    }

    window.currentSound = new Audio('./sounds/' + file);
    window.currentSound.play();
}