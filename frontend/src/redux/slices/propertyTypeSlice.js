import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export const fetchPropertyTypes = createAsyncThunk(
    'propertyTypes/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/property-types/all-property-types');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load property types");
        }
    }
);
export const addPropertyType = createAsyncThunk(
    '/add',
    async (typeData, { rejectWithValue }) => {
        try {
            const response = await api.post('/property-types/add', typeData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add property type");
        }
    }
);

export const removePropertyType = createAsyncThunk(
    'propertyTypes/remove',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/property-types/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete property type");
        }
    }
);


const propertyTypeSlice = createSlice({
    name: 'propertyTypes',
    initialState: {
        list: [],
        loading: false,
        error: null,
        addSuccess: false
    },
    reducers: {
        resetTypeState: (state) => {
            state.error = null;
            state.addSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyTypes.pending, (state) => { state.loading = true; })
            .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchPropertyTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addPropertyType.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.addSuccess = true;
                toast.success("New property type added!");
            })
            .addCase(addPropertyType.rejected, (state, action) => {
                toast.error(action.payload);
            })
            .addCase(removePropertyType.fulfilled, (state, action) => {
                state.list = state.list.filter(type => type._id !== action.payload);
                toast.success("Property type removed");
            });
    }
});

export const { resetTypeState } = propertyTypeSlice.actions;
export default propertyTypeSlice.reducer;