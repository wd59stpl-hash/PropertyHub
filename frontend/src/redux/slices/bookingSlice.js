import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';


export const createBooking = createAsyncThunk(
    'bookings/create',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await api.post('/bookings/request', bookingData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Booking Failed");
        }
    }
);

export const fetchBuyerBookings = createAsyncThunk(
    'bookings/fetchBuyer',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/bookings/my-visits');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch visits");
        }
    }
);

export const fetchSellerInquiries = createAsyncThunk(
    'bookings/fetchSeller',
    async ({ page = 1, limit = 5 } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/bookings/seller-inquiries?page=${page}&limit=${limit}`);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateBookingStatus = createAsyncThunk(
    'bookings/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/bookings/${id}/status`, { status });
            return { id, status, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Update Failed");
        }
    }
);


const bookingSlice = createSlice({
    name: 'bookings',
    initialState: {
        loading: false,
        success: false,
        error: null,
        buyerBookings: [],
        sellerInquiries: [], 
    },
    reducers: {
        resetBookingState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => { state.loading = true; })
            .addCase(createBooking.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                toast.success("Visit request sent!");
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(fetchBuyerBookings.pending, (state) => { state.loading = true; })
            .addCase(fetchBuyerBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.buyerBookings = action.payload; 
            })
            .addCase(fetchBuyerBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSellerInquiries.pending, (state) => { state.loading = true; })
            .addCase(fetchSellerInquiries.fulfilled, (state, action) => {
                state.loading = false;
                state.sellerInquiries = action.payload.data;
                state.pagination = {
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                    totalItems: action.payload.totalItems
                };
            })
            .addCase(fetchSellerInquiries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const index = state.sellerInquiries.findIndex(b => b._id === action.payload.id);
                if (index !== -1) {
                    state.sellerInquiries[index].status = action.payload.status;
                }
                toast.success(action.payload.message);
            });
    }
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;