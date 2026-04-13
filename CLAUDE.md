# CLAUDE.md

Questo file fornisce indicazioni a Claude Code per lavorare con il codice di questo repository.

## 1. Checklist Rapida
1. Avviare il server: `python -m http.server 8080` e aprire `http://localhost:8080`
2. Verificare il funzionamento della UI: navigazione ancorata, modale corsi, toggle tema persistente, menu mobile, scorrimento fluido
3. Controllare l'Intelligenza Artificiale: apre la finestra chat, invio/ricezione messaggi, chip FAQ cliccabili, knowledge base popolata e fallback educato
4. Verificare il widget GitHub: eventi live, cache locale, fallback offline e diagnostica solo in sviluppo
5. Eseguire i test: `npm test` passa e la copertura code è ≥ 80 % per la nuova logica JavaScript
6. Per modifiche a CSS/JS/asset produzione, eseguire `npm run build` e verificare `http://localhost:8080/dist/`
7. SEO e performance: controllare Twitter Card, JSON-LD, immagini lazy e cache-buster degli asset generati
8. Accessibilità: verificare `main#main-content`, skip link, `nav` etichettata, `alt` significativi, live region `#a11y-status`, trap del focus sui modali e contrasto WCAG 2.1 AA
9. Commit: messaggi brevi e descrittivi in italiano (es. `feat(ai): aggiungi esperienza`)

## 2. Comandi Comuni
1. Avviare il server di sviluppo: `python -m http.server 8080`
2. Eseguire i test: `npm test` (richiede Node.js installato)
3. Generare la build produzione: `npm run build`
4. Pulire output produzione: `npm run clean`
5. Eseguire build mirate: `npm run build:css`, `npm run build:js`, `npm run build:static`
6. Verificare vulnerabilità dev/runtime: `npm audit --audit-level=moderate`
7. Integrare il widget GitHub: dati recuperati da `api.github.com/users/paolopci/events/public` in `js/main.js`, con cache TTL 6 ore, retry exponential backoff e fallback portfolio
8. Ricaricare l'Intelligenza Artificiale: aggiornare i record di `aiKnowledgeBase` in `js/main.js`, aggiornare il cache-buster in `index.html` se necessario e ricaricare la pagina
9. Validare il codice HTML con lo strumento W3C validator

## 3. Architettura del Codice
1. **Frontend**:
   - `index.html` – punto di ingresso, include UI AI, widget GitHub, markup JSON‑LD, landmark `main`, skip link e modali accessibili
   - `js/main.js` – logica core, `aiKnowledgeBase` strutturata, normalizzazione/matching AI, osservatore scroll, gestione API GitHub, cache/retry e fallback del widget
   - `css/index.css` – stili globali, effetti Glassmorphism, variabili tema scuro
2. **Build produzione**:
   - `scripts/build.js` – copia gli asset statici, genera `dist/index.html` e applica cache-buster hash agli asset minificati
   - `dist/` – output generato da `npm run build`, con `css/index.min.css`, `js/app.min.js`, immagini, PDF, `courses.json`, `favicon.ico` e `code-demo.js`
   - `package.json` – contiene gli script `clean`, `build:css`, `build:js`, `build:static` e `build`
3. **Gestione dati**:
   - `courses.json` – sorgente per la sezione "Certificazioni & Corsi"
   - `.gitignore` – esclude automaticamente `node_modules/` e altre directory generate
4. **Documentazione**:
   - `conductor/` – guida prodotto, stack tecnologico, tracce di sviluppo, file di stato (`setup_state.json`)
   - `docs/cache-headers.md` – note su cache HTTP per GitHub Pages e configurazioni alternative Apache/Netlify/Cloudflare
5. **Testing**:
   - Suite di test Jest in `tests/` per validare il comportamento JavaScript (es. `tests/ai.test.js`)

## 4. Note di Implementazione Chiave
1. Tutte le comunicazioni e i messaggi di commit devono essere in **italiano**
2. Seguire la **metodologia Conductor** per lo sviluppo strutturato e il tracciamento dello stato (`conductor/setup_state.json`)
3. Aggiornare il knowledge base AI richiede:
   - Modifica dei record strutturati in `js/main.js` (`id`, `category`, `priority`, `aliases`, `keywords`, `answer`)
   - Uso di alias specifici e keyword mirate: il matching passa da `normalizeAIInput()` e `findBestAIEntry()` con scoring deterministico
   - Aggiunta di test Jest corrispondenti in `tests/ai.test.js`
4. I chip FAQ dell'assistente sono in `index.html` dentro `#ai-suggestions`; la gestione click vive in `initAIChat()` e va coperta in `tests/chat.test.js`
5. Se cambi `js/main.js` o `css/index.css` per funzionalità visibili, valuta di aggiornare il query string cache-buster in `index.html` per evitare asset vecchi in browser
6. Non modificare direttamente i file minificati in `dist/`: aggiornare i sorgenti e rigenerare con `npm run build`
7. La build produzione mantiene Prism CDN prima di `js/app.min.js`; non invertire l'ordine perché `hero-code-bg.js` usa Prism quando disponibile
8. Il widget GitHub deve restare client-side e senza token: usare cache versionata con TTL 6 ore, retry `500/1000/2000 ms`, fallback su repository portfolio e dettagli errore solo per `localhost`, `127.0.0.1`, `::1` o `file:`
9. SEO implementata:
   - Open Graph e Twitter Card devono restare allineati a titolo, descrizione, immagine social e URL pubblico
   - JSON-LD usa `Person`, `Occupation` e `OrganizationRole`; non usare `JobPosting` per esperienze lavorative storiche
   - Se cambiano contatti, competenze o carriere visibili, allineare `index.html`, JSON-LD e knowledge base AI
10. Performance immagini:
   - Immagini non critiche con `loading="lazy"` e `decoding="async"`
   - Immagini informative con `width`, `height` e `alt` descrittivo
   - Icone decorative con `alt=""` o `aria-hidden="true"`
11. Caching:
   - GitHub Pages non applica `.htaccess`
   - La strategia primaria è il cache-buster hash generato su `dist/css/index.min.css` e `dist/js/app.min.js`
   - Aggiornare `docs/cache-headers.md` solo quando cambia la strategia di hosting o caching
12. Accessibilità implementata:
   - Landmark principale `main#main-content`, skip link e `nav` con `aria-label="Navigazione principale"`
   - `#a11y-status` come live region globale tramite `window.a11yAnnounce()`
   - Helper `openAccessibleModal()`/`closeAccessibleModal()` per trap Tab/Shift+Tab, Escape, `aria-hidden`, `aria-expanded` e ritorno focus
   - Immagini informative con `alt` descrittivi e icone decorative con `alt=""` o `aria-hidden="true"`
   - Contrasto target WCAG 2.1 AA per tema chiaro e scuro
13. Il toggle del tema persiste la scelta in `localStorage.theme` (`dark`/`light`), legge la preferenza salvata all'avvio, usa `prefers-color-scheme` solo come fallback iniziale e deve restare funzionante anche se `localStorage` non e disponibile
14. Il toggle del tema deve aggiornare `data-mode`, `aria-pressed`, `aria-label`, `title`, infografiche `data-dark`/`data-light` e annunci tramite `window.a11yAnnounce()` o `#a11y-status`
15. Il toggle del tema e gli effetti Glassmorphism utilizzano valori CSS `rgba` e `backdrop-filter`
16. Non committare mai `node_modules/` o file legacy presenti nella cartella `archive/`

## 5. Linee Guida per i Contributi
1. **Stile del commit**: utilizzo di conventional commit in italiano (es. `feat(ui): aggiungi pulsante`, `fix(ai): correggi enrich di messaggi`)
2. Ogni nuova funzionalità deve includere test Jest con copertura ≥ 80 %
3. Le modifiche al chatbot devono aggiornare `tests/ai.test.js`; se toccano chip, focus, live region o invio messaggi, aggiornare anche `tests/chat.test.js`
4. Le modifiche al widget GitHub devono aggiornare `tests/github.test.js` per cache, retry, payload non valido, fallback offline e visibilità degli errori tra sviluppo e produzione
5. Le modifiche a landmark, live region, modali, tema o contrasto devono aggiornare `tests/modal-accessibility.test.js` e/o `tests/theme.test.js`
6. Le modifiche al tema devono coprire in `tests/theme.test.js` preferenza salvata, fallback `prefers-color-scheme`, assenza di `matchMedia`, stato ARIA/label e errori di `localStorage`
7. Le modifiche a SEO, JSON-LD o social preview devono essere validate almeno con parsing JSON locale e, quando possibile, con validator W3C/schema.org
8. Le modifiche a build, caching o asset produzione devono eseguire `npm run build` e controllare che `dist/index.html` punti agli asset minificati con hash
9. Dovrà essere compilata la Checklist Rapida prima di aprire una PR
10. Utilizzare `.gitignore` per file temporanei o generati

## 6. Gestione delle Versioni
1. **main** – codice pronto per la produzione
2. **develop** – branch di sviluppo attivo, da cui partono le PR
3. Taggare le release con numeri di versione (es. `Release-1.4.1`) per le versioni stabili
