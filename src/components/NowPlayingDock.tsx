import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, ExternalLink, AlertCircle, ChevronDown, ChevronUp, Music2 } from 'lucide-react';
import './NowPlayingDock.css';

export const NowPlayingDock: React.FC = () => {
  const {
    playingTrack,
    playbackState,
    isPlaying,
    isPlayerReady,
    autoplayBlocked,
    errorMessage,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  useEffect(() => { if (playingTrack || isPlaying) setIsExpanded(true); }, [playingTrack, isPlaying]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo(val);
  };

  return (
    <aside
      className={`now-playing-dock ${!isExpanded ? 'now-playing-dock--collapsed' : ''} ${!playingTrack ? 'now-playing-dock--idle' : ''}`}
      aria-label="Now playing audio player"
      hidden={!playingTrack}
    >
      {/* Header Bar */}
      <div className="dock-header">
        <div className="dock-header-left">
          <Music2 size={14} className="dock-music-icon" />
          <span className="dock-header-title">NOW PLAYING</span>
          {playbackState === 'playing' && <span className="dock-live-dot" />}
        </div>
        <button
          type="button"
          className="dock-toggle-btn"
          onClick={() => { if (isExpanded && isPlaying) togglePlayPause(); setIsExpanded(!isExpanded); }}
          aria-label={isExpanded ? 'Collapse player dock' : 'Expand player dock'}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Main Content when expanded */}
      <div className="dock-body">
        {/* Persistent YouTube Iframe Target Container */}
        <div className="dock-iframe-wrapper">
          <div id="katosi-youtube-iframe-target" />
        </div>

        {/* Autoplay / Restriction Alert */}
        {autoplayBlocked && (
          <div className="dock-alert dock-alert--autoplay" role="alert">
            <AlertCircle size={15} />
            <span>Browser blocked audio autoplay. <strong>Press play</strong> on the player to listen.</span>
          </div>
        )}

        {/* Playback Error Alert */}
        {errorMessage && (
          <div className="dock-alert dock-alert--error" role="alert">
            <AlertCircle size={15} />
            <div className="dock-alert-text">
              <span>{errorMessage}</span>
              {playingTrack?.youtubeUrl && (
                <a
                  href={playingTrack.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dock-error-link"
                >
                  Watch on YouTube <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Track Title and Controls */}
        <div className="dock-controls-area">
          <div className="dock-track-info">
            <span className="dock-track-title">
              {playingTrack ? playingTrack.title : 'Select a compact disc to play'}
            </span>
            <span className="dock-track-sub">
              {playingTrack ? `${playingTrack.artists.join(', ')} • ${playingTrack.albumOrFilm}` : 'KATOSI Audio Stream'}
            </span>
          </div>

          {/* Timeline slider */}
          {duration > 0 && (
            <div className="dock-timeline">
              <span className="dock-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime || 0}
                onChange={handleSeek}
                className="dock-slider"
                aria-label="Seek track position"
              />
              <span className="dock-time">{formatTime(duration)}</span>
            </div>
          )}

          {/* Control Buttons */}
          <div className="dock-btn-row">
            <button
              type="button"
              className="dock-ctrl-btn"
              onClick={playPrevious}
              disabled={!isPlayerReady}
              aria-label="Previous song"
              title="Previous song"
            >
              <SkipBack size={16} />
            </button>

            <button
              type="button"
              className="dock-ctrl-btn dock-ctrl-btn--play"
              onClick={togglePlayPause}
              disabled={!isPlayerReady}
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            </button>

            <button
              type="button"
              className="dock-ctrl-btn"
              onClick={playNext}
              disabled={!isPlayerReady}
              aria-label="Next song"
              title="Next song"
            >
              <SkipForward size={16} />
            </button>

            {playingTrack?.youtubeUrl && (
              <a
                href={playingTrack.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="dock-yt-link"
                title="Open official video on YouTube"
                aria-label="Open on YouTube"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
