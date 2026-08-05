import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

const loadCompareState = () => {
    try {
        const serializedState = localStorage.getItem('property_hub_compare');
        if (serializedState === null) return [];
        return JSON.parse(serializedState);
    } catch (err) {
        return [];
    }
};

const compareSlice = createSlice({
    name: 'compare',
    initialState: { 
        items: loadCompareState(),
        limit: 4 
    },
    reducers: {
        toggleCompare: (state, action) => {
            const property = action.payload;
            const exists = state.items.find(item => item._id === property._id);

            if (exists) {
                state.items = state.items.filter(item => item._id !== property._id);
                toast.success(`${property.name} removed from comparison registry`, {
                    style: { borderRadius: '10px', background: '#080E4B', color: '#fff' }
                });
            } else {
                if (state.items.length >= state.limit) {
                    toast.error(`Architecture comparison limit reached (Max ${state.limit})`, {
                        icon: '⚖️',
                    });
                    return;
                }

                state.items.push(property);
                toast.success(`${property.name} queued for analysis`, {
                    style: { borderRadius: '10px', background: '#C5A358', color: '#080E4B', fontWeight: 'bold' }
                });
            }
            localStorage.setItem('property_hub_compare', JSON.stringify(state.items));
        },

        removeSpecific: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            localStorage.setItem('property_hub_compare', JSON.stringify(state.items));
        },

        clearCompare: (state) => { 
            state.items = []; 
            localStorage.removeItem('property_hub_compare');
            toast.success("Comparison registry cleared");
        }
    }
});

export const { toggleCompare, clearCompare, removeSpecific } = compareSlice.actions;
export default compareSlice.reducer;