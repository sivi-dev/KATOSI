import React, { useEffect, useRef } from 'react';
import type { Track } from '../data/tracks';
import { X, Play, Pause, Disc3 } from 'lucide-react';
import './TrackIndex.css';

interface TrackIndexProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  browsingIndex: number;
  playingIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  onSelectTrack: (index: number, andPlay?: boolean) => void;
}

export const TrackIndex: React.FC<TrackIndexProps> = ({
  isOpen,
  onClose,
  tracks,
  browsingIndex,
  playingIndex,
  isPlaying,
  isPaused,
  onSelectTrack
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="track-index-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-index-heading"
    >
      <div
        className="track-index-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="track-index-header">
          <div className="track-index-title-group">
            <span className="track-index-tag">COLLECTION INDEX</span>
            <h2 id="track-index-heading" className="track-index-title">
              Complete Tracklist ({tracks.length})
            </h2>
          </div>
          <button
            type="button"
            className="track-index-close-btn"
            onClick={onClose}
            aria-label="Close track index"
          >
            <X size={20} />
          </button>
        </div>

        <p className="track-index-hint">
          Click any song to browse its disc, or press the play button to stream online directly.
        </p>

        <div className="track-index-list" role="list">
          {tracks.map((track, idx) => {
            const isBrowsed = idx === browsingIndex;
            const isCurrentlyPlaying = idx === playingIndex && isPlaying;
            const isCurrentlyPaused = idx === playingIndex && isPaused;

            return (
              <div
                key={track.id}
                role="listitem"
                className={`track-index-row ${isBrowsed ? 'track-index-row--browsed' : ''} ${isCurrentlyPlaying ? 'track-index-row--playing' : ''}`}
                onClick={() => {
                  onSelectTrack(idx, false);
                  onClose();
                }}
              >
                {/* Track Number / Indicator */}
                <div className="track-index-col-num">
                  {isCurrentlyPlaying ? (
                    <div className="track-mini-eq" title="Now Playing">
                      <span className="mini-eq-bar" />
                      <span className="mini-eq-bar" />
                      <span className="mini-eq-bar" />
                    </div>
                  ) : isCurrentlyPaused ? (
                    <span className="track-mini-paused" title="Paused">⏸</span>
                  ) : (
                    <span className="track-number">{String(idx + 1).padStart(2, '0')}</span>
                  )}
                </div>

                {/* Disc Thumbnail */}
                <div className="track-index-thumbnail">
                  <img
                    src={track.artworkUrl}
                    alt=""
                    className="track-thumb-img"
                    loading="lazy"
                  />
                  <div className="track-thumb-hole" />
                </div>

                {/* Track Info */}
                <div className="track-index-col-info">
                  <span className="track-item-title">{track.title}</span>
                  <span className="track-item-meta">
                    {track.artists.join(', ')} • <em>{track.albumOrFilm}</em> ({track.year})
                  </span>
                </div>

                {/* Play Button Shortcut */}
                <button
                  type="button"
                  className={`track-play-shortcut ${isCurrentlyPlaying ? 'track-play-shortcut--active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrack(idx, true);
                  }}
                  aria-label={`Play ${track.title}`}
                  title={isCurrentlyPlaying ? 'Pause' : 'Play'}
                >
                  {isCurrentlyPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="track-index-footer">
          <div className="track-index-legend">
            <span className="legend-item">
              <Disc3 size={14} /> <span>10 Verified Cinema Tracks</span>
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-dot--playing" /> <span>Green: Active stream</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
