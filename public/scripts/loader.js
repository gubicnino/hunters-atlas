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

    // ✅ Initialize login icon state on load
    initializeLoginIcon();

    // ✅ Enhanced click handler with state management
    if (loginTrigger) {
        loginTrigger.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Add loading state
            loginTrigger.classList.add('loading');
            
            try {
                // Check if Supabase is available
                if (!window.supabase) {
                    throw new Error('Authentication service not available');
                }

                const { data: { user }, error } = await window.supabase.auth.getUser();
                
                if (error) {
                    console.warn('Auth check error:', error);
                }
                
                if (user) {
                    // User is logged in - show user menu or logout option
                    showUserMenu(user);
                } else {
                    // User not logged in - show login modal
                    if (loginModal) {
                        loginModal.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                        
                        // Focus on email input for better UX
                        const emailInput = document.getElementById('loginEmail');
                        if (emailInput) {
                            setTimeout(() => emailInput.focus(), 100);
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                // Fall back to showing login modal
                if (loginModal) {
                    loginModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            } finally {
                loginTrigger.classList.remove('loading');
            }
        });
    }

    // Close modal when X is clicked
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            closeModal();
        });
    }

    // Close modal when clicking outside of it
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeModal();
            }
        });
        
        // ✅ Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginModal.style.display === 'block') {
                closeModal();
            }
        });
    }

    // ✅ Enhanced form submission with better error handling
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const errorDiv = document.getElementById('loginError');
            const successDiv = document.getElementById('loginSuccess');
            const submitButton = loginForm.querySelector('button[type="submit"]');
            
            // Clear previous messages
            if (errorDiv) {
                errorDiv.style.display = 'none';
                errorDiv.textContent = '';
            }
            if (successDiv) {
                successDiv.style.display = 'none';
                successDiv.textContent = '';
            }
            
            // Validation
            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            // Add loading state to submit button
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Signing in...';
            submitButton.classList.add('loading');
            
            try {
                if (!window.supabase) {
                    throw new Error('Authentication service not available');
                }

                const { data, error } = await window.supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    throw error;
                }
                
                // ✅ Successful login
                console.log('User logged in:', data.user);
                
                const userName = data.user.user_metadata?.full_name || 
                               data.user.user_metadata?.name || 
                               data.user.email.split('@')[0];
                
                showSuccess(`Welcome back, ${userName}!`);
                
                // Update login icon state
                updateLoginIcon(data.user);
                
                // Show login notification
                showLoginNotification();
                
                // Clear form
                loginForm.reset();
                
                // Close modal after short delay
                setTimeout(() => {
                    closeModal();
                    if (successDiv) successDiv.style.display = 'none';
                }, 1500);
                
            } catch (error) {
                console.error('Error during login:', error);
                
                let errorMessage = 'An error occurred. Please try again.';
                
                // ✅ Better error messages
                if (error.message.includes('Invalid login credentials')) {
                    errorMessage = 'Invalid email or password. Please check your credentials.';
                } else if (error.message.includes('Email not confirmed')) {
                    errorMessage = 'Please check your email and confirm your account first.';
                } else if (error.message.includes('Too many requests')) {
                    errorMessage = 'Too many login attempts. Please wait a moment and try again.';
                } else if (error.message.includes('Network')) {
                    errorMessage = 'Network error. Please check your internet connection.';
                }
                
                showError(errorMessage);
            } finally {
                // Reset submit button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.classList.remove('loading');
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
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // ✅ Listen for auth state changes
    if (window.supabase) {
        window.supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            if (event === 'SIGNED_IN' && session?.user) {
                updateLoginIcon(session.user);
                showLoginNotification();
            } else if (event === 'SIGNED_OUT') {
                updateLoginIcon(null);
            }
        });
    }

    // ✅ Helper functions
    function closeModal() {
        if (loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Clear any error/success messages
        const errorDiv = document.getElementById('loginError');
        const successDiv = document.getElementById('loginSuccess');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    }

    function showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    function showSuccess(message) {
        const successDiv = document.getElementById('loginSuccess');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ✅ Initialize login icon state
function initializeLoginIcon() {
    const loginIcon = document.getElementById('prijava');
    if (!loginIcon) return;
    
    // Set initial tooltip
    loginIcon.setAttribute('data-tooltip', 'Click to login');
    
    // Check if user is already logged in
    if (window.supabase) {
        window.supabase.auth.getUser().then(({ data: { user }, error }) => {
            if (user && !error) {
                updateLoginIcon(user);
            } else {
                updateLoginIcon(null);
            }
        }).catch(error => {
            console.warn('Error checking initial auth state:', error);
            updateLoginIcon(null);
        });
    }
}

// ✅ Update login icon based on user state
function updateLoginIcon(user) {
    const loginIcon = document.getElementById('prijava');
    if (!loginIcon) return;
    
    if (user) {
        const userName = user.user_metadata?.full_name || 
                        user.user_metadata?.name || 
                        user.email.split('@')[0];
        
        loginIcon.setAttribute('data-tooltip', `Logged in as ${userName}`);
        loginIcon.classList.add('logged-in');
        
        // Update icon if needed
        const icon = loginIcon.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-user-check';
        }
    } else {
        loginIcon.setAttribute('data-tooltip', 'Click to login');
        loginIcon.classList.remove('logged-in');
        
        // Reset icon
        const icon = loginIcon.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-user';
        }
    }
}

// ✅ Show login notification
function showLoginNotification() {
    const loginIcon = document.getElementById('prijava');
    if (!loginIcon) return;
    
    // Remove any existing notification
    const existingNotification = loginIcon.querySelector('.login-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification badge
    const notification = document.createElement('span');
    notification.className = 'login-notification';
    notification.textContent = '✓';
    
    loginIcon.appendChild(notification);
    loginIcon.classList.add('has-notification');
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        loginIcon.classList.remove('has-notification');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ✅ Show user menu (placeholder for future implementation)
function showUserMenu(user) {
    // For now, just log the user info
    console.log('User menu for:', user.email);
    
    // You can implement a dropdown menu here in the future
    // For now, we'll show a simple alert or console log
    const userName = user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    user.email.split('@')[0];
    
    // Simple confirmation for logout
    if (confirm(`Hello ${userName}! Would you like to sign out?`)) {
        logout();
    }
}

// ✅ Logout function
async function logout() {
    const loginIcon = document.getElementById('prijava');
    
    try {
        if (loginIcon) loginIcon.classList.add('loading');
        
        if (window.supabase) {
            const { error } = await window.supabase.auth.signOut();
            if (error) throw error;
        }
        
        console.log('User logged out successfully');
        updateLoginIcon(null);
        
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Error signing out. Please try again.');
    } finally {
        if (loginIcon) loginIcon.classList.remove('loading');
    }
}