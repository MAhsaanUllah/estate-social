import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchAgentReviews = createAsyncThunk(
  'reviews/fetchAgentReviews',
  async (agentId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/reviews/agent/${agentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const res = await api.post('/reviews', reviewData);
      toast.success('Review submitted successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create review';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/reviews/${id}`, data);
      toast.success('Review updated successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update review';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      return id;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete review';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    addReview: (state, action) => {
      state.reviews.unshift(action.payload);
    },
    removeReview: (state, action) => {
      state.reviews = state.reviews.filter((r) => r._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || action.payload.data || action.payload;
      })
      .addCase(fetchAgentReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload.review || action.payload.data || action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.review || action.payload.data || action.payload;
        const idx = state.reviews.findIndex((r) => r._id === updated._id);
        if (idx !== -1) state.reviews[idx] = updated;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setReviews, addReview, removeReview } = reviewSlice.actions;
export default reviewSlice.reducer;