import axios from 'axios';

// Shazam Core API Configuration
const BASE_URL = 'https://shazam-core.p.rapidapi.com/v1';
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'demo_key'; // Use VITE_ prefix for Vite

const options = {
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
  }
};

// Mock data for fallback
const mockSongs = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    artwork: '/src/assets/songs/blinding-lights.svg',
    genre: 'pop',
    duration: '3:20',
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder audio
  },
  {
    id: 2,
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    artwork: '/src/assets/songs/watermelon-sugar.svg',
    genre: 'pop',
    duration: '2:54',
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 3,
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    artwork: '/src/assets/songs/bohemian-rhapsody.svg',
    genre: 'rock',
    duration: '5:55',
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 4,
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    artwork: '/src/assets/songs/stairway-to-heaven.svg',
    genre: 'rock',
    duration: '8:02',
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 5,
    title: 'Lose Yourself',
    artist: 'Eminem',
    album: '8 Mile Soundtrack',
    artwork: '/src/assets/songs/lose-yourself.svg',
    genre: 'hip-hop',
    duration: '5:26',
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 6,
    title: 'Rap God',
    artist: 'Eminem',
    album: 'The Marshall Mathers LP 2',
    artwork: '/src/assets/songs/lose-yourself.svg', // Reuse for now
    genre: 'hip-hop',
    duration: '6:03',
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 7,
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    artwork: '/src/assets/songs/shape-of-you.svg',
    genre: 'pop',
    duration: '3:53',
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 8,
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    artwork: '/src/assets/songs/bohemian-rhapsody.svg', // Reuse for now
    genre: 'rock',
    duration: '6:30',
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
];

export const getTopSongs = async () => {
  try {
    if (API_KEY === 'demo_key') {
      console.log('Using mock data - add VITE_RAPIDAPI_KEY to .env for real API');
      return mockSongs;
    }

    const response = await axios.get(`${BASE_URL}/charts/world`, options);
    return response.data.map((track, index) => ({
      id: track.key || index,
      title: track.title,
      artist: track.subtitle,
      album: track.album || 'Unknown Album',
      artwork: track.images?.coverart || track.images?.background || 'https://via.placeholder.com/300',
      genre: track.genres?.primary || 'pop',
      duration: track.duration || '3:00',
      preview: track.hub?.actions?.[1]?.uri || null,
      url: track.url,
    }));
  } catch (error) {
    console.error('Error fetching top songs:', error);
    return mockSongs; // Fallback to mock data
  }
};

export const getSongsByGenre = async (genre) => {
  try {
    if (API_KEY === 'demo_key') {
      return mockSongs.filter(song => song.genre.toLowerCase() === genre.toLowerCase());
    }

    const response = await axios.get(`${BASE_URL}/charts/genre-world`, {
      ...options,
      params: { genre_code: genre.toUpperCase() }
    });

    return response.data.map((track, index) => ({
      id: track.key || index,
      title: track.title,
      artist: track.subtitle,
      album: track.album || 'Unknown Album',
      artwork: track.images?.coverart || track.images?.background || 'https://via.placeholder.com/300',
      genre: track.genres?.primary || genre,
      duration: track.duration || '3:00',
      preview: track.hub?.actions?.[1]?.uri || null,
      url: track.url,
    }));
  } catch (error) {
    console.error('Error fetching songs by genre:', error);
    return mockSongs.filter(song => song.genre.toLowerCase() === genre.toLowerCase());
  }
};

export const searchSongs = async (query) => {
  try {
    if (API_KEY === 'demo_key') {
      return mockSongs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
      );
    }

    const response = await axios.get(`${BASE_URL}/search/multi`, {
      ...options,
      params: {
        search_type: 'SONGS_ARTISTS',
        query: query
      }
    });

    const tracks = response.data.tracks?.hits || [];
    return tracks.map(hit => ({
      id: hit.track.key,
      title: hit.track.title,
      artist: hit.track.subtitle,
      album: hit.track.album || 'Unknown Album',
      artwork: hit.track.images?.coverart || hit.track.images?.background || 'https://via.placeholder.com/300',
      genre: hit.track.genres?.primary || 'pop',
      duration: hit.track.duration || '3:00',
      preview: hit.track.hub?.actions?.[1]?.uri || null,
      url: hit.track.url,
    }));
  } catch (error) {
    console.error('Error searching songs:', error);
    return mockSongs.filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const getSongDetails = async (id) => {
  try {
    if (API_KEY === 'demo_key') {
      return mockSongs.find(song => song.id.toString() === id.toString());
    }

    const response = await axios.get(`${BASE_URL}/tracks/details`, {
      ...options,
      params: { track_id: id }
    });

    const track = response.data;
    return {
      id: track.key,
      title: track.title,
      artist: track.subtitle,
      album: track.album || 'Unknown Album',
      artwork: track.images?.coverart || track.images?.background || 'https://via.placeholder.com/300',
      genre: track.genres?.primary || 'pop',
      duration: track.duration || '3:00',
      preview: track.hub?.actions?.[1]?.uri || null,
      url: track.url,
      lyrics: track.sections?.find(section => section.type === 'LYRICS')?.text || null,
    };
  } catch (error) {
    console.error('Error fetching song details:', error);
    return mockSongs.find(song => song.id.toString() === id.toString());
  }
};

export const getTopArtists = async () => {
  try {
    if (API_KEY === 'demo_key') {
      const artistData = [
        { name: 'The Weeknd', avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face' },
        { name: 'Harry Styles', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
        { name: 'Queen', avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&h=150&fit=crop&crop=face' },
        { name: 'Led Zeppelin', avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face' },
        { name: 'Eminem', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
        { name: 'Ed Sheeran', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
        { name: 'Eagles', avatar: 'https://images.unsplash.com/photo-1520637836862-4d197d17c1a8?w=150&h=150&fit=crop&crop=face' },
      ];
      return artistData.map((artist, index) => ({
        id: index,
        name: artist.name,
        avatar: artist.avatar,
        verified: true,
      }));
    }

    const response = await axios.get(`${BASE_URL}/charts/world`, options);
    const artists = response.data
      .reduce((acc, track) => {
        const existingArtist = acc.find(a => a.name === track.subtitle);
        if (!existingArtist) {
          acc.push({
            id: track.artists?.[0]?.adamid || acc.length,
            name: track.subtitle,
            avatar: track.images?.background || 'https://via.placeholder.com/150',
            verified: true,
          });
        }
        return acc;
      }, [])
      .slice(0, 10);

    return artists;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    const artistData = [
      { name: 'The Weeknd', avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face' },
      { name: 'Harry Styles', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      { name: 'Queen', avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&h=150&fit=crop&crop=face' },
      { name: 'Led Zeppelin', avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face' },
      { name: 'Eminem', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
      { name: 'Ed Sheeran', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
      { name: 'Eagles', avatar: 'https://images.unsplash.com/photo-1520637836862-4d197d17c1a8?w=150&h=150&fit=crop&crop=face' },
    ];
    return artistData.map((artist, index) => ({
      id: index,
      name: artist.name,
      avatar: artist.avatar,
      verified: true,
    }));
  }
};

// If using real API, uncomment and configure
// const options = {
//   method: 'GET',
//   url: 'https://shazam-core.p.rapidapi.com/v1/charts/world',
//   headers: {
//     'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
//     'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
//   }
// };

// export const getTopSongs = async () => {
//   try {
//     const response = await axios.request(options);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };