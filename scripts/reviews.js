// Lazy load individual review modules
function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    const reviewModules = [
        'smearmo',
        'tedmac',
        'gustojose',
    ];
    
    reviewsList.innerHTML = '';
    
    // Use Intersection Observer to load only visible reviews
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                const username = placeholder.dataset.username;
                
                fetch(`./blocks/reviews/${username}.html`)
                    .then(res => res.text())
                    .then(html => {
                        const reviewDiv = document.createElement('div');
                        reviewDiv.innerHTML = html;
                        placeholder.replaceWith(reviewDiv.firstElementChild);
                    })
                    .catch(err => console.error(`Failed: ${username}`, err));
                
                observer.unobserve(placeholder);
            }
        });
    }, { rootMargin: '100px' });
    
    // Create placeholders for each review
    reviewModules.forEach(username => {
        const placeholder = document.createElement('div');
        placeholder.className = 'review-skeleton p-3 flex gap-3';
        placeholder.dataset.username = username;
        placeholder.innerHTML = `
            <div class="w-10 h-10 bg-white/5"></div>
            <div class="flex-1">
                <div class="h-3 bg-white/5 w-24 mb-2"></div>
                <div class="h-2 bg-white/5 w-full"></div>
            </div>
        `;
        reviewsList.appendChild(placeholder);
        observer.observe(placeholder);
    });
}

// Start loading reviews when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReviews);
} else {
    loadReviews();
}