import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCcw, MessageCircle, ArrowLeft } from 'lucide-react';

const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl p-12 text-center border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <XCircle size={56} strokeWidth={2.5} />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">
                    Payment Cancelled
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                    The transaction was not completed. Don't worry, no funds were deducted from your account. You can try again or contact support.
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full flex items-center justify-center gap-3 py-5 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-100 active:scale-95 text-lg"
                    >
                        <RefreshCcw size={20}/> Try Again
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-3 py-4 text-slate-400 font-bold hover:text-slate-800 transition-all text-sm"
                    >
                        <ArrowLeft size={18}/> Back to Property List
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest cursor-pointer hover:underline">
                    <MessageCircle size={16}/> Need Help? Contact Support
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;