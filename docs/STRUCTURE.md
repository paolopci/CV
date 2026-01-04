Struttura del progetto (static CV)

- index.html — entry point. Include: navbar ad anchor, hero, sezioni, modale corsi, blocco JSON‑LD.
- courses.json — dati per “Certificazioni & Corsi” (fetch su root). Mantenerlo in root.

Cartelle principali
- css/
  - index.css — stili globali e dark theme.
  - components/ — (opzionale) stili dei componenti isolati; non presente di default.
- js/
  - main.js — logica UI (modale corsi, menu mobile, toggle tema, fetch dei corsi).
  - hero-code-bg.js — iniettore dell'animazione di codice nell'hero (pausa su mobile, riavvio on-resize, debounce listener).
  - components/ — (opzionale) script per componenti riutilizzabili; non presente di default.
- images/ — asset immagini (foto profilo, loghi, favicon custom se presente).
- archive/legacy/ — file non più usati ma conservati per riferimento (es. _served.css).

Animazione codice (hero)
- code-demo.js (root): file demo letto dall’animazione dell’hero (`SOURCE_FILE`).
- Il vecchio componente "code-typer" è archiviato in `archive/legacy/code-typer/` e non è referenziato.

Convenzioni
- Non rinominare: Paolo Paci.pdf, courses.json, favicon.ico, id delle sezioni.
- Aggiungere nuovi componenti in js/components e i relativi stili in css/components.
- Evitare file JS/CSS in root, salvo asset demo esplicitamente letti dallo script dell’hero.

Nota UI Corsi
- Nelle card: i dettagli (durata, studenti, livello) sono renderizzati come chip `.detail-chip` con il valore in `.detail-value` per impedire il ritorno a capo tra valore ed etichetta.
