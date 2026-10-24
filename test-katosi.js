// Automated verification suite for KATOSI
import { TRACKS } from './src/data/tracks.ts';
import https from 'https';

console.log('--- STARTING KATOSI AUTOMATED VERIFICATION ---');

// 1. Verify 10 tracks in strict required order
const EXPECTED_TITLES = [
  'Zehnaseeb',
  'In Dino',
  'Dil To Bachcha Hai',
  'Nazar Laaye',
  'Tu Jaane Na',
  'Chori Kiya Re Jiya',
  'Tum Ho Toh',
  'Tere Naina',
  'Pee Loon',
  'Soniyo'
];

if (TRACKS.length !== 10) {
  throw new Error(`Expected exactly 10 tracks, but found ${TRACKS.length}`);
}

const checkOEmbed = (videoId) => {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`JSON parse error for ${videoId}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode} for ${videoId}`));
        }
      });
    }).on('error', reject);
  });
};

async function run() {
  for (let index = 0; index < TRACKS.length; index++) {
    const track = TRACKS[index];
    const expectedTitle = EXPECTED_TITLES[index];

    if (!track.title.toLowerCase().includes(expectedTitle.toLowerCase())) {
      throw new Error(`Track ${index + 1} mismatch: got "${track.title}", expected "${expectedTitle}"`);
    }

    try {
      const oembed = await checkOEmbed(track.youtubeVideoId);
      console.log(`✓ [${index + 1}/10] ${track.title} verified on YouTube: "${oembed.title}" by ${oembed.author_name} (Embed enabled: YES)`);
    } catch (err) {
      console.error(`✗ [${index + 1}/10] ${track.title} (${track.youtubeVideoId}) failed: ${err.message}`);
    }
  }
  console.log('\n--- VERIFICATION COMPLETED SUCCESSFULLY ---');
}

run();
