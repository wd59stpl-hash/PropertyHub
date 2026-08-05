import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import SellerLayout from '../pages/seller/SellerLayout';
import BuyerLayout from '../buyer/BuyerLayout';
import AdminLayout from '../admin/AdminLayout';
import ReportsGenerator from '../admin/ReportsGenerator';
import Profile from '../pages/Profile';
import ManageCategories from '../admin/ManageCategories';
import PropertyTypeManager from '../admin/PropertyTypeManager';
import EditProperty from '../admin/EditProperty';
import NewLaunches from '../pages/NewLaunches';
import ReportsHub from '../admin/ReportsHub';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const BrowseProperties = lazy(() => import('../BrowseProperties'));
const PropertyDetail = lazy(() => import('../pages/PropertyDetail'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const SellerDashboard = lazy(() => import('../pages/seller/Dashboard'));
const AddProperty = lazy(() => import('../pages/seller/AddProperty'));
const ManageListings = lazy(() => import('../pages/seller/ManageListings'));
const Schedules = lazy(() => import('../pages/seller/Schedules'));
const SellerAnalytics = lazy(() => import('../pages/seller/SellerAnalytics'));
const SellerReviews = lazy(() => import('../pages/seller/SellerReviews'));
const SellerMessages = lazy(() => import('../pages/seller/SellerMessages'));
const BuyerDashboard = lazy(() => import('../buyer/Dashboard'));
const MyWishlist = lazy(() => import('../buyer/MyWishlist'));
const BookedVisits = lazy(() => import('../buyer/BookedVisits'));
const MyPurchases = lazy(() => import('../buyer/MyPurchases'));
const BuyerProfile = lazy(() => import('../buyer/BuyerProfile'));
const BuyerMessages = lazy(() => import('../buyer/BuyerMessages'));
const AdminDashboard = lazy(() => import('../admin/AdminDashboard'));
const UserManagement = lazy(() => import('../admin/UserManagement'));
const PropertyApprovals = lazy(() => import('../admin/PropertyApprovals'));
const ManageComplaints = lazy(() => import('../admin/ManageComplaints'));
const Chat = lazy(() => import('../Chat'));
const PaymentSuccess = lazy(() => import('../pages/payment/PaymentSuccess'));
const PaymentCancel = lazy(() => import('../pages/payment/PaymentCancel'));
const PageLoader = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-[3px] border-gray-100 border-t-[#C5A358] rounded-full animate-spin mb-4" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold animate-pulse">PropertyHub</p>
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/new-launches" element={<NewLaunches />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/properties" element={<BrowseProperties />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['seller', 'buyer', 'admin']} />}>
                    <Route element={<MainLayout />}>
                        <Route path="/messages" element={<Chat />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
                    <Route element={<SellerLayout />}>
                        <Route path="/seller/dashboard" element={<SellerDashboard />} />
                        <Route path="/seller/profile" element={<Profile />} />
                        <Route path="/seller/add-property" element={<AddProperty />} />
                        <Route path="/seller/manage-listings" element={<ManageListings />} />
                        <Route path="/seller/schedules" element={<Schedules />} />
                        <Route path="/seller/analytics" element={<SellerAnalytics />} />
                        <Route path="/seller/reviews" element={<SellerReviews />} />
                        <Route path="/seller/messages" element={<SellerMessages />} />
                        <Route path="/seller/edit-property/:id" element={<EditProperty />} />
                        <Route path="/seller/wishlist" element={<MyWishlist />} /> 

                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
                    <Route element={<BuyerLayout />}>
                        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
                        <Route path="/buyer/wishlist" element={<MyWishlist />} />
                        <Route path="/buyer/visits" element={<BookedVisits />} />
                        <Route path="/buyer/purchases" element={<MyPurchases />} />
                        <Route path="/buyer/profile" element={<Profile />} />
                        <Route path="/buyer/messages" element={<BuyerMessages />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/approvals" element={<PropertyApprovals />} />
                        <Route path="/admin/complaints" element={<ManageComplaints />} />
                        <Route path="/admin/users" element={<UserManagement />} />
                        <Route path="/admin/reports" element={<ReportsGenerator />} />
                        <Route path="/admin/profile" element={<Profile />} />
                        <Route path="/admin/property-type" element={<PropertyTypeManager />} />
                        <Route path="/admin/reports1" element={<ReportsHub />} />
                    </Route>
                </Route>

                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentCancel />} />

                <Route path="*" element={
                    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
                        <h1 className="text-[120px] font-serif text-gray-200 leading-none">404</h1>
                        <h2 className="text-2xl font-bold text-gray-900 mt-4">Estate Not Found</h2>
                        <p className="text-gray-500 mt-2 mb-8 max-w-md">The page you're looking for has moved to a new address or doesn't exist anymore.</p>
                        <a href="/" className="px-10 py-4 bg-[#080E4B] text-white font-bold rounded-full hover:bg-[#C5A358] transition-all shadow-lg">
                            Return Home
                        </a>
                    </div>
                } />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;