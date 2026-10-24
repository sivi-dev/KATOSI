import React, { useState } from 'react';
import type { Track } from '../data/tracks';
import { Play, Pause } from 'lucide-react';
import './CompactDisc.css';

interface CompactDiscProps {
  track: Track;
  index: number;
  isActive: boolean;        // Is this the currently browsed/viewed disc
  isPlaying: boolean;       // Is this specific disc currently playing
  isPaused: boolean;        // Is this specific disc currently paused
  onSelect: (track: Track, index: number) => void;
  size?: number;
  reducedMotion?: boolean;
}

export const CompactDisc: React.FC<CompactDiscProps> = ({
  track,
  index,
  isActive,
  isPlaying,
  isPaused,
  onSelect,
  size = 380,
  reducedMotion = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(track, index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(track, index);
    }
  };

  const isCurrentPlayingTrack = isPlaying || isPaused;

  return (
    <div
      className={`cd-wrapper ${isActive ? 'cd-wrapper--active' : ''} ${isPlaying ? 'cd-wrapper--playing' : ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        maxWidth: '85vw',
        maxHeight: '85vw'
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`${track.title} by ${track.artists.join(', ')}. ${isCurrentPlayingTrack ? (isPlaying ? 'Currently playing. Click to pause.' : 'Currently paused. Click to resume.') : 'Click to select and play.'}`}
    >
      {/* 3D Depth Cast Shadow */}
      <div className="cd-ambient-shadow" />

      {/* Main Rotating Disc Platter */}
      <div
        className={`cd-platter ${isPlaying && !reducedMotion ? 'cd-platter--spinning' : ''} ${isPaused ? 'cd-platter--paused' : ''}`}
      >
        {/* Polycarbonate Outer Rim */}
        <div className="cd-outer-rim" />

        {/* Circular Artwork or Fallback */}
        <div className="cd-artwork-container">
          {imageLoaded && track.artworkUrl ? (
            <img
              src={track.artworkUrl}
              alt={`${track.title} artwork`}
              className="cd-artwork-img"
              onError={() => setImageLoaded(false)}
              loading="lazy"
            />
          ) : (
            <div className="cd-fallback-artwork">
              <div className="cd-fallback-pattern" />
              <div className="cd-fallback-text">
                <span className="cd-fallback-brand">KATOSI</span>
                <span className="cd-fallback-title">{track.title}</span>
                <span className="cd-fallback-artist">{track.artists[0]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Micro concentric data grooves */}
        <div className="cd-grooves-layer" />

        {/* Anisotropic Prism / Specular Glare Sheen */}
        <div className="cd-sheen-layer" />
        <div className="cd-sheen-sweep" />

        {/* Outer Mirror Ring */}
        <div className="cd-mirror-ring" />

        {/* Mirror Clamping Band with Laser Matrix Stamper Text */}
        <div className="cd-metallic-band">
          <svg className="cd-laser-text-svg" viewBox="0 0 200 200">
            <path
              id={`stamper-path-${index}`}
              d="M 100, 100 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
              fill="none"
            />
            <text className="cd-stamper-text">
              <textPath href={`#stamper-path-${index}`} startOffset="0%">
                KATOSI COMPACT DISC • DIGITAL AUDIO • MASTER 24-BIT • {track.label.toUpperCase()} •
              </textPath>
            </text>
          </svg>
        </div>

        {/* Clear Plastic Inner Hub */}
        <div className="cd-plastic-hub">
          <div className="cd-hub-ridge" />
        </div>

        {/* Center Spindle Transparent Hole */}
        <div className="cd-center-hole">
          <div className="cd-hole-rim" />
        </div>
      </div>

      {/* Floating Center Play/Pause Indicator on hover or when active */}
      {(isHovered || isCurrentPlayingTrack) && (
        <div className={`cd-control-badge ${isPlaying ? 'cd-control-badge--playing' : ''}`}>
          {isPlaying ? (
            <Pause size={18} className="cd-badge-icon" />
          ) : (
            <Play size={18} className="cd-badge-icon cd-badge-icon--play" />
          )}
        </div>
      )}
    </div>
  );
};
