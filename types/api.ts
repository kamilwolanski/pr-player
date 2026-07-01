import { EpisodeRm } from "./episode";

export interface EpisodesResponse {
  data: EpisodeRm[];
  pageNumber: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface MediaResponse<T> {
  data: T;
}
