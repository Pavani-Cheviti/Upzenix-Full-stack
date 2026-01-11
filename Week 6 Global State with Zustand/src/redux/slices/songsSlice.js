import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSongsByGenre, getTopSongs } from '../../services/musicApi';

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (genre) => {
    if (genre === 'all') {
      return await getTopSongs();
    }
    return await getSongsByGenre(genre);
  }
);

const initialState = {
  songs: [],
  genre: 'all',
  loading: false,
  error: null,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setGenre: (state, action) => {
      state.genre = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setGenre } = songsSlice.actions;
export default songsSlice.reducer;