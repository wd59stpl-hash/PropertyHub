import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50">
            <div className="bg-red-100 p-6 rounded-full mb-6">
                <ShieldAlert size={80} className="text-red-600" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-4">Access Denied</h1>
            <p className="text-slate-600 mb-8 max-w-md italic">
                "You do not have the required permissions to view this module. Please contact the administrator if you believe this is an error."
            </p>
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
            >
                <ArrowLeft size={18} /> Back to Safety
            </button>
        </div>
    );
};

export default Unauthorized;