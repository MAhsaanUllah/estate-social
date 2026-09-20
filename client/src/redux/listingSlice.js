import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const loadFiltersFromStorage = () => {
  try {
    const saved = localStorage.getItem('estateFilters');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse filters from local storage', e);
  }
  return {
    purpose: '',
    propertyType: '',
    society: '',
    phase: '',
    block: '',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
    search: '',
  };
};

const initialState = {
  listings: [],
  currentListing: null,
  loading: false,
  error: null,
  filters: loadFiltersFromStorage(),
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          query.append(key, value);
        }
      });
      const res = await api.get(`/listings?${query.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch listings');
    }
  }
);

export const fetchListingById = createAsyncThunk(
  'listings/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/listings/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch listing');
    }
  }
);

export const createListing = createAsyncThunk(
  'listings/create',
  async (listingData, { rejectWithValue }) => {
    try {
      const res = await api.post('/listings', listingData);
      toast.success('Listing created successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create listing';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateListing = createAsyncThunk(
  'listings/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/listings/${id}`, data);
      toast.success('Listing updated successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update listing';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteListing = createAsyncThunk(
  'listings/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/listings/${id}`);
      toast.success('Listing deleted successfully!');
      return id;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete listing';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchAgentListings = createAsyncThunk(
  'listings/fetchAgentListings',
  async (agentId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/listings/agent/${agentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch agent listings');
    }
  }
);

export const fetchMyListings = createAsyncThunk(
  'listings/fetchMyListings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/listings/my-listings');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch my listings');
    }
  }
);

const listingSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
      localStorage.setItem('estateFilters', JSON.stringify(state.filters));
    },
    clearFilters: (state) => {
      state.filters = {
        purpose: '', propertyType: '', society: '', phase: '', block: '',
        minPrice: '', maxPrice: '', minSize: '', maxSize: '', search: '',
      };
      state.pagination.page = 1;
      localStorage.removeItem('estateFilters');
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearCurrentListing: (state) => {
      state.currentListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload.listings || action.payload.data || [];
        state.pagination = {
          ...state.pagination,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
          page: action.payload.page || 1,
        };
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentListing = action.payload.listing || action.payload.data || action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings.unshift(action.payload.listing || action.payload.data || action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.listing || action.payload.data || action.payload;
        const idx = state.listings.findIndex((l) => l._id === updated._id);
        if (idx !== -1) state.listings[idx] = updated;
        if (state.currentListing?._id === updated._id) state.currentListing = updated;
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = state.listings.filter((l) => l._id !== action.payload);
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAgentListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentListings.fulfilled, (state, action) => {
        state.loading = false;
        // Store agent listings separately or in the main listings array
        state.listings = action.payload.listings || action.payload.data || action.payload;
      })
      .addCase(fetchAgentListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setPage, clearCurrentListing } = listingSlice.actions;
export default listingSlice.reducer;