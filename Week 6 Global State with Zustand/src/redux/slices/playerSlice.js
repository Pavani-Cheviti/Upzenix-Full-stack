import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSong: null,
  isPlaying: false,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
  isShuffle: false,
  repeatMode: 'off', // 'off', 'one', 'all'
  queue: [],
  currentIndex: -1,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.currentIndex = state.queue.findIndex(song => song.id === action.payload.id);
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
      state.currentIndex = action.payload.findIndex(song => song.id === state.currentSong?.id);
    },
    playNext: (state) => {
      if (state.queue.length === 0) return;

      let nextIndex;
      if (state.isShuffle) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        nextIndex = (state.currentIndex + 1) % state.queue.length;
      }

      state.currentIndex = nextIndex;
      state.currentSong = state.queue[nextIndex];
    },
    playPrevious: (state) => {
      if (state.queue.length === 0) return;

      const prevIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.queue.length - 1;
      state.currentIndex = prevIndex;
      state.currentSong = state.queue[prevIndex];
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    setRepeatMode: (state) => {
      const modes = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(currentIndex + 1) % modes.length];
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action) => {
      const index = state.queue.findIndex(song => song.id === action.payload);
      if (index > -1) {
        state.queue.splice(index, 1);
        if (state.currentIndex >= index && state.currentIndex > 0) {
          state.currentIndex--;
        }
      }
    },
  },
});

export const {
  setCurrentSong,
  togglePlayPause,
  setVolume,
  setCurrentTime,
  setDuration,
  setQueue,
  playNext,
  playPrevious,
  toggleShuffle,
  setRepeatMode,
  addToQueue,
  removeFromQueue,
} = playerSlice.actions;

export default playerSlice.reducer;