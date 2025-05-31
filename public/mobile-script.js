// Cache DOM elements
let menuButton, menu, overlay, warning;

// Function to check if the device is mobile
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Function to handle the desktop warning
function handleDesktopWarning() {
    if (!isMobileDevice()) {
        warning.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        warning.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle mobile menu with performance optimizations
function initMobileMenu() {
    // Get menu elements
    menuButton = document.querySelector('.menu-cta');
    menu = document.querySelector('.montfort-menu');
    overlay = document.querySelector('.overlay');

    // Log if elements are not found
    if (!menuButton) console.error('Menu button not found');
    if (!menu) console.error('Menu not found');
    if (!overlay) console.error('Overlay not found');

    if (menuButton && menu && overlay) {
        const toggleMenu = () => {
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            menuButton.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (menu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        };

        // Add click event listeners
        menuButton.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Close menu when a menu link is clicked
        const menuLinks = menu.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
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

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    warning = document.querySelector('.desktop-warning');

    // Initialize features
    handleDesktopWarning();
    initMobileMenu();

    // Add debounced resize handler
    window.addEventListener('resize', debounce(handleDesktopWarning, 100));
}); 