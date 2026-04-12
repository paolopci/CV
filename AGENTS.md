# AGENTS.md - CV Paolo Paci

## 1. Scopo e Ambito

- Questo file definisce le istruzioni operative per agenti e contributor che lavorano in questo repository.
- Ambito: l'intero repository radicato nella cartella corrente.
- Progetto: sito statico del CV di Paolo Paci, in lingua italiana.
- Architettura: frontend client-side, senza backend e senza segreti.
- Eventuali `AGENTS.md` annidati hanno precedenza nella propria sottostruttura.

## 2. Regole di Collaborazione

- Applica le regole comuni definite in [_shared/regole-collaborazione.md](./_shared/regole-collaborazione.md).
- Chat, aggiornamenti e interazioni di progetto devono essere rigorosamente in italiano.
- Il progetto usa la metodologia Conductor, documentata nella cartella `conductor/`, per sviluppo guidato da specifiche e track.

## 3. Workflow Operativo

- Applica il workflow comune definito in [_shared/workflow-operativo.md](./_shared/workflow-operativo.md).
- Prima di modificare file, analizza il task e presenta una checklist di 1-7 punti.
- Usa `🟩` per i punti aperti e `🟨 ~~testo~~` per quelli completati.
- Alla fine della checklist chiedi: `Confermi lo step X? oppure si step all`.
- Se l'utente conferma un singolo step, esegui solo quello step e valida l'esito in 1-2 frasi.
- Se l'utente scrive `si step all`, esegui tutti gli step rimanenti senza ulteriori richieste di conferma.
- In chiusura, testa, riformatta il codice quando applicabile e proponi eventuali refactoring solo alla fine.
- Se per test o operazioni necessarie servono permessi piu elevati, usa permessi piu elevati secondo il flusso autorizzativo disponibile.

## 4. Struttura del Progetto e Organizzazione dei Moduli

- `index.html`: entry point del sito; include AI UI, GitHub widget, JSON-LD, navbar, landmark `main`, skip link e modali accessibili.
- `css/index.css`: stili globali, Glassmorphism, animazioni e tema scuro.
- `js/main.js`: logica UI core, AI Assistant, knowledge base, GitHub API, cache/retry del widget GitHub e scroll observer.
- `js/hero-code-bg.js`: iniettore dell'animazione di codice nell'hero.
- `tests/`: suite Jest per validare la logica JavaScript.
- `package.json`: dipendenze e script dell'ambiente di test.
- `courses.json`: sorgente dati per la sezione `Certificazioni & Corsi`.
- `images/`: asset immagine, inclusi foto profilo e infografiche WebP/PNG.
- `Paolo Paci.pdf`: CV scaricabile.
- `conductor/`: documentazione di progetto, product guide, tech stack, guidelines e track.
- `archive/`: track completati e file legacy.
- `_shared/`: moduli condivisi richiamati da questo file.

## 5. Comandi di Build, Test e Sviluppo

- Server locale: `python -m http.server 8080`, poi apri `http://localhost:8080`.
- Test automatici: `npm test`.
- Validazione HTML: usare W3C validator quando si modifica markup significativo.
- Test rapido manuale: anchor, skip link, modale corsi, modali infografiche, toggle tema persistente, menu mobile e scroll fluido.
- AI Assistant: verifica apertura chat, invio messaggio, chip FAQ cliccabili, risposte basate sulla knowledge base e fallback educato.
- GitHub Widget: verifica caricamento eventi, cache locale, fallback offline e diagnostica solo in sviluppo.
- Dati: se modifichi `courses.json`, ricarica la pagina e controlla la console per confermare JSON valido.

## 6. Stile del Codice e Convenzioni di Naming

- Indentazione: 4 spazi per HTML e CSS.
- Wrapping consigliato: circa 100 caratteri quando migliora leggibilita.
- JavaScript: preferire funzioni globali per testabilita, esponendole su `window` quando necessario per Jest.
- CSS: usare classi descrittive o BEM-like.
- CSS: mantenere l'uso di variabili custom, `rgba` e `backdrop-filter` coerente con il Glassmorphism esistente.
- AI Knowledge Base: usare record strutturati in `aiKnowledgeBase` con `id`, `category`, `priority`, `aliases`, `keywords` e `answer`.
- Per modifiche UI, intervenire principalmente su `css/index.css` seguendo lo stile esistente.
- GitHub Widget: mantenere cache versionata con TTL 6 ore, retry con exponential backoff e dati di esempio coerenti con il portfolio.

## 7. Linee Guida per i Test e Accessibilita

- Mantieni copertura Jest maggiore dell'80% per nuove logiche JavaScript.
- Per nuove informazioni nel chatbot, aggiorna i record di `aiKnowledgeBase` in `js/main.js` e aggiungi o aggiorna test in `tests/ai.test.js`.
- Il matching AI usa `normalizeAIInput()`, `findBestAIEntry()` e scoring deterministico: preferisci alias specifici e keyword mirate per evitare risposte ambigue.
- I chip FAQ dell'assistente sono in `index.html` dentro `#ai-suggestions`; se li modifichi, aggiorna la gestione in `initAIChat()` e i test in `tests/chat.test.js`.
- Quando cambi `css/index.css` o `js/main.js` per funzionalita visibili, aggiorna il query string cache-buster in `index.html` se serve forzare il refresh browser.
- Per modifiche al widget GitHub, aggiorna `tests/github.test.js` coprendo cache, retry, payload non valido, fallback e dettagli errore sviluppo/produzione.
- Se l'informazione e visibile nel sito, mantieni allineati `index.html`, knowledge base AI e JSON-LD.
- Verifica responsivita, effetto magnetico e chatbot su diversi viewport quando tocchi UI o layout.
- A11y: mantieni `main#main-content`, skip link, `nav[aria-label="Navigazione principale"]`, titoli coerenti e ruoli semantici non ridondanti.
- A11y immagini: usa `alt` significativi per immagini informative e `alt=""` o `aria-hidden="true"` per icone decorative dentro link gia testuali.
- A11y dinamica: usa `window.a11yAnnounce()` e mantieni `#a11y-status` fuori dalle aree nascoste quando si aprono modali.
- A11y modali: conserva `openAccessibleModal()`/`closeAccessibleModal()`, `aria-modal`, `aria-labelledby`, `aria-describedby`, ritorno focus al trigger e trap Tab/Shift+Tab/Escape.
- Contrasto: mantieni conformita WCAG 2.1 AA, almeno 4.5:1 per testo normale e 3:1 per testo grande o componenti UI; verifica tema chiaro e scuro.
- Test accessibilita: aggiorna `tests/modal-accessibility.test.js` per focus trap/live region dei modali e `tests/theme.test.js` per annunci del toggle tema.
- Tema: il toggle in `js/main.js` deve persistere la scelta in `localStorage.theme` con valori `dark`/`light`, leggere la preferenza salvata all'avvio e usare `prefers-color-scheme` solo come fallback iniziale.
- Tema: gli accessi a `localStorage` devono essere tolleranti a errori, mantenendo il toggle funzionante anche se la preferenza non puo essere letta o salvata.
- Tema: aggiorna sempre `data-mode`, `aria-pressed`, `aria-label`, `title`, infografiche `data-dark`/`data-light` e annunci accessibili quando cambia lo stato.
- Tema: assicurati che trasparenze e contrasti siano leggibili sia in tema chiaro sia in tema scuro.

## 8. Linee Guida per Commit e Pull Request

- Commit in italiano, brevi e orientati all'azione.
- Esempi: `feat(ai): add info laurea`, `fix(ui): modal close button`.
- Mantieni cambi mirati e coerenti con il task.
- Non committare mai `node_modules/`.
- Prima di proporre commit, verifica lo stato Git e separa eventuali modifiche non correlate.

## 9. Suggerimenti su Sicurezza e Configurazione

- Applica le regole comuni definite in [_shared/sicurezza-configurazione.md](./_shared/sicurezza-configurazione.md).
- Il sito e solo client-side: non introdurre backend, segreti o chiavi API lato client.
- Il widget GitHub usa dati pubblici da `api.github.com/users/paolopci/events/public`.
- Non introdurre token GitHub, segreti o chiavi API: il widget deve restare resiliente tramite cache locale, retry e fallback client-side.
- `index.html` include JSON-LD `Person`: mantieni le informazioni di contatto allineate con la knowledge base dell'AI.
- Conductor: aggiorna `conductor/setup_state.json` durante i setup quando il flusso Conductor lo richiede.

## 10. Flusso di Collaborazione

- Applica il flusso comune definito in [_shared/flusso-collaborazione.md](./_shared/flusso-collaborazione.md).
- Le istruzioni dirette dell'utente e del sistema hanno sempre priorita su questo file.
- Le regole locali di questo `AGENTS.md` prevalgono sui moduli `_shared` quando specificano dettagli propri del repository.
- In caso di conflitto tra moduli `_shared`, prevale [_shared/workflow-operativo.md](./_shared/workflow-operativo.md).
