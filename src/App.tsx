import { useCallback, useEffect, useState } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { DiscGallery } from './components/DiscGallery';
import { TrackIndex } from './components/TrackIndex';
import { NowPlayingDock } from './components/NowPlayingDock';
import './App.css';

function MusicCollection() {
  const audio=useAudio();
  const [browsingIndex,setBrowsingIndex]=useState(0);
  const [indexOpen,setIndexOpen]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const track=audio.tracks[browsingIndex];
  const isSelectedPlaying=audio.playingIndex===browsingIndex&&audio.isPlaying;
  const browse=useCallback((index:number)=>setBrowsingIndex(Math.max(0,Math.min(audio.tracks.length-1,index))),[audio.tracks.length]);
  useEffect(()=>{
    const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setReducedMotion(mq.matches);
    mq.addEventListener('change',change);return()=>mq.removeEventListener('change',change);
  },[]);
  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{
      if(indexOpen||event.altKey||event.metaKey||event.ctrlKey)return;
      const target=event.target as HTMLElement;
      if(target.closest('input, textarea, select, [contenteditable="true"]'))return;
      if(event.key==='ArrowRight'){event.preventDefault();browse(browsingIndex+1);}
      if(event.key==='ArrowLeft'){event.preventDefault();browse(browsingIndex-1);}
      if(event.key==='Enter'||event.code==='Space'){
        if(target.closest('button,a'))return;
        event.preventDefault();audio.playTrack(track,browsingIndex);
      }
    };
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[audio,browse,browsingIndex,indexOpen,track]);
  return <div className="collection-page">
    <main className="collection-stage" aria-label="KATOSI music collection">
      <header className="archive-nav" aria-label="Main navigation">
        <a className="archive-wordmark" href="/" aria-label="KATOSI home">KATOSI</a>
        <span className="archive-nav-active">Music</span>
        <span className="archive-nav-secondary">Collection</span>
        <button className="archive-index-toggle" onClick={()=>setIndexOpen(true)} aria-expanded={indexOpen}>Index <span aria-hidden="true">⌄</span></button>
      </header>
      <section key={track.id} className="track-credits" aria-label={`Details for ${track.title}`}>
        <h1>{track.title}</h1>
        <dl>
          <div><dt>COMPOSED BY</dt><dd>{track.composer}</dd></div>
          <div><dt>YEAR</dt><dd>{track.year}</dd></div>
          <div><dt>PERFORMED BY</dt><dd>{track.artists.map(artist=><span key={artist}>{artist}</span>)}</dd></div>
        </dl>
      </section>
      <button className="sr-only accessible-play" onClick={()=>audio.playTrack(track,browsingIndex)}>{isSelectedPlaying?'Pause':'Play'} {track.title}</button>
      <DiscGallery tracks={audio.tracks} browsingIndex={browsingIndex} playingIndex={audio.playingIndex}
        isPlaying={audio.isPlaying} isPaused={audio.playbackState==='paused'} reducedMotion={reducedMotion}
        onBrowse={browse} onSelectTrack={audio.playTrack}/>
      <section className="record-annotations" aria-label="Selected record information" key={`${track.id}-notes`}>
        <div className="record-annotation"><span className="annotation-mark" aria-hidden="true">✦ ✦ ✦</span><span className="annotation-label">THE ORIGINAL SOUNDTRACK</span><p>{track.albumOrFilm}</p></div>
        <div className="record-annotation"><span className="annotation-mark annotation-play" aria-hidden="true">{isSelectedPlaying?'Ⅱ':'▷'}</span><span className="annotation-label">A KATOSI SELECTION</span><button className="annotation-action" onClick={()=>audio.playTrack(track,browsingIndex)}>{isSelectedPlaying?'Pause this\nrecord':'Some songs\nstay with you'}</button></div>
      </section>
      <footer className="archive-footer">
        <span className="archive-instructions">Drag or scroll to explore <span>↗</span></span>
        <nav className="record-navigation" aria-label="Browse records">
          <button onClick={()=>browse(browsingIndex-1)} disabled={browsingIndex===0} aria-label="Previous compact disc">←</button>
          <span>{String(browsingIndex+1).padStart(2,'0')} <span className="record-counter-divider">/</span> {String(audio.tracks.length).padStart(2,'0')}</span>
          <button onClick={()=>browse(browsingIndex+1)} disabled={browsingIndex===audio.tracks.length-1} aria-label="Next compact disc">→</button>
        </nav>
        <span className="archive-signature">Sound reflects you.</span>
      </footer>
    </main>
    <NowPlayingDock/>
    <TrackIndex isOpen={indexOpen} onClose={()=>setIndexOpen(false)} tracks={audio.tracks} browsingIndex={browsingIndex} playingIndex={audio.playingIndex} isPlaying={audio.isPlaying} isPaused={audio.playbackState==='paused'} onSelectTrack={(index,andPlay)=>{browse(index);if(andPlay){audio.playTrack(audio.tracks[index],index);setIndexOpen(false);}}}/>
    <div className="paper-grain" aria-hidden="true"/>
  </div>;
}
export default function App(){return <AudioProvider><MusicCollection/></AudioProvider>;}
