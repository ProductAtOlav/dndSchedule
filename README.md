# DnD Planner - Tilgjengelighetssystem

En norsk webapplikasjon for å administrere ukentlig tilgjengelighet for D&D-spillere.

## Beskrivelse

DnD Planner hjelper spillere og arrangører med å koordinere tilgjengelighet for D&D-økter. Applikasjonen inkluderer en visuell ukekalender hvor brukere kan markere når de er tilgjengelige, og dataene lagres i Supabase for enkel deling og analyse.

## Funksjoner

- **Innloggingssystem**: Sikker pålogging med mulighet for å huske brukernavn
- **Visuell ukekalender**: Klikk eller dra for å markere tilgjengelighet
- **Supabase-integrasjon**: Datalagring i skyen med sanntidssynkronisering
- **Responsivt design**: Fungerer på desktop og mobile enheter
- **Forhåndsinnstillinger**: Rask konfigurasjon med forhåndsdefinerte maler
- **Norsk språk**: Fullstendig norsk grensesnitt

## Teknologi

- HTML5, CSS3, Vanilla JavaScript
- **Supabase** (PostgreSQL database + REST API)
- Row Level Security (RLS) for datasikkerhet

## Oppsett

### 1. Supabase-konfigurasjon

1. Gå til [Supabase Dashboard](https://app.supabase.com)
2. Finn ditt prosjekt
3. Gå til **Settings > API**
4. Kopier **Project URL** og **anon public** API-nøkkel
5. Åpne [supabase-config.js](supabase-config.js) og erstatt:
```javascript
const SUPABASE_URL = 'DIN_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'DIN_SUPABASE_ANON_KEY';
```

### 2. Database-oppsett

1. Gå til **SQL Editor** i Supabase Dashboard
2. Åpne [supabase-setup.sql](supabase-setup.sql) og kopier innholdet
3. Lim inn i SQL Editor og kjør query (Run)

Dette oppretter:
- `users` tabell for brukerdata
- `availability` tabell for tilgjengelighet
- Row Level Security (RLS) policies
- Indekser for rask data-oppslag

### 3. Kjør applikasjonen

Åpne `index.html` i en nettleser eller kjør med en lokal webserver:

```bash
# Med Python 3
python -m http.server 8000

# Med Node.js
npx http-server
```

Besøk `http://localhost:8000` i nettleseren.

### 4. Logg inn

Testbrukere:
- Brukernavn: `admin`, Passord: `admin123`
- Brukernavn: `bruker`, Passord: `passord123`

## Filstruktur

```
dndSchedule/
├── index.html              # Innloggingsside
├── dashboard.html          # Tilgjengelighetsklalendar
├── styles.css             # All styling
├── main.js                # Innloggingslogikk
├── dashboard.js           # Kalenderlogikk og Supabase-integrasjon
├── supabase-config.js     # Supabase-konfigurasjon (må oppdateres)
├── supabase-setup.sql     # SQL for database-oppsett
└── README.md              # Denne filen
```

## Bruk

### Tilgjengelighetskalender

1. **Klikk** på en tidslot for å toggle tilgjengelighet
2. **Dra** over flere slots for å markere mange timer
3. **Bruk forhåndsinnstillinger**:
   - "Kun arbeidstid": Mandag-Fredag, 09:00-17:00
   - "Bare kvelder": Alle dager, 18:00-22:00
   - "Hele uken": Marker alt som tilgjengelig
   - "Tøm alt": Fjern alle markeringer
4. **Lagre** endringer til databasen

## Database-struktur

### `availability` tabell

| Kolonne | Type | Beskrivelse |
|---------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key til users |
| username | TEXT | Brukernavn |
| day_index | INTEGER | Ukedag (0-6, Mandag-Søndag) |
| hour | INTEGER | Time (8-22) |
| is_available | BOOLEAN | Tilgjengelig eller ikke |
| created_at | TIMESTAMP | Opprettet tidspunkt |
| updated_at | TIMESTAMP | Sist oppdatert |

## Sikkerhet

- Row Level Security (RLS) aktivert i Supabase
- Brukere kan kun endre sin egen tilgjengelighet
- Alle kan se andres tilgjengelighet (for arrangører)
- **VIKTIG**: API-nøkler bør IKKE committes til git

## Fremtidige forbedringer

- [ ] Ekte autentisering med Supabase Auth
- [ ] Passord-hashing i databasen
- [ ] Aggregert visning for arrangører
- [ ] Export til iCal/Google Calendar
- [ ] Notifikasjoner ved endringer
- [ ] Mobil app

## Lisens

MIT License - Fri bruk for alle formål
