// Cache DOM elements
let menuButton, menu, overlay, warning;

// Function to check if the device is mobile
function isMobileDevice() {
    return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.innerWidth <= 768)
    );
}

// Function to handle the desktop warning
function handleDesktopWarning() {
    if (!isMobileDevice()) {
        warning.style.display = 'flex';
        // Prevent scrolling on desktop
        document.body.style.overflow = 'hidden';
    } else {
        warning.style.display = 'none';
        // Enable scrolling on mobile
        document.body.style.overflow = 'auto';
    }
}

// Handle mobile menu with performance optimizations
function initMobileMenu() {
    if (menuButton && menu && overlay) {
        const toggleMenu = () => {
            requestAnimationFrame(() => {
                menu.classList.toggle('active');
                overlay.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        };

        menuButton.addEventListener('click', toggleMenu, { passive: true });
        overlay.addEventListener('click', toggleMenu, { passive: true });
    }
}

// Debounced resize handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything with performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    menuButton = document.querySelector('.menu-cta');
    menu = document.querySelector('.montfort-menu');
    overlay = document.querySelector('.overlay');
    warning = document.querySelector('.desktop-warning');

    // Initialize features
    handleDesktopWarning();
    initMobileMenu();

    // Add debounced resize handler
    window.addEventListener('resize', debounce(handleDesktopWarning, 100), { passive: true });
}); 