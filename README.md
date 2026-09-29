# Movie Browser App

Aplikacja full-stack do przeglądania, dodawania do zakładek, oceniania i otrzymywania spersonalizowanych rekomendacji filmów i seriali — zbudowana na bazie API OMDb.

**Stack:** NestJS · Next.js (App Router) · TypeScript · PostgreSQL + Prisma · Tailwind CSS + shadcn/ui

## Co robi aplikacja

- Wyszukiwanie filmów i seriali, z nieskończonym przewijaniem i filtrowaniem po typie
- Dodawanie tytułów do zakładek, ocenianie w skali 1–10 z opcjonalną recenzją tekstową
- Spersonalizowane rekomendacje, budowane na podstawie ocen, historii wyszukiwań i wywnioskowanych preferencji gatunkowych
- Pełna autoryzacja JWT, tryb ciemny i udokumentowane API (Swagger)

## Struktura projektu

```
movie-browser-app/
├── backend/     # API w NestJS
└── frontend/    # Frontend w Next.js
```

## Instalacja

### Wymagania wstępne
- Node.js 18+
- PostgreSQL (lokalnie lub przez Docker)
- Darmowy klucz API OMDb: https://www.omdbapi.com/apikey.aspx — **trzeba go aktywować przez link w mailu potwierdzającym przed użyciem**, w przeciwnym razie API zwróci "Invalid API key"

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Otwórz `.env` i uzupełnij `DATABASE_URL` oraz `OMDB_API_KEY` (patrz [Zmienne środowiskowe](#zmienne-środowiskowe) poniżej).

```bash
npx prisma migrate dev --name init
npm run start:dev
```

- API: `http://localhost:3000/api`
- Dokumentacja Swagger: `http://localhost:3000/api/docs`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

- Aplikacja: `http://localhost:3001`

Oba serwery muszą działać jednocześnie.

## Zmienne środowiskowe

### `backend/.env`

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/movie_browser"
JWT_SECRET="change-me-to-a-long-random-string"
JWT_EXPIRES_IN="1d"
OMDB_API_KEY="your-omdb-api-key"
OMDB_BASE_URL="https://www.omdbapi.com/"
CACHE_TTL_SECONDS=3600
OMDB_MAX_REQUESTS_PER_SECOND=2
```

| Zmienna | Opis |
|---|---|
| `DATABASE_URL` | Connection string do bazy Postgres |
| `JWT_SECRET` | Sekret do podpisywania tokenów autoryzacyjnych |
| `OMDB_API_KEY` | Twój klucz OMDb ([uzyskaj tutaj](https://www.omdbapi.com/apikey.aspx)) |
| `CACHE_TTL_SECONDS` | Jak długo odpowiedzi z OMDb są cache'owane |
| `OMDB_MAX_REQUESTS_PER_SECOND` | Ograniczenie liczby zapytań do OMDb, chroniące darmowy klucz (limit 1000/dzień) |

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Kluczowe decyzje architektoniczne

Kilka rzeczy wartych uwagi dla osoby przeglądającej kod:

- **Brak duplikowania danych o filmach.** Baza danych przechowuje wyłącznie sygnały generowane przez użytkownika (zakładki, oceny, historię wyszukiwań, wagi gatunków), powiązane z `imdbId`. Dane samych tytułów (plakaty, fabuła, obsada) są zawsze pobierane na żywo z OMDb, przez warstwę cache. Zobacz `backend/src/omdb/omdb.service.ts`.
- **Dwa niezależne mechanizmy ograniczania requestów.** `ThrottlerModule` chroni samo API przed nadużyciami; osobna kolejka typu token-bucket (`omdb-rate-limiter.service.ts`) ogranicza requesty *wychodzące* do OMDb, tak żeby nagły napływ użytkowników nie przekroczył limitów samego OMDb.
- **Scoring rekomendacji.** `recommendations.service.ts` buduje listę kandydatów na podstawie wysoko ocenionych tytułów i ostatnich wyszukiwań użytkownika (przez wyszukiwanie tekstowe OMDb — patrz ograniczenie poniżej), a następnie ponownie sortuje je według zgodności z zapisanymi preferencjami gatunkowymi.

## Silnik rekomendacji: znane ograniczenie

OMDb nie ma endpointu "podobne tytuły" ani "trending" — udostępnia jedynie wyszukiwanie tekstowe i dokładny lookup po ID. Oznacza to, że silnik rekomendacji traktuje wysoko ocenione tytuły i ostatnie wyszukiwania użytkownika jako **frazy wyszukiwania**, a nie jako dane wejściowe do faktycznego modelu podobieństwa. W efekcie wyniki są przechylone w stronę tytułów **tekstowo** podobnych (sequele, ta sama seria filmowa), a nie tematycznie/gatunkowo podobnych — nawet po ponownym sortowaniu według gatunków.

To świadomy kompromis, nie przeoczenie — właściwa naprawa wymagałaby dodania drugiego źródła danych z prawdziwymi endpointami rekomendacji (np. TMDB z `/similar` i `/recommendations`), ograniczonego wyłącznie do tej jednej funkcji, przy zachowaniu OMDb dla reszty aplikacji. Pominięte tutaj, żeby ograniczyć projekt do jednej zewnętrznej zależności.

## Świadome decyzje o zakresie projektu

- JWT tylko z access tokenem (bez refresh tokenów) — akceptowalne dla aplikacji lokalnej/deweloperskiej, wymagałoby uzupełnienia przed wdrożeniem produkcyjnym
- Cache w pamięci (można podmienić na Redis przez fabrykę `CacheModule` w `app.module.ts`, bez zmian w reszcie kodu)
- Brak jeszcze automatycznych testów

## Przydatne komendy

| Zadanie | Komenda |
|---|---|
| Podgląd bazy danych | `npx prisma studio` (z folderu `backend/`) |
| Serwer deweloperski backendu | `npm run start:dev` (z folderu `backend/`) |
| Serwer deweloperski frontendu | `npm run dev` (z folderu `frontend/`) |
| Dokumentacja API | `http://localhost:3000/api/docs` |