import { useEffect, useRef } from 'react';
import type { Track } from '../data/tracks';
import './TrackIndex.css';
interface Props {
  isOpen:boolean;onClose:()=>void;tracks:Track[];browsingIndex:number;
  playingIndex:number;isPlaying:boolean;isPaused:boolean;
  onSelectTrack:(index:number,andPlay?:boolean)=>void;
}
export function TrackIndex({isOpen,onClose,tracks,browsingIndex,playingIndex,isPlaying,onSelectTrack}:Props){
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    if(isOpen&&!dialog.current?.open)dialog.current?.showModal();
    else if(!isOpen&&dialog.current?.open)dialog.current.close();
  },[isOpen]);
  return <dialog ref={dialog} className="track-index-panel" aria-labelledby="track-index-title" onCancel={onClose} onClose={onClose} onClick={e=>{
    if(e.target===dialog.current){const r=dialog.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}
  }}>
    <header className="index-heading"><div><span>THE KATOSI COLLECTION</span><h2 id="track-index-title">The index.</h2></div><button onClick={onClose} aria-label="Close track index" autoFocus>×</button></header>
    <ol className="index-records">
      {tracks.map((track,index)=><li key={track.id} className={index===browsingIndex?'index-record-selected':''}>
        <button className="index-browse" onClick={()=>{onSelectTrack(index,false);onClose();}} aria-label={`Browse ${track.title}`} aria-current={index===browsingIndex?'true':undefined}>
          <span className="index-number">{String(index+1).padStart(2,'0')}</span>
          <img src={track.artworkUrl} alt="" loading="lazy"/>
          <span className="index-track-title">{track.title}<small>{track.year} · {track.albumOrFilm}</small></span>
        </button>
        <button className="index-play" aria-label={`${index===playingIndex&&isPlaying?'Pause':'Play'} ${track.title}`} onClick={()=>onSelectTrack(index,true)}>{index===playingIndex&&isPlaying?'Ⅱ':'▷'}</button>
      </li>)}
    </ol>
    <footer className="index-footer">Ten records. A thousand memories.</footer>
  </dialog>;
}
