import type { Track } from '../data/tracks';
import './SongPage.css';
import { MusicNoteOrbit } from './MusicNoteOrbit';
interface Props {
  track:Track; index:number; tracks:Track[]; isPlaying:boolean;
  onPlay:()=>void; onBack:()=>void; onOpenTrack:(index:number)=>void;
}
export function SongPage({track,index,tracks,isPlaying,onPlay,onBack,onOpenTrack}:Props){
  return <main className="song-page">
    <header className="song-page-nav"><a href="/" onClick={event=>{event.preventDefault();onBack();}}>← Back to collection</a><img src="/brand/katosi-logo.png" alt="KATOSI" className="song-page-logo" /><span>{String(index+1).padStart(2,'0')} / {String(tracks.length).padStart(2,'0')}</span></header>
    <div className="song-page-content">
      <div className="song-page-artwork">
        <div className="detail-record-stage">
        <MusicNoteOrbit isPlaying={isPlaying}/>
        <button className={`detail-disc ${isPlaying?'detail-disc--playing':''}`} onClick={onPlay} aria-label={`${isPlaying?'Pause':'Play'} ${track.title}`}>
          <img src={track.artworkUrl} alt={`${track.albumOrFilm} album artwork`}/><span className="detail-disc-hub"/>
        </button>
        </div>
        <p>{isPlaying?'Now playing':'Click the record to listen'}</p>
      </div>
      <section className="song-page-info" aria-labelledby="song-page-title">
        <span className="glass-glint-tl" aria-hidden="true" />
        <span className="glass-glint-br" aria-hidden="true" />
        <span className="song-page-eyebrow">A KATOSI SELECTION · {track.year}</span>
        <h1 id="song-page-title">{track.title}</h1>
        <p className="song-page-artists">{track.artists.join(' · ')}</p>
        <p className="song-page-album">From <em>{track.albumOrFilm}</em></p>
        <dl className="song-page-credits">
          <div><dt>COMPOSED BY</dt><dd>{track.composer}</dd></div>
          <div><dt>LYRICS BY</dt><dd>{track.lyricist}</dd></div>
          <div><dt>RELEASE YEAR</dt><dd>{track.year}</dd></div>
          <div><dt>RECORD LABEL</dt><dd>{track.label}</dd></div>
          {track.duration&&<div><dt>LISTED DURATION</dt><dd>{track.duration}</dd></div>}
          {track.notes&&<div><dt>VERSION</dt><dd>{track.notes}</dd></div>}
        </dl>
        <div className="song-page-actions"><button onClick={onPlay}>{isPlaying?'Ⅱ Pause record':'▷ Play record'}</button><a href={track.youtubeUrl} target="_blank" rel="noreferrer">Listen on YouTube ↗</a></div>
      </section>
    </div>
    <nav className="song-page-pagination" aria-label="Other songs">
      {index>0?<a href={`/songs/${tracks[index-1].id}`} onClick={event=>{event.preventDefault();onOpenTrack(index-1);}}>← {tracks[index-1].title}</a>:<span/>}
      {index<tracks.length-1?<a href={`/songs/${tracks[index+1].id}`} onClick={event=>{event.preventDefault();onOpenTrack(index+1);}}>{tracks[index+1].title} →</a>:<span/>}
    </nav>
  </main>;
}
