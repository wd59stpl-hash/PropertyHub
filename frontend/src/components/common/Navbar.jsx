import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Menu, X, Home, LogOut, Bell, ChevronDown,
    LayoutDashboard, Sun, Moon, Languages, User
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { toggleDarkMode } from '../../redux/slices/themeSlice';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationSidebar from '../NotificationSidebar';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false); // Language State

    const primary = "#080E4B";
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);
    const { items: notifications, unreadCount } = useSelector((state) => state.notifications || { items: [], unreadCount: 0 });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        if (isAuthenticated) {
            dispatch(fetchNotifications());
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isAuthenticated, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        setShowProfileMenu(false);
        setIsOpen(false);
        navigate('/login');
    };

    const changeLanguage = (langCode) => {
        const selectElem = document.querySelector('.goog-te-combo');
        if (selectElem) {
            selectElem.value = langCode;
            selectElem.dispatchEvent(new Event('change'));
        }
        setLangOpen(false);
    };

    const languages = [
        { name: 'English', code: 'en' },
        { name: 'हिन्दी (Hindi)', code: 'hi' },
        { name: 'العربية (Arabic)', code: 'ar' },
        { name: 'اردو (Urdu)', code: 'ur' },
        { name: 'Français (French)', code: 'fr' },
        { name: 'Español (Spanish)', code: 'es' },
        { name: 'Deutsch (German)', code: 'de' },
        { name: 'Русский (Russian)', code: 'ru' },
        { name: '简体中文 (Chinese)', code: 'zh-CN' }
    ];
    const navLinks = [
        { name: 'Browse', path: '/properties', show: true },
        { name: 'New Projects', path: '/new-launches', show: true },
        { name: 'Wishlist', path: '/buyer/wishlist', show: user?.role === 'buyer' },
        { name: 'My Listings', path: '/seller/manage-listings', show: user?.role === 'seller' },
        { name: 'Admin Panel', path: '/admin/dashboard', show: user?.role === 'admin' },
    ];

    return (
        <>
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled
                ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl py-2 shadow-lg'
                : 'bg-white dark:bg-slate-900 py-4'
                }`}>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="flex justify-between items-center">

                        <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative z-10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] shadow-lg shadow-blue-900/10"
                                style={{ backgroundColor: primary }}>
                                <Home className="text-white" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg sm:text-2xl font-serif tracking-tight text-slate-900 dark:text-white">
                                    Property<span className="italic text-[#C5A358]">Hub</span>
                                </span>
                                <span className="hidden sm:block text-[7px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500">Elite Residency</span>
                            </div>
                        </Link>

                        <div className="hidden xl:flex items-center gap-8">
                            {navLinks.filter(link => link.show).map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) => `
                                        relative text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300
                                        ${isActive ? 'text-[#080E4B] dark:text-[#C5A358]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}
                                    `}
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">

                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setLangOpen(!langOpen)}
                                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C5A358] hover:bg-[#C5A358] hover:text-white transition-all shadow-sm"
                                >
                                    <Languages size={18} />
                                </button>
                                <AnimatePresence>
                                    {langOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[150]">
                                            {languages.map((lang) => (
                                                <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-[#C5A358]/10 hover:text-[#C5A358] transition-all border-b border-slate-50 dark:border-slate-800 last:border-none">
                                                    {lang.name}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* DARK MODE */}
                            <div className="hidden md:flex items-center gap-3">
                                <button onClick={() => dispatch(toggleDarkMode())} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-yellow-400 hover:scale-110 transition-all">
                                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                            </div>

                            {isAuthenticated ? (
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <button onClick={() => setIsNotifOpen(true)} className="relative p-2 text-slate-400 hover:text-[#080E4B] transition-colors">
                                        <Bell size={20} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A358] text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 font-bold">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    <div className="relative">
                                        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 p-1 rounded-full border border-transparent hover:border-slate-100 transition-all">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#080E4B] text-white flex items-center justify-center font-bold text-xs overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                                                {user?.profilePic ? (
                                                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    user?.name?.[0].toUpperCase() || <User size={16} />
                                                )}
                                            </div>
                                            <ChevronDown size={14} className={`hidden sm:block text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {showProfileMenu && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border dark:border-slate-700 p-2 z-[110]">
                                                    <div className="px-4 py-3 border-b dark:border-slate-700">
                                                        <p className="font-black text-[#080E4B] dark:text-[#C5A358] truncate text-sm">{user?.name}</p>
                                                        <p className="text-[10px] text-slate-400 truncate font-bold uppercase tracking-tighter">{user?.role} Account</p>
                                                    </div>
                                                    <div className="mt-2 p-1">
                                                        <Link to={`/${user.role}/dashboard`} onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 p-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
                                                            <LayoutDashboard size={16} className="text-slate-400" /> My Dashboard
                                                        </Link>
                                                        <Link to={`/${user.role}/profile`} onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 p-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
                                                            <User size={16} className="text-slate-400" /> View Profile
                                                        </Link>
                                                        <div className="my-2 border-t dark:border-slate-700 opacity-50"></div>
                                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                                            <LogOut size={16} /> Secure Logout
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <Link to="/login" className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400">Login</Link>
                                    <Link to="/register" className="px-4 py-2 sm:px-6 sm:py-3 bg-[#080E4B] text-white text-[9px] sm:text-[10px] font-black uppercase rounded-full shadow-lg shadow-blue-900/20">Join Hub</Link>
                                </div>
                            )}

                            {/* MOBILE MENU TOGGLE */}
                            <button className="xl:hidden p-2 text-[#080E4B] dark:text-white" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 bg-[#080E4B] dark:bg-slate-950 z-[200] p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-xl font-serif text-white">Property<span className="text-[#C5A358]">Hub</span></span>
                                <button onClick={() => setIsOpen(false)} className="p-2 bg-white/10 text-white rounded-full"><X /></button>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto">
                                {navLinks.filter(link => link.show).map((link) => (
                                    <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block text-4xl font-serif text-white/70 hover:text-white uppercase tracking-tighter transition-all">
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-6 space-y-3">
                                <button onClick={() => dispatch(toggleDarkMode())} className="w-full py-4 bg-white/5 text-white flex items-center justify-center gap-2 rounded-2xl border border-white/10">
                                    {darkMode ? <Sun size={18} /> : <Moon size={18} />} Switch Theme
                                </button>

                                {isAuthenticated ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to={`/${user.role}/dashboard`} onClick={() => setIsOpen(false)} className="py-4 bg-white/10 text-white text-center font-bold rounded-2xl">Console</Link>
                                        <button onClick={handleLogout} className="py-4 bg-red-500/20 text-red-400 font-bold rounded-2xl">Logout</button>
                                    </div>
                                ) : (
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-[#C5A358] text-[#080E4B] text-center font-black uppercase tracking-widest rounded-2xl shadow-xl">Get Started</Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <div className="h-16 sm:h-20"></div>
            <NotificationSidebar isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} notifications={notifications} />
        </>
    );
};

export default Navbar;