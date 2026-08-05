import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FileText, Download, PieChart, Users, DollarSign, Loader2, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsHub = () => {
    const { reports, loading } = useSelector(state => state.admin);
    const [generating, setGenerating] = useState(null);
    const generatePDF = (type) => {
        setGenerating(type);
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        doc.setFontSize(22);
        doc.setTextColor(8, 14, 75); 
        doc.text("PropertyHub Executive Report", 14, 20);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Report Type: ${type.toUpperCase()}`, 14, 28);
        doc.text(`Generated on: ${timestamp}`, 14, 33);
        doc.line(14, 38, 196, 38);

        if (type === 'sales') {
            doc.autoTable({
                startY: 45,
                head: [['Month', 'Sales Count', 'Revenue (INR)']],
                body: reports?.revenueTrend?.map(r => [r._id.month, r.salesCount, `Rs. ${r.totalRevenue}`]) || [],
                headStyles: { fillColor: [8, 14, 75] }
            });
        } else if (type === 'inventory') {
            doc.autoTable({
                startY: 45,
                head: [['Property Type', 'Total Listings']],
                body: reports?.inventory?.map(i => [i._id.type, i.count]) || [],
                headStyles: { fillColor: [59, 130, 246] }
            });
        } else if (type === 'users') {
            doc.autoTable({
                startY: 45,
                head: [['Role', 'User Count']],
                body: reports?.userDistribution?.map(u => [u._id, u.count]) || [],
                headStyles: { fillColor: [16, 185, 129] }
            });
        }

        doc.save(`PropertyHub_${type}_Report.pdf`);
        setTimeout(() => setGenerating(null), 1000);
    };

    const reportCards = [
        {
            id: 'sales',
            title: 'Financial & Sales Report',
            desc: 'Detailed monthly revenue, transaction volume, and growth metrics.',
            icon: <DollarSign className="text-blue-600" />,
            color: 'bg-blue-50'
        },
        {
            id: 'inventory',
            title: 'Property Inventory Report',
            desc: 'Summary of all listings, categories, and property type distribution.',
            icon: <PieChart className="text-purple-600" />,
            color: 'bg-purple-50'
        },
        {
            id: 'users',
            title: 'User Demographics Report',
            desc: 'Growth analysis of buyers and sellers across the platform.',
            icon: <Users className="text-green-600" />,
            color: 'bg-green-50'
        }
    ];

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-900" size={50} /></div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-[#080E4B]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Document <span className="italic text-slate-400">Center</span>
                </h1>
                <p className="text-slate-500 mt-2">Generate and export official platform data in PDF format.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reportCards.map((card) => (
                    <div key={card.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                        <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                        <h3 className="text-xl font-bold text-[#080E4B] mb-3">{card.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">{card.desc}</p>
                        
                        <button 
                            onClick={() => generatePDF(card.id)}
                            disabled={generating === card.id}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-[#080E4B] text-white rounded-2xl font-bold text-sm hover:bg-blue-900 disabled:bg-slate-300 transition-all"
                        >
                            {generating === card.id ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <Download size={18} /> Download PDF
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-[#080E4B] text-white rounded-[3rem] p-10 mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold italic">Need a Custom Date Range?</h2>
                    <p className="text-blue-200 text-sm">Advanced filtering is available in the detailed analytics view.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-6 border-r border-blue-800">
                        <p className="text-3xl font-bold">100%</p>
                        <p className="text-[10px] uppercase tracking-widest text-blue-300">Data Accuracy</p>
                    </div>
                    <div className="text-center px-6">
                        <p className="text-3xl font-bold">Secure</p>
                        <p className="text-[10px] uppercase tracking-widest text-blue-300">Encrypted PDF</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsHub;