import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/favorites');
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await api.post('/favorites/toggle', { listingId });
      toast.success(response.data.message || 'Favorites updated');
      return { listingId, action: response.data.action, favorite: response.data.favorite };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update favorite';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const clearFavoritesApi = createAsyncThunk(
  'favorites/clearFavoritesApi',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/favorites');
      toast.success('Favorites cleared');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to clear favorites';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { listingId, action: act, favorite } = action.payload;
        if (act === 'added' && favorite) {
          if (!state.favorites.some((f) => f._id === listingId)) {
            state.favorites.push(favorite);
          }
        } else if (act === 'removed') {
          state.favorites = state.favorites.filter((f) => f._id !== listingId);
        }
      })

      // Clear Favorites
      .addCase(clearFavoritesApi.fulfilled, (state) => {
        state.favorites = [];
      });
  },
});

export const { setFavorites, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;