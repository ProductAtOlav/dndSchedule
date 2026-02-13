# DnD Planner

En norsk webapplikasjon for planlegging og organisering av Dungeons & Dragons-kampanjer.

## Beskrivelse

DnD Planner er et verktøy som hjelper deg med å planlegge og administrere dine D&D-økter. Applikasjonen inkluderer innlogging og et dashboard for å holde oversikt over kampanjene dine.

## Funksjoner

- **Innloggingssystem**: Sikker pålogging med mulighet for å huske brukernavn
- **Dashboard**: Sentralt kontrollpanel for administrasjon
- **Responsivt design**: Fungerer på desktop og mobile enheter
- **Norsk språk**:Fullstendig norsk grensesnitt

## Teknologi

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage for lokal datalagring

## Komme i gang

1. Åpne `index.html` i en nettleser
2. Logg inn med en av testbrukerne:
   - Brukernavn: `admin`, Passord: `admin123`
   - Brukernavn: `bruker`, Passord: `passord123`

## Filstruktur

```
dndSchedule/
├── index.html          # Innloggingsside
├── dashboard.html      # Hovedside etter innlogging
├── main.js            # Logikk for innlogging
├── dashboard.js       # Logikk for dashboard
├── styles.css         # Styling for applikasjonen
└── README.md          # Denne filen
```

## Utvikling

Dette er for øyeblikket en klientside-applikasjon. For produksjonsbruk bør:
- Implementere ekte backend-autentisering
- Bruke en database for datalagring
- Legge til serversidevalidering
- Implementere sikre passordrutiner

## Lisens

Dette er et personlig prosjekt.
