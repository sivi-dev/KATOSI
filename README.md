# KATOSI — Sound Reflects You

> **"Sound reflects you"** — an immersive, disc-based music browsing experience inspired by modern cinematic and editorial interfaces.

KATOSI reimagines digital music curation through convincing skeuomorphic compact discs that serve as the primary interactive medium. Each disc features circular artwork, authentic transparent center holes, metallic clamping bands with laser-etched stamper codes, concentric micro-grooves, and dynamic rainbow prism specular reflections.

---

## Features

- **3D Coverflow Disc Gallery**: Browse all 10 cinema tracks with smooth CSS 3D perspective transforms, depth layering, and responsive scaling.
- **Skeuomorphic Compact Discs**:
  - Transparent center spindle hole revealing backdrop lighting.
  - Specular metallic inner ring and clear polycarbonate clamping hub.
  - Authentic laser stamper matrix text (`KATOSI COMPACT DISC • DIGITAL AUDIO`).
  - Anisotropic iridescent light sheen that catches illumination like real polycarbonate.
  - Micro-grooves simulating pressed digital audio pits.
  - Rotation behavior: Spins slowly during playback; pauses and freezes at its exact angle without resetting.
- **Independent Browsing & Playback**: Browsing, swiping, or viewing different CDs never interrupts or resets the currently playing track.
- **Online YouTube IFrame Streaming**:
  - Persistent, single-instance player docked in the corner.
  - Fully compliant with YouTube embedding standards (unaltered dimensions, visible branding and native controls).
  - Handles browser autoplay restrictions gracefully ("Press play to listen" notification).
  - Fallback "Open on YouTube" links for each track.
- **Full Navigation Support**:
  - Desktop buttons & mouse interaction (click any adjacent disc to bring to focus).
  - Keyboard controls (`←` / `→` arrow keys to browse, `Spacebar` to play/pause).
  - Mobile touch gestures (horizontal swipe with inertia threshold).
  - Compact 10-track collection index drawer.
- **Accessibility & Motion**:
  - Complete ARIA landmarks and accessible button labels.
  - Visible keyboard focus rings.
  - Reduced-motion support (`prefers-reduced-motion: reduce`) which disables spin animations and 3D camera shifts.

---

## The Ten Tracks (Exact Order)

| # | Title | Artists | Album / Film | Year | Label / Rights | Verified YouTube ID |
|---|---|---|---|---|---|---|
| 01 | **Zehnaseeb** | Chinmayi Sripaada, Shekhar Ravjiani | *Hasee Toh Phasee* | 2014 | Sony Music India | `WnU0lH6C0EA` |
| 02 | **In Dino** | Soham Chakraborty | *Life in a... Metro* | 2007 | Sony Music India | `wuWGPFBgM_g` |
| 03 | **Dil To Bachcha Hai** | Rahat Fateh Ali Khan | *Ishqiya* | 2010 | Shemaroo / T-Series | `_TJZaE0FkKs` |
| 04 | **Nazar Laaye** | Rashid Ali, Neeti Mohan | *Raanjhanaa* | 2013 | Sony Music India | `1YyQ0wuD0jw` |
| 05 | **Tu Jaane Na** | Atif Aslam | *Ajab Prem Ki Ghazab Kahani* | 2009 | Tips Official | `53l2DkivxJs` |
| 06 | **Chori Kiya Re Jiya** | Sonu Nigam, Shreya Ghoshal | *Dabangg* | 2010 | T-Series | `d09R1K9wkl4` |
| 07 | **Tum Ho Toh** | Vishal Mishra, Hansika Pareek | *Saiyaara* | 2025 | YRF | `rOUuGvJkBrQ` |
| 08 | **Tere Naina** | Shafqat Amanat Ali | *My Name Is Khan* | 2010 | Sony Music India | `Km5AQkh58DU` |
| 09 | **Pee Loon** | Mohit Chauhan | *Once Upon a Time in Mumbaai* | 2010 | T-Series | `D8XFTglfSMg` |
| 10 | **Soniyo** | Sonu Nigam, Shreya Ghoshal, Neeraj Shridhar | *Raaz: The Mystery Continues* | 2009 | Sony Music India | `N57zVA-cRUM` |

All 10 songs have been verified via live YouTube oEmbed requests for official uploads and embed permissions.

---

## How to Edit Song Metadata & YouTube Links

All song metadata, artwork links, YouTube video IDs, and accent color palettes are maintained in a single typed configuration file:

📁 **[`src/data/tracks.ts`](file:///Users/Ishant/KATOSI,/src/data/tracks.ts)**

Each track record contains:
```typescript
{
  id: 'zehnaseeb',
  title: 'Zehnaseeb',
  artists: ['Chinmayi Sripaada', 'Shekhar Ravjiani'],
  albumOrFilm: 'Hasee Toh Phasee',
  year: 2014,
  composer: 'Vishal–Shekhar',
  lyricist: 'Amitabh Bhattacharya',
  label: 'Sony Music India',
  artworkUrl: 'https://i.ytimg.com/vi/WnU0lH6C0EA/maxresdefault.jpg',
  artworkSourceUrl: 'https://www.youtube.com/watch?v=WnU0lH6C0EA',
  youtubeVideoId: 'WnU0lH6C0EA',
  youtubeUrl: 'https://www.youtube.com/watch?v=WnU0lH6C0EA',
  availability: 'available',
  duration: '3:35',
  featuredQuote: 'Zehnaseeb, zehnaseeb, tujhe chahoon betahasha zehnaseeb...',
  accentColor: '#e07a5f'
}
```

To update or replace a song:
1. Update `youtubeVideoId` with the 11-character YouTube video ID.
2. Update `artworkUrl` with an image URL or official YouTube thumbnail (`https://i.ytimg.com/vi/{VIDEO_ID}/maxresdefault.jpg`).
3. Set `availability: 'available'` (or `'restricted'` / `'unavailable'` if embedding is disallowed).

---

## Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your web browser.

### Production Build
```bash
# Typecheck and build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Automated Track & Stream Verification
```bash
node test-katosi.js
```
Runs the automated test suite verifying all 10 tracks, metadata ordering, and querying YouTube's official oEmbed API live.
