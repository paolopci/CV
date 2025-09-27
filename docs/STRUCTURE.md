Struttura del progetto (static CV)

- index.html — entry point. Include: navbar ad anchor, hero, sezioni, modale corsi, blocco JSON‑LD.
- courses.json — dati per “Certificazioni & Corsi” (fetch su root). Mantenerlo in root.

Cartelle principali
- css/
  - index.css — stili globali e dark theme.
  - components/ — stili dei componenti isolati.
- js/
  - main.js — logica UI (modale corsi, menu mobile, toggle tema, fetch dei corsi).
  - components/ — script di componenti riutilizzabili.
- images/ — asset immagini (foto profilo, loghi, favicon custom se presente).
- archive/legacy/ — file non più usati ma conservati per riferimento (es. _served.css).

Componenti animazione codice (hero)
- code-demo.js (root): file demo letto dall’animazione dell’hero (SOURCE_FILE in index.html).
- js/components/code-typer.js e css/components/code-typer.css: componente portabile, attualmente non referenziato.

Convenzioni
- Non rinominare: cv-paolo-paci.pdf, courses.json, favicon.ico, id delle sezioni.
- Aggiungere nuovi componenti in js/components e i relativi stili in css/components.
- Evitare file JS/CSS in root, salvo asset demo esplicitamente letti dallo script dell’hero.

