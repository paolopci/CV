# CLAUDE.md

Questo file fornisce indicazioni a Claude Code per lavorare con il codice di questo repository.

## 1. Checklist Rapida
1. Avviare il server: `python -m http.server 8080` e aprire `http://localhost:8080`
2. Verificare il funzionamento della UI: navigazione ancorata, modale corsi, toggle tema, menu mobile, scorrimento fluido
3. Controllare l'Intelligenza Artificiale: apre la finestra chat, invio/ricezione messaggi, knowledge base popolata
4. Verificare il widget GitHub: vengono visualizzati gli ultimi eventi nel portfolio
5. Eseguire i test: `npm test` passa e la copertura code è ≥ 80 % per la nuova logica JavaScript
6. Accessibilità: verificare `alt` significativi, live region `#a11y-status`, trap del focus sul modulo modale
7. Commit: messaggi brevi e descrittivi in italiano (es. `feat(ai): aggiungi esperienza`)

## 2. Comandi Comuni
1. Avviare il server di sviluppo: `python -m http.server 8080`
2. Eseguire i test: `npm test` (richiede Node.js installato)
3. Integrare il widget GitHub: dati recuperati da `api.github.com/users/paolopci/events/public` in `js/main.js`
4. Ricaricare l'Intelligenza Artificiale: aggiornare `aiKnowledgeBase` in `js/main.js` e ricaricare la pagina
5. Validare il codice HTML con lo strumento W3C validator

## 3. Architettura del Codice
1. **Frontend**:
   - `index.html` – punto di ingresso, include UI AI, widget GitHub e markup JSON‑LD
   - `js/main.js` – logica core, oggetto `aiKnowledgeBase`, osservatore scroll e gestione API GitHub
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
   - Modifica dell'oggetto JSON in `js/main.js`
   - Aggiunta di un test Jest corrispondente in `tests/ai.test.js`
4. Il toggle del tema e gli effetti Glassmorphism utilizzano valori CSS `rgba` e `backdrop-filter`
5. Non committare mai `node_modules/` o file legacy presenti nella cartella `archive/`

## 5. Linee Guida per i Contributi
1. **Stile del commit**: utilizzo di conventional commit in italiano (es. `feat(ui): aggiungi pulsante`, `fix(ai): correggi enrich di messaggi`)
2. Ogni nuova funzionalità deve includere test Jest con copertura ≥ 80 %
3. Dovrà essere compilata la Checklist Rapida prima di aprire una PR
4. Utilizzare `.gitignore` per file temporanei o generati

## 6. Gestione delle Versioni
1. **main** – codice pronto per la produzione
2. **develop** – branch di sviluppo attivo, da cui partono le PR
3. Taggare le release con numeri di versione (es. `Release-1.4.1`) per le versioni stabili