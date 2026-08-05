import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalyticsReports } from '../redux/slices/adminSlice';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, TrendingUp, Users, Home, AlertCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsGenerator = () => {
    const dispatch = useDispatch();
    const { reports, loading } = useSelector(state => state.admin);

    useEffect(() => {
        dispatch(fetchAnalyticsReports());
    }, [dispatch]);

    const COLORS = ['#080E4B', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    const downloadPDF = () => {
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();
        doc.setFontSize(22);
        doc.setTextColor(8, 14, 75);
        doc.text("PropertyHub Executive Analytics", 14, 20);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Official Business Report | Generated: ${timestamp}`, 14, 28);
        doc.line(14, 32, 196, 32);
        autoTable(doc, {
            startY: 42,
            head: [['Metric', 'Data Value']],
            body: [
                ['Total Platform Revenue', `INR ${reports?.revenueTrend?.reduce((acc, curr) => acc + curr.totalRevenue, 0).toLocaleString()}`],
                ['Total Properties Sold', `${reports?.revenueTrend?.reduce((acc, curr) => acc + curr.salesCount, 0)} Units`],
                ['Active Users', `${reports?.userDistribution?.reduce((acc, curr) => acc + curr.count, 0)} Members`],
            ],
            theme: 'striped',
            headStyles: { fillColor: [8, 14, 75] },
        });

        doc.setFontSize(14);
        doc.setTextColor(8, 14, 75);
        doc.text("User Distribution Breakdown", 14, doc.lastAutoTable.finalY + 15);

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [['User Role', 'Active Count']],
            body: reports?.userDistribution?.map(u => [u._id?.toUpperCase(), u.count]) || [],
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
        });
        doc.text("Inventory Overview", 14, doc.lastAutoTable.finalY + 15);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Property Type', 'Listings Count']],
            body: reports?.inventory?.map(i => [i._id.type?.toUpperCase() || 'GENERAL', i.count]) || [],
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] },
        });

        doc.save(`PropertyHub_Full_Analytics_${Date.now()}.pdf`);
    };
    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen font-['Plus_Jakarta_Sans']">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-normal tracking-tight text-[#080E4B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Analytics <span className="italic text-slate-400">& Reports</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Data-Driven Platform Insights</p>
                </div>
                <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 px-6 py-3 bg-[#080E4B] text-white rounded-2xl font-bold text-sm hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20"
                >
                    <Download size={18} /> Export PDF Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', val: '₹' + (reports?.revenueTrend?.[0]?.totalRevenue || 0), icon: <TrendingUp className="text-green-500" />, bg: 'bg-green-50' },
                    { label: 'Total Sales', val: reports?.revenueTrend?.[0]?.salesCount || 0, icon: <Home className="text-blue-500" />, bg: 'bg-blue-50' },
                    { label: 'Active Users', val: reports?.userDistribution?.reduce((a, b) => a + b.count, 0) || 0, icon: <Users className="text-purple-500" />, bg: 'bg-purple-50' },
                    { label: 'Pending Issues', val: reports?.complaints?.find(c => c._id === 'Pending')?.count || 0, icon: <AlertCircle className="text-red-500" />, bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className={`p-4 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-[#080E4B]">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-[#080E4B] mb-6">Revenue Growth Trend</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={reports?.revenueTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="_id.month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="totalRevenue" stroke="#3B82F6" strokeWidth={4} dot={{ r: 6, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-[#080E4B] mb-6">User Base Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={reports?.userDistribution}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {reports?.userDistribution?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-[#080E4B] mb-6">Property Inventory by Category</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reports?.inventory}>
                                <XAxis dataKey="_id.type" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px' }} />
                                <Bar dataKey="count" fill="#080E4B" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsGenerator;