import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
    const res = await api.get('/notifications');
    return res.data;
});

export const deleteNotification = createAsyncThunk('notifications/delete', async (id) => {
    await api.delete(`/notifications/${id}`);
    return id;
});

export const clearAllNotifications = createAsyncThunk('notifications/clearAll', async () => {
    await api.delete('/notifications/clear-all');
    return [];
});

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: { items: [], unreadCount: 0, loading: false },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.items = action.payload.notifications || [];
                state.unreadCount = action.payload.unreadCount || 0;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
                state.unreadCount = state.items.filter(i => !i.isRead).length;
            })
            .addCase(clearAllNotifications.fulfilled, (state) => {
                state.items = [];
                state.unreadCount = 0;
            });
    }
});

export default notificationSlice.reducer;