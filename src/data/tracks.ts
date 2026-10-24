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
    artworkUrl: 'https://i.ytimg.com/vi/WnU0lH6C0EA/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=WnU0lH6C0EA',
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
    artworkUrl: 'https://i.ytimg.com/vi/wuWGPFBgM_g/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=wuWGPFBgM_g',
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
    artworkUrl: 'https://i.ytimg.com/vi/_TJZaE0FkKs/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=_TJZaE0FkKs',
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
    artworkUrl: 'https://i.ytimg.com/vi/1YyQ0wuD0jw/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=1YyQ0wuD0jw',
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
    artworkUrl: 'https://i.ytimg.com/vi/53l2DkivxJs/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=53l2DkivxJs',
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
    artworkUrl: 'https://i.ytimg.com/vi/d09R1K9wkl4/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=d09R1K9wkl4',
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
    artworkUrl: 'https://i.ytimg.com/vi/rOUuGvJkBrQ/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=rOUuGvJkBrQ',
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
    artworkUrl: 'https://i.ytimg.com/vi/Km5AQkh58DU/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=Km5AQkh58DU',
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
    artworkUrl: 'https://i.ytimg.com/vi/D8XFTglfSMg/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=D8XFTglfSMg',
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
    artworkUrl: 'https://i.ytimg.com/vi/N57zVA-cRUM/maxresdefault.jpg',
    artworkSourceUrl: 'https://www.youtube.com/watch?v=N57zVA-cRUM',
    youtubeVideoId: 'N57zVA-cRUM',
    youtubeUrl: 'https://www.youtube.com/watch?v=N57zVA-cRUM',
    availability: 'available',
    duration: '5:29',
    featuredQuote: 'Soniyo, o soniyo, tumhein dekhta hoon toh sochta hoon bas yehi...',
    accentColor: '#7f4f24'
  }
];
