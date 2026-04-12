# CLAUDE.md

Questo file fornisce indicazioni a Claude Code per lavorare con il codice di questo repository.

## 1. Checklist Rapida
1. Avviare il server: `python -m http.server 8080` e aprire `http://localhost:8080`
2. Verificare il funzionamento della UI: navigazione ancorata, modale corsi, toggle tema, menu mobile, scorrimento fluido
3. Controllare l'Intelligenza Artificiale: apre la finestra chat, invio/ricezione messaggi, chip FAQ cliccabili, knowledge base popolata e fallback educato
4. Verificare il widget GitHub: eventi live, cache locale, fallback offline e diagnostica solo in sviluppo
5. Eseguire i test: `npm test` passa e la copertura code è ≥ 80 % per la nuova logica JavaScript
6. Accessibilità: verificare `main#main-content`, skip link, `nav` etichettata, `alt` significativi, live region `#a11y-status`, trap del focus sui modali e contrasto WCAG 2.1 AA
7. Commit: messaggi brevi e descrittivi in italiano (es. `feat(ai): aggiungi esperienza`)

## 2. Comandi Comuni
1. Avviare il server di sviluppo: `python -m http.server 8080`
2. Eseguire i test: `npm test` (richiede Node.js installato)
3. Integrare il widget GitHub: dati recuperati da `api.github.com/users/paolopci/events/public` in `js/main.js`, con cache TTL 6 ore, retry exponential backoff e fallback portfolio
4. Ricaricare l'Intelligenza Artificiale: aggiornare i record di `aiKnowledgeBase` in `js/main.js`, aggiornare il cache-buster in `index.html` se necessario e ricaricare la pagina
5. Validare il codice HTML con lo strumento W3C validator

## 3. Architettura del Codice
1. **Frontend**:
   - `index.html` – punto di ingresso, include UI AI, widget GitHub, markup JSON‑LD, landmark `main`, skip link e modali accessibili
   - `js/main.js` – logica core, `aiKnowledgeBase` strutturata, normalizzazione/matching AI, osservatore scroll, gestione API GitHub, cache/retry e fallback del widget
   - `css/index.css` – stili globali, effetti Glassmorphism, variabili tema scuro
2. **Gestione dati**:
   - `courses.json` – sorgente per la sezione "Certificazioni & Corsi"
   - `.gitignore` – esclude automaticamente `node_modules/` e altre directory generate
3. **Documentazione**:
   - `conductor/` – guida prodotto, stack tecnologico, tracce di sviluppo, file di stato (`setup_state.json`)
4. **Testing**:
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
6. Il widget GitHub deve restare client-side e senza token: usare cache versionata con TTL 6 ore, retry `500/1000/2000 ms`, fallback su repository portfolio e dettagli errore solo per `localhost`, `127.0.0.1`, `::1` o `file:`
7. Accessibilità implementata:
   - Landmark principale `main#main-content`, skip link e `nav` con `aria-label="Navigazione principale"`
   - `#a11y-status` come live region globale tramite `window.a11yAnnounce()`
   - Helper `openAccessibleModal()`/`closeAccessibleModal()` per trap Tab/Shift+Tab, Escape, `aria-hidden`, `aria-expanded` e ritorno focus
   - Immagini informative con `alt` descrittivi e icone decorative con `alt=""` o `aria-hidden="true"`
   - Contrasto target WCAG 2.1 AA per tema chiaro e scuro
8. Il toggle del tema e gli effetti Glassmorphism utilizzano valori CSS `rgba` e `backdrop-filter`
9. Non committare mai `node_modules/` o file legacy presenti nella cartella `archive/`

## 5. Linee Guida per i Contributi
1. **Stile del commit**: utilizzo di conventional commit in italiano (es. `feat(ui): aggiungi pulsante`, `fix(ai): correggi enrich di messaggi`)
2. Ogni nuova funzionalità deve includere test Jest con copertura ≥ 80 %
3. Le modifiche al chatbot devono aggiornare `tests/ai.test.js`; se toccano chip, focus, live region o invio messaggi, aggiornare anche `tests/chat.test.js`
4. Le modifiche al widget GitHub devono aggiornare `tests/github.test.js` per cache, retry, payload non valido, fallback offline e visibilità degli errori tra sviluppo e produzione
5. Le modifiche a landmark, live region, modali, tema o contrasto devono aggiornare `tests/modal-accessibility.test.js` e/o `tests/theme.test.js`
6. Dovrà essere compilata la Checklist Rapida prima di aprire una PR
7. Utilizzare `.gitignore` per file temporanei o generati

## 6. Gestione delle Versioni
1. **main** – codice pronto per la produzione
2. **develop** – branch di sviluppo attivo, da cui partono le PR
3. Taggare le release con numeri di versione (es. `Release-1.4.1`) per le versioni stabili