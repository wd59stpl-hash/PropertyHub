import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Download, Loader2 } from 'lucide-react';
import api from '../../services/api'; 
import { generateInvoice } from '../../utils/pdfGenerator';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const [fetching, setFetching] = useState(true);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await api.get(`/payments/session/${sessionId}`);
                setPaymentData(data.data);
            } catch (error) {
                toast.error("Failed to load invoice data");
            } finally {
                setFetching(false);
            }
        };
        if (sessionId) fetchDetails();
    }, [sessionId]);

    const handleDownload = () => {
        if (!paymentData) return toast.error("Data not ready yet");
        generateInvoice(paymentData); 
        toast.success("Invoice Downloaded!");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white rounded-[3.5rem] shadow-2xl p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                
                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={48} />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-4">Payment Success!</h1>
                <p className="text-slate-500 mb-8">Your property has been booked successfully. Download your receipt below.</p>

                {fetching ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-600" /></div>
                ) : (
                    <div className="space-y-4">
                        <button 
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95"
                        >
                            <Download size={20}/> Download Receipt (PDF)
                        </button>
                        
                        <button 
                            onClick={() => navigate('/buyer/dashboard')}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                            <ShoppingBag size={20}/> Go to My Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;