/**
 * Babulu Digamarti - Portfolio Script
 * Handles scroll-triggered navigation reveal, mobile overlay menu,
 * scroll animations, and interactive contact form.
 */

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('main-header');
    const menuBtn = document.getElementById('menu-btn');
    const overlay = document.getElementById('overlay');
    const closeOverlayBtn = document.getElementById('close-overlay-btn');
    const overlayLinks = document.querySelectorAll('.overlay-link');
    const scrollPrompt = document.getElementById('scroll-prompt');
    const contactForm = document.getElementById('contact-form');

    // 1. Initial State & Scroll Trigger for Header Navigation
    // The header and menu icons remain completely hidden at the top/opening screen.
    // They are smoothly introduced only when the user scrolls down.
    function updateHeaderOnScroll() {
        const scrollThreshold = 90; // pixels from the top
        if (window.scrollY > scrollThreshold) {
            mainHeader.classList.remove('nav-hidden');
            mainHeader.classList.add('nav-visible');
        } else {
            mainHeader.classList.remove('nav-visible');
            mainHeader.classList.add('nav-hidden');
        }
    }

    // Run immediately on page load in case page is refreshed at scrolled position
    updateHeaderOnScroll();

    // Listen to scroll events
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

    // 2. Click on Scroll Prompt to smoothly scroll into normal portfolio structure
    if (scrollPrompt) {
        scrollPrompt.addEventListener('click', () => {
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 3. Mobile Navigation Overlay
    if (menuBtn && overlay) {
        menuBtn.addEventListener('click', () => {
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // prevent background scrolling while menu open
        });
    }

    function closeOverlay() {
        if (overlay) {
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    if (closeOverlayBtn) {
        closeOverlayBtn.addEventListener('click', closeOverlay);
    }

    overlayLinks.forEach(link => {
        link.addEventListener('click', closeOverlay);
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const animatedElements = document.querySelectorAll('.study, .exp, .project-card, .skill-category, .contact-info-card');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in-element');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const elementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // once revealed, keep visible
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        elementObserver.observe(el);
    });

    // 5. Contact Form Handler
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            const emailSubject = encodeURIComponent(`Portfolio Inquiry: ${subject} (from ${name})`);
            const emailBody = encodeURIComponent(`Hello Babulu,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);

            const mailtoUrl = `mailto:babulu8520@gmail.com?subject=${emailSubject}&body=${emailBody}`;

            window.location.href = mailtoUrl;

            // Optional user notification
            alert(`Thank you, ${name}! Your email client will now open to send your message directly to Babulu.`);
            contactForm.reset();
        });
    }
});