import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPropertyTypes = createAsyncThunk('propertyTypes/fetchAll', async () => {
    const response = await api.get('/property-types');
    return response.data.data;
});

export const addPropertyType = createAsyncThunk('propertyTypes/add', async (data) => {
    const response = await api.post('/property-types', data);
    return response.data.data;
});

const propertyTypeSlice = createSlice({
    name: 'propertyTypes',
    initialState: { list: [], loading: false },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(addPropertyType.fulfilled, (state, action) => {
                state.list.push(action.payload);
            });
    }
});

export default propertyTypeSlice.reducer;