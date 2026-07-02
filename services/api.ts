import { EpisodesResponse, MediaResponse } from "@/types/api";
import { AudioAsset, VideoAsset } from "@/types/media";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${url}`);

  if (!res.ok) {
    throw new Error(`API error: ${url}`);
  }

  return res.json();
}

export const getEpisodes = (page = 1, pageSize = 20) =>
  request<EpisodesResponse>(
    `/podcast-episodes/read-models?pageNumber=${page}&pageSize=${pageSize}`,
  );

export const getAudio = (audioId: string) =>
  request<MediaResponse<AudioAsset>>(`/audio/${audioId}`);

export const getVideo = (videoId: string) =>
  request<MediaResponse<VideoAsset>>(`/video/${videoId}`);
