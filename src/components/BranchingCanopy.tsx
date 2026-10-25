import React, { useState, useEffect, useMemo } from 'react';
import type { Track, BranchCard } from '../data/tracks';
import { X, Play, Pause } from 'lucide-react';
import './BranchingCanopy.css';

interface BranchingCanopyProps {
  track: Track;
  isOpen: boolean;
  isClosing?: boolean;
  onClose: () => void;
  accentColor?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

interface CardLayoutItem {
  branch: BranchCard;
  index: number;
  x: number;
  y: number;
  rotation: number;
  startX: number;
  startY: number;
  unfoldDelay: number;
  floatDelay: number;
  zIndex: number;
}

export const BranchingCanopy: React.FC<BranchingCanopyProps> = ({
  track,
  isOpen,
  isClosing = false,
  onClose,
  accentColor = '#E8A526',
  isPlaying = false,
  onTogglePlay
}) => {
  const [selectedBranch, setSelectedBranch] = useState<BranchCard | null>(null);
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900
  }));

  const branches = track.branches || [];

  // Track window size for synchronized responsive layout
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard accessibility: dismiss modal reader or close notes on Esc
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

  // Compute synchronized semicircular fan layout for 5 cards following the CD's upper rim
  const layout = useMemo(() => {
    const { width, height } = dimensions;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1100;

    // CD Radius matching OrthographicCamera scale in lower-center branches mode:
    const baseRadius = isMobile
      ? Math.min(width * 0.34, height * 0.24)
      : Math.min(width * 0.175, height * 0.295);
    const cdRadius = isMobile ? baseRadius * 1.05 : baseRadius * 1.15;

    // Card sizes calibrated so 5 cards fit naturally in a semicircular fan without crowding
    const cardWidth = isMobile
      ? 220
      : isTablet
        ? 168
        : Math.min(184, Math.max(165, width * 0.125));

    const cardHeight = isMobile
      ? 185
      : isTablet
        ? 168
        : Math.min(182, Math.max(165, height * 0.20));

    if (isMobile) {
      return {
        isMobile: true,
        isTablet: false,
        cdRadius,
        cardWidth,
        cardHeight,
        cards: [] as CardLayoutItem[]
      };
    }

    // Radial distances from CD center to the card centers
    // Small uniform gap between final card bottom and CD rim (~16-22px)
    const gap = 18;
    const Ry = cdRadius + gap + cardHeight * 0.50;
    const Rx = cdRadius + gap + cardHeight * 0.52 + (isTablet ? 15 : 28);

    // 5 Semicircular fan positions crowning the upper half of the CD:
    // 0: Far Left (Cinema) - angle: -48°, rotation: -24°
    // 1: Mid Left (Harmony) - angle: -24°, rotation: -12°
    // 2: Center Top (Poetry) - angle: 0°, rotation: 0°
    // 3: Mid Right (Vocals) - angle: +24°, rotation: +12°
    // 4: Far Right (Legacy) - angle: +48°, rotation: +24°
    const fanAnglesDeg = [-48, -24, 0, 24, 48];
    const fanRotationsDeg = [-24, -12, 0, 12, 24];
    // Center-outward unfolding delays (~70ms stagger, unfolding like a peacock fan)
    const unfoldDelaysMs = [700, 630, 560, 630, 700];
    const floatDelaysSec = [0.4, 0.2, 0, 0.2, 0.4];
    const zIndices = [8, 9, 10, 9, 8];

    const cards: CardLayoutItem[] = branches.slice(0, 5).map((branch, index) => {
      const angleDeg = fanAnglesDeg[index];
      const rad = (angleDeg * Math.PI) / 180;
      const rotation = fanRotationsDeg[index];

      // Settle position (center of card relative to CD center)
      const x = Rx * Math.sin(rad);
      const y = -Ry * Math.cos(rad);

      // Start position for unfold animation (from just behind the upper rim)
      const rimR = cdRadius * 0.88;
      const startX = rimR * Math.sin(rad * 0.6);
      const startY = -rimR * Math.cos(rad * 0.6);

      return {
        branch,
        index,
        x,
        y,
        rotation,
        startX,
        startY,
        unfoldDelay: unfoldDelaysMs[index],
        floatDelay: floatDelaysSec[index],
        zIndex: zIndices[index]
      };
    });

    return {
      isMobile: false,
      isTablet,
      cdRadius,
      cardWidth,
      cardHeight,
      cards
    };
  }, [dimensions, branches]);

  if (!isOpen) return null;

  return (
    <div
      className={`katosi-notes-view ${isClosing ? 'katosi-notes-view--closing' : ''}`}
      style={{ ['--notes-accent' as any]: accentColor }}
      role="region"
      aria-label={`Expanded song notes for ${track.title}`}
    >
      {/* Deep Aubergine / Midnight Navy Atmosphere */}
      <div className="notes-aubergine-aura" aria-hidden="true" />
      <div className="notes-backdrop-dismiss" onClick={onClose} aria-hidden="true" />

      {layout.isMobile ? (
        /* Mobile Layout: CD on top with carousel cards below */
        <div className="notes-mobile-stage">
          <div className="notes-mobile-center-meta">
            <h2 className="notes-center-title">{track.title}</h2>
            <p className="notes-center-artist">{track.artists.join(', ')} · {track.albumOrFilm}</p>
            {onTogglePlay && (
              <button
                type="button"
                className="notes-center-play-btn"
                onClick={onTogglePlay}
                aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                {isPlaying ? <Pause size={14} fill="#ffffff" /> : <Play size={14} fill="#ffffff" className="play-icon-shim" />}
              </button>
            )}
          </div>

          <div className="notes-mobile-carousel">
            {branches.map((branch) => (
              <article
                key={branch.id}
                className="notes-glass-card notes-glass-card--mobile"
                onClick={() => setSelectedBranch(branch)}
              >
                <div className="notes-card-badge-row">
                  <span className="notes-card-badge">{branch.badge}</span>
                </div>
                <h3 className="notes-card-title">{branch.title}</h3>
                <p className="notes-card-preview">{branch.preview}</p>
                <div className="notes-card-footer">
                  <span className="notes-card-read-action">
                    Read ↗
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="notes-mobile-hint" aria-hidden="true">
            Swipe cards to explore · Tap Read ↗ for story
          </div>
        </div>
      ) : (
        /* Desktop & Tablet Lower-Center Composition */
        <div className="notes-ellipse-stage">
          {/* Five Semicircular Fan Glass Cards - Unfolds from behind CD rim */}
          <div className="notes-cards-container">
            {layout.cards.map((item) => {
              const { branch, x, y, rotation, startX, startY, unfoldDelay, floatDelay, zIndex } = item;
              return (
                <article
                  key={branch.id}
                  className={`notes-glass-card ${isClosing ? 'notes-glass-card--closing' : ''}`}
                  style={{
                    width: `${layout.cardWidth}px`,
                    height: `${layout.cardHeight}px`,
                    marginLeft: `${-layout.cardWidth / 2}px`,
                    marginTop: `${-layout.cardHeight / 2}px`,
                    zIndex,
                    ['--settle-x' as any]: `${x}px`,
                    ['--settle-y' as any]: `${y}px`,
                    ['--settle-rot' as any]: `${rotation}deg`,
                    ['--unfold-start-x' as any]: `${startX}px`,
                    ['--unfold-start-y' as any]: `${startY}px`,
                    ['--unfold-delay' as any]: `${unfoldDelay}ms`,
                    ['--float-delay' as any]: `${floatDelay}s`,
                  }}
                  onClick={() => setSelectedBranch(branch)}
                >
                  <div className="notes-card-badge-row">
                    <span className="notes-card-badge">{branch.badge}</span>
                  </div>

                  <h3 className="notes-card-title">{branch.title}</h3>
                  <p className="notes-card-preview">{branch.preview}</p>

                  <div className="notes-card-footer">
                    <span className="notes-card-read-action">
                      Read ↗
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Lower Center Song Title, Artist Metadata & Play/Pause Button - Safely inside viewport */}
          <div className="notes-center-metadata">
            <div className="notes-brand-badge">
              <img src="/brand/katosi-mark.png" alt="" className="notes-brand-icon" />
              <span>KATOSI ARCHIVE</span>
            </div>
            <h2 className="notes-center-title">{track.title}</h2>
            <p className="notes-center-artist">{track.artists.join(', ')} · {track.albumOrFilm}</p>
            {onTogglePlay && (
              <button
                type="button"
                className="notes-center-play-btn"
                onClick={onTogglePlay}
                aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                title={isPlaying ? 'Pause song' : 'Play song'}
              >
                {isPlaying ? (
                  <Pause size={14} fill="#ffffff" />
                ) : (
                  <Play size={14} fill="#ffffff" className="play-icon-shim" />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Detailed Story Reader Modal (When Read ↗ is clicked) */}
      {selectedBranch && (
        <div
          className="branch-modal-overlay"
          onClick={() => setSelectedBranch(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="branch-modal-title"
        >
          <div
            className="branch-modal-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="branch-modal-header">
              <div className="branch-modal-tag">
                <img src="/brand/katosi-mark.png" alt="" className="modal-brand-mark" />
                <span>{track.title} · {selectedBranch.badge}</span>
              </div>
              <button
                type="button"
                className="branch-modal-close"
                onClick={() => setSelectedBranch(null)}
                aria-label="Close story reader"
              >
                <X size={18} />
              </button>
            </div>

            <h3 id="branch-modal-title" className="branch-modal-title">{selectedBranch.title}</h3>

            <div className="branch-modal-body">
              <p>{selectedBranch.fullText}</p>
            </div>

            <div className="branch-modal-stat-pill">
              <span className="stat-pill-label">{selectedBranch.statLabel}</span>
              <span className="stat-pill-value">{selectedBranch.statValue}</span>
            </div>

            <div className="branch-modal-footer">
              <span className="modal-esc-hint">Press Esc or click outside to dismiss</span>
              <button
                type="button"
                className="branch-modal-done-btn"
                onClick={() => setSelectedBranch(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
