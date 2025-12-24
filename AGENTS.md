**Checklist Rapida**
- Avvia server: `python -m http.server 8080` e apri `http://localhost:8080`.
- Test rapido: anchor, modale corsi, toggle tema, menu mobile, scroll fluido.
- Dati: se modifichi `courses.json`, ricarica e controlla la console (JSON valido).
- A11y: titoli coerenti, `alt` significativi, live region `#a11y-status`, focus trap del modale.
- SEO/dati strutturati: verifica `url`/`sameAs` nel JSON-LD; non rinominare asset pubblici.
- Commit: messaggi brevi in IT; cambi mirati; evita nuovi toolchain/framework.

**Workflow & Interaction**
- **Lingua**: Chat e interazioni di progetto rigorosamente in Italiano.
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
- Solo client-side; nessun backend né segreti.
- Pubblicabile su qualunque hosting statico (es. GitHub Pages) o via semplice server HTTP locale.

**Structure**
- `index.html`: entry point del sito (include JSON-LD `Person`, navbar ad anchor, sezione corsi dinamica, tema chiaro/scuro, miglioramenti a11y).
- `css/index.css`: stili globali, animazioni, tema scuro (`.dark-theme`), helper `.sr-only`.
- `js/main.js`: logica UI (modale corsi, toggle tema, menu mobile, fetch `courses.json`).
- `js/hero-code-bg.js`: iniettore dell'animazione di codice nell'hero (pausa su mobile, riavvio automatico al resize desktop, debounce attivo).
- `images/`: asset immagine (foto profilo, loghi, ecc.).
- `courses.json`: sorgente dati per la sezione "Certificazioni & Corsi".
- `cv-paolo-paci.pdf`: CV scaricabile; mantenere il nome file stabile.
- `favicon.ico`: icona del sito.
- `firma.html`, `firma_paolopci.html`, `firma_email/`: modelli di firma email.
- `docs/`: documentazione aggiuntiva (es. `STRUCTURE.md`).
- `archive/`: file legacy e versioni precedenti (es. `legacy/`).
- File demo per animazione: `code-demo.js` (root). Mantenere il nome stabile o aggiornare `SOURCE_FILE` in `js/hero-code-bg.js`/`index.html`.
- Vedi anche `docs/STRUCTURE.md` per la mappa cartelle aggiornata.

**Run & Validate**
- Server locale: `python -m http.server 8080` e apri `http://localhost:8080`.
- Validazione HTML: W3C validator (upload o URL pubblico).
- Lint opzionale (se Node disponibile): `npx html-validate .` e `npx stylelint "css/**/*.css"`.
- Test rapido: navigazione tra anchor, apertura/chiusura modale corsi, toggle tema, scorrimento fluido, comportamento mobile del menu.

**Coding Style**
- Indentazione: 4 spazi per HTML/CSS; wrapping ~100 caratteri.
- HTML: tag semantici (`header`, `main`, `section`), attributi lowercase, virgolette doppie.
- CSS: classi minuscole con trattini (es. `hero-header`, `presentation-letter`); evitare inline styles.
- Asset: immagini compresse (≤200KB se possibile); percorsi relativi.
- Lingua: testo visibile in Italiano; rispettare accenti e punteggiatura.
- JSON (`courses.json`): UTF-8, virgolette doppie, chiavi stabili; niente trailing comma.

**Testing & Accessibility**
- Responsività: verificare mobile/desktop e performance delle animazioni.
- Link: controllare link esterni e download del PDF.
- Dati: dopo modifiche a `courses.json`, ricarica e controlla la console per errori di parsing.
- A11y: mantenere gerarchia dei titoli, `alt` significativi, live region `#a11y-status`, focus trap del modale corsi, `aria-*` coerenti.
- Tema: preservare `#themeToggleIcon` e la logica che alterna `body.dark-theme`.

**UI Corsi — Dettagli nelle card**
- La riga dei dettagli (durata, studenti, livello) usa chip compatti: `.detail-chip` con valore evidenziato `.detail-value` per evitare a capo tra valore ed etichetta.
- Non modificare il layout della card; eventuali nuove etichette devono seguire lo stesso schema.

**Commits & PRs**
- Stile commit: messaggi brevi e orientati all’azione (spesso in Italiano). Es.: `fix pulsante doppio LinkedIn`, `add firma in html per email`, `add miglioramento seo`.
- Presente indicativo e soggetto chiaro; raggruppare modifiche correlate.
- Branching: feature branch da `main`; diff focalizzati.
- PR: descrizione concisa, screenshot/GIF per UI, motivazione per modifiche dati/SEO, riferimenti a issue.
- Prima della review: test locale, viewport mobile, spell-check dei testi visibili.

**Security & Maintenance**
- Nessun segreto/token nel repo (sito pubblico statico).
- Aggiornando date/dettagli del CV, tenere allineati HTML e PDF.
- Nomi file stabili per evitare link rotti; se rinomini, aggiorna tutti i riferimenti.
- URL JSON-LD in `index.html` (`application/ld+json`): aggiornare `url` se cambia l’hosting (es. path GitHub Pages).

**Agent Tips**
- Task tipici: contenuti in `index.html`, stile in `css/index.css`, dati in `courses.json`, aggiornamenti SEO/meta.
- Cambi minimi e mirati; evitare refactor strutturali non richiesti.
- Aggiungendo asset: preferire immagini compresse e riferimenti relativi.
- Preferire miglioramenti semantici HTML rispetto a workaround puramente visivi.
- Ancore navbar: preservare gli `id` delle sezioni (`home`, `presentation`, `profile`, `skills`, `experience`, `education`, `contact`).
- PDF: il link a `cv-paolo-paci.pdf` è usato in più punti; non cambiare nome senza aggiornare i riferimenti.

**courses.json — Schema e Linee Guida**
- Root: oggetto con chiave `courses` (array di corsi) e opzionale `metadata`.
- Campi tipici corso:
  - Obbligatori: `platform`, `title`, `date`, `description`.
  - Opzionali: `id`, `platformIcon` (o `platformicon`), `duration`, `level`, `students`, `audience`, `tags` (array di stringhe).
- Ordinamento: aggiungi in ordine cronologico inverso (più recenti in alto) per coerenza visiva.
- Localizzazione: usa mesi e testi in Italiano quando possibile (es. "Giugno 2025").
- Validazione: mantenere JSON valido (niente trailing comma). La UI è tollerante su campi mancanti ma preferire chiavi consistenti.

**SEO & Dati Strutturati**
- `index.html` include un blocco JSON-LD `Person` con `jobTitle`, `url`, `address`, `email`, `telephone`, `sameAs`:
  - Aggiornare `jobTitle` se cambia il ruolo principale.
  - Aggiornare `url` se cambia il percorso di pubblicazione (es. GitHub Pages path).
  - Verificare i link `sameAs` (LinkedIn, GitHub).

**Hosting (GitHub Pages)**

**Checklist Deploy Pages**
- Abilita Pages: branch `main`, directory root `/`.
- Aggiorna `index.html` JSON-LD `url` a `https://paolopci.github.io/CV/`.
- Verifica asset e fetch `courses.json` (niente 404/CORS in console).
- Prova link interni/esterni e download `cv-paolo-paci.pdf`.

 - Opzione consigliata: abilitare GitHub Pages dal branch `main`, directory root.
 - URL tipico del progetto: `https://paolopci.github.io/CV/` (coerente con il JSON-LD).

**Do Not**
- Aggiungere toolchain/build system o framework senza richiesta esplicita.
- Introdurre analytics o script esterni che raccolgono dati.
- Rompere URL pubblici degli asset senza aggiornare ogni riferimento.
