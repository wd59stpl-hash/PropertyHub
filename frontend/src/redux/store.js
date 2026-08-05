import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import bookingReducer from './slices/bookingSlice';
import adminReducer from './slices/adminSlice';
import wishlistReducer from './slices/wishlistSlice';
import complaintReducer from './slices/complaintSlice';
import buyerReducer from './slices/buyerSlice';
import sellerReducer from './slices/sellerService';
import categoryReducer from './slices/categorySlice';
import propertyTypeReducer from './slices/propertyTypeSlice';
import notificationsReducer from './slices/notificationSlice';
import themeReducer from './slices/themeSlice';
import compareReducer from './slices/compareSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        properties: propertyReducer,
        bookings: bookingReducer,
        admin: adminReducer,
        wishlist: wishlistReducer,
        complaints: complaintReducer,
        buyer: buyerReducer,
        seller: sellerReducer,
        categories: categoryReducer,
        propertyTypes: propertyTypeReducer,
        notifications: notificationsReducer,
        theme: themeReducer,
        compareItems: compareReducer,
    },
});