import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import songsReducer from './slices/songsSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    songs: songsReducer,
    theme: themeReducer,
  },
});