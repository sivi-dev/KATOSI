import type { CSSProperties } from 'react';
import { noteImageSource } from './musicalNotation';
import './MusicNoteOrbit.css';
export function MusicNoteOrbit({isPlaying}:{isPlaying:boolean}) {
  return <div className={`music-note-orbit ${isPlaying?'music-note-orbit--playing':''}`} aria-hidden="true">
    {Array.from({length:6},(_,index)=>{
      const angle=index*Math.PI/3-.3;
      return <span className="music-note-position" key={index} style={{left:`${50+49*Math.cos(angle)}%`,top:`${50+49*Math.sin(angle)}%`} as CSSProperties}>
        <img className="music-note-symbol" src={noteImageSource(index)} alt="" draggable={false}/>
      </span>;
    })}
  </div>;
}
