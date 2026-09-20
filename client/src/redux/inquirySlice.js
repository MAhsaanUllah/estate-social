import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const initialState = {
  inquiries: [],
  sentInquiries: [],
  loading: false,
  error: null,
};

export const fetchReceivedInquiries = createAsyncThunk(
  'inquiries/fetchReceived',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/inquiries/received');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch inquiries');
    }
  }
);

export const fetchSentInquiries = createAsyncThunk(
  'inquiries/fetchSent',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/inquiries/sent');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch sent inquiries');
    }
  }
);

export const createInquiry = createAsyncThunk(
  'inquiries/create',
  async (inquiryData, { rejectWithValue }) => {
    try {
      const res = await api.post('/inquiries', inquiryData);
      toast.success('Inquiry sent successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create inquiry';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateInquiry = createAsyncThunk(
  'inquiries/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/inquiries/${id}`, data);
      toast.success('Inquiry updated successfully!');
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update inquiry';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteInquiry = createAsyncThunk(
  'inquiries/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/inquiries/${id}`);
      toast.success('Inquiry deleted');
      return id;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete inquiry';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const inquirySlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {
    setInquiries: (state, action) => {
      state.inquiries = action.payload;
    },
    setSentInquiries: (state, action) => {
      state.sentInquiries = action.payload;
    },
    addInquiry: (state, action) => {
      state.inquiries.unshift(action.payload);
    },
    updateInquiryStatus: (state, action) => {
      const idx = state.inquiries.findIndex((i) => i._id === action.payload._id);
      if (idx !== -1) state.inquiries[idx] = action.payload;
    },
    removeInquiry: (state, action) => {
      state.inquiries = state.inquiries.filter((i) => i._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivedInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload.inquiries || action.payload.data || action.payload;
      })
      .addCase(fetchReceivedInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSentInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.sentInquiries = action.payload.inquiries || action.payload.data || action.payload;
      })
      .addCase(fetchSentInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.sentInquiries.unshift(action.payload.inquiry || action.payload.data || action.payload);
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInquiry.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.inquiry || action.payload.data || action.payload;
        const idx = state.inquiries.findIndex((i) => i._id === updated._id);
        if (idx !== -1) state.inquiries[idx] = updated;
        const sentIdx = state.sentInquiries.findIndex((i) => i._id === updated._id);
        if (sentIdx !== -1) state.sentInquiries[sentIdx] = updated;
      })
      .addCase(updateInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = state.inquiries.filter((i) => i._id !== action.payload);
        state.sentInquiries = state.sentInquiries.filter((i) => i._id !== action.payload);
      })
      .addCase(deleteInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setInquiries, setSentInquiries, addInquiry, updateInquiryStatus, removeInquiry } = inquirySlice.actions;
export default inquirySlice.reducer;