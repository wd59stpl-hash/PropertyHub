import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/categories');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load categories");
        }
    }
);

export const addCategory = createAsyncThunk(
    'categories/add',
    async (catData, { rejectWithValue }) => {
        try {
            const response = await api.post('/categories', catData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add category");
        }
    }
);

export const removeCategory = createAsyncThunk(
    'categories/remove',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/categories/${id}`);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete category");
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        list: [],
        loading: false,
        error: null,
        addSuccess: false 
    },
    reducers: {
        resetCategoryState: (state) => {
            state.error = null;
            state.addSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.addSuccess = true;
                state.list.push(action.payload); 
                toast.success("New category added!");
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(removeCategory.fulfilled, (state, action) => {
                state.list = state.list.filter(cat => cat._id !== action.payload);
                toast.success("Category removed");
            })
            .addCase(removeCategory.rejected, (state, action) => {
                toast.error(action.payload);
            });
    }
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;