import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    LayoutDashboard, PlusCircle, List, CalendarCheck,
    LogOut, Home, MessageSquare,
    ChevronRight, Globe, Menu, X, StarHalf,
    UserCircle
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const SellerLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Add Property', path: '/seller/add-property', icon: <PlusCircle size={18} /> },
        { name: 'Manage Listings', path: '/seller/manage-listings', icon: <List size={18} /> },
        { name: 'Visit Requests', path: '/seller/schedules', icon: <CalendarCheck size={18} /> },
        { name: 'Reviews', path: '/seller/reviews', icon: <StarHalf size={18} /> },
        { name: 'Messages', path: '/seller/messages', icon: <MessageSquare size={18} /> },
        { name: 'My Profile', path: '/seller/profile', icon: <UserCircle size={18} /> },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="h-screen overflow-hidden bg-[#F8F9FB] dark:bg-slate-950 flex flex-col lg:flex-row font-sans text-[#080E4B] dark:text-slate-200 transition-colors duration-500">
            <div className="lg:hidden bg-[#080E4B] dark:bg-slate-900 px-6 py-4 flex items-center justify-between text-white shadow-lg z-[60]">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#C5A358] rounded-full" />
                    <span className="font-serif uppercase tracking-widest text-sm">PropertyHub PRO</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#080E4B] dark:bg-[#020617] text-white transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                border-r dark:border-slate-800
            `}>
                <div className="h-full flex flex-col">

                    <div className="p-10 mb-2">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 border-2 border-[#C5A358] rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 bg-[#C5A358] rounded-full shadow-[0_0_15px_rgba(197,163,88,0.4)]" />
                            </div>
                            <span className="text-xl font-serif tracking-[0.1em] uppercase text-white leading-none">Seller <br /><span className="text-[10px] tracking-[0.4em] text-[#C5A358]">Professional</span></span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 ml-6">Management</p>

                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `
                                    group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden
                                    ${isActive
                                        ? 'bg-gradient-to-r from-[#C5A358] to-[#B8860B] text-[#080E4B] shadow-[0_10px_20px_-10px_rgba(197,163,88,0.5)]'
                                        : 'text-white/40 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <span className={`${isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100'} transition-transform duration-300`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-[11px] font-black uppercase tracking-[0.15em]">{item.name}</span>
                                        </div>
                                        {isActive && <div className="w-1.5 h-1.5 bg-[#080E4B] rounded-full shadow-inner animate-pulse" />}
                                    </>
                                )}
                            </NavLink>
                        ))}

                        <div className="pt-8 mt-8 border-t border-white/5">
                            <Link
                                to="/"
                                className="flex items-center gap-4 px-6 py-4 text-[#C5A358] hover:bg-[#C5A358] hover:text-[#080E4B] border border-[#C5A358]/30 rounded-2xl transition-all duration-500 group"
                            >
                                <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">View Website</span>
                            </Link>
                        </div>
                    </nav>

                    <div className="p-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white/30 hover:text-red-400 transition-colors font-bold text-xs uppercase tracking-widest bg-white/5 rounded-2xl border border-white/5"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto scrollbar-hide relative bg-[#F8F9FB] dark:bg-slate-950 transition-colors duration-500">
                <div className="hidden lg:flex sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-12 py-5 items-center justify-between border-b border-gray-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-slate-500">
                        <Home size={12} />
                        <Link to="/" className="hover:text-[#C5A358]">Portal</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#080E4B] dark:text-slate-300">Seller Dashboard</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none dark:text-slate-400">Seller Business</p>
                            <p className="text-[10px] text-blue-500 dark:text-blue-400 font-bold mt-1 uppercase">● PRO Merchant</p>
                        </div>
                        <div className="w-10 h-10 bg-[#080E4B] dark:bg-[#C5A358] rounded-full flex items-center justify-center text-[#C5A358] dark:text-white font-serif italic text-lg shadow-inner">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                    </div>
                </div>
                <div className="p-6 lg:p-12">
                    <div className="animate-in fade-in duration-700">
                        <Outlet />
                    </div>
                </div>
            </main>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    );
};

export default SellerLayout;