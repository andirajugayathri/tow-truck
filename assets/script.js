
class TowTruckCarousel {
    constructor() {
        this.slidesContainer = document.getElementById('towtrk-slides');
        this.indicators = document.querySelectorAll('.towtrk-indicator');
        this.currentSlide = 0;
        this.isDesktop = window.innerWidth >= 768;
        this.totalSlides = this.isDesktop ? 2 : 5;

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCarousel();
        this.startAutoPlay();

        // Handle resize
        window.addEventListener('resize', () => {
            const wasDesktop = this.isDesktop;
            this.isDesktop = window.innerWidth >= 768;

            if (wasDesktop !== this.isDesktop) {
                this.totalSlides = this.isDesktop ? 2 : 6;
                this.currentSlide = 0;
                this.updateCarousel();
            }
        });
    }

    bindEvents() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (this.isDesktop && index >= 2) return;
                if (!this.isDesktop && index >= 6) return;

                this.currentSlide = index;
                this.updateCarousel();
                this.resetAutoPlay();
            });
        });
    }

    updateCarousel() {
        this.indicators.forEach((indicator, index) => {
            if (this.isDesktop) {
                indicator.style.display = index < 2 ? 'block' : 'none';
                indicator.classList.toggle('active', index === this.currentSlide);
            } else {
                indicator.style.display = index < 6 ? 'block' : 'none';
                indicator.classList.toggle('active', index === this.currentSlide);
            }
        });
        const translateX = -this.currentSlide * 100;
        this.slidesContainer.style.transform = `translateX(${translateX}%)`;
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new TowTruckCarousel();
});

// Testimonials
const carousel = new bootstrap.Carousel(document.getElementById('testimonialsCarousel'), {
    interval: 5000,
    ride: 'carousel'
});

function nextSlide() {
    carousel.next();
    updateControlButtons();
}

function previousSlide() {
    carousel.prev();
    updateControlButtons();
}

function updateControlButtons() {
    const controls = document.querySelectorAll('.carousel-control-custom');
    controls.forEach(control => control.classList.remove('active'));

    setTimeout(() => {
        controls[1].classList.add('active');
    }, 100);
}
document.getElementById('testimonialsCarousel').addEventListener('slid.bs.carousel', function () {
    updateControlButtons();
});
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
    });
});


// form validations
let correctCaptchaAnswer = 0;

function showForm(formType) {
    const singleForm = document.getElementById('singleTruckForm');
    const multipleForm = document.getElementById('multipleTruckForm');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const validationSummary = document.getElementById('validationSummary');

    if (validationSummary) {
        validationSummary.style.display = 'none';
    }

    if (singleForm) singleForm.classList.remove('active');
    if (multipleForm) multipleForm.classList.remove('active');
    toggleBtns.forEach(btn => btn.classList.remove('active'));

    if (formType === 'single' && singleForm) {
        singleForm.classList.add('active');
        if (toggleBtns[0]) toggleBtns[0].classList.add('active');
        clearValidation(singleForm);
    } else if (formType === 'multiple' && multipleForm) {
        multipleForm.classList.add('active');
        if (toggleBtns[1]) toggleBtns[1].classList.add('active');
        clearValidation(multipleForm);
    }

    generateCaptcha();
}

// Clear validation states
function clearValidation(form) {
    if (!form) return;
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = '';
        }
    });
}

// CAPTCHA function
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let question = `${num1} ${operator} ${num2}`;
    correctCaptchaAnswer = eval(question);

    const captchaQuestions = document.querySelectorAll('[id*="captcha"], .captcha-question');
    captchaQuestions.forEach(element => {
        if (['SPAN', 'P', 'DIV'].includes(element.tagName)) {
            element.textContent = `What is ${question}?`;
        }
    });

    const captchaInputs = document.querySelectorAll('input[name="captcha"], input[name*="captcha"]');
    captchaInputs.forEach(input => {
        input.value = '';
        input.classList.remove('is-invalid', 'is-valid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = '';
        }
    });
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

function validateRegistration(reg) {
    const regRegex = /^[A-Z0-9]{3,8}$/i;
    return regRegex.test(reg.replace(/\s/g, ''));
}

function validatePostcode(postcode) {
    const postcodeRegex = /^\d{4}$/;
    return postcodeRegex.test(postcode);
}

function validateCurrency(value) {
    const currencyRegex = /^\$?[\d,]+(\.\d{2})?$/;
    return currencyRegex.test(value.replace(/\s/g, ''));
}

function validateTruckDetails(details) {
    const parts = details.trim().split(/\s+/);
    return parts.length >= 3 && /\d{4}/.test(details);
}

function validateCaptcha(answer) {
    return parseInt(answer) === correctCaptchaAnswer;
}

// Real-time validation
function setupRealTimeValidation() {
    const forms = document.querySelectorAll('form, .quote-form, #singleTruckForm, #multipleTruckForm');

    forms.forEach(form => {
        if (!form) return;
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.removeEventListener('blur', handleFieldValidation);
            input.removeEventListener('input', handleFieldInput);

            input.addEventListener('blur', handleFieldValidation);
            input.addEventListener('input', handleFieldInput);
        });
    });
}

function handleFieldValidation(event) {
    validateField(event.target);
}

function handleFieldInput(event) {
    if (event.target.classList.contains('is-invalid')) {
        validateField(event.target);
    }
}

function validateField(field) {
    if (!field) return true;

    const value = field.value.trim();
    const fieldName = field.name || field.id || '';
    const fieldType = field.type || '';
    const feedback = field.nextElementSibling;
    let isValid = true;
    let message = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required.';
    }
    else if ((fieldType === 'email' || fieldName.toLowerCase().includes('email')) && value && !validateEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
    }
    else if ((fieldType === 'tel' || fieldName.toLowerCase().includes('phone') || fieldName.toLowerCase().includes('contact') || fieldName.toLowerCase().includes('mobile')) && value && !validatePhone(value)) {
        isValid = false;
        message = 'Please enter a valid phone number.';
    }
    else if ((fieldName.toLowerCase().includes('name') || fieldName.toLowerCase().includes('firstname') || fieldName.toLowerCase().includes('lastname') || fieldName.toLowerCase().includes('full_name') || fieldName.toLowerCase().includes('full-name')) && value) {
        const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
        if (!nameRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only).';
        }
    }
    else if (fieldName.toLowerCase().includes('captcha') && value) {
        if (!validateCaptcha(value)) {
            isValid = false;
            message = 'Incorrect answer. Please try again.';
        }
    }

    if (isValid) {
        field.classList.remove('is-invalid');
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = '';
        }
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }
    }

    return isValid;
}

// Form submission validation
function setupFormSubmission() {
    const forms = document.querySelectorAll('form, .quote-form, #singleTruckForm, #multipleTruckForm');

    forms.forEach(form => {
        if (!form) return;
        form.removeEventListener('submit', handleFormSubmit);
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const isValid = validateForm(form);

    if (isValid) {
        const validationSummary = document.getElementById('validationSummary');
        if (validationSummary) {
            validationSummary.style.display = 'none';
        }

        const submitBtn = form.querySelector('.submit-btn') ||
            form.querySelector('button[type="submit"]') ||
            form.querySelector('input[type="submit"]') ||
            form.querySelector('[type="submit"]');

        let originalText = 'Submit';
        if (submitBtn) {
            originalText = submitBtn.textContent || submitBtn.value || 'Submit';
            if (submitBtn.textContent !== undefined) {
                submitBtn.textContent = 'Submitting...';
            } else if (submitBtn.value !== undefined) {
                submitBtn.value = 'Submitting...';
            }
            submitBtn.disabled = true;
        }

        const formData = new FormData(form);
        console.log('Form is valid, submitting with data:', Object.fromEntries(formData));

        const bypassInput = document.createElement('input');
        bypassInput.type = 'hidden';
        bypassInput.name = 'validation_bypass';
        bypassInput.value = 'true';
        form.appendChild(bypassInput);

        form.removeEventListener('submit', handleFormSubmit);
        form.submit();

        setTimeout(() => {
            form.addEventListener('submit', handleFormSubmit);
            if (submitBtn) {
                if (submitBtn.textContent !== undefined) {
                    submitBtn.textContent = originalText;
                } else if (submitBtn.value !== undefined) {
                    submitBtn.value = originalText;
                }
                submitBtn.disabled = false;
            }
            generateCaptcha();
        }, 100);
    } else {
        console.log('Form validation failed');
    }
}

function validateForm(form) {
    if (!form) return false;

    const inputs = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    const errors = [];

    inputs.forEach(input => {
        if (input.hasAttribute('required') || input.value.trim()) {
            const isFieldValid = validateField(input);
            if (!isFieldValid && input.hasAttribute('required')) {
                isFormValid = false;
                const label = getFieldLabel(input);
                if (label && !errors.includes(label)) {
                    errors.push(label);
                }
            }
        }
    });

    const captchaInputs = form.querySelectorAll('input[name="captcha"], input[name*="captcha"]');
    captchaInputs.forEach(captchaInput => {
        if (!captchaInput.value.trim()) {
            isFormValid = false;
            errors.push('CAPTCHA verification');
            captchaInput.classList.add('is-invalid');
            const feedback = captchaInput.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = 'Please complete the CAPTCHA verification.';
            }
        } else if (!validateCaptcha(captchaInput.value.trim())) {
            isFormValid = false;
            errors.push('CAPTCHA verification');
            generateCaptcha();
        }
    });

    showValidationSummary(isFormValid, errors);

    return isFormValid;
}

function getFieldLabel(input) {
    let label = '';

    if (input.id) {
        const labelElement = document.querySelector(`label[for="${input.id}"]`);
        if (labelElement) {
            label = labelElement.textContent;
        }
    }

    if (!label) {
        const container = input.closest('.col-md-4, .col-md-12, .form-group, .field');
        if (container) {
            const labelElement = container.querySelector('label');
            if (labelElement) {
                label = labelElement.textContent;
            }
        }
    }

    if (!label) {
        label = input.name || input.placeholder || 'Field';
    }

    return label.replace('*', '').trim();
}

function showValidationSummary(isFormValid, errors) {
    const validationSummary = document.getElementById('validationSummary');
    const validationList = document.getElementById('validationList');

    if (validationSummary && validationList) {
        if (!isFormValid && errors.length > 0) {
            validationList.innerHTML = '';
            errors.forEach(error => {
                const li = document.createElement('li');
                li.textContent = error;
                validationList.appendChild(li);
            });
            validationSummary.style.display = 'block';
            validationSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            validationSummary.style.display = 'none';
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing form validation...');
    setupRealTimeValidation();
    setupFormSubmission();
    generateCaptcha();

    const forms = document.querySelectorAll('form, .quote-form, #singleTruckForm, #multipleTruckForm');
    console.log('Found forms:', forms.length);
    forms.forEach((form, index) => {
        console.log(`Form ${index + 1}:`, form.id || form.className || 'unnamed');
    });
});
function reinitializeValidation() {
    setupRealTimeValidation();
    setupFormSubmission();
    generateCaptcha();
}

document.addEventListener('DOMContentLoaded', function () {
    const moreText = document.getElementById("more-text");
    const readMoreBtn = document.getElementById("read-more-btn");
    const readLessBtn = document.getElementById("read-less-btn");

    if (readMoreBtn && readLessBtn && moreText) {
        function toggleReadMore(e) {
            e.preventDefault();
            if (moreText.style.display === "none" || moreText.style.display === "") {
                moreText.style.display = "inline";
                readMoreBtn.style.display = "none";
                readLessBtn.style.display = "inline";
            } else {
                moreText.style.display = "none";
                readMoreBtn.style.display = "inline";
                readLessBtn.style.display = "none";
            }
        }

        readMoreBtn.addEventListener('click', toggleReadMore);
        readLessBtn.addEventListener('click', toggleReadMore);
    }
});
