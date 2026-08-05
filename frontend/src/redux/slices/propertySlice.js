import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export const fetchAllProperties = createAsyncThunk(
    'properties/fetchAll',
    async (queryParams, { rejectWithValue }) => {
        try {
            const response = await api.get('/properties', { params: queryParams });
            return { data: response.data, isLoadMore: queryParams.page > 1 };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const fetchPropertyById = createAsyncThunk(
    'properties/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/properties/details/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch details");
        }
    }
);

export const createProperty = createAsyncThunk(
    'properties/create',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/properties/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error");
        }
    }
);

export const getSellerProperties = createAsyncThunk(
    'properties/getSeller',
    async ({ page = 1, limit = 8 } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/properties/my-listings?page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed");
        }
    }
);


export const deleteProperty = createAsyncThunk(
    'properties/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/properties/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Delete failed");
        }
    }
);

export const updateProperty = createAsyncThunk(
    'properties/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/properties/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Update failed");
        }
    }
);
const propertySlice = createSlice({
    name: 'properties',
    initialState: {
        loading: false,
        error: null,
        success: false,
        allProperties: [],
        singleProperty: null,
        sellerProperties: [],
        pagination: { total: 0, pages: 0, currentPage: 1 }
    },
    reducers: {
        resetState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.singleProperty = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProperties.pending, (state) => { state.loading = true; })
            .addCase(fetchAllProperties.fulfilled, (state, action) => {
                state.loading = false;
                const { properties, total, pages, currentPage } = action.payload.data;
                if (action.payload.isLoadMore) {
                    state.allProperties = [...state.allProperties, ...properties];
                } else {
                    state.allProperties = properties;
                }
                state.pagination = { total, pages, currentPage };
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.loading = false;
                state.singleProperty = action.payload;
            })
            .addCase(createProperty.pending, (state) => { state.loading = true; })
            .addCase(createProperty.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                toast.success("Property Published!");
            })
            .addCase(getSellerProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.sellerProperties = action.payload.properties;
                state.sellerPagination = {
                    total: action.payload.total,
                    pages: action.payload.pages,
                    currentPage: action.payload.currentPage
                };
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                state.sellerProperties = state.sellerProperties.filter(p => p._id !== action.payload);
                toast.success("Property Deleted");
            })
            .addCase(updateProperty.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.sellerProperties.findIndex(p => p._id === action.payload._id);
                if (index !== -1) state.sellerProperties[index] = action.payload;
                toast.success("Property Updated!");
            })
            .addCase(updateProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    }
});

export const { resetState } = propertySlice.actions;
export default propertySlice.reducer;