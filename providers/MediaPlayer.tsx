"use client";

import { createContext, ReactNode, useContext } from "react";
import useMediaPlayer from "@/hooks/media-player/useMediaPlayer";
import { EpisodeRm } from "@/types/episode";

type MediaPlayerContextValue = ReturnType<typeof useMediaPlayer>;

const MediaPlayerContext = createContext<MediaPlayerContextValue | null>(null);

type MediaPlayerProviderProps = {
  selectedEpisode: EpisodeRm | null;
  children: ReactNode;
};

export const MediaPlayerProvider = ({
  selectedEpisode,
  children,
}: MediaPlayerProviderProps) => {
  const player = useMediaPlayer(selectedEpisode);

  return (
    <MediaPlayerContext.Provider value={player}>
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayerContext = () => {
  const context = useContext(MediaPlayerContext);

  if (!context) {
    throw new Error(
      "useMediaPlayerContext must be used inside MediaPlayerProvider",
    );
  }

  return context;
};
