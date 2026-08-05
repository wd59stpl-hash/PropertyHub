import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { forgotPassword } from '../../redux/slices/authSlice';

const ForgotPassword = () => {
    const { register, handleSubmit } = useForm();
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.auth);

    const onSubmit = (data) => {
        dispatch(forgotPassword(data.email)).then((res) => {
            if (!res.error) toast.success("Reset link sent! Check your inbox.");
            else toast.error(res.payload);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase mb-8 hover:text-blue-600 transition-all">
                    <ArrowLeft size={16}/> Back to Login
                </Link>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Forgot Password?</h2>
                <p className="text-slate-400 text-sm mb-8">Enter your email and we'll send instructions.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-4 text-slate-400" size={18} />
                        <input {...register("email", { required: true })} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Email Address" />
                    </div>
                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-blue-600 transition-all disabled:opacity-50">
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ForgotPassword;