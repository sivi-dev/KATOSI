import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, ExternalLink, AlertCircle, ChevronDown, ChevronUp, Tv } from 'lucide-react';
import './NowPlayingDock.css';

interface NowPlayingDockProps {
  isBranched?: boolean;
}

export const NowPlayingDock: React.FC<NowPlayingDockProps> = ({ isBranched = false }) => {
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
  const [showVideo, setShowVideo] = useState<boolean>(true);

  // Auto minimize when branches open, but allow user manual toggle
  useEffect(() => {
    if (isBranched) {
      setIsExpanded(false);
    }
  }, [isBranched]);

  useEffect(() => { if (playingTrack && !isBranched) setIsExpanded(true); }, [playingTrack, isBranched]);
  useEffect(() => { if (isPlaying && !isBranched) setIsExpanded(true); }, [isPlaying, isBranched]);

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
      className={`now-playing-dock liquid-glass-slab ${!isExpanded ? 'now-playing-dock--collapsed' : ''} ${!playingTrack ? 'now-playing-dock--idle' : ''}`}
      aria-label="Now playing audio and video player"
      hidden={!playingTrack}
      style={{ ['--dock-accent' as any]: playingTrack?.accentColor || '#e8a526' }}
    >
      {/* Header Bar */}
      <div className="dock-header">
        <div className="dock-header-left">
          <img
            src="/brand/katosi-mark.png"
            alt=""
            className={`dock-brand-mark ${playbackState === 'playing' ? 'dock-brand-mark--spinning' : ''}`}
          />
          <span className="dock-header-title">NOW PLAYING</span>
          {playbackState === 'playing' ? (
            <span className="dock-live-eq" aria-label="Audio active">
              <span className="dock-eq-bar dock-eq-bar--1" />
              <span className="dock-eq-bar dock-eq-bar--2" />
              <span className="dock-eq-bar dock-eq-bar--3" />
            </span>
          ) : (
            <span className="dock-idle-dot" />
          )}
        </div>
        <div className="dock-header-actions">
          {/* Toggle Video Preview Button */}
          <button
            type="button"
            className={`dock-tool-btn ${showVideo ? 'dock-tool-btn--active' : ''}`}
            onClick={() => setShowVideo(!showVideo)}
            aria-label={showVideo ? 'Hide video canvas' : 'Show video canvas'}
            title={showVideo ? 'Hide video frame' : 'Show video frame'}
          >
            <Tv size={14} />
          </button>
          {/* Collapse/Expand Dock Button */}
          <button
            type="button"
            className="dock-tool-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse player dock' : 'Expand player dock'}
            title={isExpanded ? 'Collapse player' : 'Expand player'}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Main Content when expanded */}
      <div className="dock-body">
        {/* Persistent YouTube Iframe Target Container (Always mounted in DOM for audio continuity) */}
        <div
          className={`dock-iframe-wrapper ${!showVideo ? 'dock-iframe-wrapper--minimized' : ''}`}
          aria-hidden={!showVideo}
        >
          <div id="katosi-youtube-iframe-target" />
        </div>

        {/* Autoplay / Restriction Alert */}
        {autoplayBlocked && (
          <div className="dock-alert dock-alert--autoplay" role="alert">
            <AlertCircle size={15} />
            <span>Browser blocked autoplay. <strong>Click play</strong> below to start playback.</span>
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

        {/* Track Title, Artwork and Controls */}
        <div className="dock-controls-area">
          <div className="dock-track-row">
            {playingTrack?.artworkUrl && (
              <img
                src={playingTrack.artworkUrl}
                alt=""
                className="dock-track-thumb"
              />
            )}
            <div className="dock-track-info">
              <span className="dock-track-title">
                {playingTrack ? playingTrack.title : 'Select a compact disc to play'}
              </span>
              <span className="dock-track-sub">
                {playingTrack ? `${playingTrack.artists.join(', ')}` : 'KATOSI Audio Stream'}
              </span>
            </div>
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
              className={`dock-ctrl-btn dock-ctrl-btn--play ${isPlaying ? 'dock-ctrl-btn--playing' : ''}`}
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
