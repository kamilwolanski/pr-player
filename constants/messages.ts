import type { MediaType } from "@/hooks/media-player/mediaPlayer.types";

export const MEDIA_TYPE_LABEL: Record<MediaType, string> = {
  audio: "audio",
  video: "wideo",
};

export const ERROR_MESSAGES = {
  activePlayerMissing: "Nie znaleziono aktywnego odtwarzacza.",
  episodesLoad: "Nie udało się pobrać odcinków",
  episodesLoadDescription:
    "API nie odpowiedziało poprawnie. Spróbuj ponownie za chwilę.",
  episodesLoadMore: "Nie udało się pobrać kolejnych odcinków.",
  mediaElementPlayback:
    "Nie udało się odtworzyć tego pliku. Spróbuj ponownie za chwilę.",
  mediaUrlLoad: (mediaType: MediaType) =>
    `Nie udało się pobrać adresu ${MEDIA_TYPE_LABEL[mediaType]}. Spróbuj ponownie.`,
  noAudio: "Ten odcinek nie ma dostępnego audio.",
  noEpisodes: "Brak odcinków do wyświetlenia",
  noMedia: "Ten odcinek nie ma dostępnego audio ani wideo.",
  noVideo: "Ten odcinek nie ma dostępnego wideo.",
  playbackStart:
    "Nie udało się uruchomić odtwarzania. Spróbuj ponownie lub wybierz inny odcinek.",
  videoUnavailable: "Brak wideo dla tego odcinka.",
} as const;

export const STATUS_MESSAGES = {
  loading: "Ładowanie...",
  noAudioShort: "Brak audio",
  noMediaShort: "Brak mediów",
  noVideoShort: "Brak wideo",
  videoLoadPrompt: "Kliknij Obejrzyj, żeby załadować wideo.",
  videoLoading: "Ładowanie wideo...",
} as const;