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

    obamaClickCount++;

    if (obamaClickCount >= 10) {
        window.location.href = "./secret/obama.html";
    }
}

// User Reviews
(function setupReviews() {
    const reviewsData = [
        { name: "kohrad", rating: 5, text: "soulz is literally the cat king. awesome guy, funny as hell." },
        { name: "twixxty", rating: 5, text: "genuinely one of the nicest people i've met online. also his cat pics are 10/10." },
        { name: "lamp", rating: 4, text: "pretty cool dude, makes the server feel like home." },
        { name: "coco", rating: 5, text: "autistic king we love you soulz !!! 🐱" },
        { name: "obama", rating: 5, text: "very based and cat-pilled. would recommend." }
    ];

    // Create modal lazily (only when first needed)
    let modal = null;
    let modalCreated = false;

    function createModal() {
        if (modalCreated) return;
        
        modal = document.createElement('div');
        modal.className = 'reviews-modal';
        modal.id = 'reviewsModal';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3>⭐ user reviews</h3>
                    <button class="modal-close-btn" id="closeModalBtn">✕</button>
                </div>
                <div class="reviews-list" id="reviewsList"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('closeModalBtn').addEventListener('click', closeReviewsModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeReviewsModal();
        });
        
        modalCreated = true;
    }

    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function renderReviews() {
        const reviewsListEl = document.getElementById('reviewsList');
        if (!reviewsListEl) return;
        if (reviewsData.length === 0) {
            reviewsListEl.innerHTML = '<div class="no-reviews">✨ no reviews yet — be the first!</div>';
            return;
        }
        reviewsListEl.innerHTML = reviewsData.map(review => `
            <div class="review-card">
                <span class="reviewer-name">${escapeHtml(review.name)}</span>
                <div class="star-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                <p class="review-text">${escapeHtml(review.text)}</p>
            </div>
        `).join('');
    }

    function openReviewsModal() {
        createModal(); // Create modal only when clicked
        if (typeof playSound === 'function') {
            try { playSound('click.mp3'); } catch(e) {}
        }
        renderReviews();
        if (modal) modal.classList.add('active');
    }

    function closeReviewsModal() {
        if (modal) modal.classList.remove('active');
    }

    // Find button with simple interval (stops after found)
    let buttonFound = false;
    let checkInterval = null;
    
    function findAndBindButton() {
        if (buttonFound) return true;
        const btn = document.getElementById('user-reviews-btn');
        if (btn) {
            btn.addEventListener('click', openReviewsModal);
            buttonFound = true;
            if (checkInterval) clearInterval(checkInterval);
            return true;
        }
        return false;
    }
    
    // Try immediately
    if (!findAndBindButton()) {
        checkInterval = setInterval(() => {
            if (findAndBindButton()) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
        }, 500);
        
        setTimeout(() => {
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
        }, 10000);
    }
})();