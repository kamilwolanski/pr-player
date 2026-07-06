## Szybkie uruchomienie w Dockerze

Rekomendowany sposób uruchomienia aplikacji z repozytorium:

```bash
docker build -t pr-player .
docker run --rm -p 3000:3000 pr-player
```

Po starcie aplikacja będzie dostępna pod adresem:

```txt
http://localhost:3000
```

## Uruchomienie deweloperskie

Wymagania:

- Node.js 22+
- pnpm

Instalacja zależności:

```bash
pnpm install
```

Start trybu deweloperskiego:

```bash
pnpm dev
```

Aplikacja będzie dostępna pod adresem:

```txt
http://localhost:3000
```

Build produkcyjny lokalnie:

```bash
pnpm build
```

## Architektura

- `app/page.tsx` pobiera pierwszą stronę odcinków po stronie serwera i przekazuje ją do części klienckiej.
- `components/EpisodesView.tsx` trzyma stan listy, wybranego odcinka oraz paginacji dla przycisku `Pokaż więcej`.
- `components/EpisodesViewContent.tsx` składa główny widok: listę, panel szczegółów, mobilny sheet oraz dolny player.
- `providers/MediaPlayer.tsx` udostępnia stan odtwarzacza przez context.
- `hooks/media-player/*` zawierają logikę ładowania mediów, kontroli elementów audio/wideo, seekowania, głośności i błędów odtwarzania.
- `components/DetailPanel.tsx` pokazuje szczegóły odcinka, przełączanie audio/wideo oraz link do strony odcinka na `polskieradio.pl`.
- `constants/messages.ts` centralizuje komunikaty błędów i podstawowe statusy.

## Decyzje techniczne

- Pierwsza strona odcinków jest renderowana po stronie serwera, żeby użytkownik szybko dostał gotową listę.
- Kolejne strony są dociągane po stronie klienta przyciskiem `Pokaż więcej`.
- Media audio/wideo są ładowane leniwie, dopiero przy próbie odtworzenia lub podglądu wideo.
- Player utrzymuje wspólny czas przy przełączaniu audio/wideo, gdy to możliwe.
- Dodano podstawowe stany UI: ładowanie, błąd API, brak mediów i błąd odtwarzania.
- Dodano podstawową dostępność: fokus z klawiatury, `aria-label`, `aria-current`, `aria-busy`, role tabów i dialogu mobilnego.

## Co można rozwinąć dalej

Na potrzeby zadania skupiłem się na podstawowym, działającym przepływie od listy odcinków do odtwarzania audio/wideo. Gdybym miał więcej czasu, rozwinąłbym szczególnie:

- React Query do pobierania danych. Ułatwiłoby to cache'owanie kolejnych stron odcinków, obsługę retry, deduplikację requestów, stany loading/error oraz ewentualne odświeżanie danych bez ręcznego zarządzania tym w komponentach.
- Napisy WebVTT do wideo
- Testy jednostkowe. W pierwszej kolejności pokryłbym helpery, logikę media-playera, paginację oraz przypadki błędów ładowania mediów.
- Lepszą dostępność. Obecnie aplikacja ma podstawowe `aria-label`, obsługę fokusu i role dla kluczowych elementów, ale warto byłoby zrobić pełniejszy audyt klawiatury i screen readerów, dopracować zarządzanie fokusem w mobilnym panelu oraz sprawdzić kontrasty i komunikaty dynamiczne.

## Czas pracy

Szacunkowy czas poświęcony na zadanie: około 12 godzin.

Najwięcej czasu zajęła synchronizacja odtwarzania audio/wideo przy jednoczesnej możliwości przeglądania innych odcinków bez gubienia aktualnie odtwarzanego materiału.
