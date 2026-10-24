import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { type Track, TRACKS } from '../data/tracks';

export type PlaybackState = 'unstarted' | 'buffering' | 'playing' | 'paused' | 'ended' | 'error';

export interface AudioContextType {
  tracks: Track[];
  playingTrack: Track | null;
  playingIndex: number;
  playbackState: PlaybackState;
  isPlaying: boolean;
  isPlayerReady: boolean;
  autoplayBlocked: boolean;
  errorMessage: string | null;
  currentTime: number;
  duration: number;
  playTrack: (track: Track, index: number) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (seconds: number) => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: any;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playingIndex, setPlayingIndex] = useState<number>(-1);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('unstarted');
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const playerRef = useRef<any>(null);
  const requestedTrackRef = useRef<{ track: Track; index: number } | null>(null);
  const timeIntervalRef = useRef<number | null>(null);

  const playingTrack = playingIndex >= 0 && playingIndex < TRACKS.length ? TRACKS[playingIndex] : null;
  const isPlaying = playbackState === 'playing';

  const hasRequestedPlayback = playingIndex >= 0;

  // Load the online player only after a visitor selects a record.
  useEffect(() => {
    if (!hasRequestedPlayback) return;
    let isCancelled = false;

    const initPlayer = () => {
      if (isCancelled) return;
      if (!window.YT || !window.YT.Player) return;

      const playerElement = document.getElementById('katosi-youtube-iframe-target');
      if (!playerElement || playerRef.current) return;

      try {
        playerRef.current = new window.YT.Player('katosi-youtube-iframe-target', {
          height: '200',
          width: '340',
          videoId: requestedTrackRef.current?.track.youtubeVideoId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onAutoplayBlocked: () => { if (!isCancelled) {setAutoplayBlocked(true);setPlaybackState('paused');} },
            onReady: (event: any) => {
              if (isCancelled) return;
              setIsPlayerReady(true);

              // If a track was requested before player became ready
              if (requestedTrackRef.current) {
                const { track, index } = requestedTrackRef.current;
                requestedTrackRef.current = null;
                setPlayingIndex(index);
                event.target.loadVideoById(track.youtubeVideoId);
              }
            },
            onStateChange: (event: any) => {
              if (isCancelled) return;
              const state = event.data;
              const YTState = window.YT?.PlayerState;

              if (YTState) {
                if (state === YTState.PLAYING) {
                  setPlaybackState('playing');
                  setAutoplayBlocked(false);
                  setErrorMessage(null);
                  if (playerRef.current?.getDuration) {
                    setDuration(playerRef.current.getDuration());
                  }
                } else if (state === YTState.PAUSED) {
                  setPlaybackState('paused');
                } else if (state === YTState.BUFFERING) {
                  setPlaybackState('buffering');
                } else if (state === YTState.ENDED) {
                  setPlaybackState('ended');
                  // Advance to next track; stop at end of collection
                  setPlayingIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    if (nextIndex < TRACKS.length) {
                      const nextTrack = TRACKS[nextIndex];
                      if (playerRef.current?.loadVideoById && nextTrack.youtubeVideoId) {
                        playerRef.current.loadVideoById(nextTrack.youtubeVideoId);
                        return nextIndex;
                      }
                    }
                    return prevIndex;
                  });
                } else if (state === YTState.UNSTARTED) {
                  setPlaybackState('unstarted');
                }
              }
            },
            onError: (event: any) => {
              if (isCancelled) return;
              const errorCode = event.data;
              let msg = 'Playback error occurred.';
              if (errorCode === 101 || errorCode === 150) {
                msg = 'Embedding restricted by owner. You can play directly on YouTube.';
              } else if (errorCode === 100) {
                msg = 'Video not found or removed.';
              } else if (errorCode === 2) {
                msg = 'Invalid video ID parameter.';
              }
              setErrorMessage(msg);
              setPlaybackState('error');
            }
          }
        });
      } catch (err) {
        console.error('Failed to instantiate YouTube Player', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.getElementById('katosi-yt-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'katosi-yt-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      isCancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [hasRequestedPlayback]);

  // Poll current playback time when playing
  useEffect(() => {
    if (playbackState === 'playing') {
      timeIntervalRef.current = window.setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time || 0);
          const dur = playerRef.current.getDuration?.();
          if (dur) setDuration(dur);
        }
      }, 500);
    } else {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [playbackState]);

  const playTrack = useCallback((track: Track, index: number) => {
    setErrorMessage(null);

    // If clicking currently active track
    if (playingIndex === index && playingTrack?.id === track.id) {
      if (playbackState === 'playing') {
        playerRef.current?.pauseVideo?.();
      } else {
        try {
          playerRef.current?.playVideo?.();
        } catch {
          setAutoplayBlocked(true);
        }
      }
      return;
    }

    // Switching to a new track
    setCurrentTime(0);
    setDuration(0);
    setAutoplayBlocked(false);
    setPlayingIndex(index);

    if (!isPlayerReady || !playerRef.current) {
      requestedTrackRef.current = { track, index };
      return;
    }

    if (!track.youtubeVideoId || track.availability === 'unavailable') {
      setPlaybackState('error');
      setErrorMessage('This song is currently unavailable for online streaming.');
      return;
    }

    try {
      if (typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById(track.youtubeVideoId);
        setPlaybackState('buffering');
      } else if (typeof playerRef.current.cueVideoById === 'function') {
        playerRef.current.cueVideoById(track.youtubeVideoId);
        playerRef.current.playVideo?.();
      }
    } catch (e) {
      console.warn('Autoplay or loadVideoById error:', e);
      setAutoplayBlocked(true);
    }
  }, [playingIndex, playingTrack, isPlayerReady, playbackState]);

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return;

    if (playbackState === 'playing') {
      playerRef.current.pauseVideo?.();
    } else if (playbackState === 'paused') {
      playerRef.current.playVideo?.();
    } else if (playingIndex === -1 && TRACKS.length > 0) {
      playTrack(TRACKS[0], 0);
    }
  }, [playbackState, playingIndex, playTrack]);

  const playNext = useCallback(() => {
    const nextIdx = (playingIndex + 1) % TRACKS.length;
    playTrack(TRACKS[nextIdx], nextIdx);
  }, [playingIndex, playTrack]);

  const playPrevious = useCallback(() => {
    const prevIdx = playingIndex <= 0 ? TRACKS.length - 1 : playingIndex - 1;
    playTrack(TRACKS[prevIdx], prevIdx);
  }, [playingIndex, playTrack]);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  }, []);

  return (
    <AudioContext.Provider
      value={{
        tracks: TRACKS,
        playingTrack,
        playingIndex,
        playbackState,
        isPlaying,
        isPlayerReady,
        autoplayBlocked,
        errorMessage,
        currentTime,
        duration,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        seekTo
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
