import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
const DiscGallery = lazy(() => import('./components/DiscGallery').then(module => ({ default: module.DiscGallery })));
import { NowPlayingDock } from './components/NowPlayingDock';
import { BranchingCanopy } from './components/BranchingCanopy';
import './App.css';
import './glass-theme.css';

function songFromLocation() {
  const match = /^\/songs\/([^/]+)\/?$/.exec(window.location.pathname);
  try { return match ? decodeURIComponent(match[1]) : null; } catch { return null; }
}

function MusicCollection() {
  const audio = useAudio();
  const initialSongId = songFromLocation();
  const initialIndex = initialSongId ? Math.max(0, audio.tracks.findIndex(t => t.id === initialSongId)) : 0;

  const [browsingIndex, setBrowsingIndex] = useState<number>(initialIndex);
  const [minimizedIndex, setMinimizedIndex] = useState<number | null>(() => (initialSongId ? initialIndex : null));
  const [isBranched, setIsBranched] = useState<boolean>(() => initialSongId !== null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const track = audio.tracks[browsingIndex] || audio.tracks[0];
  const isSelectedPlaying = audio.playingIndex === browsingIndex && audio.isPlaying;

  const browse = useCallback((index: number) => {
    setBrowsingIndex(Math.max(0, Math.min(audio.tracks.length - 1, index)));
  }, [audio.tracks.length]);

  const playSong = audio.playTrack;

  const selectTrack = useCallback((selected: typeof track, index: number) => {
    playSong(selected, index);
  }, [playSong]);

  // In-Place Branching Canopy: Minimizes CD and opens overhead arch of cards on the same page
  const openBranchCanopy = useCallback((index: number) => {
    setBrowsingIndex(index);
    setMinimizedIndex(index);
    setIsBranched(true);
    const selected = audio.tracks[index];
    if (selected) {
      window.history.pushState({}, '', `/songs/${selected.id}`);
    }
  }, [audio.tracks]);

  const closeBranchCanopy = useCallback(() => {
    setIsBranched(false);
    setMinimizedIndex(null);
    window.history.pushState({}, '', '/');
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const pop = () => {
      const id = songFromLocation();
      if (id) {
        const index = audio.tracks.findIndex(item => item.id === id);
        if (index >= 0) {
          setBrowsingIndex(index);
          setMinimizedIndex(index);
          setIsBranched(true);
        }
      } else {
        setIsBranched(false);
        setMinimizedIndex(null);
      }
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, [audio.tracks]);

  useEffect(() => {
    document.title = `${track.title} — KATOSI · Sound Reflects You`;
  }, [track.title]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', change);
    return () => mq.removeEventListener('change', change);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'ArrowRight' && !isBranched) { event.preventDefault(); browse(browsingIndex + 1); }
      if (event.key === 'ArrowLeft' && !isBranched) { event.preventDefault(); browse(browsingIndex - 1); }
      if (event.key === 'Escape' && isBranched) { event.preventDefault(); closeBranchCanopy(); }
      if (event.key === 'Enter' || event.code === 'Space') {
        if (target.closest('button,a')) return;
        event.preventDefault();
        selectTrack(track, browsingIndex);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [browse, browsingIndex, track, selectTrack, isBranched, closeBranchCanopy]);

  return (
    <div
      className="collection-page"
      style={{
        ['--active-accent' as any]: track.accentColor || '#e8a526'
      }}
    >
      {/* Live Animated Flowing Gradient Canvas Background */}
      <div className="live-gradient-stage" aria-hidden="true">
        <div className="live-gradient-orb live-gradient-orb--1" />
        <div className="live-gradient-orb live-gradient-orb--2" />
        <div className="live-gradient-orb live-gradient-orb--3" />
        <div className="live-gradient-aurora" />
      </div>

      {/* Dynamic Background Volumetric Light & Optical Ambient Glow */}
      <div className="ambient-stage-glow" aria-hidden="true" />
      <div className="ambient-radial-spot" aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />

      <main className="collection-stage" aria-label="KATOSI music collection">
        {/* Floating Top Glass Navigation */}
        <header className="archive-nav" aria-label="Main navigation">
          <a className="archive-wordmark" href="/" onClick={(e) => { e.preventDefault(); if (isBranched) closeBranchCanopy(); }} aria-label="KATOSI home">
            <span className="editorial-mark" aria-hidden="true" />
            KATOSI
          </a>
          <div className="editorial-nav-links">
            <button
              type="button"
              onClick={() => (isBranched ? closeBranchCanopy() : openBranchCanopy(browsingIndex))}
            >
              {isBranched ? 'Close Branches ✕' : 'Song Branches ↗'}
            </button>
            <span>Sound Reflects You</span>
          </div>
        </header>

        {/* Left Hero Glass Card: Ultra-Realistic Beveled Glass Slab */}
        <section
          key={track.id}
          className={`track-credits liquid-glass-slab ${isBranched ? 'track-credits--tucked' : ''}`}
          aria-label={`Details for ${track.title}`}
        >
          {/* Signature Corner Lens Flare Glints */}
          <span className="glass-glint-tl" aria-hidden="true" />
          <span className="glass-glint-br" aria-hidden="true" />

          <div className="track-credits-tag">
            <span>RECORD {String(browsingIndex + 1).padStart(2, '0')} / {String(audio.tracks.length).padStart(2, '0')}</span>
            <span>{track.label.toUpperCase()}</span>
          </div>

          <h2>{track.title}</h2>
          <div className="track-credits-artist">{track.artists.join(', ')}</div>

          <dl>
            <div>
              <dt>ALBUM / FILM</dt>
              <dd>{track.albumOrFilm}</dd>
            </div>
            <div>
              <dt>COMPOSED BY</dt>
              <dd>{track.composer}</dd>
            </div>
            <div>
              <dt>LYRICS BY</dt>
              <dd>{track.lyricist}</dd>
            </div>
            <div>
              <dt>RELEASE YEAR</dt>
              <dd>{track.year}</dd>
            </div>
          </dl>

          {track.featuredQuote && (
            <div className="track-quote-box">
              <em>“{track.featuredQuote}”</em>
            </div>
          )}

          <div className="track-card-actions">
            <button
              type="button"
              className={`glass-play-btn ${isSelectedPlaying ? 'glass-play-btn--active' : ''}`}
              onClick={() => selectTrack(track, browsingIndex)}
              aria-label={isSelectedPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            >
              {isSelectedPlaying ? (
                <>
                  <span className="equalizer-bars" aria-hidden="true">
                    <span className="eq-bar eq-bar--1" />
                    <span className="eq-bar eq-bar--2" />
                    <span className="eq-bar eq-bar--3" />
                  </span>
                  <span>Pause Record</span>
                </>
              ) : (
                <>
                  <span className="play-triangle-icon" aria-hidden="true">▶</span>
                  <span>Play Record</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="track-detail-link"
              onClick={() => openBranchCanopy(browsingIndex)}
            >
              Branches ↗
            </button>
          </div>
        </section>

        {/* Hidden accessible button */}
        <button
          className="sr-only accessible-play"
          onClick={() => selectTrack(track, browsingIndex)}
        >
          {isSelectedPlaying ? 'Pause' : 'Play'} {track.title}
        </button>

        {/* Center 3D Disc Gallery */}
        <div className="gallery-stage-container">
          <Suspense fallback={<div className="scene-loading" role="status" aria-label="Loading record collection" />}>
            <DiscGallery
              tracks={audio.tracks}
              browsingIndex={browsingIndex}
              playingIndex={audio.playingIndex}
              isPlaying={audio.isPlaying}
              isPaused={audio.playbackState === 'paused'}
              reducedMotion={reducedMotion}
              onBrowse={browse}
              onSelectTrack={selectTrack}
              onOpenTrack={openBranchCanopy}
              onMinimizeTrack={setMinimizedIndex}
              minimizedIndex={minimizedIndex}
              isBranched={isBranched}
            />
          </Suspense>

          {/* In-Place Branching Arch Canopy: Radiates overhead in an arc, crowning the minimized CD */}
          <BranchingCanopy
            track={track}
            isOpen={isBranched}
            onClose={closeBranchCanopy}
            accentColor={track.accentColor}
          />

          {/* 3D Glass Mirror Reflection Floor beneath the CD */}
          <div className={`disc-floor-reflection ${isBranched ? 'disc-floor-reflection--footer' : ''}`} aria-hidden="true" />
        </div>

        {/* Bottom Floating Glass Navigation Pill */}
        {!isBranched && (
          <nav className="record-navigation" aria-label="Browse records">
            <button
              onClick={() => browse(browsingIndex - 1)}
              disabled={browsingIndex === 0}
              aria-label="Previous compact disc"
              title="Previous record (Left Arrow)"
            >
              ←
            </button>
            <span>
              {String(browsingIndex + 1).padStart(2, '0')}
              <span className="record-counter-divider">/</span>
              {String(audio.tracks.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => browse(browsingIndex + 1)}
              disabled={browsingIndex === audio.tracks.length - 1}
              aria-label="Next compact disc"
              title="Next record (Right Arrow)"
            >
              →
            </button>
          </nav>
        )}

        {/* Footer Hints */}
        <footer className="archive-footer">
          <span className="archive-instructions">
            Drag to browse · Space or Click to listen · Double-click CD for story branches <span>↗</span>
          </span>
          <span className="archive-signature">KATOSI · Sound Reflects You</span>
        </footer>
      </main>

      {/* Floating Compliant YouTube Player Dock with 16:9 Video Canvas and Tactile Equalizer Controls */}
      <NowPlayingDock />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MusicCollection />
    </AudioProvider>
  );
}
