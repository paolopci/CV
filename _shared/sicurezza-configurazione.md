# Sicurezza e Configurazione

## Obiettivo

Queste regole coprono il minimo indispensabile di sicurezza applicativa e gestione configurazione da richiamare nei repository che le adottano.

## Regole

- Non committare segreti, token o credenziali in file versionati.
- Per credenziali e valori sensibili preferisci variabili d'ambiente, secret manager o strumenti equivalenti.
- Separa la configurazione locale, di sviluppo e di produzione.
- Documenta i punti di configurazione sensibili senza esporre valori reali.
- Valida gli input in ingresso nel boundary applicativo corretto.
- Gestisci in modo esplicito input mancanti, non validi o fuori formato.
- Non esporre dettagli sensibili o stack trace nei messaggi destinati all'utente finale.
- Per questo repository statico, non introdurre backend, chiavi API o segreti client-side.
