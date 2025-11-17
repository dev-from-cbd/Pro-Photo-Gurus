// Simple image slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    if (totalSlides === 0) return;
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    if (totalSlides === 0) return;
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance slider every 4 seconds
if (totalSlides > 0) {
    showSlide(0);
    setInterval(nextSlide, 4000);
}

// Smooth scrolling for same-page navigation links only
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const isHashLink = href && href.startsWith('#');
        if (isHashLink) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        // Close mobile menu after click
        const nav = document.querySelector('nav');
        if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            const toggle = document.querySelector('.menu-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Mobile-friendly parallax (enables parallax on small screens where CSS fixed isn't supported)
if (window.innerWidth <= 768) {
    const parallaxElements = document.querySelectorAll('.parallax');

    // Ensure scroll-based background movement
    parallaxElements.forEach(el => {
        el.style.backgroundAttachment = 'scroll';
        el.style.backgroundPosition = 'center center';
    });

    let ticking = false;

    function updateParallax() {
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const speed = 0.35; // slightly softer for mobile
            let offset = (rect.top - window.innerHeight / 2) * speed;
            // Clamp offset to avoid exposing empty areas
            const maxShift = Math.min(90, el.offsetHeight * 0.25);
            if (offset > maxShift) offset = maxShift;
            if (offset < -maxShift) offset = -maxShift;
            el.style.backgroundPosition = `center calc(50% + ${Math.round(offset)}px)`;
        });
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Initial paint
    onScroll();
}

// Hamburger menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navEl = document.querySelector('nav');
if (menuToggle && navEl) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navEl.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close menu on Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navEl.classList.contains('open')) {
            navEl.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}