import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { generateInvoice } from '../utils/pdfGenerator';
import { Download, ShoppingBag } from 'lucide-react';

const MyPurchases = () => {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        api.get('/buyer/purchases').then(res => setPurchases(res.data.data));
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black mb-8">My Purchases</h1>
            <div className="space-y-4">
                {purchases.map(item => (
                    <div key={item._id} className="bg-white p-6 rounded-[2rem] border flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <img src={item.property.images[0]} className="w-20 h-20 rounded-2xl object-cover" />
                            <div>
                                <h3 className="font-black text-xl">{item.property.name}</h3>
                                <p className="text-slate-400 font-bold text-sm">Paid: ₹{item.amount.toLocaleString()}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => generateInvoice(item)}
                            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-600 transition-all"
                        >
                            <Download size={18}/> Invoice
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPurchases;