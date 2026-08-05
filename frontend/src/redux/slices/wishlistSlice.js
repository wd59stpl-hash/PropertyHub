import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/buyer/wishlist');
        return response.data.data; 
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (id, { rejectWithValue }) => {
    try {
        const response = await api.post('/buyer/wishlist/toggle', { propertyId: id });
        return { 
            propertyId: id, 
            added: response.data.added, 
            property: response.data.property 
        };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Error");
    }
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: { 
        items: [], 
        loading: false, 
        error: null 
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || []; 
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(toggleWishlist.fulfilled, (state, action) => {
                const { propertyId, added, property } = action.payload;
                
                if (added && property) {
                    state.items.push(property);
                } else {
                    state.items = state.items.filter(item => item._id !== propertyId);
                }
            });
    }
});

export default wishlistSlice.reducer;