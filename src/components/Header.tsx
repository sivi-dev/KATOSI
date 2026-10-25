import React from 'react';
import './Header.css';
interface HeaderProps { onOpenIndex: () => void; trackCount: number; activeTrackTitle?: string; isPlaying?: boolean; }
export const Header: React.FC<HeaderProps> = ({onOpenIndex, trackCount}) => (
  <header className="katosi-header">
    <a href="/" className="katosi-logo-link" aria-label="KATOSI home">
      <img src="/brand/katosi-logo.png" alt="KATOSI" className="katosi-header-logo" />
    </a>
    <span className="collection-label">Music<span className="nav-dot">•</span></span>
    <span className="header-archive">A personal collection</span>
    <button className="header-index-btn" onClick={onOpenIndex} aria-label="Open track index">Index <span>⌄</span><sup>{trackCount}</sup></button>
  </header>
);
