import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSongsByGenre, getTopSongs } from '../services/musicApi';

// Helper function to get initial theme
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const useStore = create(
  persist(
    (set) => ({
      // Player State
      currentSong: null,
      isPlaying: false,
      volume: 0.5,
      currentTime: 0,
      duration: 0,
      isShuffle: false,
      repeatMode: 'off', // 'off', 'one', 'all'
      queue: [],
      currentIndex: -1,

      // Theme State
      theme: getInitialTheme(),

      // Songs State
      songs: [],
      genre: 'all',
      loading: false,
      error: null,

      // User Preferences
      lastPlayedSong: null,

      // Player Actions
      setCurrentSong: (song) => set((state) => {
        const newIndex = state.queue.findIndex(s => s.id === song.id);
        return {
          currentSong: song,
          currentIndex: newIndex,
          lastPlayedSong: song,
        };
      }),

      togglePlayPause: () => set((state) => ({
        isPlaying: !state.isPlaying
      })),

      setVolume: (volume) => set({ volume }),

      setCurrentTime: (time) => set({ currentTime: time }),

      setDuration: (duration) => set({ duration }),

      setQueue: (queue) => set((state) => ({
        queue,
        currentIndex: queue.findIndex(song => song.id === state.currentSong?.id)
      })),

      playNext: () => set((state) => {
        if (state.queue.length === 0) return state;

        let nextIndex;
        if (state.isShuffle) {
          nextIndex = Math.floor(Math.random() * state.queue.length);
        } else {
          nextIndex = (state.currentIndex + 1) % state.queue.length;
        }

        return {
          currentIndex: nextIndex,
          currentSong: state.queue[nextIndex],
          lastPlayedSong: state.queue[nextIndex],
        };
      }),

      playPrevious: () => set((state) => {
        if (state.queue.length === 0) return state;

        const prevIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.queue.length - 1;
        return {
          currentIndex: prevIndex,
          currentSong: state.queue[prevIndex],
          lastPlayedSong: state.queue[prevIndex],
        };
      }),

      toggleShuffle: () => set((state) => ({
        isShuffle: !state.isShuffle
      })),

      setRepeatMode: () => set((state) => {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(state.repeatMode);
        return {
          repeatMode: modes[(currentIndex + 1) % modes.length]
        };
      }),

      addToQueue: (song) => set((state) => ({
        queue: [...state.queue, song]
      })),

      removeFromQueue: (songId) => set((state) => {
        const index = state.queue.findIndex(song => song.id === songId);
        if (index > -1) {
          const newQueue = [...state.queue];
          newQueue.splice(index, 1);
          let newCurrentIndex = state.currentIndex;
          if (newCurrentIndex >= index && newCurrentIndex > 0) {
            newCurrentIndex--;
          }
          return {
            queue: newQueue,
            currentIndex: newCurrentIndex,
          };
        }
        return state;
      }),

      // Theme Actions
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return { theme: newTheme };
      }),

      setTheme: (theme) => set(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        return { theme };
      }),

      // Songs Actions
      setGenre: (genre) => set({ genre }),

      fetchSongs: async (genre) => {
        set({ loading: true, error: null });
        try {
          let songs;
          if (genre === 'all') {
            songs = await getTopSongs();
          } else {
            songs = await getSongsByGenre(genre);
          }
          set({ songs, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    {
      name: 'masthi-music-store',
      partialize: (state) => ({
        theme: state.theme,
        genre: state.genre,
        lastPlayedSong: state.lastPlayedSong,
        volume: state.volume,
        isShuffle: state.isShuffle,
        repeatMode: state.repeatMode,
      }),
    }
  )
);

// Apply initial theme to document
document.documentElement.classList.toggle('dark', useStore.getState().theme === 'dark');

export default useStore;