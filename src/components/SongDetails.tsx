import React from 'react';
import type { Track } from '../data/tracks';
import { Play, Pause, ExternalLink, Disc3 } from 'lucide-react';
import './SongDetails.css';

interface SongDetailsProps {
  track: Track;
  index: number;
  totalTracks: number;
  isCurrentlyPlaying: boolean;
  isCurrentlyPaused: boolean;
  onPlayToggle: () => void;
  onJumpToPlaying?: () => void;
  playingTrackTitle?: string;
}

export const SongDetails: React.FC<SongDetailsProps> = ({
  track,
  index,
  totalTracks,
  isCurrentlyPlaying,
  isCurrentlyPaused,
  onPlayToggle,
  onJumpToPlaying,
  playingTrackTitle
}) => {
  const isPlayingThis = isCurrentlyPlaying;
  const isPausedThis = isCurrentlyPaused;
  const hasActiveAudioElsewhere = !!playingTrackTitle && !isPlayingThis && !isPausedThis;

  return (
    <section className="song-details-section" aria-label={`Details for ${track.title}`}>
      {/* Index tracker and active status pill */}
      <div className="song-details-header">
        <span className="song-index-counter">
          TRACK {String(index + 1).padStart(2, '0')} / {String(totalTracks).padStart(2, '0')}
        </span>

        {isPlayingThis && (
          <span className="song-status-pill song-status-pill--playing">
            <span className="status-equalizer-bar" />
            <span className="status-equalizer-bar" />
            <span className="status-equalizer-bar" />
            NOW PLAYING
          </span>
        )}

        {isPausedThis && (
          <span className="song-status-pill song-status-pill--paused">
            PAUSED
          </span>
        )}

        {hasActiveAudioElsewhere && (
          <button
            type="button"
            className="song-jump-btn"
            onClick={onJumpToPlaying}
            title={`Return to currently playing disc: ${playingTrackTitle}`}
          >
            <Disc3 size={12} className="spin-subtle" />
            <span>PLAYING: {playingTrackTitle}</span>
          </button>
        )}
      </div>

      {/* Main Track Title */}
      <h1 className="song-title">{track.title}</h1>

      {/* Metadata Specification Panels with Fine Dividers */}
      <div className="song-meta-panels">
        <div className="song-meta-row">
          <span className="meta-label">ALBUM / FILM</span>
          <span className="meta-value">{track.albumOrFilm}</span>
        </div>

        <div className="song-meta-row">
          <span className="meta-label">COMPOSER</span>
          <span className="meta-value">{track.composer}</span>
        </div>

        <div className="song-meta-row">
          <span className="meta-label">PERFORMED BY</span>
          <span className="meta-value">{track.artists.join(', ')}</span>
        </div>

        <div className="song-meta-row">
          <span className="meta-label">YEAR & LABEL</span>
          <span className="meta-value">
            {track.year} • {track.label}
          </span>
        </div>

        {track.notes && (
          <div className="song-meta-row">
            <span className="meta-label">VERSION</span>
            <span className="meta-value meta-value--highlight">{track.notes}</span>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="song-actions">
        <button
          type="button"
          className={`song-primary-btn ${isPlayingThis ? 'song-primary-btn--playing' : ''}`}
          onClick={onPlayToggle}
          aria-label={isPlayingThis ? 'Pause this track' : 'Play this track'}
        >
          {isPlayingThis ? (
            <>
              <Pause size={18} />
              <span>PAUSE DISC</span>
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              <span>{isPausedThis ? 'RESUME PLAYBACK' : 'PLAY ONLINE'}</span>
            </>
          )}
        </button>

        {track.youtubeUrl && (
          <a
            href={track.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="song-secondary-link"
            title="Open verified official release on YouTube"
          >
            <ExternalLink size={16} />
            <span>YouTube</span>
          </a>
        )}
      </div>
    </section>
  );
};
