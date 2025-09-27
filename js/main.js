// Accessibility live region helper (global)
window.a11yAnnounce = window.a11yAnnounce || function (msg) {
    const live = document.getElementById('a11y-status');
    if (!live) return;
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 50);
};

// Function to load and display courses
async function loadCourses() {
    try {
        const response = await fetch('courses.json');
        const data = await response.json();
        const coursesGrid = document.getElementById('coursesGrid');
        coursesGrid.innerHTML = '';

        const fmt = (val) => {
            if (val === undefined || val === null) return '';
            const s = String(val).trim();
            const up = s.toUpperCase();
            if (!s || up === 'N/A' || up === 'N-D' || up === 'N/D') return '';
            return s;
        };

        data.courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card fade-in-up';
            card.style.cursor = 'pointer';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Apri dettagli corso: ${course.title}`);

            const courseDetails = [];
            const d = fmt(course.duration);
            const s = fmt(course.students);
            const l = fmt(course.level);
            const a = fmt(course.audience);
            if (d) courseDetails.push(d);
            if (s) courseDetails.push(s);
            if (l) courseDetails.push(l);
            if (a) courseDetails.push(a);

            const tagsHtml = course.tags ? course.tags.map(tag => `<span>${tag}</span>`).join('') : '';

            card.innerHTML = `
                <div class="course-header">
                    <span class="course-platform">${course.platformIcon || course.platformicon || ''} ${course.platform}</span>
                    <span class="course-date">${course.date}</span>
                </div>
                <h3 class="course-title">${course.title}</h3>
                <div class="course-details">${courseDetails.join('<span></span>')}</div>
                <p class="course-description">${course.description}</p>
                <div class="course-tags">${tagsHtml}</div>
            `;

            const openModal = (openerEl) => {
                const modal = document.getElementById('courseModal');
                const modalContent = modal.querySelector('.modal-content');
                const modalBody = document.getElementById('modalBody');
                const duration = fmt(course.duration) || 'N/D';
                const level = fmt(course.level) || 'N/D';
                const students = fmt(course.students) || 'N/D';
                modalBody.innerHTML = `
                    <h2 id="courseModalTitle">${course.title}</h2>
                    <p><strong>Piattaforma:</strong> ${course.platform}</p>
                    <p><strong>Durata:</strong> ${duration}</p>
                    <p><strong>Livello:</strong> ${level}</p>
                    <p><strong>Studenti:</strong> ${students}</p>
                    <p><strong>Data:</strong> ${course.date}</p>
                    <p style="margin-top: 1rem;">${course.description}</p>
                    <p><strong>Tags:</strong> ${tagsHtml}</p>
                `;
                modal.style.display = 'flex';

                // Focus management
                const previouslyFocused = document.activeElement;
                modal.dataset.returnFocus = previouslyFocused ? '1' : '';
                if (previouslyFocused) {
                    modal.dataset.returnSelector = openerEl ? '' : '';
                    modal._returnEl = openerEl || previouslyFocused;
                }

                // Trap focus
                const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                const getFocusable = () => Array.from(modalContent.querySelectorAll(focusableSelectors))
                    .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
                const focusables = getFocusable();
                const first = focusables[0] || modalContent;
                const last = focusables[focusables.length - 1] || modalContent;
                first.focus();
                if (window.a11yAnnounce) {
                    window.a11yAnnounce(`Dettagli corso aperti: ${course.title}`);
                }

                function handleKey(e) {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        closeModal();
                    } else if (e.key === 'Tab') {
                        const f = getFocusable();
                        const firstEl = f[0] || modalContent;
                        const lastEl = f[f.length - 1] || modalContent;
                        if (e.shiftKey && document.activeElement === firstEl) {
                            e.preventDefault();
                            lastEl.focus();
                        } else if (!e.shiftKey && document.activeElement === lastEl) {
                            e.preventDefault();
                            firstEl.focus();
                        }
                    }
                }

                document.addEventListener('keydown', handleKey);

                function closeModal() {
                    modal.style.display = 'none';
                    document.removeEventListener('keydown', handleKey);
                    if (window.a11yAnnounce) {
                        window.a11yAnnounce('Dettagli corso chiusi');
                    }
                    if (modal._returnEl && typeof modal._returnEl.focus === 'function') {
                        modal._returnEl.focus();
                    }
                }
                modal._close = closeModal;
            };

            card.addEventListener('click', () => openModal(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                }
            });

            coursesGrid.appendChild(card);
        });

        // Re-observe for animations
        document.querySelectorAll('.course-card.fade-in-up').forEach(el => observer.observe(el));
    } catch (error) {
        console.error('Errore nel caricamento dei corsi:', error);
        document.getElementById('coursesGrid').innerHTML = '<div class="error">Errore nel caricamento dei corsi</div>';
    }
}

// Smooth scrolling enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    });
});

// Enhanced navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else if (currentScroll < lastScroll && currentScroll < 100) {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// Effetto parallax leggero (senza spingere le sezioni verso il basso)
const parallaxSections = Array.from(document.querySelectorAll('.parallax-section'))
    .filter(s => !['certifications', 'education', 'contact'].includes(s.id));
window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        parallaxSections.forEach(section => {
            const distance = window.pageYOffset - section.offsetTop;
            const speed = 0.15;
            const raw = distance * speed;
            const offset = Math.max(-60, Math.min(0, raw));
            if (Math.abs(distance) < window.innerHeight * 1.5) {
                section.style.transform = `translateY(${offset}px)`;
            }
        });
    });
});

// Intersection Observer for scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '-50px 0px -50px 0px' };
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('parallax-section')) {
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);
document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .parallax-section').forEach(el => observer.observe(el));

// Initialize smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'visible' : 'hidden';
    });
    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'visible';
    }));
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'visible';
        }
    });
}

// Load courses when page is ready
document.addEventListener('DOMContentLoaded', loadCourses);

// Close modal
const closeBtn = document.getElementById('closeModal');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('courseModal');
        if (modal && modal._close) modal._close();
    });
}
const courseModal = document.getElementById('courseModal');
if (courseModal) {
    courseModal.addEventListener('click', (e) => {
        if (e.target.id === 'courseModal') {
            const modal = document.getElementById('courseModal');
            if (modal && modal._close) modal._close();
        }
    });
}

// Theme toggle
document.addEventListener('DOMContentLoaded', () => {
    const icon = document.getElementById('themeToggleIcon');
    if (!icon) return;
    icon.setAttribute('role', 'button');
    icon.setAttribute('aria-label', 'Cambia tema');
    const announce = window.a11yAnnounce || function (msg) {
        const live = document.getElementById('a11y-status');
        if (!live) return;
        live.textContent = '';
        setTimeout(() => { live.textContent = msg; }, 50);
    };
    const updateIcon = () => {
        const isDark = document.body.classList.contains('dark-theme');
        // Show sun in dark mode (to switch to light), moon in light mode (to switch to dark)
        icon.textContent = isDark ? '🌞' : '🌙';
        icon.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        icon.setAttribute('title', isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro');
    };
    const applyTheme = (makeDark, persist = true) => {
        document.body.classList.toggle('dark-theme', makeDark);
        if (persist) {
            localStorage.setItem('theme', makeDark ? 'dark' : 'light');
        }
        updateIcon();
        announce(makeDark ? 'Tema scuro attivato' : 'Tema chiaro attivato');
    };
    icon.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        applyTheme(!isDark);
    });
    icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const isDark = document.body.classList.contains('dark-theme');
            applyTheme(!isDark);
        }
    });
    // Preferenza salvata o tema di sistema come default
    const saved = localStorage.getItem('theme');
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (saved === 'dark' || saved === 'light') {
        applyTheme(saved === 'dark', false);
    } else if (mq && typeof mq.matches === 'boolean') {
        applyTheme(mq.matches, false);
        // Aggiorna automaticamente al cambio del sistema se non c'è preferenza utente
        try {
            const onSystemChange = (e) => {
                if (!localStorage.getItem('theme')) {
                    applyTheme(e.matches, false);
                }
            };
            if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
            else if (mq.addListener) mq.addListener(onSystemChange);
        } catch (_) { /* no-op */ }
    } else {
        applyTheme(false, false); // fallback: light
    }
});

// Dynamic Italian date in the presentation letter
const monthsIt = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const today = new Date();
const mese = monthsIt[today.getMonth()];
const giorno = today.getDate();
const anno = today.getFullYear();
const dynamicDateEl = document.getElementById('dynamic-date');
if (dynamicDateEl) {
    dynamicDateEl.textContent = `Pesaro, ${giorno} ${mese} ${anno}`;
}
