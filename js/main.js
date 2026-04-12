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

        const createSvgIcon = (symbolId, extraClass = '') => {
            const cleanId = fmt(symbolId);
            if (!cleanId) return null;
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const classes = ['icon'];
            if (extraClass) classes.push(extraClass);
            svg.setAttribute('class', classes.join(' '));
            svg.setAttribute('aria-hidden', 'true');
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttribute('href', `#${cleanId}`);
            svg.appendChild(use);
            return svg;
        };

        const createDetailChip = (text) => {
            const s = fmt(text);
            if (!s) return null;
            const chip = document.createElement('span');
            chip.className = 'detail-chip';
            const match = s.match(/^([0-9]+(?:[.,][0-9]+)?\+?K?)\s*(.*)$/i);
            if (match) {
                const valueEl = document.createElement('span');
                valueEl.className = 'detail-value';
                valueEl.textContent = match[1];
                chip.appendChild(valueEl);
                if (match[2]) {
                    chip.appendChild(document.createTextNode(` ${match[2]}`));
                }
            } else {
                chip.textContent = s;
            }
            return chip;
        };

        const createTagsFragment = (tags = []) => {
            const fragment = document.createDocumentFragment();
            tags.forEach(tag => {
                const cleanTag = fmt(tag);
                if (!cleanTag) return;
                const span = document.createElement('span');
                span.textContent = cleanTag;
                fragment.appendChild(span);
            });
            return fragment;
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

            const header = document.createElement('div');
            header.className = 'course-header';

            const platformSpan = document.createElement('span');
            platformSpan.className = 'course-platform';
            const platformIcon = createSvgIcon(course.platformIcon, 'icon-platform');
            if (platformIcon) {
                platformSpan.appendChild(platformIcon);
                platformSpan.appendChild(document.createTextNode(' '));
            }
            const platformName = fmt(course.platform) || '';
            platformSpan.appendChild(document.createTextNode(platformName));

            const dateSpan = document.createElement('span');
            dateSpan.className = 'course-date';
            dateSpan.textContent = fmt(course.date);

            header.appendChild(platformSpan);
            header.appendChild(dateSpan);

            const titleEl = document.createElement('h3');
            titleEl.className = 'course-title';
            titleEl.textContent = fmt(course.title) || 'Corso';

            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'course-details';
            courseDetails.forEach(chipHtml => {
                const chip = createDetailChip(chipHtml);
                if (chip) detailsContainer.appendChild(chip);
            });

            const description = document.createElement('p');
            description.className = 'course-description';
            description.textContent = fmt(course.description);

            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'course-tags';
            tagsContainer.appendChild(createTagsFragment(course.tags || []));

            card.appendChild(header);
            card.appendChild(titleEl);
            card.appendChild(detailsContainer);
            card.appendChild(description);
            card.appendChild(tagsContainer);

            const openModal = (openerEl) => {
                const modal = document.getElementById('courseModal');
                const modalContent = modal.querySelector('.modal-content');
                const modalBody = document.getElementById('modalBody');
                const duration = fmt(course.duration) || 'N/D';
                const level = fmt(course.level) || 'N/D';
                const students = fmt(course.students) || 'N/D';
                const platform = fmt(course.platform) || 'N/D';
                const date = fmt(course.date) || 'N/D';
                const title = fmt(course.title) || 'Corso';
                const descriptionText = fmt(course.description) || '';

                const makeInfoRow = (label, value) => {
                    const p = document.createElement('p');
                    const strong = document.createElement('strong');
                    strong.textContent = `${label}:`;
                    p.appendChild(strong);
                    p.appendChild(document.createTextNode(` ${value}`));
                    return p;
                };

                modalBody.innerHTML = '';

                const titleEl = document.createElement('h2');
                titleEl.id = 'courseModalTitle';
                titleEl.textContent = title;

                const descriptionEl = document.createElement('p');
                descriptionEl.style.marginTop = '1rem';
                descriptionEl.textContent = descriptionText;

                const tagsRow = document.createElement('p');
                const tagsLabel = document.createElement('strong');
                tagsLabel.textContent = 'Tags:';
                tagsRow.appendChild(tagsLabel);
                const tagsFragment = createTagsFragment(course.tags || []);
                if (tagsFragment.childNodes.length) {
                    tagsRow.appendChild(document.createTextNode(' '));
                    tagsRow.appendChild(tagsFragment);
                } else {
                    tagsRow.appendChild(document.createTextNode(' Nessun tag'));
                }

                modalBody.appendChild(titleEl);
                modalBody.appendChild(makeInfoRow('Piattaforma', platform));
                modalBody.appendChild(makeInfoRow('Durata', duration));
                modalBody.appendChild(makeInfoRow('Livello', level));
                modalBody.appendChild(makeInfoRow('Studenti', students));
                modalBody.appendChild(makeInfoRow('Data', date));
                modalBody.appendChild(descriptionEl);
                modalBody.appendChild(tagsRow);

                modal.style.display = 'flex';
                modal.setAttribute('aria-hidden', 'false');
                const previousOverflow = document.body.style.overflow;
                modal._previousBodyOverflow = previousOverflow;
                document.body.style.overflow = 'hidden';

                const hiddenSiblings = [];
                Array.from(document.body.children).forEach((el) => {
                    if (el === modal || el.id === 'a11y-status' || el.id === 'codebg-status') return;
                    if (el.tagName === 'SCRIPT' || el.classList.contains('icon-defs')) return;
                    const prev = el.getAttribute('aria-hidden');
                    hiddenSiblings.push({ el, prev });
                    el.setAttribute('aria-hidden', 'true');
                });
                modal._hiddenSiblings = hiddenSiblings;

                // Focus management
                const previouslyFocused = document.activeElement;
                modal._returnEl = openerEl || previouslyFocused;

                // Trap focus
                const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                const getFocusable = () => Array.from(modalContent.querySelectorAll(focusableSelectors))
                    .filter(el => !el.hasAttribute('disabled'));
                const focusables = getFocusable();
                const first = focusables[0] || modalContent;
                const last = focusables[focusables.length - 1] || modalContent;
                setTimeout(() => first.focus(), 0);
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

                function handleFocusIn(e) {
                    if (!modalContent.contains(e.target)) {
                        const f = getFocusable();
                        (f[0] || modalContent).focus();
                    }
                }

                document.addEventListener('keydown', handleKey);
                document.addEventListener('focusin', handleFocusIn);

                function closeModal() {
                    modal.style.display = 'none';
                    modal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = modal._previousBodyOverflow || '';
                    if (modal._hiddenSiblings) {
                        modal._hiddenSiblings.forEach(({ el, prev }) => {
                            if (prev === null || prev === undefined) {
                                el.removeAttribute('aria-hidden');
                            } else {
                                el.setAttribute('aria-hidden', prev);
                            }
                        });
                    }
                    document.removeEventListener('keydown', handleKey);
                    document.removeEventListener('focusin', handleFocusIn);
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

// Effetto parallax disattivato: mantieni lo stacco tra le sezioni durante lo scroll.

// Intersection Observer for scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '-50px 0px -50px 0px' };
const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right, .parallax-section').forEach(el => observer.observe(el));

// Accordion per la timeline: una sola card aperta alla volta
const timelineDetails = Array.from(document.querySelectorAll('#experience .timeline-item'));
timelineDetails.forEach((detail) => {
    detail.addEventListener('toggle', () => {
        if (!detail.open) {
            return;
        }
        timelineDetails.forEach((other) => {
            if (other !== detail && other.open) {
                other.open = false;
            }
        });
    });
});

// Initialize smooth scroll behavior
// Smooth behavior gestito via CSS (evita duplicazioni)

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
if (mobileMenu && navLinks) {
    const setMenuState = (isOpen) => {
        mobileMenu.classList.toggle('active', isOpen);
        navLinks.classList.toggle('active', isOpen);
        mobileMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileMenu.setAttribute('aria-label', isOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione');
        document.body.style.overflow = isOpen ? 'hidden' : 'visible';
    };

    mobileMenu.addEventListener('click', () => {
        setMenuState(!mobileMenu.classList.contains('active'));
    });

    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            setMenuState(false);
        }
    }));

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && mobileMenu.classList.contains('active')) {
            setMenuState(false);
        }
    });
}

// Theme toggle logic
function initTheme() {
    const icon = document.getElementById('themeToggleIcon');
    if (!icon) return;
    icon.setAttribute('aria-pressed', 'false');
    const announce = window.a11yAnnounce || function (msg) {
        const live = document.getElementById('a11y-status');
        if (!live) return;
        live.textContent = '';
        setTimeout(() => { live.textContent = msg; }, 50);
    };
    const updateIcon = () => {
        const isDark = document.body.classList.contains('dark-theme');
        icon.dataset.mode = isDark ? 'dark' : 'light';
        icon.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        const label = isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro';
        icon.setAttribute('aria-label', label);
        icon.setAttribute('title', label);
    };
    const updateInfographicTheme = () => {
        const isDark = document.body.classList.contains('dark-theme');
        const sources = document.querySelectorAll('[data-dark][data-light]');
        sources.forEach((el) => {
            const src = isDark ? el.getAttribute('data-dark') : el.getAttribute('data-light');
            if (!src) return;
            if (el.tagName.toLowerCase() === 'source') {
                if (el.getAttribute('srcset') !== src) {
                    el.setAttribute('srcset', src);
                }
            } else if (el.tagName.toLowerCase() === 'img') {
                if (el.getAttribute('src') !== src) {
                    el.setAttribute('src', src);
                }
            }
        });
    };
    const applyTheme = (makeDark, persist = true) => {
        document.body.classList.toggle('dark-theme', makeDark);
        if (persist) {
            localStorage.setItem('theme', makeDark ? 'dark' : 'light');
        }
        updateIcon();
        updateInfographicTheme();
        announce(makeDark ? 'Tema scuro attivato' : 'Tema chiaro attivato');
    };
    icon.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        applyTheme(!isDark);
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
            if (mq.addEventListener) {
                mq.addEventListener('change', onSystemChange);
            } else if (mq.addListener) {
                mq.addListener(onSystemChange);
            }
        } catch (_) {
            /* no-op */
        }
    } else {
        applyTheme(false, false); // fallback: light
    }
}

window.initTheme = initTheme;

function initInfoskillsModal() {
    const trigger = document.getElementById('infoskillsTrigger');
    const modal = document.getElementById('infoskillsModal');
    if (!trigger || !modal) return;

    const modalContent = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.modal-close');
    const announce = window.a11yAnnounce || function () { };
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const openModal = (openerEl) => {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
        const previousOverflow = document.body.style.overflow;
        modal._previousBodyOverflow = previousOverflow;
        document.body.style.overflow = 'hidden';

        const hiddenSiblings = [];
        Array.from(document.body.children).forEach((el) => {
            if (el === modal || el.id === 'a11y-status' || el.id === 'codebg-status') return;
            if (el.tagName === 'SCRIPT' || el.classList.contains('icon-defs')) return;
            const prev = el.getAttribute('aria-hidden');
            hiddenSiblings.push({ el, prev });
            el.setAttribute('aria-hidden', 'true');
        });
        modal._hiddenSiblings = hiddenSiblings;

        const previouslyFocused = document.activeElement;
        modal._returnEl = openerEl || previouslyFocused;

        const getFocusable = () => Array.from(modalContent.querySelectorAll(focusableSelectors))
            .filter(el => !el.hasAttribute('disabled'));
        const focusables = getFocusable();
        const first = focusables[0] || modalContent;
        const last = focusables[focusables.length - 1] || modalContent;
        setTimeout(() => first.focus(), 0);
        announce('Infografica competenze aperta');

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

        function handleFocusIn(e) {
            if (!modalContent.contains(e.target)) {
                const f = getFocusable();
                (f[0] || modalContent).focus();
            }
        }

        modal._keyHandler = handleKey;
        modal._focusHandler = handleFocusIn;
        document.addEventListener('keydown', handleKey);
        document.addEventListener('focusin', handleFocusIn);
    };

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = modal._previousBodyOverflow || '';
        if (modal._hiddenSiblings) {
            modal._hiddenSiblings.forEach(({ el, prev }) => {
                if (prev === null || prev === undefined) {
                    el.removeAttribute('aria-hidden');
                } else {
                    el.setAttribute('aria-hidden', prev);
                }
            });
        }
        if (modal._keyHandler) document.removeEventListener('keydown', modal._keyHandler);
        if (modal._focusHandler) document.removeEventListener('focusin', modal._focusHandler);
        announce('Infografica competenze chiusa');
        if (modal._returnEl && typeof modal._returnEl.focus === 'function') {
            modal._returnEl.focus();
        }
    }

    modal._close = closeModal;

    trigger.addEventListener('click', () => openModal(trigger));
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(trigger);
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal());
    }

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'infoskillsModal') {
            closeModal();
        }
    });
}

function initInfoPercorsoModal() {
    const trigger = document.getElementById('infoPercorsoTrigger');
    const modal = document.getElementById('infoPercorsoModal');
    if (!trigger || !modal) return;

    const modalContent = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.modal-close');
    const announce = window.a11yAnnounce || function () { };
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const openModal = (openerEl) => {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
        const previousOverflow = document.body.style.overflow;
        modal._previousBodyOverflow = previousOverflow;
        document.body.style.overflow = 'hidden';

        const hiddenSiblings = [];
        Array.from(document.body.children).forEach((el) => {
            if (el === modal || el.id === 'a11y-status' || el.id === 'codebg-status') return;
            if (el.tagName === 'SCRIPT' || el.classList.contains('icon-defs')) return;
            const prev = el.getAttribute('aria-hidden');
            hiddenSiblings.push({ el, prev });
            el.setAttribute('aria-hidden', 'true');
        });
        modal._hiddenSiblings = hiddenSiblings;

        const previouslyFocused = document.activeElement;
        modal._returnEl = openerEl || previouslyFocused;

        const getFocusable = () => Array.from(modalContent.querySelectorAll(focusableSelectors))
            .filter(el => !el.hasAttribute('disabled'));
        const focusables = getFocusable();
        const first = focusables[0] || modalContent;
        const last = focusables[focusables.length - 1] || modalContent;
        setTimeout(() => first.focus(), 0);
        announce('Infografica percorso professionale aperta');

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

        function handleFocusIn(e) {
            if (!modalContent.contains(e.target)) {
                const f = getFocusable();
                (f[0] || modalContent).focus();
            }
        }

        modal._keyHandler = handleKey;
        modal._focusHandler = handleFocusIn;
        document.addEventListener('keydown', handleKey);
        document.addEventListener('focusin', handleFocusIn);
    };

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = modal._previousBodyOverflow || '';
        if (modal._hiddenSiblings) {
            modal._hiddenSiblings.forEach(({ el, prev }) => {
                if (prev === null || prev === undefined) {
                    el.removeAttribute('aria-hidden');
                } else {
                    el.setAttribute('aria-hidden', prev);
                }
            });
        }
        if (modal._keyHandler) document.removeEventListener('keydown', modal._keyHandler);
        if (modal._focusHandler) document.removeEventListener('focusin', modal._focusHandler);
        announce('Infografica percorso professionale chiusa');
        if (modal._returnEl && typeof modal._returnEl.focus === 'function') {
            modal._returnEl.focus();
        }
    }

    modal._close = closeModal;

    trigger.addEventListener('click', () => openModal(trigger));
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(trigger);
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal());
    }

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'infoPercorsoModal') {
            closeModal();
        }
    });
}

// Magnet effect for CTA buttons
function initMagnetButtons() {
    const buttons = document.querySelectorAll('.btn-hero');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Timeline scroll activation
function initTimelineScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -20% 0px'
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                highlightRelatedSkills(entry.target.dataset.relatedSkills);
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => timelineObserver.observe(item));
}

function highlightRelatedSkills(skillsString) {
    // Reset all highlights
    document.querySelectorAll('.skill-category').forEach(el => {
        el.classList.remove('highlight');
    });

    if (!skillsString) return;

    const skills = skillsString.split(' ');
    skills.forEach(skillType => {
        const skillEl = document.getElementById(`skill-${skillType}`);
        if (skillEl) {
            skillEl.classList.add('highlight');
        }
    });
}

const aiKnowledgeBase = [
    {
        id: 'profilo',
        category: 'profilo',
        priority: 85,
        aliases: ['chi sei', 'profilo professionale', 'presentami paolo', 'paolo paci'],
        keywords: ['profilo', 'software engineer', 'ingegnere', 'sviluppatore', 'full stack'],
        answer: 'Sono l\'assistente virtuale di Paolo Paci. Paolo è un Software Engineer full-stack con 10+ anni di esperienza in .NET e Angular, specializzato in backend Microsoft, API RESTful, frontend moderno e integrazione AI.',
    },
    {
        id: 'esperienza',
        category: 'esperienza',
        priority: 100,
        aliases: ['parlami della tua esperienza', 'che esperienza ha paolo', 'esperienza lavorativa', 'carriera professionale', 'team remoto'],
        keywords: ['esperienza', 'carriera', 'lavorato', 'tim', 'aruba', 'qbitsoft', 'global sistemi', 'lasersoft', 'bkn301'],
        answer: 'Paolo ha 10+ anni di esperienza in .NET e Angular. Ha lavorato su progetti full-stack e backend per TIM, Aruba, BKN301, LaserSoft e altri contesti enterprise, con focus su Web API, JWT, data access, e-commerce, servizi digitali e team full-remote.',
    },
    {
        id: 'competenze',
        category: 'profilo',
        priority: 94,
        aliases: ['quali tecnologie usa', 'quali sono le tue skills', 'quali sono le competenze', 'competenze tecniche'],
        keywords: ['skills', 'competenze', 'tecnologie', 'stack tecnico'],
        answer: 'Le competenze principali di Paolo includono: .NET Core, C#, Angular, SQL Server, Entity Framework, Microservizi, Docker e Integrazione AI.',
    },
    {
        id: 'backend',
        category: 'tecnologie-backend',
        priority: 95,
        aliases: ['parlami di .net', 'cosa sa fare con dotnet', 'esperienza backend', 'asp.net core'],
        keywords: ['.net', 'dotnet', 'net', 'c#', 'asp.net', 'aspnet', 'backend', 'web api', 'api rest', 'restful', 'mvc', 'linq', 'automapper', 'microservizi'],
        answer: 'Paolo ha oltre 10 anni di esperienza con l\'ecosistema Microsoft. È esperto di .NET Core 6/8, ASP.NET Core MVC e Web API, C#, LINQ, AutoMapper, architetture RESTful e microservizi.',
    },
    {
        id: 'frontend',
        category: 'frontend',
        priority: 90,
        aliases: ['cosa sa fare con angular', 'esperienza frontend', 'angular e typescript', 'performance frontend'],
        keywords: ['angular', 'typescript', 'javascript', 'rxjs', 'signals', 'html', 'css', 'bootstrap', 'frontend', 'prestazioni'],
        answer: 'Paolo utilizza Angular (attualmente v18+) per lo sviluppo frontend, con forte competenza in TypeScript, RxJS, Signals, HTML5, CSS3 e Bootstrap 5. Cura componenti responsive, accessibilità e performance frontend.',
    },
    {
        id: 'ai',
        category: 'ai',
        priority: 88,
        aliases: ['esperienza con ai', 'esperienza con ia', 'esperienza con intelligenza artificiale', 'openai integration'],
        keywords: ['ai', 'ia', 'openai', 'chatgpt', 'copilot', 'claude', 'codex', 'intelligenza artificiale', 'prompt engineering', 'modelli generativi'],
        answer: 'Paolo ha integrato modelli AI (OpenAI) in applicazioni enterprise e lavora con strumenti come ChatGPT, GitHub Copilot, Claude AI e OpenAI Codex. Il focus è su integrazione API, prompt engineering e automazioni utili allo sviluppo software.',
    },
    {
        id: 'database-cloud',
        category: 'database-cloud',
        priority: 78,
        aliases: ['esperienza database', 'database e cloud', 'sql server'],
        keywords: ['database', 'sql server', 'postgresql', 'mysql', 'mongodb', 'dapper', 'entity framework', 'ef core', 'azure', 'docker', 'containerizzazione'],
        answer: 'Paolo ha esperienza con SQL Server, PostgreSQL e MongoDB, oltre a MySQL. Usa Entity Framework, EF Core e Dapper per il data access, Docker e containerizzazione per i servizi, e Azure (livello base).',
    },
    {
        id: 'testing-devops',
        category: 'testing-devops',
        priority: 75,
        aliases: ['come testa il codice', 'esperienza con test', 'ci cd', 'github actions'],
        keywords: ['test', 'testing', 'xunit', 'jest', 'cypress', 'postman', 'swagger', 'ci/cd', 'github actions', 'pipeline', 'devops', 'serilog', 'seq'],
        answer: 'Paolo usa strumenti di testing come xUnit, Jest e Cypress, oltre a Postman/Swagger per API testing. Nei progetti pubblici cura README tecnici, workflow GitHub Actions e checklist di qualità.',
    },
    {
        id: 'sicurezza',
        category: 'sicurezza',
        priority: 76,
        aliases: ['esperienza sicurezza', 'autenticazione jwt', 'oauth'],
        keywords: ['sicurezza', 'jwt', 'oauth', 'identity', 'cors', 'autenticazione', 'autorizzazione', 'hardening'],
        answer: 'Paolo ha esperienza con JWT, OAuth, ASP.NET Core Identity, configurazioni CORS e hardening di flussi applicativi, in particolare su Web API e contesti e-commerce o servizi digitali regolati.',
    },
    {
        id: 'progetti',
        category: 'progetti',
        priority: 86,
        aliases: ['parlami dei progetti', 'portfolio github', 'progetti github', 'repository principali'],
        keywords: ['progetti', 'portfolio', 'github', 'repository', 'open source', 'mango', 'bookstore', 'dashboard', 'e-commerce'],
        answer: 'Nel portfolio Paolo presenta progetti open-source e repository pubblici full-stack: una serie Mango.* con microservizi ASP.NET Core 8, JWT, Docker e Azure Service Bus; BlazorBookStoreApp, applicazione e-commerce con Blazor WASM e backend ASP.NET Core; una dashboard Angular 18+ orientata ad AI, Signals e RxJS.',
    },
    {
        id: 'formazione',
        category: 'formazione',
        priority: 72,
        aliases: ['sei laureato', 'titolo di studio', 'che studi ha fatto'],
        keywords: ['laurea', 'laureato', 'studi', 'formazione', 'universita', 'bologna', 'ingegneria elettronica', 'matlab', 'simulink', 'corsi'],
        answer: 'Paolo è laureato in Ingegneria Elettronica presso l\'Università di Bologna (1991), con tesi sul controllo in tempo reale in ambiente Matlab/Simulink. Continua ad aggiornarsi con corsi specialistici su .NET, Angular e tecnologie moderne.',
    },
    {
        id: 'disponibilita',
        category: 'disponibilita-contratto',
        priority: 92,
        aliases: ['disponibilita lavorativa', 'lavori in remoto', 'tipo di contratto', 'che contratto cerchi', 'partita iva', 'p.iva', 'piva'],
        keywords: ['disponibilita', 'lavoro', 'remoto', 'full remote', 'ibrido', 'sede', 'contratto', 'assunzione', 'full-time', 'partita iva', 'p.iva', 'piva', 'naspi', 'percettore'],
        answer: 'Paolo è disponibile per collaborazioni Full-Remote o Ibride e predilige l\'assunzione diretta in azienda con contratto Full-Time. Paolo non ha la Partita IVA ed è attualmente percettore NASpI, informazione utile per eventuali incentivi all\'assunzione.',
    },
    {
        id: 'contatti',
        category: 'contatti',
        priority: 98,
        aliases: ['come posso contattarlo', 'contatti', 'email', 'telefono', 'cellulare', 'linkedin', 'recapito'],
        keywords: ['contatto', 'contatti', 'email', 'mail', 'telefono', 'cellulare', 'recapito', 'linkedin', 'scrivere'],
        answer: 'Puoi contattare Paolo via email a paolopci@yahoo.it, al telefono +39 328 3834012 oppure tramite LinkedIn: https://www.linkedin.com/in/paolo-paci-a89b7438/',
    },
    {
        id: 'soft-skills',
        category: 'profilo',
        priority: 70,
        aliases: ['soft skills', 'carattere', 'come lavora paolo'],
        keywords: ['soft skill', 'problem solving', 'team working', 'proattivita', 'comunicazione', 'curiosita'],
        answer: 'Oltre alle competenze tecniche, Paolo evidenzia problem solving, team working, proattività, curiosità verso l\'innovazione e buone capacità comunicative e relazionali.',
    },
];

const aiFallbackResponse = 'Interessante domanda. Posso rispondere con precisione su esperienza, .NET, Angular, AI, progetti, formazione, disponibilità lavorativa e contatti di Paolo. Prova a chiedermi, ad esempio: "Che esperienza ha Paolo?" oppure "Parlami dei progetti".';

function normalizeAIInput(input) {
    return String(input || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s+#./-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, (char) => `\\${char}`);
}

function aiInputContainsTerm(input, term) {
    const normalizedTerm = normalizeAIInput(term);
    if (!normalizedTerm) return false;

    const hasOnlyWordChars = /^[\w\s]+$/.test(normalizedTerm);
    if (!hasOnlyWordChars || normalizedTerm.includes(' ')) {
        return input.includes(normalizedTerm);
    }

    const termRegex = new RegExp(`(^|\\s)${escapeRegExp(normalizedTerm)}($|\\s)`);
    return termRegex.test(input);
}

function scoreAIEntry(normalizedInput, entry) {
    let score = 0;
    const aliases = entry.aliases || [];
    const keywords = entry.keywords || [];

    aliases.forEach((alias) => {
        if (aiInputContainsTerm(normalizedInput, alias)) {
            score += normalizeAIInput(alias) === normalizedInput ? 130 : 95;
        }
    });

    keywords.forEach((keyword) => {
        if (aiInputContainsTerm(normalizedInput, keyword)) {
            score += 28;
        }
    });

    return score > 0 ? score + (entry.priority || 0) / 100 : 0;
}

function findBestAIEntry(input) {
    const normalizedInput = normalizeAIInput(input);
    if (!normalizedInput) return null;

    return aiKnowledgeBase.reduce((best, entry) => {
        const score = scoreAIEntry(normalizedInput, entry);
        if (score < 28) return best;
        if (!best || score > best.score || (score === best.score && entry.priority > best.entry.priority)) {
            return { entry, score };
        }
        return best;
    }, null);
}

function getAIResponse(input) {
    const match = findBestAIEntry(input);
    return match ? match.entry.answer : aiFallbackResponse;
}

window.aiKnowledgeBase = aiKnowledgeBase;
window.normalizeAIInput = normalizeAIInput;
window.findBestAIEntry = findBestAIEntry;
window.getAIResponse = getAIResponse;

// AI Chat Assistant UI Logic
function initAIChat() {
    const fab = document.getElementById('ai-fab');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('ai-send-btn');
    const userInput = document.getElementById('ai-user-input');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const suggestionsContainer = document.getElementById('ai-suggestions');

    if (!fab || !chatWindow || !closeBtn || !sendBtn || !userInput || !messagesContainer) return;

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `ai-message ${sender}`;
        msg.textContent = text;
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        if (sender === 'assistant' && window.a11yAnnounce) {
            window.a11yAnnounce('Risposta dell\'assistente AI aggiunta');
        }
    };

    const handleSend = (presetText = '') => {
        const text = String(presetText || userInput.value).trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = '';

        // Simulate thinking
        setTimeout(() => {
            const response = getAIResponse(text);
            addMessage(response, 'assistant');
        }, 600);
    };

    let lastFocusedEl = null;
    const setChatState = (isOpen, options = {}) => {
        const { focus = true, announce = true } = options;
        chatWindow.style.display = isOpen ? 'flex' : 'none';
        chatWindow.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        fab.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const label = isOpen ? 'Chiudi assistente AI' : 'Apri assistente AI';
        fab.setAttribute('aria-label', label);
        fab.setAttribute('title', isOpen ? 'Chiudi chat' : 'Chiedi all\'AI');

        if (isOpen) {
            lastFocusedEl = document.activeElement;
            if (focus) {
                setTimeout(() => userInput.focus(), 0);
            }
            if (announce && window.a11yAnnounce) {
                window.a11yAnnounce('Assistente AI aperto');
            }
        } else {
            if (announce && window.a11yAnnounce) {
                window.a11yAnnounce('Assistente AI chiuso');
            }
            if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
                lastFocusedEl.focus();
            }
        }
    };

    closeBtn.setAttribute('aria-label', closeBtn.getAttribute('aria-label') || 'Chiudi assistente AI');
    setChatState(chatWindow.style.display !== 'none', { focus: false, announce: false });

    fab.addEventListener('click', () => {
        const isVisible = chatWindow.style.display !== 'none';
        setChatState(!isVisible);
    });

    closeBtn.addEventListener('click', () => {
        setChatState(false);
    });

    chatWindow.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            setChatState(false);
            fab.focus();
        }
    });

    if (suggestionsContainer) {
        suggestionsContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.ai-suggestion-chip');
            if (!chip) return;
            const question = chip.dataset.question || chip.textContent;
            if (window.a11yAnnounce) {
                window.a11yAnnounce(`Domanda rapida inviata: ${question}`);
            }
            handleSend(question);
            userInput.focus();
        });
    }

    sendBtn.addEventListener('click', () => handleSend());
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

window.initAIChat = initAIChat;

// GitHub Activity Logic
const GITHUB_EVENTS_CACHE_KEY = 'githubEventsCache';

function getGitHubCache() {
    try {
        const raw = localStorage.getItem(GITHUB_EVENTS_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.events)) return null;
        return parsed;
    } catch (error) {
        return null;
    }
}

function setGitHubCache(events) {
    if (!Array.isArray(events)) return;
    const payload = {
        updatedAt: Date.now(),
        events: events,
    };
    try {
        localStorage.setItem(GITHUB_EVENTS_CACHE_KEY, JSON.stringify(payload));
    } catch (error) {
        // LocalStorage non disponibile o pieno: fallback silenzioso.
    }
}

function renderGitHubEvents(container, events, options = {}) {
    const note = options.note || '';
    const safeEvents = Array.isArray(events) ? events.slice(0, 5) : [];

    container.innerHTML = '';

    if (note) {
        const noteEl = document.createElement('p');
        noteEl.className = 'github-event-note';
        noteEl.textContent = note;
        container.appendChild(noteEl);
    }

    if (safeEvents.length === 0) {
        const emptyEl = document.createElement('p');
        emptyEl.textContent = 'Nessuna attività pubblica recente trovata.';
        container.appendChild(emptyEl);
        return;
    }

    safeEvents.forEach(event => {
        if (!event || !event.repo || !event.repo.name || !event.created_at) return;

        const eventEl = document.createElement('div');
        eventEl.className = 'github-event';

        let action = '';
        switch (event.type) {
            case 'PushEvent': action = 'Push su'; break;
            case 'CreateEvent': action = 'Creato'; break;
            case 'WatchEvent': action = 'Star su'; break;
            default: action = 'Attivit? su';
        }

        const date = new Date(event.created_at).toLocaleDateString('it-IT');
        const repoName = event.repo.name.replace('paolopci/', '');

        eventEl.innerHTML = `
                <span class="event-date">${date}</span>
                <span class="event-action">${action}</span>
                <a href="https://github.com/${event.repo.name}" target="_blank" class="event-repo">${repoName}</a>
            `;
        container.appendChild(eventEl);
    });
}

async function loadGitHubActivity() {
    const container = document.getElementById('github-activity-content');
    if (!container) return;

    const cached = getGitHubCache();
    const cachedEvents = cached ? cached.events : null;

    try {
        const response = await fetch('https://api.github.com/users/paolopci/events/public');
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const events = await response.json();
        if (!Array.isArray(events)) throw new Error('GitHub payload non valido');

        renderGitHubEvents(container, events);
        setGitHubCache(events);
    } catch (error) {
        console.error('Errore GitHub:', error);
        if (cachedEvents && cachedEvents.length > 0) {
            const lastUpdate = cached && cached.updatedAt
                ? new Date(cached.updatedAt).toLocaleString('it-IT')
                : 'data non disponibile';
            renderGitHubEvents(
                container,
                cachedEvents,
                { note: `Dati offline. Ultimo aggiornamento: ${lastUpdate}.` }
            );
            return;
        }
        container.innerHTML = "<p>Impossibile caricare l'attività di GitHub.</p>";
    }
}

window.getGitHubCache = getGitHubCache;
window.setGitHubCache = setGitHubCache;
window.renderGitHubEvents = renderGitHubEvents;
window.loadGitHubActivity = loadGitHubActivity;
// Initialize components when page is ready
document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
    initInfoskillsModal();
    initInfoPercorsoModal();
    initMagnetButtons();
    initTheme();
    initTimelineScroll();
    initAIChat();
    loadGitHubActivity();

    // Modal closing logic
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





// Typewriter Effect
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.textContent = this.txt;

        // Initial Type Speed
        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Init TypeWriter
document.addEventListener('DOMContentLoaded', () => {
    const txtElement = document.getElementById('typewriter-text');
    if (txtElement) {
        const words = [
            "Software Engineer",
            ".NET Core Specialist",
            "Angular Developer",
            "Solution Architect"
        ];
        new TypeWriter(txtElement, words);
    }
});

// Portfolio Filtering
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-card');

    if (filterButtons.length === 0 || portfolioItems.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const categories = (item.getAttribute('data-category') || '').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.classList.remove('hidden');
                    // Small delay to allow display:block to apply before opacity transition
                    setTimeout(() => {
                        item.classList.remove('fade-out');
                    }, 10);
                } else {
                    item.classList.add('fade-out');
                    // Wait for transition to finish before hiding
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 400); // Matches CSS transition duration
                }
            });
        });
    });
});
