import React from 'react';
import { Shield, Camera } from 'lucide-react';

const BuyerProfile = () => {
    return (
        <div className="max-w-3xl space-y-10">
            <h2 className="text-3xl font-black text-slate-800">Account Settings</h2>            
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black">AM</div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all">
                            <Camera size={16}/>
                        </button>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800">Amit Malhotra</h4>
                        <p className="text-sm text-slate-400">Verified Buyer since 2024</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Full Name</label>
                        <input type="text" defaultValue="Amit Malhotra" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Email</label>
                        <input type="email" defaultValue="amit@example.com" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-6">
                    <h5 className="font-bold text-slate-800 flex items-center gap-2"><Shield size={18} className="text-blue-600"/> Security</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="password" placeholder="New Password" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                        <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all">Update Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerProfile;