# Workflow Operativo

## Principio iniziale

Leggi sempre `AGENTS.md` come prima azione di ogni nuova richiesta sul progetto, prima di analisi, piano, uso tool o modifiche.

Se `AGENTS.md` non e stato letto nella richiesta corrente:

- non proporre checklist;
- non usare tool;
- non eseguire attivita operative.

Se il task richiede o puo beneficiare di server MCP:

- verifica dopo la lettura di `AGENTS.md` se i server MCP rilevanti sono configurati correttamente per il repository o l'ambiente corrente;
- applica il controllo minimo definito dal repository in `AGENTS.md`;
- se la configurazione MCP non e adeguata, dichiara in modo esplicito quale server manca o e configurato in modo non adatto;
- non correggere automaticamente la configurazione MCP senza autorizzazione dell'utente.

## Pianificazione a step

Dopo la lettura iniziale di `AGENTS.md`:

- analizza il task;
- identifica il perimetro della modifica;
- presenta una checklist concettuale di 1-7 step.

Per ogni step:

- usa `🟩` per gli step aperti;
- usa `🟨 ~~testo~~` per gli step completati;
- usa sempre il formato `Step <numero>: <descrizione>`.

Regole:

- mantieni visibili step aperti e completati;
- ripubblica la checklist solo se cambiano stato, perimetro o contenuto del piano;
- alla fine chiedi: `Confermi lo step X? oppure si step all`.

## Esecuzione e validazione

- Non eseguire attivita operative prima di una conferma valida.
- Se l'utente conferma uno step specifico, esegui solo quello step.
- Se l'utente scrive `si step all`, esegui tutti gli step rimanenti senza ulteriori richieste di conferma.
- Dopo ogni modifica, valida l'esito in 1-2 frasi e correggi se serve.
- Testa e verifica il codice modificato quando il task lo richiede.
- Riformatta i file toccati quando esiste un formatter pertinente.
- Se compare `Accesso negato`, usa permessi elevati se disponibili e consentiti.
- Mantieni in italiano contenuto del piano, aggiornamenti e deliverable.
