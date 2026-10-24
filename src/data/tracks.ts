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
  youtubeVideoId: string;
  youtubeUrl: string;
  availability: 'available' | 'restricted' | 'unavailable';
  duration?: string;
  featuredQuote?: string;
  notes?: string;
  accentColor?: string;
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/16/61/f8/1661f8e0-7d25-0f4e-a50e-5338808dfdbb/886444396479.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/zehnaseeb/783487038?i=783487058&uo=4',
    youtubeVideoId: 'WnU0lH6C0EA',
    youtubeUrl: 'https://www.youtube.com/watch?v=WnU0lH6C0EA',
    availability: 'available',
    duration: '3:35',
    featuredQuote: 'Zehnaseeb, zehnaseeb, tujhe chahoon betahasha zehnaseeb...',
    accentColor: '#e07a5f'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/91/38/c3/9138c3d7-941c-3298-49c4-1286f4216bbc/888880945457.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/in-dino/302523807?i=302523872&uo=4',
    youtubeVideoId: 'wuWGPFBgM_g',
    youtubeUrl: 'https://www.youtube.com/watch?v=wuWGPFBgM_g',
    availability: 'available',
    duration: '4:00',
    featuredQuote: 'In dino dil mera mujhse hai keh raha, tu khwaab saja...',
    accentColor: '#3d5a80'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/51/62/24/5162249a-75a8-fd57-9aec-6ce9f3aa6c46/8902894685887_cover.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/dil-to-bachcha-hai/1131043351?i=1131043354&uo=4',
    youtubeVideoId: '_TJZaE0FkKs',
    youtubeUrl: 'https://www.youtube.com/watch?v=_TJZaE0FkKs',
    availability: 'available',
    duration: '5:36',
    featuredQuote: 'Aisi uljhi nazar unse hatt-ti nahi, daant se reshmi dor katt-ti nahi...',
    accentColor: '#b08968'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9e/72/a0/9e72a0e7-eb6f-e576-47b1-2ae26a007dac/886444018869.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/nazar-laaye/656015920?i=656016011&uo=4',
    youtubeVideoId: '1YyQ0wuD0jw',
    youtubeUrl: 'https://www.youtube.com/watch?v=1YyQ0wuD0jw',
    availability: 'available',
    duration: '3:58',
    featuredQuote: 'Nazar laaye na koi, aisi taaza hawaon ki dhoop ko...',
    accentColor: '#d4a373'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/43/fb/d8/43fbd870-9a3b-ccd9-8866-2a2c6dc48287/8901854003792.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/tu-jaane-na/1537029617?i=1537030272&uo=4',
    youtubeVideoId: '53l2DkivxJs',
    youtubeUrl: 'https://www.youtube.com/watch?v=53l2DkivxJs',
    availability: 'available',
    duration: '5:41',
    notes: 'Official Atif Aslam version',
    featuredQuote: 'Kaise batayein kyun tujhko chahe yaara bata na paaye...',
    accentColor: '#2b2d42'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d7/1f/56/d71f5669-03dc-e787-7999-6be9112c8601/8902894688765_cover.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/chori-kiya-re-jiya/1123346616?i=1123346657&uo=4',
    youtubeVideoId: 'd09R1K9wkl4',
    youtubeUrl: 'https://www.youtube.com/watch?v=d09R1K9wkl4',
    availability: 'available',
    duration: '4:48',
    featuredQuote: 'Saancha kahe torey bina aaye na ek pal chaina...',
    accentColor: '#c59b27'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/06/a4/20/06a420d5-6378-ff20-8cb6-612ef7e70262/Tum_Ho_Toh_Audio_Cover.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/tum-ho-toh-from-saiyaara/1820715703?i=1820715704&uo=4',
    youtubeVideoId: 'rOUuGvJkBrQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=rOUuGvJkBrQ',
    availability: 'available',
    duration: '3:40',
    featuredQuote: 'Tum ho toh subah nayi hai, tum ho toh shaamein haseen hain...',
    accentColor: '#5c677d'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/49/32/5a/49325a52-e5e5-bb10-62f6-eebb211ce423/886446889825.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/tere-naina/1569776324?i=1569776328&uo=4',
    youtubeVideoId: 'Km5AQkh58DU',
    youtubeUrl: 'https://www.youtube.com/watch?v=Km5AQkh58DU',
    availability: 'available',
    duration: '4:38',
    featuredQuote: 'Nainaa... tere do naina, thag lenge...',
    accentColor: '#6d597a'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f3/d9/23/f3d92398-118c-10c9-2ef8-5f28cff344c2/8902894688512_cover.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/pee-loon/1123340727?i=1123340746&uo=4',
    youtubeVideoId: 'D8XFTglfSMg',
    youtubeUrl: 'https://www.youtube.com/watch?v=D8XFTglfSMg',
    availability: 'available',
    duration: '4:47',
    featuredQuote: 'Pee loon tere neele neele naino se shabnam, pee loon...',
    accentColor: '#9a8c98'
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
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/77/4d/9f/774d9f5c-830a-c140-f1ae-6e637dc9af14/888880931542.jpg/1200x1200bb.jpg',
    artworkSourceUrl: 'https://music.apple.com/in/album/soniyo/299122148?i=299122166&uo=4',
    youtubeVideoId: 'N57zVA-cRUM',
    youtubeUrl: 'https://www.youtube.com/watch?v=N57zVA-cRUM',
    availability: 'available',
    duration: '5:29',
    featuredQuote: 'Soniyo, o soniyo, tumhein dekhta hoon toh sochta hoon bas yehi...',
    accentColor: '#7f4f24'
  }
];
