import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Home, AlertTriangle, 
    FileText, ShieldCheck, LogOut, Settings, 
    Menu, X, UserCircle, BarChart3, Bell, BadgeCheck
} from 'lucide-react';

const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const adminMenu = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18}/> },
        { name: 'User Management', path: '/admin/users', icon: <Users size={18}/> },
        { name: 'Property Types', path: '/admin/property-type', icon: <FileText size={18}/> },
        { name: 'Pending Approvals', path: '/admin/approvals', icon: <BadgeCheck size={18}/> },
        { name: 'Complaint Center', path: '/admin/complaints', icon: <AlertTriangle size={18}/> },
        { name: 'Market Analytics', path: '/admin/reports', icon: <BarChart3 size={18}/> },
        { name: 'Admin Profile', path: '/admin/profile', icon: <UserCircle size={18}/> },
    ];

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row font-sans text-[#080E4B]">
            <div className="lg:hidden bg-[#080E4B] px-6 py-4 flex items-center justify-between text-white shadow-xl z-[60]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#C5A358] rounded-full" />
                    <span className="font-serif uppercase tracking-widest text-xs">Admin Control</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#080E4B] text-white transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-10 mb-2">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#C5A358]/10 border border-[#C5A358]/30 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={20} className="text-[#C5A358]" />
                            </div>
                            <div>
                                <span className="text-lg font-serif tracking-widest uppercase text-white leading-none">PropertyHub</span>
                                <p className="text-[8px] tracking-[0.3em] text-[#C5A358] uppercase mt-1">Management Portal</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 ml-6">Main Console</p>
                        
                        {adminMenu.map((item) => (
                            <NavLink 
                                key={item.path} 
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `
                                    group flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300
                                    ${isActive 
                                        ? 'bg-[#C5A358] text-[#080E4B] shadow-lg' 
                                        : 'text-white/50 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <span className={`${isActive ? 'scale-110' : 'opacity-70'}`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-[11px] font-bold uppercase tracking-widest">{item.name}</span>
                                        </div>
                                        {isActive && <div className="w-1 h-4 bg-[#080E4B] rounded-full" />}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-6 border-t border-white/5 space-y-2">
                        <button className="w-full flex items-center gap-3 px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">
                            <Settings size={14}/> Settings
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-3 text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-all bg-red-500/5 rounded-xl"
                        >
                            <LogOut size={14}/> Secure Logout
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto relative flex flex-col">
                <div className="hidden lg:flex sticky top-0 z-40 bg-white/80 backdrop-blur-md px-12 py-5 items-center justify-between border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Server Status: <span className="text-emerald-600">Online</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="h-8 w-[1px] bg-gray-100" />
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#080E4B]">Super Admin</p>
                                <p className="text-[8px] text-[#C5A358] font-bold uppercase tracking-tighter">Verified Access</p>
                            </div>
                            <div className="w-10 h-10 bg-[#080E4B] rounded-xl flex items-center justify-center text-[#C5A358] font-serif text-lg">
                                A
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 lg:p-10 flex-1">
                    <Outlet /> 
                </div>
            </main>

            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                />
            )}
        </div>
    );
};

export default AdminLayout;