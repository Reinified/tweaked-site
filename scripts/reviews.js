// Lazy load individual review modules
function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    // List of review modules to load (add more as you go)
    const reviewModules = [
        'smearmo',
    ];
    
    // Clear loading text
    reviewsList.innerHTML = '';
    
    // Load each review module lazily
    reviewModules.forEach((username, index) => {
        // Use requestIdleCallback to load reviews when browser is free
        const loadModule = () => {
            fetch(`./blocks/reviews/${username}.html`)
                .then(res => {
                    if (!res.ok) throw new Error('Review not found');
                    return res.text();
                })
                .then(html => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.innerHTML = html;
                    reviewsList.appendChild(reviewDiv.firstElementChild);
                })
                .catch(err => {
                    console.error(`Failed to load review: ${username}`, err);
                    // Optionally show a fallback
                });
        };
        
        if (window.requestIdleCallback) {
            requestIdleCallback(loadModule, { timeout: 2000 });
        } else {
            setTimeout(loadModule, index * 50); // stagger loading
        }
    });
}

// Start loading reviews when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReviews);
} else {
    loadReviews();
}