
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const registerError = document.getElementById('registerError');
    const registerSuccess = document.getElementById('registerSuccess');
    const btnText = registerBtn.querySelector('.btn-text');
    const spinner = registerBtn.querySelector('.spinner-border');

    // Password toggle functionality
    setupPasswordToggle('toggleRegisterPassword', 'registerPassword');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

    // Form validation
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value !== passwordInput.value) {
            this.setCustomValidity('Passwords do not match');
        } else {
            this.setCustomValidity('');
        }
    });

    // Handle form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('registerEmail').value.trim();
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Hide previous messages
        hideMessage(registerError);
        hideMessage(registerSuccess);

        // Validate form
        if (!validateForm(email, username, password, confirmPassword, agreeTerms)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Sign up user with Supabase
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        display_name: username
                    }
                }
            });

            if (error) {
                throw error;
            }

            // Success
            showMessage(registerSuccess, 'Account created successfully!');
            registerForm.reset();
            
            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = 'An error occurred during registration. Please try again.';
            
            if (error.message.includes('already registered')) {
                errorMessage = 'This email is already registered. Please use a different email or try signing in.';
            } else if (error.message.includes('Password')) {
                errorMessage = 'Password must be at least 6 characters long.';
            } else if (error.message.includes('email')) {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showMessage(registerError, errorMessage);
        } finally {
            setLoadingState(false);
        }
    });

    function validateForm(email, username, password, confirmPassword, agreeTerms) {
        if (!email || !username || !password || !confirmPassword) {
            showMessage(registerError, 'Please fill in all required fields.');
            return false;
        }

        if (password !== confirmPassword) {
            showMessage(registerError, 'Passwords do not match.');
            return false;
        }

        if (password.length < 6) {
            showMessage(registerError, 'Password must be at least 6 characters long.');
            return false;
        }

        if (username.length < 3) {
            showMessage(registerError, 'Username must be at least 3 characters long.');
            return false;
        }

        if (!agreeTerms) {
            showMessage(registerError, 'You must agree to the Terms of Service and Privacy Policy.');
            return false;
        }

        return true;
    }

    function setLoadingState(loading) {
        if (loading) {
            registerBtn.disabled = true;
            btnText.textContent = 'Creating Account...';
            spinner.classList.remove('d-none');
        } else {
            registerBtn.disabled = false;
            btnText.textContent = 'Create Account';
            spinner.classList.add('d-none');
        }
    }

    function showMessage(element, message) {
        element.textContent = message;
        element.classList.remove('d-none');
    }

    function hideMessage(element) {
        element.classList.add('d-none');
    }

    function setupPasswordToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        
        if (toggle && input) {
            toggle.addEventListener('click', function() {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                const icon = toggle.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }
    }
});