import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../redux/slices/wishlistSlice'; 
import PropertyCard from "../components/PropertyCard";

const MyWishlist = () => {
    const dispatch = useDispatch();
    const { items = [], loading } = useSelector((state) => state.wishlist || {});
    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    if (loading) return <div className="p-10 text-center font-bold">Loading Wishlist...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black mb-8">My Wishlist</h1>
            
            {items.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-bold">Your wishlist is empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(property => (
                        <PropertyCard key={property._id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyWishlist;