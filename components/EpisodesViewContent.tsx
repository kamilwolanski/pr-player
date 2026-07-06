"use client";

import { Dispatch, SetStateAction, useState } from "react";
import BottomPlayer from "@/components/BottomPlayer";
import DetailPanel from "@/components/DetailPanel";
import { EpisodeRm } from "@/types/episode";
import MobileEpisodeDetailSheet from "./episodes/MobileEpisodeDetailSheet";
import EpisodesList from "./episodes/EpisodesList";
import { useMediaPlayerContext } from "@/providers/MediaPlayer";
import { useIsMobile } from "@/hooks/useIsMobile";

type EpisodesViewContentProps = {
  episodes: EpisodeRm[];
  selectedEpisode: EpisodeRm;
  setSelectedEpisode: Dispatch<SetStateAction<EpisodeRm | null>>;
  hasMoreEpisodes: boolean;
  isLoadingMore: boolean;
  loadMoreError: string | null;
  onLoadMoreEpisodes: () => void;
};

const EpisodesViewContent = ({
  episodes,
  selectedEpisode,
  setSelectedEpisode,
  hasMoreEpisodes,
  isLoadingMore,
  loadMoreError,
  onLoadMoreEpisodes,
}: EpisodesViewContentProps) => {
  const {
    audioRef,
    playingEpisode,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleMediaEnded,
    handleMediaError,
    currentTime,
    togglePlayback,
    seekTo,
    isPlaying,
    closePlayer,
    volume,
    changeVolume,
    toggleMute,
    activeMediaType,
    playbackError,
    mediaError,
    switchPlayingVideoToAudio,
  } = useMediaPlayerContext();

  const [isMobileDetailMounted, setIsMobileDetailMounted] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const isMobile = useIsMobile();

  const mobilePlayerOffset = playingEpisode
    ? "bottom-20 md:bottom-24"
    : "bottom-0";

  const mobileSheetMaxHeight = playingEpisode
    ? "max-h-[calc(100dvh-5rem)]"
    : "max-h-[calc(100dvh-1rem)]";

  const selectEpisode = async (episode: EpisodeRm) => {
    const isBrowsingDifferentEpisode = playingEpisode?.id !== episode.id;

    if (
      activeMediaType === "video" &&
      playingEpisode &&
      isBrowsingDifferentEpisode
    ) {
      await switchPlayingVideoToAudio();
    }

    setSelectedEpisode(episode);

    if (isMobile) {
      setIsMobileDetailMounted(true);

      requestAnimationFrame(() => {
        setIsMobileDetailOpen(true);
      });
    }
  };

  const closeMobileDetail = () => {
    setIsMobileDetailOpen(false);
  };

  const unmountMobileDetail = () => {
    setIsMobileDetailMounted(false);
  };

  return (
    <>
      <main
        className={`mx-auto grid w-full max-w-page gap-6 px-4 py-4 sm:px-6 md:px-8 md:py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] ${
          playingEpisode ? "pb-32 md:pb-36" : "pb-6 md:pb-8"
        }`}
      >
        <audio
          ref={audioRef}
          src={playingEpisode?.audioUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleMediaEnded}
          onError={handleMediaError}
        />

        <EpisodesList
          episodes={episodes}
          selectedEpisodeId={selectedEpisode.id}
          isMobileDetailMounted={isMobileDetailMounted}
          hasMoreEpisodes={hasMoreEpisodes}
          isLoadingMore={isLoadingMore}
          loadMoreError={loadMoreError}
          onEpisodeSelect={selectEpisode}
          onLoadMore={onLoadMoreEpisodes}
        />

        <section
          aria-label="Szczegóły odcinka"
          className="hidden lg:order-2 lg:block"
        >
          <DetailPanel episode={selectedEpisode} />
        </section>
      </main>

      {isMobileDetailMounted && (
        <MobileEpisodeDetailSheet
          episode={selectedEpisode}
          isOpen={isMobileDetailOpen}
          playerOffsetClassName={mobilePlayerOffset}
          sheetMaxHeightClassName={mobileSheetMaxHeight}
          onClose={closeMobileDetail}
          onExited={unmountMobileDetail}
        />
      )}

      {playingEpisode && (
        <BottomPlayer
          episode={playingEpisode}
          currentTime={currentTime}
          isPlaying={isPlaying}
          playbackError={playbackError ?? mediaError}
          onClose={closePlayer}
          volume={volume}
          togglePlay={togglePlayback}
          onSeek={seekTo}
          onVolumeChange={changeVolume}
          onToggleMute={toggleMute}
        />
      )}
    </>
  );
};

export default EpisodesViewContent;