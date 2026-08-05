import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBuyerDashboard = createAsyncThunk(
    'buyer/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/buyer/dashboard');
            return res.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const buyerSlice = createSlice({
    name: 'buyer',
    initialState: {
        dashboard: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBuyerDashboard.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBuyerDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchBuyerDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default buyerSlice.reducer;