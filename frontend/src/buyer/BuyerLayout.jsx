import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import {
    LayoutDashboard, Heart, Calendar, CreditCard,
    User, LogOut, MessageSquare, Menu, X, ChevronRight,
    Globe, Home
} from 'lucide-react';

const BuyerLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        { name: 'Dashboard', path: '/buyer/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'My Wishlist', path: '/buyer/wishlist', icon: <Heart size={18} /> },
        { name: 'Booked Visits', path: '/buyer/visits', icon: <Calendar size={18} /> },
        { name: 'Transactions', path: '/buyer/purchases', icon: <CreditCard size={18} /> },
        { name: 'Messages', path: '/buyer/messages', icon: <MessageSquare size={18} /> },
        { name: 'Account Profile', path: '/buyer/profile', icon: <User size={18} /> },
    ];

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row font-sans text-[#080E4B]">
            <div className="lg:hidden bg-[#080E4B] px-6 py-4 flex items-center justify-between text-white shadow-lg">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#C5A358] rounded-full" />
                    <span className="font-serif uppercase tracking-widest text-sm">PropertyHub</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#080E4B] text-white transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-10 mb-4">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 border-2 border-[#C5A358] rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 bg-[#C5A358] rounded-full shadow-[0_0_15px_rgba(197,163,88,0.3)]" />
                            </div>
                            <span className="text-xl font-serif tracking-[0.1em] uppercase text-white">PropertyHub</span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 ml-6">Buyer Menu</p>

                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 relative
                                ${isActive
                                        ? 'bg-gradient-to-r from-[#C5A358] to-[#B8860B] text-[#080E4B] shadow-[0_10px_20px_-10px_rgba(197,163,88,0.5)] border-t border-white/20'
                                        : 'text-white/40 hover:bg-white/5 hover:text-white'}
                            `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className={`${isActive ? 'scale-110 text-[#080E4B]' : 'opacity-70 group-hover:opacity-100'} transition-transform duration-300`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-[11px] font-black uppercase tracking-[0.15em]">{item.name}</span>
                                        </div>

                                        {isActive && (
                                            <div className="w-1.5 h-1.5 bg-[#080E4B] rounded-full shadow-inner animate-pulse" />
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}
                            </NavLink>
                        ))}
                        <div className="pt-8 mt-8 border-t border-white/5">
                            <Link
                                to="/properties"
                                className="flex items-center gap-4 px-6 py-4 text-[#C5A358] hover:bg-[#C5A358] hover:text-[#080E4B] border border-[#C5A358]/30 rounded-2xl transition-all duration-500 group shadow-[0_0_15px_rgba(197,163,88,0.1)] hover:shadow-[#C5A358]/30"
                            >
                                <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Marketplace</span>
                            </Link>
                        </div>
                    </nav>
                    <div className="p-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-4 text-white/40 hover:text-red-400 transition-colors font-bold text-xs uppercase tracking-widest bg-white/5 rounded-2xl"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto relative bg-[#F8F9FB]">
                <div className="hidden lg:flex sticky top-0 z-40 bg-white/80 backdrop-blur-md px-12 py-5 items-center justify-between border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                        <Home size={12} />
                        <Link to="/" className="hover:text-[#2563EB]">Portal</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#080E4B]">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Buyer Account</p>
                            <p className="text-[10px] text-green-500 font-bold mt-1 uppercase">● Online</p>
                        </div>
                        <div className="w-10 h-10 bg-[#080E4B] rounded-full flex items-center justify-center text-[#C5A358] font-serif italic text-lg shadow-inner">
                            {user?.name?.charAt(0) || 'B'}
                        </div>
                    </div>
                </div>
                <div className="p-6 lg:p-12">
                    <Outlet />
                </div>
            </main>
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    );
};

export default BuyerLayout;