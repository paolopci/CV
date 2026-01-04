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
                    tagsRow.appendChild(document.createTextNode(' â€”'));
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

    const aiKnowledgeBase = {
        "email": "Puoi scrivere a Paolo all'indirizzo paolopci@yahoo.it.",
        "telefono": "Il numero di telefono di Paolo è +39 328 3834012.",
        "cellulare": "Puoi contattare Paolo al numero +39 328 3834012.",
        "recapito": "Il numero di Paolo è +39 328 3834012 e la sua email è paolopci@yahoo.it.",
        "linkedin": "Trovi il profilo LinkedIn di Paolo qui: https://www.linkedin.com/in/paolo-paci-a89b7438/",
        "partita iva": "No, Paolo non ha la Partita IVA. È interessato a collaborazioni come lavoratore dipendente o tramite altre forme contrattuali previste per i professionisti.",
        "p.iva": "Paolo non possiede una Partita IVA.",
        "piva": "Paolo non possiede una Partita IVA.",
        "lavoro": "Paolo è disponibile per collaborazioni Full-Remote o Ibride. Predilige l'assunzione diretta in azienda con contratto Full-Time.",
        "remoto": "Sì, Paolo è disponibile per posizioni Full-Remote o Ibride.",
        "ibrido": "Paolo valuta opportunità in modalità ibrida o full-remote.",
        "sede": "Paolo è disponibile per lavoro Full-Remote o Ibrido.",
        "contratto": "Paolo predilige l'assunzione diretta in azienda a tempo pieno (Full-Time).",
        "assunzione": "Paolo cerca preferibilmente un'assunzione diretta in azienda.",
        "naspi": "Sì, Paolo è attualmente percettore NASpI, il che può comportare significativi incentivi contributivi per l'azienda che assume.",
        "percettore": "Paolo è percettore NASpI (incentivi assunzione disponibili).",
        "laurea": "Paolo è laureato in Ingegneria Elettronica presso l'Università di Bologna (1991), con una tesi sul controllo in tempo reale in ambiente Matlab/Simulink.",
        "laureato": "Sì, Paolo è laureato in Ingegneria Elettronica presso l'Università di Bologna.",
        "studi": "Paolo ha conseguito la laurea in Ingegneria Elettronica all'Università di Bologna e continua a formarsi costantemente con corsi specialistici su .NET e Angular.",
        ".net": "Paolo ha oltre 10 anni di esperienza con l'ecosistema Microsoft. È esperto di .NET Core 6/8, ASP.NET Core MVC e Web API.",
        "angular": "Paolo utilizza Angular (attualmente v18+) per lo sviluppo frontend, con forte competenza in TypeScript, RxJS e Signals.",
        "ai": "Recentemente Paolo ha integrato modelli OpenAI in applicazioni enterprise, occupandosi di prompt engineering e integrazione API.",
        "soft skills": "Oltre alle competenze tecniche, Paolo possiede ottime doti di problem solving, attitudine al team working, proattività e una naturale curiosità verso l'innovazione.",
        "carattere": "Paolo è una persona equilibrata, proattiva e con ottime capacità comunicative e relazionali.",
        "skills": "Le competenze principali di Paolo includono: .NET Core, C#, Angular, SQL Server, Entity Framework, Microservizi, Docker e Integrazione AI.",
        "competenze": "Le competenze principali di Paolo includono: .NET Core, C#, Angular, SQL Server, Entity Framework, Microservizi, Docker e Integrazione AI.",
        "chi sei": "Sono l'assistente virtuale di Paolo Paci. Posso darti informazioni sulla sua carriera, competenze e progetti.",
        "contatti": "Puoi contattare Paolo via email (paolopci@yahoo.it), telefono (+39 328 3834012) o su LinkedIn.",
        "default": "Interessante! Paolo ha molta esperienza in quell'ambito. Vuoi sapere di più sulla sua carriera o sulle sue competenze tecniche?"
    };
function getAIResponse(input) {
    if (!input) return aiKnowledgeBase.default;
    const lowerInput = input.toLowerCase();
    for (const key in aiKnowledgeBase) {
        if (lowerInput.includes(key)) return aiKnowledgeBase[key];
    }
    return aiKnowledgeBase.default;
}

window.getAIResponse = getAIResponse;

// AI Chat Assistant UI Logic
function initAIChat() {
    const fab = document.getElementById('ai-fab');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('ai-send-btn');
    const userInput = document.getElementById('ai-user-input');
    const messagesContainer = document.getElementById('ai-chat-messages');

    if (!fab || !chatWindow || !closeBtn || !sendBtn || !userInput || !messagesContainer) return;

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `ai-message ${sender}`;
        msg.textContent = text;
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const handleSend = () => {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = '';

        // Simulate thinking
        setTimeout(() => {
            const response = getAIResponse(text);
            addMessage(response, 'assistant');
        }, 600);
    };

    fab.addEventListener('click', () => {
        const isVisible = chatWindow.style.display !== 'none';
        chatWindow.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            userInput.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

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
