"use client";

import { useState } from "react";
import { EpisodeRm } from "@/types/episode";
import { EpisodesResponse } from "@/types/api";
import { getEpisodes } from "@/services/api";

import EpisodesViewContent from "./EpisodesViewContent";
import { MediaPlayerProvider } from "@/providers/MediaPlayer";

type EpisodesViewProps = {
  initialEpisodesResponse: EpisodesResponse;
};

const EpisodesView = ({ initialEpisodesResponse }: EpisodesViewProps) => {
  const [episodes, setEpisodes] = useState<EpisodeRm[]>(
    initialEpisodesResponse.data,
  );
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeRm | null>(
    initialEpisodesResponse.data[0] ?? null,
  );
  const [pageNumber, setPageNumber] = useState(
    initialEpisodesResponse.pageNumber,
  );
  const [totalPages, setTotalPages] = useState(
    initialEpisodesResponse.totalPages,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const hasMoreEpisodes = pageNumber < totalPages;

  const loadMoreEpisodes = async () => {
    if (isLoadingMore || !hasMoreEpisodes) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const nextPage = await getEpisodes(
        pageNumber + 1,
        initialEpisodesResponse.pageSize,
      );

      setEpisodes((currentEpisodes) => {
        const existingEpisodeIds = new Set(
          currentEpisodes.map((episode) => episode.id),
        );
        const newEpisodes = nextPage.data.filter(
          (episode) => !existingEpisodeIds.has(episode.id),
        );

        return [...currentEpisodes, ...newEpisodes];
      });
      setPageNumber(nextPage.pageNumber);
      setTotalPages(nextPage.totalPages);
    } catch {
      setLoadMoreError("Nie udało się pobrać kolejnych odcinków.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (!selectedEpisode) {
    return (
      <main className="mx-auto w-full max-w-page px-4 py-6 sm:px-6 md:px-8">
        <p>Brak odcinków do wyświetlenia</p>
      </main>
    );
  }

  return (
    <MediaPlayerProvider selectedEpisode={selectedEpisode}>
      <EpisodesViewContent
        episodes={episodes}
        selectedEpisode={selectedEpisode}
        setSelectedEpisode={setSelectedEpisode}
        hasMoreEpisodes={hasMoreEpisodes}
        isLoadingMore={isLoadingMore}
        loadMoreError={loadMoreError}
        onLoadMoreEpisodes={loadMoreEpisodes}
      />
    </MediaPlayerProvider>
  );
};

export default EpisodesView;
