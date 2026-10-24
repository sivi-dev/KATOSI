import React, { useState, useEffect } from 'react';
import type { Track, BranchCard } from '../data/tracks';
import { X, Sparkles, BookOpen, ChevronRight, Music } from 'lucide-react';
import './BranchingCanopy.css';

interface BranchingCanopyProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
}

export const BranchingCanopy: React.FC<BranchingCanopyProps> = ({
  track,
  isOpen,
  onClose,
  accentColor = '#e8a526'
}) => {
  const [selectedBranch, setSelectedBranch] = useState<BranchCard | null>(null);
  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }));

  const branches = track.branches || [];

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close full modal reader on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedBranch) {
          setSelectedBranch(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedBranch, onClose]);

  if (!isOpen) return null;

  // Polar positioning angles for 5 cards: 27° angular step ensures at least ~40px gap between cards
  // Total span is 108° (from -54° to +54°), creating a magnificent non-overlapping crown
  const angles = [-54, -27, 0, 27, 54];

  // Dynamic radius based on viewport height, ensuring the arch fits with generous margins
  const radius = Math.min(Math.max(440, windowDimensions.height * 0.58), 530);

  return (
    <div
      className="branching-canopy-overlay"
      style={{ ['--canopy-accent' as any]: accentColor }}
      role="region"
      aria-label={`Branching story canopy for ${track.title}`}
    >
      {/* Background Soft Dimmer */}
      <div className="canopy-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Canopy Header & Close Bar */}
      <div className="canopy-controls-bar">
        <div className="canopy-badge">
          <Sparkles size={14} className="canopy-badge-icon" />
          <span>STORY BRANCHES · {track.title.toUpperCase()}</span>
        </div>
        <button
          type="button"
          className="canopy-close-pill"
          onClick={onClose}
          aria-label="Close story branches"
        >
          <span>Close Branches</span>
          <X size={15} />
        </button>
      </div>

      {/* Radial Fan / Arch Canopy Container anchored from center footer */}
      <div className="canopy-arch-stage">
        {/* SVG Curved Filaments: Delicately branching from CD hub at footer up to each card */}
        <svg className="canopy-filaments-svg" aria-hidden="true" viewBox="0 0 1000 780" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="branchBeam" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#E6CA85" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#FFFDF7" stopOpacity="0.45" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.2" />
            </linearGradient>
            <filter id="branchGlow">
              <feGaussianBlur stdDeviation="2.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* 5 Organic Beziers originating from CD hub at center footer (500, 740) */}
          <path d="M 500,740 C 440,660 180,620 80,510" stroke="url(#branchBeam)" strokeWidth="1.6" fill="none" filter="url(#branchGlow)" />
          <path d="M 500,740 C 460,590 320,480 264,360" stroke="url(#branchBeam)" strokeWidth="1.6" fill="none" filter="url(#branchGlow)" />
          <path d="M 500,740 C 500,560 500,420 500,295" stroke="url(#branchBeam)" strokeWidth="2.0" fill="none" filter="url(#branchGlow)" />
          <path d="M 500,740 C 540,590 680,480 736,360" stroke="url(#branchBeam)" strokeWidth="1.6" fill="none" filter="url(#branchGlow)" />
          <path d="M 500,740 C 560,660 820,620 920,510" stroke="url(#branchBeam)" strokeWidth="1.6" fill="none" filter="url(#branchGlow)" />
        </svg>

        {/* Fanned Arch of Cards: Guaranteed proper margin between cards (zero overlap) */}
        <div className="canopy-cards-arc">
          {branches.map((branch, i) => {
            const angle = angles[i] ?? 0;
            const rad = (angle * Math.PI) / 180;
            // Polar coordinates with origin at the CD hub in the center footer
            const x = Math.sin(rad) * radius;
            const y = -Math.cos(rad) * radius;
            const rot = angle * 0.70; // Elegant tangential tilt matching classical fan reference

            return (
              <article
                key={branch.id}
                className="canopy-branch-card liquid-glass-slab"
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
                  animationDelay: `${i * 65}ms`
                }}
                onClick={() => setSelectedBranch(branch)}
              >
                {/* Signature Specular Corner Lens Flare Glints */}
                <span className="glass-glint-tl" aria-hidden="true" />
                <span className="glass-glint-br" aria-hidden="true" />

                <div className="branch-card-header">
                  <span className="branch-badge">{branch.badge}</span>
                  <span className="branch-stat-pill">{branch.statValue}</span>
                </div>

                <h3 className="branch-title">{branch.title}</h3>
                <p className="branch-preview">{branch.preview}</p>

                <div className="branch-card-footer">
                  <span className="branch-stat-label">{branch.statLabel}</span>
                  <span className="branch-open-action">
                    Read <ChevronRight size={13} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Detailed Story Reader Modal (When a card in the arch is clicked) */}
      {selectedBranch && (
        <div
          className="branch-modal-overlay"
          onClick={() => setSelectedBranch(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="branch-modal-title"
        >
          <div
            className="branch-modal-sheet liquid-glass-slab"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="glass-glint-tl" aria-hidden="true" />
            <span className="glass-glint-br" aria-hidden="true" />

            <div className="branch-modal-header">
              <div className="branch-modal-tag">
                <Music size={14} />
                <span>{track.title} · {selectedBranch.badge}</span>
              </div>
              <button
                type="button"
                className="branch-modal-close"
                onClick={() => setSelectedBranch(null)}
                aria-label="Close chapter reader"
              >
                <X size={16} />
              </button>
            </div>

            <h2 id="branch-modal-title" className="branch-modal-heading">
              {selectedBranch.title}
            </h2>

            <div className="branch-modal-meta-row">
              <div className="branch-meta-item">
                <span className="branch-meta-k">{selectedBranch.statLabel}</span>
                <span className="branch-meta-v">{selectedBranch.statValue}</span>
              </div>
              <div className="branch-meta-item">
                <span className="branch-meta-k">Album / Film</span>
                <span className="branch-meta-v">{track.albumOrFilm} ({track.year})</span>
              </div>
            </div>

            <div className="branch-modal-body">
              <p className="branch-modal-p">{selectedBranch.fullText}</p>
              {track.featuredQuote && (
                <blockquote className="branch-modal-quote">
                  “{track.featuredQuote}”
                </blockquote>
              )}
            </div>

            <div className="branch-modal-footer">
              <span className="branch-modal-hint">Press Esc or click outside to dismiss</span>
              <button
                type="button"
                className="branch-modal-done-btn"
                onClick={() => setSelectedBranch(null)}
              >
                <BookOpen size={14} />
                <span>Back to Canopy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
