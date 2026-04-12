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

- `index.html`: entry point del sito; include AI UI, GitHub widget, JSON-LD e navbar.
- `css/index.css`: stili globali, Glassmorphism, animazioni e tema scuro.
- `js/main.js`: logica UI core, AI Assistant, knowledge base, GitHub API e scroll observer.
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
- Test rapido manuale: anchor, modale corsi, toggle tema, menu mobile e scroll fluido.
- AI Assistant: verifica apertura chat, invio messaggio e risposte basate sulla knowledge base.
- GitHub Widget: verifica il caricamento degli ultimi eventi nel portfolio.
- Dati: se modifichi `courses.json`, ricarica la pagina e controlla la console per confermare JSON valido.

## 6. Stile del Codice e Convenzioni di Naming

- Indentazione: 4 spazi per HTML e CSS.
- Wrapping consigliato: circa 100 caratteri quando migliora leggibilita.
- JavaScript: preferire funzioni globali per testabilita, esponendole su `window` quando necessario per Jest.
- CSS: usare classi descrittive o BEM-like.
- CSS: mantenere l'uso di variabili custom, `rgba` e `backdrop-filter` coerente con il Glassmorphism esistente.
- AI Knowledge Base: mantenere le chiavi ordinate per specificita per evitare conflitti di parsing.
- Per modifiche UI, intervenire principalmente su `css/index.css` seguendo lo stile esistente.

## 7. Linee Guida per i Test e Accessibilita

- Mantieni copertura Jest maggiore dell'80% per nuove logiche JavaScript.
- Per nuove informazioni nel chatbot, aggiorna `aiKnowledgeBase` in `js/main.js` e aggiungi o aggiorna test in `tests/ai.test.js`.
- Se l'informazione e visibile nel sito, mantieni allineati `index.html`, knowledge base AI e JSON-LD.
- Verifica responsivita, effetto magnetico e chatbot su diversi viewport quando tocchi UI o layout.
- A11y: mantieni titoli coerenti, `alt` significativi, live region `#a11y-status` e focus trap del modale.
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
- `index.html` include JSON-LD `Person`: mantieni le informazioni di contatto allineate con la knowledge base dell'AI.
- Conductor: aggiorna `conductor/setup_state.json` durante i setup quando il flusso Conductor lo richiede.

## 10. Flusso di Collaborazione

- Applica il flusso comune definito in [_shared/flusso-collaborazione.md](./_shared/flusso-collaborazione.md).
- Le istruzioni dirette dell'utente e del sistema hanno sempre priorita su questo file.
- Le regole locali di questo `AGENTS.md` prevalgono sui moduli `_shared` quando specificano dettagli propri del repository.
- In caso di conflitto tra moduli `_shared`, prevale [_shared/workflow-operativo.md](./_shared/workflow-operativo.md).
