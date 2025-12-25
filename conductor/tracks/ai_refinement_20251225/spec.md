# Specification: AI Assistant & UI Refinement

## Overview
Questo track mira a elevare il sito CV/Portfolio di Paolo Paci aggiungendo una funzionalità di intelligenza artificiale interattiva e modernizzando l'interfaccia utente con effetti visivi premium.

## Goals
1.  **AI Assistant:** Creare una chat bot (UI-only mockup o integrazione API) che simuli o effettui risposte a domande sul profilo professionale dell'autore.
2.  **Glassmorphism UI:** Aggiornare la Navbar e le card delle sezioni "Skills" e "Experience" con effetti di trasparenza sfocata (frosted glass).
3.  **Interactive Timeline:** Trasformare la timeline statica in un elemento dinamico che reagisce allo scroll.
4.  **GitHub Widget:** Visualizzare dati reali di attività da GitHub.

## Technical Requirements
*   **Frontend:** Estensione del codice Vanilla JS e CSS3 esistente.
*   **AI Integration:** Utilizzo di OpenAI API o simulazione intelligente tramite knowledge base locale (JSON).
*   **Animations:** Utilizzo di CSS `backdrop-filter` e JavaScript `IntersectionObserver`.
*   **Testing:** Introduzione di un framework di test (es. Jest o Vitest) per validare le nuove logiche JS.

## User Experience
*   L'utente deve poter interagire con il chatbot in modo fluido.
*   Gli effetti visivi devono essere discreti e non ostacolare la lettura.
*   Le performance di caricamento devono rimanere ottimali (Core Web Vitals).
