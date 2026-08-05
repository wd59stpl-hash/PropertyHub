import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; 
import { toast } from "react-hot-toast";

export const fetchSellerDashboard = createAsyncThunk(
    'seller/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/seller/dashboard');
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard");
        }
    }
);

export const deleteProperty = createAsyncThunk(
    'seller/deleteProperty',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/property/${id}`);
            toast.success("Property deleted successfully");
            return id;
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


const sellerSlice = createSlice({
    name: 'seller',
    initialState: {
        dashboard: null, 
        loading: false,
        error: null
    },
    reducers: {
        clearSellerError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchSellerDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                if (state.dashboard) {
                    state.dashboard.listings = state.dashboard.listings.filter(
                        (item) => item._id !== action.payload
                    );
                }
            });
    }
});

export const { clearSellerError } = sellerSlice.actions;
export default sellerSlice.reducer; 