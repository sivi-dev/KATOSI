export interface BranchCard {
  id: string;
  badge: string;
  title: string;
  preview: string;
  fullText: string;
  statLabel: string;
  statValue: string;
}

export interface Track {
  id: string;
  title: string;
  artists: string[];
  albumOrFilm: string;
  year: number;
  composer: string;
  lyricist: string;
  label: string;
  artworkUrl: string;
  artworkSourceUrl: string;
  audioUrl?: string;
  youtubeVideoId: string;
  fallbackVideoId?: string;
  youtubeUrl: string;
  availability: 'available' | 'restricted' | 'unavailable';
  duration?: string;
  featuredQuote?: string;
  notes?: string;
  accentColor?: string;
  branches?: BranchCard[];
}

export const TRACKS: Track[] = [
  {
    id: 'zehnaseeb',
    title: 'Zehnaseeb',
    artists: ['Chinmayi Sripaada', 'Shekhar Ravjiani'],
    albumOrFilm: 'Hasee Toh Phasee',
    year: 2014,
    composer: 'Vishal–Shekhar',
    lyricist: 'Amitabh Bhattacharya',
    label: 'Sony Music India',
    artworkUrl: '/covers/zehnaseeb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/zehnaseeb/783487038?i=783487058&uo=4',
    audioUrl: '/audio/zehnaseeb.mp3',
    youtubeVideoId: 'WnU0lH6C0EA',
    fallbackVideoId: 'bC36d8e3b-E',
    youtubeUrl: 'https://www.youtube.com/watch?v=WnU0lH6C0EA',
    availability: 'available',
    duration: '3:35',
    featuredQuote: 'Zehnaseeb, zehnaseeb, tujhe chahoon betahasha zehnaseeb...',
    accentColor: '#e07a5f',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'Anatomy of Unconventional Love',
        preview: 'How a quirky chemist and an earnest groom discovered grace in chaos.',
        fullText: 'In Hasee Toh Phasee, Zehnaseeb serves as the emotional pivot. Vinil Mathew captures Nikhil and Meeta navigating nocturnal Mumbai streets, transforming an arranged wedding into an intimate study of two eccentric souls finding solace in one another.',
        statLabel: 'Film Director',
        statValue: 'Vinil Mathew'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Acoustic Guitar & Sweeping Strings',
        preview: 'Vishal–Shekhar’s masterclass in pastoral fingerpicking and crescendo.',
        fullText: 'The arrangement begins with an uncluttered fingerstyle acoustic motif, gradually inviting a lush European string quartet and subtle bansuri swells. The tempo maintains a steady 84 BPM, allowing the space between notes to breathe.',
        statLabel: 'Key & Tempo',
        statValue: 'E Major · 84 BPM'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'The Etymology of Zehnaseeb',
        preview: 'Amitabh Bhattacharya reinvents Urdu courtliness for modern romance.',
        fullText: 'Combining "Zehn" (intellect/fate) with "Naseeb" (destiny), Bhattacharya fashioned a romantic portmanteau. Lines like "Lakh chaha par hansi lab pe na aayi" contrast vulnerability with total devotion.',
        statLabel: 'Lyricist Award',
        statValue: 'Filmfare Nominee'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Chinmayi & Shekhar’s Dual Tone',
        preview: 'Tender whispers meeting open-throated baritone sincerity.',
        fullText: 'Chinmayi’s entry brings ethereal warmth reminiscent of morning dew, while Shekhar Ravjiani delivers an honest, unvarnished vocal counterpoint that eschews excessive ornamentation in favor of raw sentiment.',
        statLabel: 'Vocal Duet',
        statValue: 'Soprano & Baritone'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: '24-Bit Studio Master',
        preview: 'Recorded at YRF Studios, mixed with dynamic headroom for vinyl.',
        fullText: 'Mastered with expansive dynamic range, preserving the gentle pick scrapes on steel guitar strings and the natural room resonance of Chinmayi’s vocal microphone capsule.',
        statLabel: 'Mix Engineer',
        statValue: 'Vijay Dayal (YRF)'
      }
    ]
  },
  {
    id: 'in-dino',
    title: 'In Dino',
    artists: ['Soham Chakraborty'],
    albumOrFilm: 'Life in a... Metro',
    year: 2007,
    composer: 'Pritam',
    lyricist: 'Sayeed Quadri',
    label: 'Sony Music India',
    artworkUrl: '/covers/in-dino.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/in-dino/302523807?i=302523872&uo=4',
    audioUrl: '/audio/in-dino.mp3',
    youtubeVideoId: 'wuWGPFBgM_g',
    fallbackVideoId: 'Kz9q0kUeFzI',
    youtubeUrl: 'https://www.youtube.com/watch?v=wuWGPFBgM_g',
    availability: 'available',
    duration: '4:00',
    featuredQuote: 'In dino dil mera mujhse hai keh raha, tu khwaab saja...',
    accentColor: '#3d5a80',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'Life in a... Metro',
        preview: 'A city, a moment, a memory.',
        fullText: 'In Life in a... Metro, Anurag Basu integrates Pritam and the Metro band directly into Mumbai’s nocturnal transit tapestry—on rooftops, skywalks, and platforms—framing three generations of tangled urban relationships.',
        statLabel: 'Film Canvas',
        statValue: 'Life in a... Metro'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'A melody that stays',
        preview: 'Notes on the arrangement.',
        fullText: 'The arrangement balances driving rock percussion with clean, chorus-drenched electric guitar arpeggios and warm Fender Rhodes chords, creating a bittersweet acoustic-electric dynamic that remains unforgettable.',
        statLabel: 'Arrangement',
        statValue: 'Live Rock Ensemble'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'Between the lines',
        preview: 'Explore the song’s words.',
        fullText: '"Tu khwaab saja, tu jee le zara..." Sayeed Quadri crafts an earnest meditation on loneliness and sudden intimacy, capturing the quiet courage required to love in an indifferent metropolis.',
        statLabel: 'Lyricist',
        statValue: 'Sayeed Quadri'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Soham Chakraborty',
        preview: 'The voice behind In Dino.',
        fullText: 'Soham Chakraborty’s performance blends classical precision with the raw, emotional rasp of alternative rock, soaring with authentic vulnerability on the high-octave chorus.',
        statLabel: 'Lead Vocals',
        statValue: 'Soham Chakraborty'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'The lasting feeling',
        preview: 'Your notes on this record.',
        fullText: 'A defining cultural touchstone of late-2000s Bollywood alternative music, establishing how a live on-screen rock band format could produce multi-platinum physical disc status and enduring cultural devotion.',
        statLabel: 'Collection',
        statValue: 'Cultural Landmark'
      }
    ]
  },
  {
    id: 'dil-to-bachcha-hai',
    title: 'Dil To Bachcha Hai',
    artists: ['Rahat Fateh Ali Khan'],
    albumOrFilm: 'Ishqiya',
    year: 2010,
    composer: 'Vishal Bhardwaj',
    lyricist: 'Gulzar',
    label: 'T-Series / Shemaroo',
    artworkUrl: '/covers/dil-to-bachcha-hai.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/dil-to-bachcha-hai/1131043351?i=1131043354&uo=4',
    audioUrl: '/audio/dil-to-bachcha-hai.mp3',
    youtubeVideoId: 'AtnB0DbuFFU',
    fallbackVideoId: 'hQ3dcgFKPIY',
    youtubeUrl: 'https://www.youtube.com/watch?v=AtnB0DbuFFU',
    availability: 'available',
    duration: '5:36',
    featuredQuote: 'Aisi uljhi nazar unse hatt-ti nahi, daant se reshmi dor katt-ti nahi...',
    accentColor: '#b08968',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'Rustic Noir & Autumnal Romance',
        preview: 'Naseeruddin Shah’s weathered crook smitten in rural Gorakhpur.',
        fullText: 'Abhishek Chaubey’s rustic noir Ishqiya juxtaposes pistols with poetic surrender. Khalujan (Naseeruddin Shah) finds his hardened heart hijacked by the enigmatic Krishna (Vidya Balan).',
        statLabel: 'Film Genre',
        statValue: 'Rustic Noir'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Accordion, Clarinet & Waltz Swing',
        preview: 'A bohemian European cabaret waltz transposed to the heartlands of UP.',
        fullText: 'Vishal Bhardwaj ingeniously melds an Argentine tango/waltz cadence (3/4 time) with Parisian musette accordions, jazz upright bass, and Hindustani phrasing to create an utterly singular soundscape.',
        statLabel: 'Time Signature',
        statValue: '3/4 Cabaret Waltz'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'Gulzar’s National Award-Winning Wit',
        preview: '"Daant se reshmi dor katt-ti nahi"—domestic realism turned pure poetry.',
        fullText: 'Gulzar received the National Film Award for Best Lyrics for this piece. His playful imagery of untangling a thread with teeth or a playful child doing mischief redefines senescent romance.',
        statLabel: 'Honour',
        statValue: 'National Award Winner'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Rahat Fateh Ali Khan in Cabaret Mode',
        preview: 'Stepping out of traditional Qawwali into whimsical jazz vocalise.',
        fullText: 'Accustomed to devotional qawwalis, Rahat was coached by Bhardwaj to restrain his thunderous projection into a conspiratorial, sheepish grin that sounds both roguish and deeply endearing.',
        statLabel: 'Vocalist',
        statValue: 'Rahat Fateh Ali Khan'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'Analog Warmth & Live Room',
        preview: 'Captured with vintage ribbon microphones to preserve wooden acoustic tone.',
        fullText: 'The acoustic bass and accordion were recorded simultaneously in an ambient live room, giving the low-end resonance a physical weight that glows through compact disc playback.',
        statLabel: 'Instrumentation',
        statValue: 'Accordion & Upright Bass'
      }
    ]
  },
  {
    id: 'nazar-laaye',
    title: 'Nazar Laaye',
    artists: ['Rashid Ali', 'Neeti Mohan'],
    albumOrFilm: 'Raanjhanaa',
    year: 2013,
    composer: 'A.R. Rahman',
    lyricist: 'Irshad Kamil',
    label: 'Sony Music India',
    artworkUrl: '/covers/nazar-laaye.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/nazar-laaye/656015920?i=656016011&uo=4',
    audioUrl: '/audio/nazar-laaye.mp3',
    youtubeVideoId: '1YyQ0wuD0jw',
    fallbackVideoId: 'xP3p3sF8mHQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=1YyQ0wuD0jw',
    availability: 'available',
    duration: '3:58',
    featuredQuote: 'Nazar laaye na koi, aisi taaza hawaon ki dhoop ko...',
    accentColor: '#d4a373',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'Benares Ghats to JNU Lawns',
        preview: 'Aanand L. Rai charts an obsessive childhood adoration blooming into student politics.',
        fullText: 'Kundan (Dhanush) watches Zoya (Sonam Kapoor) step into her university life. The golden winter sunlight across Delhi colleges reflects the innocence of their changing seasons.',
        statLabel: 'Visual Tone',
        statValue: 'Winter Sunlight'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Rahman’s Bossa-Folk Synthesis',
        preview: 'Light nylon strings dancing over syncopated cajón percussion.',
        fullText: 'A.R. Rahman combines Brazilian Bossa Nova rhythmic underpinnings with North Indian folk flute motifs. The chord changes fluidly slip between major 7ths and suspended fourths.',
        statLabel: 'Composer',
        statValue: 'A.R. Rahman'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'Irshad Kamil’s Fragile Prayers',
        preview: 'Shielding fragile happiness against the evil eye of the world.',
        fullText: '"Nazar laaye na koi..." Kamil crafts a gentle maternal-like ward against heartbreak. The lyrics treat happiness not as a conqueror’s boast, but as a fragile flower needing shelter.',
        statLabel: 'Theme',
        statValue: 'Auspicious Protection'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Rashid Ali & Neeti Mohan',
        preview: 'Breezy acoustic balladeering paired with radiant conversational grace.',
        fullText: 'Rashid Ali (famed for Kabhi Aditi) brings his signature effortless, laid-back acoustic cadence, matched by Neeti Mohan’s youthful, crystalline harmonies.',
        statLabel: 'Vocal Arrangement',
        statValue: 'Acoustic Harmonies'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'Panchathan Record Inn Sound',
        preview: 'Pristine digital audio engineering from Rahman’s Chennai headquarters.',
        fullText: 'Engineered at Panchathan Record Inn with Rahman’s signature spatial separation, ensuring every nylon string pluck occupies its own distinct stereo panorama.',
        statLabel: 'Audio Studio',
        statValue: 'Panchathan Inn'
      }
    ]
  },
  {
    id: 'tu-jaane-na',
    title: 'Tu Jaane Na',
    artists: ['Atif Aslam'],
    albumOrFilm: 'Ajab Prem Ki Ghazab Kahani',
    year: 2009,
    composer: 'Pritam',
    lyricist: 'Irshad Kamil',
    label: 'Tips Official',
    artworkUrl: '/covers/tu-jaane-na.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/tu-jaane-na/1537029617?i=1537030272&uo=4',
    audioUrl: '/audio/tu-jaane-na.mp3',
    youtubeVideoId: '53l2DkivxJs',
    fallbackVideoId: 'gR9z-O9FwY8',
    youtubeUrl: 'https://www.youtube.com/watch?v=53l2DkivxJs',
    availability: 'available',
    duration: '5:41',
    featuredQuote: 'Kaise batayein kyun tujhko chahe yaara bata na paaye...',
    accentColor: '#2b2d42',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'Rajkumar Santoshi’s Whimsical Romance',
        preview: 'Ranbir Kapoor and Katrina Kaif amidst European opera house grandeur.',
        fullText: 'Prem’s tragicomedy of self-sacrificing love hits its highest pitch in this song. Set against dramatic stage backdrops, his unexpressed devotion becomes universal.',
        statLabel: 'Leads',
        statValue: 'Ranbir & Katrina'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Minor-Key Rock Ballad Anthem',
        preview: 'Cascading piano riffs erupting into wall-of-sound electric guitars.',
        fullText: 'Pritam builds an emotional crescendo starting from a minimalist D-minor piano figure, adding bass drum thuds, and exploding into stadium rock drums during the anthemic hook.',
        statLabel: 'Key Signature',
        statValue: 'D Minor'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'The Silent Agony of Silence',
        preview: 'Irshad Kamil writes the anthem of unspoken adoration.',
        fullText: '"Baatein dilon ki khud hi samajh le, hum toh keh na paaye..." The paradox of love that is too deep for speech, captured in timeless vernacular Hindustani.',
        statLabel: 'Lyricist',
        statValue: 'Irshad Kamil'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Atif Aslam’s Defining Peak',
        preview: 'The Pakistani rock icon’s signature raspy sustain and heart-wrenching belting.',
        fullText: 'Atif’s vocal control across high octaves without losing emotional vulnerability became the soundtrack of an entire generation of subcontinent college youth.',
        statLabel: 'Vocalist',
        statValue: 'Atif Aslam'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'Chart-Topper of 2009',
        preview: 'One of the most downloaded caller tunes and radio staples in Indian history.',
        fullText: 'Topped Mirchi Top 20 for 16 consecutive weeks and cemented Tips Official’s compact disc catalog as an era-defining pop monument.',
        statLabel: 'Chart Record',
        statValue: '16 Weeks #1'
      }
    ]
  },
  {
    id: 'chori-kiya-re-jiya',
    title: 'Chori Kiya Re Jiya',
    artists: ['Sonu Nigam', 'Shreya Ghoshal'],
    albumOrFilm: 'Dabangg',
    year: 2010,
    composer: 'Sajid–Wajid',
    lyricist: 'Jalees Sherwani',
    label: 'T-Series',
    artworkUrl: '/covers/chori-kiya-re-jiya.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/chori-kiya-re-jiya/1123346616?i=1123346657&uo=4',
    audioUrl: '/audio/chori-kiya-re-jiya.mp3',
    youtubeVideoId: 'd09R1K9wkl4',
    fallbackVideoId: 'adLTAl_Tjjw',
    youtubeUrl: 'https://www.youtube.com/watch?v=d09R1K9wkl4',
    availability: 'available',
    duration: '4:48',
    featuredQuote: 'Saancha kahe torey bina aaye na ek pal chaina...',
    accentColor: '#c59b27',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'Chulbul Pandey’s Tender Surrender',
        preview: 'Salman Khan’s swaggering cop disarmed by Sonakshi Sinha’s quiet grace.',
        fullText: 'Amidst rural Uttar Pradesh mustard fields and sun-drenched courtyards, Abhinav Kashyap captures a rogue cop completely disarmed by gentle traditional courtship.',
        statLabel: 'Film Canvas',
        statValue: 'Rural UP Courtyards'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Sajid–Wajid’s Golden Melody',
        preview: 'Harmonium swirls and sitar flourishes over a brisk Dholak pulse.',
        fullText: 'Built around the warmth of acoustic Indian percussion, Sajid–Wajid channeled the vintage 1970s RD Burman romantic spirit with modern crystalline digital clarity.',
        statLabel: 'Instruments',
        statValue: 'Harmonium & Sitar'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'Brajbhasha & Avadhi Dialects',
        preview: 'Jalees Sherwani evokes the folklore of the Heartland.',
        fullText: '"Bindiya chamke... torey bina aaye na chaina." Sherwani weaves traditional colloquial idioms that feel like timeless village folk poetry passed down through generations.',
        statLabel: 'Dialect',
        statValue: 'Avadhi / Braj'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Sonu & Shreya: Supreme Precision',
        preview: 'Two generational titans executing intricate murkis and taans with joy.',
        fullText: 'Sonu Nigam’s pitch-perfect glides meet Shreya Ghoshal’s sweetness. Their synchronization in the bridge sections remains a benchmark in modern playback duet history.',
        statLabel: 'Duet Titans',
        statValue: 'Sonu & Shreya'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'The Dabangg Audio Juggernaut',
        preview: 'The soundtrack that revitalized pure melodic Indian film music in 2010.',
        fullText: 'Won the Filmfare Best Music Director Award and proved that authentic Indian melody remained the supreme commercial force in subcontinent cinema.',
        statLabel: 'Filmfare Award',
        statValue: 'Best Music Album'
      }
    ]
  },
  {
    id: 'tum-ho-toh',
    title: 'Tum Ho Toh',
    artists: ['Vishal Mishra', 'Hansika Pareek'],
    albumOrFilm: 'Saiyaara',
    year: 2025,
    composer: 'Vishal Mishra',
    lyricist: 'Raj Shekhar',
    label: 'YRF',
    artworkUrl: '/covers/tum-ho-toh.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/tum-ho-toh-from-saiyaara/1820715703?i=1820715704&uo=4',
    audioUrl: '/audio/tum-ho-toh.mp3',
    youtubeVideoId: 'rOUuGvJkBrQ',
    fallbackVideoId: 'u7_jF8WwAzk',
    youtubeUrl: 'https://www.youtube.com/watch?v=rOUuGvJkBrQ',
    availability: 'available',
    duration: '5:16',
    featuredQuote: 'Tum ho toh subah nayi hai, tum ho toh shaamein haseen hain...',
    accentColor: '#5c677d',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'YRF’s Modern Romance Era',
        preview: 'Ahaan Panday and Aneet Padda in a tender contemporary youth drama.',
        fullText: 'Representing Yash Raj Films’ latest cinematic era, Tum Ho Toh grounds modern youthful affection in atmospheric European coastal landscapes and rain-swept cafes.',
        statLabel: 'Production',
        statValue: 'Yash Raj Films'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Ambient Acoustic Soul',
        preview: 'Muted grand piano chords, sub-bass pulse, and atmospheric violin swells.',
        fullText: 'Vishal Mishra employs modern spatial reverb techniques and close-miked nylon guitar picking to create an intimate headphone experience that feels warm and personal.',
        statLabel: 'Production Style',
        statValue: 'Modern Spatial Mix'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'Raj Shekhar’s Daily Miracles',
        preview: 'Finding transcendent beauty in the mundane rituals of companionship.',
        fullText: '"Tum ho toh subah nayi hai..." Raj Shekhar crafts poetry that celebrates companionship as an anchor in a chaotic digital world.',
        statLabel: 'Lyricist',
        statValue: 'Raj Shekhar'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Vishal Mishra & Hansika Pareek',
        preview: 'Heartfelt baritone grit intertwining with delicate acoustic phrasing.',
        fullText: 'Vishal Mishra’s emotional vocal inflections deliver raw, modern romantic honesty, perfectly balanced by Hansika Pareek’s airy harmonies.',
        statLabel: 'Vocal Contrast',
        statValue: 'Grit & Ethereal'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'Hi-Res 96kHz Digital Capture',
        preview: 'Pristine 2025 YRF Studios high-resolution audio session recording.',
        fullText: 'Engineered for modern high-fidelity streaming and vinyl pressings, retaining full high-frequency sparkle on cymbals and breathing room in the vocal track.',
        statLabel: 'Sample Rate',
        statValue: '96 kHz / 24-Bit'
      }
    ]
  },
  {
    id: 'tere-naina',
    title: 'Tere Naina',
    artists: ['Shafqat Amanat Ali'],
    albumOrFilm: 'My Name Is Khan',
    year: 2010,
    composer: 'Shankar–Ehsaan–Loy',
    lyricist: 'Niranjan Iyengar',
    label: 'Sony Music India',
    artworkUrl: '/covers/tere-naina.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/tere-naina/1569776324?i=1569776328&uo=4',
    audioUrl: '/audio/tere-naina.mp3',
    youtubeVideoId: 'Km5AQkh58DU',
    fallbackVideoId: '7XqP3s8zM-Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=Km5AQkh58DU',
    availability: 'available',
    duration: '4:38',
    featuredQuote: 'Nainaa... tere do naina, thag lenge...',
    accentColor: '#6d597a',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'Rizwan & Mandira in San Francisco',
        preview: 'Shah Rukh Khan and Kajol’s timeless on-screen chemistry in California light.',
        fullText: 'Karan Johar captures Rizwan Khan’s gentle worldview blossoming under Mandira’s vibrant warmth. The San Francisco cable cars and streetscapes frame their courtship.',
        statLabel: 'Iconic Pairing',
        statValue: 'SRK & Kajol'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Shankar–Ehsaan–Loy’s Semi-Classical Fusion',
        preview: 'Raag Khamaj motifs blended with contemporary funk bass and acoustic strums.',
        fullText: 'SEL construct a masterwork rooted in classical Indian thumri style yet driven by Ehsaan’s shimmering acoustic guitar grooves and Loy’s organic piano accompaniment.',
        statLabel: 'Raga Foundation',
        statValue: 'Raag Khamaj'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'Niranjan Iyengar’s Playful Warning',
        preview: '"Thag lenge"—the bewitching trap of eyes that rob you of your senses.',
        fullText: 'The lyrics borrow from classical Braj poetry where Krishna’s gaze is described as a gentle thief ("thag"). Iyengar modernizes this idiom with charming wit.',
        statLabel: 'Poetic Device',
        statValue: 'The Thief Metaphor'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Shafqat’s Classical Lineage',
        preview: 'The Patiala Gharana scion delivering effortless classical ornamentations.',
        fullText: 'Shafqat Amanat Ali brings centuries of classical training to bear on every syllable, executing breathtaking meends and sargam flourishes that sound utterly effortless.',
        statLabel: 'Lineage',
        statValue: 'Patiala Gharana'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'Global Cinematic Benchmark',
        preview: 'Celebrated worldwide upon the film’s premiere at the Berlin Film Festival.',
        fullText: 'The song was praised by international critics for its balance of traditional classical depth and Hollywood-grade orchestral production value.',
        statLabel: 'Festival Debut',
        statValue: 'Berlinale 2010'
      }
    ]
  },
  {
    id: 'pee-loon',
    title: 'Pee Loon',
    artists: ['Mohit Chauhan'],
    albumOrFilm: 'Once Upon a Time in Mumbaai',
    year: 2010,
    composer: 'Pritam',
    lyricist: 'Irshad Kamil',
    label: 'T-Series',
    artworkUrl: '/covers/pee-loon.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/pee-loon/1123340727?i=1123340746&uo=4',
    audioUrl: '/audio/pee-loon.mp3',
    youtubeVideoId: 'PFbEpI-bkzM',
    fallbackVideoId: 'Nbr_KJT0TIc',
    youtubeUrl: 'https://www.youtube.com/watch?v=PFbEpI-bkzM',
    availability: 'available',
    duration: '4:47',
    featuredQuote: 'Pee loon tere neele neele naino se shabnam, pee loon...',
    accentColor: '#9a8c98',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: '1970s Retro Noir Bombay',
        preview: 'Emraan Hashmi and Prachi Desai in vintage bell-bottoms and vintage taxis.',
        fullText: 'Milan Luthria recreates the retro swagger of 1970s Bombay. Amidst smuggling docks and vintage cinema halls, this tender romance provides pure emotional counterpoint.',
        statLabel: 'Era Aesthetic',
        statValue: '1970s Vintage Bombay'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Sufi-Pop with Acoustic Guitars',
        preview: 'Pritam’s signature infectious rhythmic clap and tabla groove.',
        fullText: 'Features an irresistible syncopated tabla beat coupled with acoustic guitar rhythms and a gentle harmonium hook that burrows instantly into memory.',
        statLabel: 'Rhythm Section',
        statValue: 'Syncopated Tabla'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'Drinking the Dew of the Eyes',
        preview: 'Irshad Kamil’s intoxicating imagery of spiritual and earthly thirst.',
        fullText: '"Pee loon tere neele neele naino se shabnam..." Kamil merges Sufi wine imagery ("jaam") with innocent adoration, crafting a lyric that sounds sacred yet intimately sensual.',
        statLabel: 'Sufi Motif',
        statValue: 'Shabnam (Morning Dew)'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Mohit Chauhan’s Hill-Station Warmth',
        preview: 'A husky, conversational tenor that feels like whispering by a bonfire.',
        fullText: 'Mohit Chauhan’s naturally textured voice brings an earthy, unhurried sincerity that makes even grand declarations of love feel like private confidences.',
        statLabel: 'Vocal Tone',
        statValue: 'Husky Mountain Tenor'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'The Song of the Year 2010',
        preview: 'Dominant airplay leader across all national FM stations throughout 2010.',
        fullText: 'Pee Loon became one of the most covered, requested, and cherished romantic ballads in modern Bollywood physical disc history.',
        statLabel: 'Airplay Status',
        statValue: '#1 Radio Track 2010'
      }
    ]
  },
  {
    id: 'soniyo',
    title: 'Soniyo',
    artists: ['Sonu Nigam', 'Shreya Ghoshal', 'Neeraj Shridhar'],
    albumOrFilm: 'Raaz: The Mystery Continues',
    year: 2009,
    composer: 'Raju Singh',
    lyricist: 'Kumaar',
    label: 'Sony Music India',
    artworkUrl: '/covers/soniyo.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/soniyo/299122148?i=299122166&uo=4',
    audioUrl: '/audio/soniyo.mp3',
    youtubeVideoId: 'N57zVA-cRUM',
    fallbackVideoId: 'scn0s3MW0Ac',
    youtubeUrl: 'https://www.youtube.com/watch?v=N57zVA-cRUM',
    availability: 'available',
    duration: '5:29',
    featuredQuote: 'Soniyo, o soniyo, tumhein dekhta hoon toh sochta hoon bas yehi...',
    accentColor: '#7f4f24',
    branches: [
      {
        id: 'cinema',
        badge: '01 / CINEMA',
        title: 'Supernatural Romance in Foggy Hills',
        preview: 'Emraan Hashmi and Kangana Ranaut in Mohit Suri’s moody Gothic thriller.',
        fullText: 'Set against mist-clad hillside mansions, gothic canvases, and psychological mystery, Soniyo provides a beacon of transcendent love amidst shadows.',
        statLabel: 'Setting',
        statValue: 'Misty Gothic Hills'
      },
      {
        id: 'harmony',
        badge: '02 / HARMONY',
        title: 'Raju Singh’s Orchestral Lushness',
        preview: 'Sweeping violins, Spanish acoustic arpeggios, and soft electronic beat.',
        fullText: 'Raju Singh arranged an evocative orchestral backdrop featuring live strings recorded with cinematic richness, elevated by Neeraj Shridhar’s smooth English refrain.',
        statLabel: 'Arrangement',
        statValue: 'Symphonic Pop'
      },
      {
        id: 'poetry',
        badge: '03 / POETRY',
        title: 'Kumaar’s Uncomplicated Devotion',
        preview: 'Direct, honest poetry that speaks straight to the heart.',
        fullText: '"Tumhein dekhta hoon toh sochta hoon bas yehi, ki har pal dekhta rahoon..." Kumaar strips away artifice, giving voice to the hypnotic trance of love.',
        statLabel: 'Style',
        statValue: 'Pure Romantic Directness'
      },
      {
        id: 'vocals',
        badge: '04 / VOCALS',
        title: 'Sonu & Shreya’s Flawless Phrasing',
        preview: 'Silky micro-tonal ornaments and breathtaking breathing control.',
        fullText: 'Sonu Nigam’s transition between chest voice and falsetto in the refrain, paired with Shreya Ghoshal’s radiant entry, creates a golden standard in playback craftsmanship.',
        statLabel: 'Vocal Mastery',
        statValue: 'Falsetto & Murki'
      },
      {
        id: 'legacy',
        badge: '05 / LEGACY',
        title: 'Gothic Cinema Disc Legacy',
        preview: 'The standout physical CD single of the Vishesh Films franchise.',
        fullText: 'Remains an enduring staple of late-2000s Bollywood CD collections, celebrated for its spatial mixing and sparkling acoustic fidelity.',
        statLabel: 'Franchise',
        statValue: 'Vishesh Films CD'
      }
    ]
  }
];
