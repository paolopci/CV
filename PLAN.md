# Piano di miglioramento del CV online

## Stato delle fasi

- [x] Esperienze orientate a risultati verificabili (`b222e27`).
- [x] Hero più autorevole e immediato.

## Fase 1: esperienze orientate a risultati verificabili

## Obiettivo

Riorganizzare la carriera online affinché le esperienze recenti presentino prima risultati verificabili,
poi contributi e tecnologie, mantenendo allineati contenuti visibili, JSON-LD e chatbot.

## Perimetro approvato

1. Riscrivere QbitSoft/TIM, Aruba, BKN301 e LaserSoft con blocchi `Risultati e impatto`,
   `Contributi principali` e `Tecnologie`.
2. Spostare aggiornamento professionale e progetti personali nel Portfolio.
3. Conservare separate ma compatte le esperienze precedenti al 2020.
4. Adeguare gli stili della timeline senza modificarne il comportamento accordion.
5. Allineare JSON-LD, knowledge base AI, test e cache-buster.
6. Rigenerare `dist/` esclusivamente tramite `npm run build`.

## Vincoli

- Non inventare numeri, percentuali o benefici economici.
- Attribuire al team internazionale la reimplementazione completa degli endpoint BKN301.
- Omettere la versione .NET per BKN301.
- Consultare `D:\@@ -- NON Cancellare -- @@\__  C V __\Paolo Paci.odt` solo in lettura.
- Non modificare ODT e PDF in questa fase.

## Verifica

- Test statici della timeline e test AI/chatbot.
- `npm test`.
- `npm run build`.
- Controllo manuale desktop/mobile, temi, accordion, markup e JSON-LD.

## Fase 2: hero più autorevole e immediato

### Obiettivo

Trasformare il primo viewport in un hero executive split con posizionamento statico, prove professionali,
CTA chiare e ritratto laterale, mantenendo l'identità tecnica dello sfondo animato.

### Perimetro approvato

1. Adottare il titolo `Senior Software Engineer .NET & Angular` e allinearlo tra hero, SEO, JSON-LD,
   Profilo, footer e chatbot.
2. Sostituire il typewriter con promessa professionale e tre proof point verificabili.
3. Inserire il ritratto professionale nel hero, mantenendolo anche nella sezione Profilo.
4. Spostare la lettera in `section#presentation` e l'incentivo over 50 in `footer#contact`.
5. Attenuare il codice animato e realizzare il layout responsive desktop/mobile.
6. Aggiornare cache-buster, test e output `dist/`.

### Vincoli

- Conservare gli ID pubblici `home`, `hero-cta`, `code-bg`, `presentation` e `contact`.
- Non modificare i ruoli storici delle esperienze lavorative.
- Non installare dipendenze e non modificare ODT o PDF.
- Scrivere e verificare i test statici prima dell'implementazione.

### Verifica

- Test statici del contenuto hero, test AI e test `hero-code-bg`.
- `npm test` e `npm run build`.
- Controllo desktop `1280x720` e mobile `390x844`, temi chiaro/scuro e reduced motion.
- Validazione HTML/JSON-LD, hash produzione e `git diff --check`.

### Esito

- Hero verificato a `1280x720` e `390x844`, nei temi chiaro e scuro.
- Titolo, ritratto, proof point e CTA rientrano nel primo viewport.
- Nessun overflow mobile; FAB e CTA non si sovrappongono.
- Anchor `Intro`, download CV, Contatti e reduced motion conservati.
