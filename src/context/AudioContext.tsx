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

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playingIndex, setPlayingIndex] = useState<number>(-1);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('unstarted');
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Native HTML5 Audio for reliable, restriction-free local playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingIndexRef = useRef<number>(playingIndex);
  useEffect(() => { playingIndexRef.current = playingIndex; }, [playingIndex]);

  const playingTrack = playingIndex >= 0 && playingIndex < TRACKS.length ? TRACKS[playingIndex] : null;
  const isPlaying = playbackState === 'playing';

  // Initialize native HTML5 Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const onPlay = () => {
      setPlaybackState('playing');
      setErrorMessage(null);
      setAutoplayBlocked(false);
    };

    const onPause = () => {
      if (audio.currentTime < audio.duration) {
        setPlaybackState('paused');
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsPlayerReady(true);
    };

    const onCanPlay = () => {
      setIsPlayerReady(true);
    };

    const onWaiting = () => {
      setPlaybackState('buffering');
    };

    const onEnded = () => {
      setPlaybackState('ended');
      // Advance automatically to next song in collection
      const nextIndex = (playingIndexRef.current + 1) % TRACKS.length;
      playTrackInternal(TRACKS[nextIndex], nextIndex);
    };

    const onError = () => {
      console.warn('Local audio playback notice:', audio.error);
      setPlaybackState('error');
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Update MediaSession API for system lock-screen / keyboard media key controls
  useEffect(() => {
    if (!('mediaSession' in navigator) || !playingTrack) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: playingTrack.title,
        artist: playingTrack.artists.join(', '),
        album: `${playingTrack.albumOrFilm} (${playingTrack.year})`,
        artwork: [
          { src: playingTrack.artworkUrl, sizes: '512x512', type: 'image/jpeg' },
          { src: playingTrack.artworkUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: playingTrack.artworkUrl, sizes: '128x128', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play().catch(console.warn);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        const prevIdx = playingIndexRef.current <= 0 ? TRACKS.length - 1 : playingIndexRef.current - 1;
        playTrackInternal(TRACKS[prevIdx], prevIdx);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        const nextIdx = (playingIndexRef.current + 1) % TRACKS.length;
        playTrackInternal(TRACKS[nextIdx], nextIdx);
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });
    } catch (e) {
      console.warn('MediaSession setup note:', e);
    }
  }, [playingTrack, isPlaying]);

  const playTrackInternal = (track: Track, index: number) => {
    setErrorMessage(null);
    setAutoplayBlocked(false);
    setPlayingIndex(index);
    setCurrentTime(0);
    setDuration(0);

    const audio = audioRef.current;
    if (audio) {
      const srcUrl = track.audioUrl || `/audio/${track.id}.mp3`;
      audio.src = srcUrl;
      audio.currentTime = 0;
      audio.play().then(() => {
        setPlaybackState('playing');
      }).catch((err) => {
        console.warn('Autoplay gesture required:', err);
        setAutoplayBlocked(true);
        setPlaybackState('paused');
      });
    }
  };

  const playTrack = useCallback((track: Track, index: number) => {
    // If clicking currently active track, toggle play/pause
    if (playingIndex === index && playingTrack?.id === track.id) {
      const audio = audioRef.current;
      if (playbackState === 'playing') {
        audio?.pause();
        setPlaybackState('paused');
      } else {
        audio?.play().then(() => {
          setPlaybackState('playing');
        }).catch(() => {
          setAutoplayBlocked(true);
        });
      }
      return;
    }

    playTrackInternal(track, index);
  }, [playingIndex, playingTrack, playbackState]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (playbackState === 'playing') {
      audio?.pause();
      setPlaybackState('paused');
    } else if (playbackState === 'paused') {
      audio?.play().then(() => {
        setPlaybackState('playing');
      }).catch(() => {
        setAutoplayBlocked(true);
      });
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
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
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
        errorMessage,
        autoplayBlocked,
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
