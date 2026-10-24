import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Track } from '../data/tracks';
import { CompactDisc } from './CompactDisc';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DiscGallery.css';

interface DiscGalleryProps {
  tracks: Track[];
  browsingIndex: number;
  playingIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  onBrowse: (index: number) => void;
  onSelectTrack: (track: Track, index: number) => void;
  reducedMotion?: boolean;
}

export const DiscGallery: React.FC<DiscGalleryProps> = ({
  tracks,
  browsingIndex,
  playingIndex,
  isPlaying,
  isPaused,
  onBrowse,
  onSelectTrack,
  reducedMotion = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const discSize = windowWidth < 480 ? 250 : windowWidth < 768 ? 300 : windowWidth < 1200 ? 360 : 410;
  const spacing = windowWidth < 480 ? 110 : windowWidth < 768 ? 160 : 230;

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current || touchStartX.current === null) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;

    if (deltaX > threshold) {
      // Swipe right -> previous disc
      if (browsingIndex > 0) {
        onBrowse(browsingIndex - 1);
      }
    } else if (deltaX < -threshold) {
      // Swipe left -> next disc
      if (browsingIndex < tracks.length - 1) {
        onBrowse(browsingIndex + 1);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting inputs if user is typing in any input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (browsingIndex > 0) onBrowse(browsingIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (browsingIndex < tracks.length - 1) onBrowse(browsingIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [browsingIndex, tracks.length, onBrowse]);

  // Compute 3D coverflow styling for each disc
  const getDiscTransform = useCallback(
    (index: number) => {
      const diff = index - browsingIndex;
      const absDiff = Math.abs(diff);

      if (reducedMotion) {
        return {
          transform: `translateX(${diff * 100}%)`,
          opacity: diff === 0 ? 1 : 0,
          pointerEvents: (diff === 0 ? 'auto' : 'none') as 'auto' | 'none',
          zIndex: 10 - absDiff,
          visibility: (absDiff <= 1 ? 'visible' : 'hidden') as 'visible' | 'hidden'
        };
      }

      // Max visible range on each side
      const isVisible = absDiff <= 3;
      if (!isVisible) {
        return {
          display: 'none',
          zIndex: 0
        };
      }

      const xOffset = diff * spacing;
      const zOffset = -absDiff * 140;
      const yRotation = diff === 0 ? 0 : diff > 0 ? -32 : 32;
      const scale = Math.max(0.68, 1 - absDiff * 0.12);
      const opacity = Math.max(0.2, 1 - absDiff * 0.25);
      const zIndex = 20 - absDiff;

      return {
        transform: `translate3d(${xOffset}px, 0, ${zOffset}px) rotateY(${yRotation}deg) scale(${scale})`,
        opacity,
        zIndex,
        transition: 'transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.6s ease'
      };
    },
    [browsingIndex, spacing, reducedMotion]
  );

  return (
    <div
      className="disc-gallery-stage"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Interactive 3D compact disc carousel"
    >
      {/* 3D Viewport with Perspective */}
      <div className="disc-gallery-viewport">
        {tracks.map((track, idx) => {
          const isActive = idx === browsingIndex;
          const isThisPlaying = idx === playingIndex && isPlaying;
          const isThisPaused = idx === playingIndex && isPaused;
          const style = getDiscTransform(idx);

          return (
            <div
              key={track.id}
              className={`disc-gallery-item ${isActive ? 'disc-gallery-item--active' : ''}`}
              style={style}
              onClick={() => {
                if (!isActive) {
                  onBrowse(idx);
                } else {
                  onSelectTrack(track, idx);
                }
              }}
            >
              <CompactDisc
                track={track}
                index={idx}
                isActive={isActive}
                isPlaying={isThisPlaying}
                isPaused={isThisPaused}
                onSelect={(t, i) => {
                  if (!isActive) {
                    onBrowse(i);
                  } else {
                    onSelectTrack(t, i);
                  }
                }}
                size={discSize}
                reducedMotion={reducedMotion}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        className="gallery-nav-btn gallery-nav-btn--prev"
        onClick={() => browsingIndex > 0 && onBrowse(browsingIndex - 1)}
        disabled={browsingIndex === 0}
        aria-label="Previous compact disc"
        title="Previous disc (Left Arrow)"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        className="gallery-nav-btn gallery-nav-btn--next"
        onClick={() => browsingIndex < tracks.length - 1 && onBrowse(browsingIndex + 1)}
        disabled={browsingIndex === tracks.length - 1}
        aria-label="Next compact disc"
        title="Next disc (Right Arrow)"
      >
        <ChevronRight size={24} />
      </button>

      {/* Disc Position Dots for mobile/quick pagination */}
      <div className="gallery-pagination" role="tablist" aria-label="Disc selection">
        {tracks.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={idx === browsingIndex}
            aria-label={`Select track ${idx + 1}: ${t.title}`}
            className={`gallery-dot ${idx === browsingIndex ? 'gallery-dot--active' : ''} ${idx === playingIndex ? 'gallery-dot--playing' : ''}`}
            onClick={() => onBrowse(idx)}
          />
        ))}
      </div>
    </div>
  );
};
