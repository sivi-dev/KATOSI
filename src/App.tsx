import React, { useState, useEffect } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Header } from './components/Header';
import { DiscGallery } from './components/DiscGallery';
import { SongDetails } from './components/SongDetails';
import { TrackIndex } from './components/TrackIndex';
import { NowPlayingDock } from './components/NowPlayingDock';
import { Compass, Keyboard } from 'lucide-react';
import './App.css';
import './reference-theme.css';

const MainAppContent: React.FC = () => {
  const {
    tracks,
    playingTrack,
    playingIndex,
    playbackState,
    isPlaying,
    playTrack,
    togglePlayPause
  } = useAudio();

  const [browsingIndex, setBrowsingIndex] = useState<number>(0);
  const [isTrackIndexOpen, setIsTrackIndexOpen] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Spacebar keyboard shortcut for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (playingIndex === -1) {
          playTrack(tracks[browsingIndex], browsingIndex);
        } else {
          togglePlayPause();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playingIndex, browsingIndex, tracks, playTrack, togglePlayPause]);

  const currentBrowsedTrack = tracks[browsingIndex] || tracks[0];
  const isBrowsedTrackPlaying = browsingIndex === playingIndex && isPlaying;
  const isBrowsedTrackPaused = browsingIndex === playingIndex && playbackState === 'paused';

  const handleSelectTrackFromGallery = (track: typeof currentBrowsedTrack, index: number) => {
    playTrack(track, index);
  };

  const handleSelectTrackFromIndex = (index: number, andPlay?: boolean) => {
    setBrowsingIndex(index);
    if (andPlay) {
      playTrack(tracks[index], index);
    }
  };

  const handleJumpToPlaying = () => {
    if (playingIndex >= 0 && playingIndex < tracks.length) {
      setBrowsingIndex(playingIndex);
    }
  };

  return (
    <div
      className="katosi-experience-wrapper"
      style={{
        // Dynamic ambient tint from active track's accent palette
        ['--track-ambient-color' as any]: currentBrowsedTrack.accentColor || '#3d5a80'
      }}
    >
      {/* Dynamic Ambient Background Glow & Film Grain */}
      <div className="ambient-glow" />
      <div className="ambient-radial-spot" />
      <div className="film-grain-layer" />

      {/* Header */}
      <Header
        onOpenIndex={() => setIsTrackIndexOpen(true)}
        trackCount={tracks.length}
        activeTrackTitle={playingTrack?.title}
        isPlaying={isPlaying}
      />

      {/* Main Experience Layout */}
      <main className="katosi-main-container">
        {/* Left Side: Song Metadata & Typography Hierarchy */}
        <div className="katosi-info-column">
          <SongDetails
            track={currentBrowsedTrack}
            index={browsingIndex}
            totalTracks={tracks.length}
            isCurrentlyPlaying={isBrowsedTrackPlaying}
            isCurrentlyPaused={isBrowsedTrackPaused}
            onPlayToggle={() => playTrack(currentBrowsedTrack, browsingIndex)}
            onJumpToPlaying={handleJumpToPlaying}
            playingTrackTitle={playingTrack?.title}
          />
        </div>

        {/* Right / Center: Interactive 3D Disc Gallery */}
        <div className="katosi-disc-column">
          <DiscGallery
            tracks={tracks}
            browsingIndex={browsingIndex}
            playingIndex={playingIndex}
            isPlaying={isPlaying}
            isPaused={playbackState === 'paused'}
            onBrowse={(idx) => setBrowsingIndex(idx)}
            onSelectTrack={handleSelectTrackFromGallery}
            reducedMotion={prefersReducedMotion}
          />
        </div>
      </main>

      <div className="collection-caption" aria-live="polite">
        <span>THE KATOSI COLLECTION · {String(browsingIndex + 1).padStart(2, '0')} / 10</span>
        <p>Sound reflects you.</p>
        <button onClick={() => playTrack(currentBrowsedTrack, browsingIndex)}>{isBrowsedTrackPlaying ? 'Pause the record' : 'Click a disc to listen'} ↗</button>
      </div>
      {/* Subtle Bottom Navigation Hints */}
      <footer className="katosi-footer">
        <div className="footer-hints">
          <span className="footer-hint-item">
            <Keyboard size={14} />
            <span>Use Left / Right arrow keys to browse</span>
          </span>
          <span className="footer-hint-separator">•</span>
          <span className="footer-hint-item">
            <Compass size={14} />
            <span>Click any disc or song to play</span>
          </span>
        </div>
        <div className="footer-branding">
          <span>KATOSI © {new Date().getFullYear()} — Sound Reflects You</span>
        </div>
      </footer>

      {/* Persistent Compliant YouTube Player Dock */}
      <NowPlayingDock />

      {/* Track Index Drawer / Modal */}
      <TrackIndex
        isOpen={isTrackIndexOpen}
        onClose={() => setIsTrackIndexOpen(false)}
        tracks={tracks}
        browsingIndex={browsingIndex}
        playingIndex={playingIndex}
        isPlaying={isPlaying}
        isPaused={playbackState === 'paused'}
        onSelectTrack={handleSelectTrackFromIndex}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AudioProvider>
      <MainAppContent />
    </AudioProvider>
  );
};

export default App;
