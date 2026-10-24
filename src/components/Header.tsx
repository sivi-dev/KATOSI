import React from 'react';
import { ListMusic, Volume2 } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onOpenIndex: () => void;
  trackCount: number;
  activeTrackTitle?: string;
  isPlaying?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenIndex,
  trackCount,
  activeTrackTitle,
  isPlaying
}) => {
  return (
    <header className="katosi-header" role="banner">
      {/* Brand & Monogram */}
      <div className="header-brand-group">
        <a href="/" className="katosi-logo-link" aria-label="KATOSI Home">
          <svg className="katosi-brand-mark" viewBox="0 0 32 32" fill="none">
            {/* Concentric sound reflection disc motif */}
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7" />
            <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="2.5" fill="currentColor" />
          </svg>
          <span className="katosi-wordmark">KATOSI</span>
        </a>
        <span className="header-separator">/</span>
        <span className="header-tagline">Sound Reflects You</span>
      </div>

      {/* Center audio indicator if playing */}
      {isPlaying && activeTrackTitle && (
        <div className="header-playing-badge" title="Audio currently active">
          <Volume2 size={13} className="header-vol-icon" />
          <span className="header-playing-text">Streaming: {activeTrackTitle}</span>
        </div>
      )}

      {/* Actions */}
      <div className="header-actions">
        <button
          type="button"
          className="header-index-btn"
          onClick={onOpenIndex}
          aria-label="Open track index"
          title="Open Track Index"
        >
          <ListMusic size={16} />
          <span className="header-index-label">TRACK INDEX</span>
          <span className="header-count-pill">{trackCount}</span>
        </button>
      </div>
    </header>
  );
};
