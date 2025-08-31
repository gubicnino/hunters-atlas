//import { createClient } from '@supabase/supabase-js'
//
//// Create a single supabase client for interacting with your database
//const supabase = createClient('https://yiigftkuuhtkdpsjspkf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaWdmdGt1dWh0a2Rwc2pzcGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjE5NjgsImV4cCI6MjA2NjU5Nzk2OH0.SEDHd8u7jzzEQj3ytsPB-HwwKEHDHRVEB65XUm7h-pU')
//
$(document).ready(function() {
    loadSupabase();
    loadFontAwesome();
    loadGoogleFonts();

    $("#header").load("header.html", () => {
        // Initialize login modal AFTER header is loaded
        initLoginModal();
    });
    
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

function loadSupabase() {
    // Check if Supabase is already loaded
    if (!document.querySelector('script[src*="supabase-js"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = function() {
            // Create global supabase client after script loads
            window.supabase = window.supabase.createClient(
                'https://yiigftkuuhtkdpsjspkf.supabase.co', 
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaWdmdGt1dWh0a2Rwc2pzcGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjE5NjgsImV4cCI6MjA2NjU5Nzk2OH0.SEDHd8u7jzzEQj3ytsPB-HwwKEHDHRVEB65XUm7h-pU'
            );
            console.log('Supabase client loaded globally');
            
            // ✅ Dispatch event to notify other scripts that Supabase is ready
            window.dispatchEvent(new CustomEvent('supabaseReady'));
        };
        document.head.appendChild(script);
    } else {
        // If Supabase is already loaded, dispatch the event immediately
        window.dispatchEvent(new CustomEvent('supabaseReady'));
    }
}
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
function initLoginModal() {
    // Get modal elements
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginTrigger = document.getElementById('prijava');
    const loginForm = document.getElementById('loginForm');

    // Show modal when user icon is clicked
    if (loginTrigger) {
        loginTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) {
                loginModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    }

    // Close modal when X is clicked
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            if (loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        });
    }

    // Close modal when clicking outside of it
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Handle form submission with Supabase
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorDiv = document.getElementById('loginError');
            const successDiv = document.getElementById('loginSuccess');

            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                } else {
                   // Successful login
                    console.log('User logged in:', data.user);
                    successDiv.textContent = `Successful login, ${data.user.display_name}!`;
                    successDiv.style.display = 'block';
                    
                    // Clear form
                    loginForm.reset();
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        loginModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        successDiv.style.display = 'none';
                    }, 2000);
                }
            } catch (error) {
                console.error('Error during login:', error);
                errorDiv.textContent = 'An error occurred. Please try again.';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}