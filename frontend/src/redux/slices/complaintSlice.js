import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export const sendComplaint = createAsyncThunk(
    'complaints/send',
    async (complaintData, { rejectWithValue }) => {
        try {
            const res = await api.post('/buyer/complaints', complaintData); 
            toast.success("Intelligence report filed. Our team will investigate.", {
                style: { borderRadius: '10px', background: '#080E4B', color: '#fff' }
            });
            return res.data;
        } catch (error) {
            const message = error.response?.data?.message || "Submission failed";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const fetchAdminComplaints = createAsyncThunk(
    'complaints/fetchAll',
    async ({ page = 1, limit = 8 }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/admin/complaints?page=${page}&limit=${limit}`);
            return res.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to sync ledger");
        }
    }
);

const complaintSlice = createSlice({
    name: 'complaints',
    initialState: { 
        list: [], 
        pagination: {
            totalPages: 1,
            currentPage: 1,
            totalItems: 0
        },
        loading: false,
        isSending: false,
        error: null 
    },
    reducers: {
        resetComplaintStatus: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminComplaints.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminComplaints.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data;
                state.pagination = {
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.currentPage,
                    totalItems: action.payload.totalItems
                };
            })
            .addCase(fetchAdminComplaints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(sendComplaint.pending, (state) => {
                state.isSending = true;
            })
            .addCase(sendComplaint.fulfilled, (state) => {
                state.isSending = false;
            })
            .addCase(sendComplaint.rejected, (state) => {
                state.isSending = false;
            });
    }
});

export const { resetComplaintStatus } = complaintSlice.actions;
export default complaintSlice.reducer;