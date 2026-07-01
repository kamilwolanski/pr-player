export interface MediaTranscription {
  lang: string;
  jsonUri: string;
  srtUri: string | null;
  vttUri: string | null;
  subtitlesId: string;
}

export interface MediaLicence {
  id: string;
  name: string;
  isOneTime: boolean;
}

export interface BaseMedia {
  id: string;
  title: string;
  uri: string;
  durationSeconds: number;

  fileName: string;
  path: string;

  createdAt: string;
  createdBy: string | null;

  transcription: MediaTranscription | null;
  licence: MediaLicence | null;
}

export interface AudioAsset extends BaseMedia {
  fileSize: number;
  availableFormats: string[];
}

export interface VideoAsset extends BaseMedia {
  imageId: string | null;
  isSynchronized: boolean;
}
