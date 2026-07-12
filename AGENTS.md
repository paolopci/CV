# AGENTS.md

## 1. Scopo e Ambito

Questo file contiene solo istruzioni sulla struttura del progetto e richiami ai moduli condivisi in shared/.

## 2. Regole di Collaborazione

Vedi shared/regole-collaborazione.md

## 3. Workflow Operativo

Vedi shared/workflow-operativo.md

## 4. Struttura del Progetto e Organizzazione dei Moduli

- Il repository contiene il sito statico, in lingua italiana, del CV di Paolo Paci.
- L'architettura è frontend client-side, senza backend.
- `index.html`: punto di ingresso del sito; include interfaccia AI, widget GitHub, Twitter Card,
  JSON-LD schema.org, barra di navigazione, landmark `main`, skip link e modali accessibili.
- `css/index.css`: stili globali, Glassmorphism, animazioni e temi chiaro e scuro.
- `js/main.js`: logica principale dell'interfaccia, assistente AI, knowledge base, API GitHub,
  cache e retry del widget GitHub e osservatore dello scorrimento.
- `js/hero-code-bg.js`: iniettore dell'animazione di codice nella sezione hero.
- `scripts/build.js`: script Node che genera `dist/`, copia gli asset statici e riscrive l'HTML
  di produzione con asset minificati e hash cache-buster.
- `dist/`: output di produzione generato da `npm run build`, con CSS e JavaScript minificati
  e asset statici copiati.
- `docs/cache-headers.md`: note sugli header HTTP di caching per GitHub Pages e hosting alternativi.
- `tests/`: suite Jest per la logica JavaScript.
- `package.json`: dipendenze e script per test, audit e build di produzione.
- `courses.json`: sorgente dati della sezione `Certificazioni & Corsi`.
- `images/`: immagini, foto profilo e infografiche WebP e PNG.
- `Paolo Paci.pdf`: CV scaricabile.
- `conductor/`: documentazione di progetto, guida prodotto, stack tecnologico, linee guida e track.
- `archive/`: track completati e file legacy.

## 5. Comandi di Build, Test e Sviluppo

- Server locale: `python -m http.server 8080`; il sito è disponibile su `http://localhost:8080`.
- Test automatici: `npm test`.
- Build di produzione: `npm run build`; genera `dist/css/index.min.css`,
  `dist/js/app.min.js` e `dist/index.html` con hash cache-buster.
- Passaggi di build separati: `npm run clean`, `npm run build:css`, `npm run build:js` e
  `npm run build:static`.
- Audit delle dipendenze: `npm audit --audit-level=moderate`.
- Verifica locale della produzione: eseguire `npm run build` e aprire
  `http://localhost:8080/dist/` tramite il server locale.
- Per modifiche significative al markup, la validazione HTML prevista usa il validatore W3C.

## 6. Stile del Codice e Convenzioni di Naming

- HTML e CSS usano un'indentazione di 4 spazi.
- Il wrapping consigliato è di circa 100 caratteri quando migliora la leggibilità.
- JavaScript preferisce funzioni globali testabili, esposte su `window` quando richiesto da Jest.
- Le classi CSS usano nomi descrittivi o uno stile simile a BEM.
- Le variabili CSS personalizzate, `rgba` e `backdrop-filter` restano coerenti con il
  Glassmorphism esistente.
- I file minificati in `dist/` sono generati: le sorgenti sono `index.html`, `css/`, `js/` e
  `scripts/`.
- Nella build generata, Prism CDN precede il bundle locale `js/app.min.js`, necessario per
  `hero-code-bg.js`.
- I record di `aiKnowledgeBase` usano `id`, `category`, `priority`, `aliases`, `keywords` e
  `answer`.
- Le modifiche dell'interfaccia interessano principalmente `css/index.css` e mantengono lo stile
  esistente.
- La cache del widget GitHub è versionata, usa un TTL di 6 ore, retry con backoff esponenziale e
  dati di esempio coerenti con il portfolio.
- I commit sono in italiano, brevi e orientati all'azione; esempi:
  `feat(ai): add info laurea` e `fix(ui): modal close button`.

## 7. Linee Guida per i Test

- Le nuove logiche JavaScript mantengono una copertura Jest superiore all'80%.
- Le nuove informazioni del chatbot richiedono record coerenti in `aiKnowledgeBase` dentro
  `js/main.js` e test in `tests/ai.test.js`.
- Il matching AI usa `normalizeAIInput()`, `findBestAIEntry()` e uno scoring deterministico;
  alias specifici e parole chiave mirate evitano risposte ambigue.
- I chip FAQ sono in `index.html` dentro `#ai-suggestions`; i relativi test sono in
  `tests/chat.test.js`.
- Le modifiche a `css/index.css` o `js/main.js` possono richiedere l'aggiornamento del parametro
  cache-buster in `index.html`.
- Dopo modifiche agli asset di produzione, `npm run build` deve generare riferimenti in
  `dist/index.html` a `css/index.min.css?v=<hash>` e `js/app.min.js?v=<hash>`.
- Il test manuale rapido copre anchor, skip link, modale corsi, modali infografiche, persistenza
  del tema, menu mobile e scorrimento fluido.
- I test manuali dell'assistente AI coprono apertura, invio, chip FAQ, knowledge base e fallback.
- I test manuali del widget GitHub coprono caricamento, cache locale, fallback offline e
  diagnostica in sviluppo.
- Le modifiche a `courses.json` richiedono la verifica del caricamento e dell'assenza di errori
  JSON nella console.
- I metadati `title`, `description`, Open Graph, Twitter Card e JSON-LD restano allineati quando
  cambiano ruolo, descrizione, immagine social o URL canonico.
- I dati strutturati delle esperienze storiche usano `Person`, `Occupation` e
  `OrganizationRole`, non `JobPosting`.
- Le immagini non critiche usano `loading="lazy"` e `decoding="async"`; le immagini informative
  includono `width`, `height` e testo `alt` significativo.
- I test del widget GitHub in `tests/github.test.js` coprono cache, retry, payload non valido,
  fallback e dettagli degli errori in sviluppo e produzione.
- Le informazioni visibili restano allineate tra `index.html`, knowledge base AI e JSON-LD.
- Le verifiche dell'interfaccia coprono più viewport, effetto magnetico e chatbot.
- L'accessibilità mantiene `main#main-content`, skip link,
  `nav[aria-label="Navigazione principale"]`, gerarchia dei titoli e ruoli semantici corretti.
- Le immagini informative hanno testi `alt` significativi; le icone decorative usano `alt=""`
  o `aria-hidden="true"` quando inserite in collegamenti già testuali.
- Le funzionalità dinamiche usano `window.a11yAnnounce()` e mantengono `#a11y-status` fuori dalle
  aree nascoste durante l'apertura delle modali.
- Le modali mantengono `openAccessibleModal()` e `closeAccessibleModal()`, gli attributi ARIA,
  il ritorno del focus e il focus trap per Tab, Shift+Tab ed Escape.
- Il contrasto rispetta WCAG 2.1 AA nei temi chiaro e scuro: almeno 4,5:1 per testo normale e
  3:1 per testo grande o componenti dell'interfaccia.
- `tests/modal-accessibility.test.js` copre focus trap e live region;
  `tests/theme.test.js` copre gli annunci del selettore del tema.
- Il tema persiste in `localStorage.theme` con i valori `dark` e `light`; usa
  `prefers-color-scheme` solo come fallback iniziale e tollera errori di accesso a `localStorage`.
- Il cambio tema aggiorna `data-mode`, `aria-pressed`, `aria-label`, `title`, gli attributi
  `data-dark` e `data-light` delle infografiche e gli annunci accessibili.

## 8. Linee Guida per Commit e Pull Request

- Le modifiche di ogni commit sono mirate e coerenti con il task.
- `node_modules/` non deve essere incluso nei commit.
- Prima di proporre un commit, lo stato Git permette di distinguere modifiche non correlate.

## 9. Suggerimenti su Sicurezza e Configurazione

Vedi shared/sicurezza-configurazione.md

## 10. Flusso di Collaborazione

Vedi shared/flusso-collaborazione.md

## 11. Decisione Iniziale per Task Non Banali

All'inizio di ogni task non banale, l'agente deve:

1. analizzare il prompt dell'utente;
2. classificare il task per complessità, numero di layer coinvolti, rischio tecnico, durata
   stimata e necessità di lavoro per fasi;
3. scegliere una sola opzione tra `A`, `B`, `C` e `D`;
4. presentare sempre all'utente la domanda decisionale iniziale;
5. contrassegnare con `(raccomandata)` una sola opzione, determinata caso per caso;
6. fermarsi e attendere che l'utente risponda con `A`, `B`, `C` oppure `D`.

La domanda deve contenere sempre queste opzioni:

- `A. Applica Modalità piano`
- `B. Applica Modalità piano e la skill [dotnet-task-decomposition](C:\Users\Paolo\.codex\skills\custom\dotnet-task-decomposition\SKILL.md)`
- `C. Applica la skill [dotnet-task-decomposition](C:\Users\Paolo\.codex\skills\custom\dotnet-task-decomposition\SKILL.md)`
- `D. Nessuna delle due`

La raccomandazione deve rispettare questi criteri:

- raccomandare `A` se il task è ampio o ambiguo e richiede soprattutto pianificazione
  conversazionale, ma non richiede ancora necessariamente `PRD` e `PLAN` nel repository;
- raccomandare `B` se il task è grande, rischioso, multifase, multilayer o multisessione e
  richiede sia governance conversazionale sia disciplina documentale ed esecutiva nel repository;
- raccomandare `C` se il task è complesso ma sufficientemente definito per iniziare con `PRD`,
  `PLAN`, esecuzione per fasi e regole della skill;
- raccomandare `D` se il task è piccolo, locale e chiaro e non richiede pianificazione strutturata
  o decomposizione documentale.

Se l'utente sceglie `A` o `B`, l'agente deve fermarsi, chiedere all'utente di attivare il toggle
UI `Modalità piano` di Codex e attendere che prema Invio prima di procedere. Se sceglie `C`,
l'agente applica `dotnet-task-decomposition` senza richiedere `Modalità piano`. Se sceglie `D`,
l'agente non usa né `Modalità piano` né `dotnet-task-decomposition`.

È vietato:

- saltare la domanda iniziale nei task non banali;
- attivare implicitamente `Modalità piano`;
- applicare implicitamente `dotnet-task-decomposition` quando la domanda iniziale è obbligatoria;
- continuare dopo `A` o `B` senza la conferma dell'utente successiva all'attivazione del toggle;
- reinterpretare la scelta dell'utente diversamente da `A`, `B`, `C` o `D`.

## Precedenza delle Istruzioni

1. `shared/workflow-operativo.md` prevale per aspetti operativi.
2. Gli altri file `shared/*.md` prevalgono per le regole condivise non operative.
3. `AGENTS.md` contiene solo istruzioni sulla struttura del progetto che non contraddicono i moduli condivisi.
