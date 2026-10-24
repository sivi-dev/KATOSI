import { NOTE_COLORS } from '../theme';

// Aristocratic, slender, classical engraving notation shapes for the 3D rotating CD orbit.
export const NOTE_PATHS = [
  // 1. Stradivarius Violin F-Hole (Antonio Stradivari 1715 Cremona acoustic soundhole)
  'M 16 3 C 14.5 3 13 4 13 5.5 C 13 7 14 7.8 15 7.8 C 15.5 7.8 16 7.5 16.2 7.2 C 15.6 9.8 13.5 13.5 11 17 C 9.8 18.6 9 20.2 9 22.2 C 9 25 11 27 13.8 27 C 15.3 27 16.8 26 16.8 24.5 C 16.8 23 15.8 22.2 14.8 22.2 C 14.3 22.2 13.8 22.5 13.6 22.8 C 14.2 20.2 16.3 16.5 18.8 13 C 20 11.4 20.8 9.8 20.8 7.8 C 20.8 5 18.8 3 16 3 Z',
  // 2. Classical Bärenreiter Engraved Treble G-Clef
  'M 16 2 C 15 2 14 2.8 14 4 C 14 5.2 15 6 16 6.8 C 14 8.5 12.5 11 12.5 14 C 12.5 18 15.5 21 18.5 21 C 21 21 23 19 23 16.5 C 23 14 21 12 18.5 12 C 17.8 12 17.2 12.2 16.7 12.5 C 17.2 9.5 19 7 21 5 C 20 3.8 18.5 2 16 2 Z M 16 23 C 14.5 23 13.5 24 13.5 25.5 C 13.5 27 14.5 28 16 28 C 17.5 28 18.5 27 18.5 25.5 C 18.5 24 17.5 23 16 23 Z',
  // 3. Classical Slender Quaver (Eighth note with sweeping curved flag)
  'M 13 4 L 14.5 4 L 14.5 21 L 13 21 Z M 14.5 4 C 17 6 20 8 20 12 C 20 15 17 17 15 17 C 16.5 15.5 17.5 14 17.5 12 C 17.5 9 15.5 7.5 14.5 6 Z M 14 20 C 14 22.2 11.5 24 9 24 C 6.8 24 5 22.5 5 20.8 C 5 19 6.8 17.2 9 17.2 C 11.5 17.2 14 18.5 14 20 Z',
  // 4. Slender Beamed Semi-Quavers (Sixteenth notes in Italian manuscript style)
  'M 9 5 L 23 3 L 23 6 L 9 8 Z M 9 9 L 23 7 L 23 9 L 9 11 Z M 9 5 L 10.5 5 L 10.5 20 L 9 20 Z M 21.5 3 L 23 3 L 23 18 L 21.5 18 Z M 10 19 C 10 21 8 22.5 6 22.5 C 4.2 22.5 3 21.5 3 20 C 3 18.5 4.2 17 6 17 C 8 17 10 18 10 19 Z M 22.5 17 C 22.5 19 20.5 20.5 18.5 20.5 C 16.7 20.5 15.5 19.5 15.5 18 C 15.5 16.5 16.7 15 18.5 15 C 20.5 15 22.5 16 22.5 17 Z',
  // 5. Acoustic String Resonance Arc (Fine concentric harmonics)
  'M 16 6 C 21.5 6 26 10.5 26 16 C 26 21.5 21.5 26 16 26 C 10.5 26 6 21.5 6 16 C 6 10.5 10.5 6 16 6 Z M 16 8 C 11.6 8 8 11.6 8 16 C 8 20.4 11.6 24 16 24 C 20.4 24 24 20.4 24 16 C 24 11.6 20.4 8 16 8 Z M 16 11 C 18.8 11 21 13.2 21 16 C 21 18.8 18.8 21 16 21 C 13.2 21 11 18.8 11 16 C 11 13.2 13.2 11 16 11 Z',
  // 6. Classical Slender Crotchet (Quarter note with tilted oval notehead)
  'M 13 3 L 14.4 3 L 14.4 20.5 L 13 20.5 Z M 14 19.5 C 14 21.8 11.5 23.5 9 23.5 C 6.8 23.5 5 22 5 20.2 C 5 18.5 6.8 16.8 9 16.8 C 11.5 16.8 14 18 14 19.5 Z'
];

export function noteImageSource(index: number) {
  const color = NOTE_COLORS[index % NOTE_COLORS.length];
  const path = NOTE_PATHS[index % NOTE_PATHS.length];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="${color}" filter="drop-shadow(0 0 2px rgba(230,202,133,0.5))" d="${path}"/></svg>`
  )}`;
}
