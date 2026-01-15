document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const formMessage = document.getElementById('formMessage');
    const btnSubmit = signupForm.querySelector('.btn-submit');
    const btnText = btnSubmit.querySelector('.btn-text');
    const spinner = btnSubmit.querySelector('.loading-spinner');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Prepare data
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        // 2. Show loading state
        setLoading(true);
        formMessage.className = 'message';
        formMessage.textContent = '';

        try {
            // 3. Make AJAX request
            // For demonstration, we'll simulate a request to an endpoint
            // In a real scenario, this would be your backend API
            const response = await simulateAjaxRequest(data);

            if (response.success) {
                // 4. Action tracking script on success
                if (window.partnerLinkLibrary && typeof window.partnerLinkLibrary.recordSignUpEvent === 'function') {
                    try {
                        const signUpData = window.partnerLinkLibrary.getSignUpDataFromForm('signupForm');
                        if (signUpData) {
                            await window.partnerLinkLibrary.recordSignUpEvent(signUpData);
                            console.log('Tracking event recorded successfully');
                        } else {
                            console.warn('Could not extract sign up data from form for tracking');
                        }
                    } catch (trackError) {
                        console.error('Error recording sign up event:', trackError);
                    }
                } else {
                    console.warn('Tracking script (partnerLinkLibrary) not found or recordSignUpEvent not available.');
                }

                // 5. Show success message
                formMessage.textContent = 'Welcome aboard! We\'ll be in touch soon.';
                formMessage.classList.add('success');
                signupForm.reset();
            } else {
                throw new Error(response.message || 'Something went wrong');
            }
        } catch (error) {
            formMessage.textContent = error.message;
            formMessage.classList.add('error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            btnSubmit.disabled = true;
            btnText.style.display = 'none';
            spinner.style.display = 'block';
        } else {
            btnSubmit.disabled = false;
            btnText.style.display = 'block';
            spinner.style.display = 'none';
        }
    }

    // Simulation helper
    async function simulateAjaxRequest(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('API Request received:', data);
                resolve({ success: true });
            }, 1000);
        });
    }
});
