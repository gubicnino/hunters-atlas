$(document).ready(function() {
    loadFontAwesome();
    loadGoogleFonts();


    $("#header").load("header.html");
    $("#footer").load("footer.html", () => {
        setCurrentYear();
    });
    
    // Add event listener for navbar toggler
    document.addEventListener('DOMContentLoaded', () => {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarCollapse.style.transition = 'none';
            navbarToggler.addEventListener('click', () => {
                requestAnimationFrame(() => {
                    navbarCollapse.classList.toggle('show');
                    navbarToggler.classList.toggle('collapsed');
                });
            });
        }
    });
});


function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function loadFontAwesome() {
    // Check if Font Awesome is already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }
}

function loadGoogleFonts() {
    // Check if Google Fonts are already loaded
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap';
        document.head.appendChild(link);
    }
}