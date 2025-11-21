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

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('nav ul li a[href$="real-estate/"]').forEach(function (a) {
        var li = a.closest('li');
        if (li) li.remove();
    });

    var footerLinks = document.querySelector('footer .footer-links');
    var footerEl = document.querySelector('footer');
    if (footerLinks && footerEl) {
        var path = location.pathname;
        var isRoot = /\/index\.html$|\/$/.test(path);
        var isRealEstate = /\/real-estate\//.test(path);
        var isService = /\/services\//.test(path);
        var base = '';
        if (!isRoot) {
            if (isRealEstate) base = '..';
            else if (isService) base = '../..';
        }

        var services = [
            ['Portraits & Headshots', 'services/portraits/'],
            ['Love Story & Pre‑Wedding', 'services/love-story/'],
            ['Families & Kids', 'services/families-kids/'],
            ['Branding & Social', 'services/branding-social/'],
            ['Products & Advertising', 'services/products-advertising/'],
            ['Retouching & Post‑production', 'services/retouching/'],
            ['Events & Lifestyle', 'services/events-lifestyle/'],
            ['Pets', 'services/pets/'],
            ['Corporate Teams', 'services/corporate-teams/'],
            ['Studio Portraits', 'services/studio-portraits/'],
            ['Fashion & Editorial', 'services/fashion-editorial/'],
            ['Real Estate', 'real-estate/']
        ];

        var sections = document.createElement('div');
        sections.className = 'footer-sections';

        var wrap = document.createElement('div');
        wrap.className = 'footer-services';
        var title = document.createElement('h4');
        title.textContent = 'Services';
        wrap.appendChild(title);
        services.forEach(function (item) {
            var a = document.createElement('a');
            a.href = base ? base + '/' + item[1] : item[1];
            a.textContent = item[0];
            wrap.appendChild(a);
        });

        sections.appendChild(wrap);
        footerEl.appendChild(sections);

        // Rebuild quick links rows: remove Contact and split Discounts/Franchise
        var allLinks = Array.from(footerLinks.querySelectorAll('a'));
        // Remove Contact
        allLinks.forEach(function(a){
            if ((a.textContent || '').trim() === 'Contact') a.remove();
        });
        // Collect again after removal
        allLinks = Array.from(footerLinks.querySelectorAll('a'));
        var primaryRow = document.createElement('div');
        primaryRow.className = 'footer-links-primary';
        var secondaryRow = document.createElement('div');
        secondaryRow.className = 'footer-links-secondary';
        // Move anchors into rows preserving icons
        allLinks.forEach(function(a){
            var text = (a.textContent || '').trim();
            if (text === 'Discounts' || text === 'Franchise') {
                secondaryRow.appendChild(a);
            } else {
                primaryRow.appendChild(a);
            }
        });
        // Clear original and append rows
        footerLinks.innerHTML = '';
        footerLinks.appendChild(primaryRow);
        footerLinks.appendChild(secondaryRow);

        var note = footerEl.querySelector('.note');
        if (note) {
            footerEl.appendChild(note);
        }
    }
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

// Gallery lightbox
const galleryImages = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-image') : null;
const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

if (galleryImages && lightbox && lightboxImg) {
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
        });
    });
    const closeFn = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        if (lightboxImg) lightboxImg.src = '';
    };
    if (lightboxClose) lightboxClose.addEventListener('click', closeFn);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeFn();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeFn();
    });
}

// Franchise language toggle
const langToggle = document.getElementById('lang-toggle');
const frBlocks = document.querySelectorAll('.fr-content');
if (langToggle && frBlocks.length) {
    langToggle.querySelectorAll('a[data-lang]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = link.getAttribute('data-lang');
            frBlocks.forEach(b => {
                const isTarget = b.getAttribute('data-lang') === lang;
                b.style.display = isTarget ? 'block' : 'none';
            });
        });
    });
}