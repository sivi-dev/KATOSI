import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, SkipBack, SkipForward, ExternalLink, ChevronDown, ChevronUp, Disc3 } from 'lucide-react';
import './NowPlayingDock.css';

interface NowPlayingDockProps {
  isBranched?: boolean;
}

export const NowPlayingDock: React.FC<NowPlayingDockProps> = ({ isBranched = false }) => {
  const {
    playingTrack,
    isPlaying,
    isPlayerReady,
    autoplayBlocked,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Auto-minimize when branches open to avoid overlapping note cards, while keeping audio playing
  useEffect(() => {
    if (isBranched) {
      setIsExpanded(false);
    }
  }, [isBranched]);

  useEffect(() => {
    if (playingTrack && !isBranched) {
      setIsExpanded(true);
    }
  }, [playingTrack, isBranched]);

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

  const accentColor = playingTrack?.accentColor || '#e8a526';

  return (
    <aside
      className={`now-playing-dock liquid-glass-slab ${!isExpanded ? 'now-playing-dock--collapsed' : ''} ${!playingTrack ? 'now-playing-dock--idle' : ''}`}
      aria-label="Now playing audio player"
      hidden={!playingTrack}
      style={{ ['--dock-accent' as any]: accentColor }}
    >
      {/* Header Bar */}
      <div className="dock-header">
        <div className="dock-header-left">
          <img
            src="/brand/katosi-mark.png"
            alt=""
            className={`dock-brand-mark ${isPlaying ? 'dock-brand-mark--spinning' : ''}`}
          />
          <span className="dock-header-title">NOW PLAYING</span>
          {isPlaying ? (
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
          <span className="dock-badge-hd">
            <span className="dock-badge-dot" />
            STUDIO MASTER
          </span>
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
        {/* Studio Platter Showcase */}
        <div className="dock-platter-showcase">
          <div className="dock-sleeve-frame">
            {playingTrack?.artworkUrl && (
              <img
                src={playingTrack.artworkUrl}
                alt={playingTrack.title}
                className="dock-sleeve-art"
              />
            )}
            <div className="dock-sleeve-sheen" />
          </div>

          {/* Protruding 3D Spinning Compact Disc */}
          <div className={`dock-cd-disc ${isPlaying ? 'dock-cd-disc--spinning' : ''}`}>
            {playingTrack?.artworkUrl && (
              <img
                src={playingTrack.artworkUrl}
                alt=""
                className="dock-cd-art"
              />
            )}
            <div className="dock-cd-grooves" />
            <div className="dock-cd-sheen" />
            <div className="dock-cd-spindle" />
          </div>

          {/* Dynamic Frequency Equalizer Visualizer */}
          <div className="dock-freq-visualizer" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className={`dock-freq-bar ${isPlaying ? 'dock-freq-bar--active' : ''}`}
                style={{
                  animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  animationDuration: `${0.65 + (i % 5) * 0.12}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Autoplay blocked banner */}
        {autoplayBlocked && (
          <div className="dock-alert dock-alert--autoplay" role="alert">
            <Disc3 size={15} />
            <span>Click <strong>play</strong> below to begin playback.</span>
          </div>
        )}

        {/* Track Title & Metadata */}
        <div className="dock-controls-area">
          <div className="dock-track-info">
            <span className="dock-track-title">
              {playingTrack ? playingTrack.title : 'Select a compact disc to play'}
            </span>
            <span className="dock-track-sub">
              {playingTrack ? `${playingTrack.artists.join(', ')} · ${playingTrack.albumOrFilm}` : 'KATOSI Audio Stream'}
            </span>
          </div>

          {/* Timeline Scrubber */}
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
                style={{
                  background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.15) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.15) 100%)`
                }}
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
                title="Watch full video on YouTube in a new tab"
                aria-label="Watch video on YouTube"
              >
                <span>Video</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
