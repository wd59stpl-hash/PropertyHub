import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export const fetchAdminStats = createAsyncThunk(
    'admin/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/stats');
            return response.data.stats;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
        }
    }
);

export const fetchPendingProperties = createAsyncThunk(
    'admin/fetchPending',
    async ({ page = 1, limit = 8 }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/admin/pending-properties?page=${page}&limit=${limit}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updatePropertyStatus = createAsyncThunk(
    'admin/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/admin/approve/${id}`, { status });
            toast.success(status ? "Property Approved" : "Property Rejected");
            return { id, status, message: response.data.message };
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    'admin/fetchUsers',
    async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
            return res.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const toggleSuspendUser = createAsyncThunk(
    'admin/suspendUser', 
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`/admin/users/suspend/${id}`, { isSuspended: status });
            toast.success(status ? "User Suspended" : "User Activated");
            return { id, status };
        } catch (error) {
            toast.error(error.response?.data?.message || "Status update failed");
            return rejectWithValue(error.response?.data?.message);
        }
});
export const updateUserStatus = createAsyncThunk(
    'admin/updateUserStatus',
    async ({ id, isSuspended }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/admin/users/${id}/status`, { isSuspended });
            toast.success(isSuspended ? "User access suspended" : "User access restored", {
                style: { background: '#080E4B', color: '#fff' }
            });
            
            return { id, isSuspended };
        } catch (error) {
            const message = error.response?.data?.message || "Failed to update status";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);


export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success("User removed from registry");
            return id;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const fetchAnalyticsReports = createAsyncThunk(
    'admin/fetchReports',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/admin/reports/analytics');
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        stats: null,
        users: [],
        pendingProperties: [],
        reports: null,
        loading: false, 
        usersLoading: false,
        propertiesLoading: false,
        pendingProperties: [],
        propertiesPagination: { 
            currentPage: 1, 
            totalPages: 1 
        }, 
        error: null
    },
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStats.pending, (state) => { state.loading = true; })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllUsers.pending, (state) => { state.usersLoading = true; })
            
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.error = action.payload;
            })
            .addCase(toggleSuspendUser.fulfilled, (state, action) => {
                const user = state.users.find(u => u._id === action.payload.id);
                if (user) user.isSuspended = action.payload.status;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
                if (state.stats) state.stats.users.total -= 1; 
            })
            .addCase(fetchPendingProperties.pending, (state) => { state.propertiesLoading = true; }).addCase(fetchPendingProperties.fulfilled, (state, action) => {
                state.pendingProperties = action.payload.data;
                state.propertiesPagination = {
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage
                };
                state.loading = false;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload.data;
                state.usersPagination = {
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage
                };
                state.loading = false;
            })
            .addCase(fetchPendingProperties.rejected, (state, action) => {
                state.propertiesLoading = false;
                state.error = action.payload;
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const user = state.users.find(u => u._id === action.payload.id);
                if (user) {
                    user.isSuspended = action.payload.isSuspended;
                }
            })
            .addCase(updatePropertyStatus.fulfilled, (state, action) => {
                state.pendingProperties = state.pendingProperties.filter(
                    (prop) => prop._id !== action.payload.id
                );
                if (state.stats) {
                    state.stats.properties.pending -= 1;
                    if (action.payload.status) state.stats.properties.total += 1;
                }
            })
            .addCase(fetchAnalyticsReports.pending, (state) => { state.loading = true; })
            .addCase(fetchAnalyticsReports.fulfilled, (state, action) => {
                state.reports = action.payload;
                state.loading = false;
            })
            .addCase(fetchAnalyticsReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;