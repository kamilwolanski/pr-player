import { EpisodeRm } from "@/types/episode";

export type MediaType = "audio" | "video";

export type PlayableEpisode = EpisodeRm & {
  audioUrl?: string;
  videoUrl?: string;
};
