**Checklist Rapida**
- Avvia server: `python -m http.server 8080` e apri `http://localhost:8080`.
- Test rapido: anchor, modale corsi, toggle tema, menu mobile, scroll fluido.
- **AI Assistant**: verifica apertura chat, invio messaggio e risposte (knowledge base).
- **GitHub Widget**: verifica caricamento ultimi eventi nel portfolio.
- **Testing**: esegui `npm test` per validare logica AI e UI.
- Dati: se modifichi `courses.json`, ricarica e controlla la console (JSON valido).
- A11y: titoli coerenti, `alt` significativi, live region `#a11y-status`, focus trap del modale.
- Commit: messaggi brevi in IT; cambi mirati; escludi `node_modules` (usare `.gitignore`).

**Workflow & Interaction**
- **Lingua**: Chat e interazioni di progetto rigorosamente in Italiano.
- **Metodologia**: Il progetto utilizza la metodologia **Conductor** (v. cartella `conductor/`) per lo sviluppo guidato da specifiche e track.
- **Procedura di Modifica**:
  1. **Analisi**: Identificare la modifica da eseguire.
  2. **Checklist**: Prima di procedere, presentare una lista (1-7 punti) usando 🟩 per i punti aperti e 🟨 (con testo barrato) per i completati. Alla fine chiedere: "Confermi lo step X? oppure si step all".
  3. **Esecuzione**: Richiedere conferma per ogni step; validare l'esito con 1-2 frasi dopo ogni modifica.
     Se l'utente scrive "si step all", eseguire tutti gli step rimanenti senza ulteriori richieste di conferma. Questa regola ha priorità rispetto alle conferme step-by-step.
  4. **Chiusura**: Testare, riformattare il codice e proporre eventuali refactoring solo alla fine.

**Purpose & Scope**
- Istruzioni operative per agenti e contributor che lavorano in questo repository.
- Ambito: l'intero repository radicato nella cartella corrente.
- Precedenza: eventuali `AGENTS.md` annidati hanno precedenza nella propria sottostruttura. Le istruzioni dirette di utente/sviluppatore hanno sempre priorità.

**Project Overview**
- Sito statico del CV di Paolo Paci (lingua: Italiano).
- Frontend moderno con AI Assistant, scrollytelling e integrazione GitHub.
- Solo client-side; nessun backend né segreti.

**Structure**
- `index.html`: entry point del sito (include AI UI, GitHub widget, JSON-LD, navbar).
- `css/index.css`: stili globali, Glassmorphism, animazioni, tema scuro.
- `js/main.js`: logica UI core, AI Assistant (knowledge base), GitHub API, scroll observer.
- `conductor/`: documentazione di progetto (Product Guide, Tech Stack, Guidelines, Tracks).
- `tests/`: suite di test Jest per validare la logica JavaScript.
- `package.json`: dipendenze per l'ambiente di test (Jest).
- `js/hero-code-bg.js`: iniettore dell'animazione di codice nell'hero.
- `images/`: asset immagine (foto profilo, infografiche WebP/PNG).
- `courses.json`: sorgente dati per la sezione "Certificazioni & Corsi".
- `Paolo Paci.pdf`: CV scaricabile.
- `archive/`: track completati e file legacy.

**Run & Validate**
- Server locale: `python -m http.server 8080` e apri `http://localhost:8080`.
- **Esecuzione Test**: `npm test` (richiede Node.js installato).
- Validazione HTML: W3C validator.
- Test rapido: navigazione, modale corsi, toggle tema, chatbot AI, widget GitHub.

**Coding Style**
- Indentazione: 4 spazi per HTML/CSS; wrapping ~100 caratteri.
- JavaScript: Preferire funzioni globali per testabilità (attaccate a `window` se necessario per Jest).
- CSS: Classi BEM-like o descrittive; uso intensivo di variabili CSS e `backdrop-filter`.
- AI Knowledge Base: Mantenere le chiavi ordinate per specificità per evitare conflitti di parsing.

**Testing & Accessibility**
- **Jest**: Mantenere la copertura >80% per le nuove logiche JS in `tests/`.
- Responsività: Verificare l'effetto magnetico e il chatbot su diversi viewport.
- A11y: Live region `#a11y-status` per feedback dinamici (es. attivazione tema, invio messaggi AI).
- Tema: Assicurarsi che le trasparenze (Glassmorphism) siano leggibili in entrambi i temi.

**AI Assistant — Gestione Knowledge Base**
- La logica risiede in `js/main.js` sotto `aiKnowledgeBase`.
- Per aggiungere informazioni (es. nuove esperienze o dettagli contrattuali), aggiornare l'oggetto JSON e aggiungere il relativo test case in `tests/ai.test.js`.

**Commits & PRs**
- Stile commit: orientato all'azione in IT. Es.: `feat(ai): add info laurea`, `fix(ui): modal close button`.
- **Importante**: Non committare mai `node_modules/` (già escluso in `.gitignore`).

**Agent Tips**
- Per modifiche alla UI: intervenire su `css/index.css` (Glassmorphism usa `rgba` e `blur`).
- Per nuove info nel chatbot: aggiornare `aiKnowledgeBase` in `js/main.js` e riflettere le info in `index.html` se necessario.
- Per il widget GitHub: i dati vengono presi da `api.github.com/users/paolopci/events/public`.
- Conductor: aggiornare sempre lo stato in `conductor/setup_state.json` durante i setup.

**SEO & Dati Strutturati**
- `index.html` include JSON-LD `Person`. Tenere allineate le info di contatto con la knowledge base dell'AI.
