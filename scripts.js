const USER_ID = "587156686612201482";

// --- DEBOUNCE FUNCTION to prevent multiple rapid calls ---
function debounce(func, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), delay);
    };
}

// --- LAZY STATUS FETCH (only when page is visible) ---
let statusInterval = null;

async function fetchStatus() {
    if (!document.getElementById('global-name')) return;
    if (document.hidden) return; // Don't fetch if tab is hidden
    
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
        const { data } = await res.json();
        
        document.getElementById('global-name').innerText = data.discord_user.global_name || data.discord_user.username;
        document.getElementById('username').innerText = `@${data.discord_user.username}`;
        
        // Lazy load avatar with requestIdleCallback
        const avatarImg = document.getElementById('avatar');
        if (avatarImg && data.discord_user.avatar) {
            requestIdleCallback(() => {
                avatarImg.src = `https://cdn.discordapp.com/avatars/${USER_ID}/${data.discord_user.avatar}?size=256`;
            });
        }
        
        // Lazy load banner
        const bannerImg = document.getElementById('banner');
        if (bannerImg) {
            requestIdleCallback(() => {
                bannerImg.src = `https://cdn.discordapp.com/banners/${USER_ID}/a_301562bacb3bdffe15204cf2e19b5ed0?size=1024`;
            });
        }
        
        document.getElementById('status-dot').className = `status-dot scale-75 status-${data.discord_status}`;
        
        const act = data.activities.find(a => a.type === 4);
        const avatarUrl = `https://cdn.discordapp.com/avatars/${USER_ID}/${data.discord_user.avatar}?size=32`;
        
        const favicon = document.getElementById('favicon');
        if (favicon) favicon.href = avatarUrl;
        
        if(act) {
            document.getElementById('status-text').innerText = act.state || data.discord_status;
            if(act.emoji) {
                const emoji = document.getElementById('status-emoji');
                const emojiUrl = act.emoji.id ? `https://cdn.discordapp.com/emojis/${act.emoji.id}.webp` : `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${act.emoji.name.codePointAt(0).toString(16)}.png`;
                requestIdleCallback(() => {
                    emoji.src = emojiUrl;
                    emoji.classList.remove('hidden');
                });
            }
        }
        document.getElementById('app')?.classList.remove('opacity-0');
    } catch (e) { 
        console.error("Lanyard fetch error:", e); 
    }
}

// Start/stop status based on page visibility
function startStatusUpdates() {
    if (statusInterval) clearInterval(statusInterval);
    fetchStatus(); // fetch immediately
    statusInterval = setInterval(() => {
        if (!document.hidden) fetchStatus();
    }, 60000); // 60 seconds instead of 30
}

function stopStatusUpdates() {
    if (statusInterval) {
        clearInterval(statusInterval);
        statusInterval = null;
    }
}

// Visibility API - stop fetching when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopStatusUpdates();
    } else {
        startStatusUpdates();
    }
});

// Start status updates
startStatusUpdates();

// --- LAZY LOAD BLOCKS (with requestIdleCallback) ---
function loadBlocks() {
    const containers = document.querySelectorAll('[id^="load-"]');
    containers.forEach(container => {
        const fileName = container.id.replace('load-', '');
        requestIdleCallback(() => {
            fetch(`./blocks/${fileName}.html`)
                .then(res => res.text())
                .then(html => {
                    container.innerHTML = html;
                })
                .catch(err => console.error(`Failed to load module: ${fileName}`, err));
        });
    });
}

// Load blocks after page is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlocks);
} else {
    loadBlocks();
}

// --- TOASTS ---
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.innerText = message;
    clearTimeout(toastTimeout);
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2000);
}

// --- SFX (with caching) ---
const soundCache = {};

function playSound(file) {
    if (!soundCache[file]) {
        soundCache[file] = new Audio('./sounds/' + file);
    }
    const sound = soundCache[file];
    sound.currentTime = 0;
    sound.play().catch(e => console.log('Sound play failed:', e));
}

let obamaClickCount = 0;
let currentSound = null;

function playSoundRestart(file) {
    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
    }

    currentSound = new Audio('./sounds/' + file);
    currentSound.play().catch(e => console.log('Sound play failed:', e));

    obamaClickCount++;

    if (obamaClickCount >= 10) {
        window.location.href = "./secret/obama.html";
    }
}

// --- OPTIMIZED USER REVIEWS MODAL (No lag, lazy loaded) ---
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