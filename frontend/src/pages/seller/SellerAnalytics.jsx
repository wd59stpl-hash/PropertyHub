import React from 'react';
import { TrendingUp, Users, MousePointer2, ArrowUpRight } from 'lucide-react';

const SellerAnalytics = () => {
    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Performance Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Inquiries', value: '156', trend: '+14%', icon: <Users/>, color: 'bg-blue-600' },
                    { label: 'Click Rate', value: '4.2%', trend: '+0.8%', icon: <MousePointer2/>, color: 'bg-purple-600' },
                    { label: 'Conversion', value: '12%', trend: '+2%', icon: <TrendingUp/>, color: 'bg-emerald-600' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-5 -mr-10 -mt-10 rounded-full group-hover:scale-150 transition-transform`}></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl text-white ${item.color}`}>{item.icon}</div>
                            <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs"><ArrowUpRight size={14}/> {item.trend}</span>
                        </div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{item.label}</p>
                        <h3 className="text-3xl font-black text-slate-800">{item.value}</h3>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[350px]">
                    <h4 className="text-slate-800 font-black mb-8">Monthly Traffic Views</h4>
                    <div className="flex items-end gap-3 h-48">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-100 rounded-t-xl hover:bg-blue-600 transition-all cursor-pointer relative group" style={{height: `${h}%`}}>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block">{h}k</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl min-h-[350px] text-white">
                    <h4 className="font-black mb-8 text-slate-400">Inquiry Sources</h4>
                    <div className="space-y-6">
                        {[
                            { name: 'Organic Search', val: '65%', color: 'bg-blue-500' },
                            { name: 'Social Media', val: '20%', color: 'bg-purple-500' },
                            { name: 'Direct Visits', val: '15%', color: 'bg-emerald-500' }
                        ].map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span>{s.name}</span><span>{s.val}</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${s.color}`} style={{width: s.val}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAnalytics;