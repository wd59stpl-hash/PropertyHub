import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'; 
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { loginUser, clearError } from '../../redux/slices/authSlice';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false); 
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated && user) {
        let path = '/';

        if (user.role === 'admin') {
            path = '/admin/dashboard';
        } else if (user.role === 'seller') {
            path = '/seller/dashboard';
        } else if (user.role === 'buyer') {
            path = '/'; 
        }

        navigate(path, { replace: true });
    }
}, [isAuthenticated, user, navigate]);

    const onSubmit = (data) => {
        dispatch(loginUser(data)).then((res) => {
            if (!res.error) {
                toast.success(`Welcome back!`);
            } else {
                toast.error(res.payload || "Invalid Credentials");
                dispatch(clearError());
            }
        });
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F8F9FB] font-sans">
            <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#080E4B]">
                <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10s]"
                    alt="Luxury Estate"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080E4B] via-transparent to-transparent opacity-90" />
                <div className="relative z-10 w-full flex flex-col justify-between p-20 text-white">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                        <div className="w-12 h-12 border-2 border-[#C5A358] rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-[#C5A358] rounded-full" />
                        </div>
                        <span className="text-2xl font-serif tracking-[0.2em] uppercase">PropertyHub</span>
                    </motion.div>
                    <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <span className="text-[#C5A358] font-bold tracking-[0.4em] text-xs uppercase mb-4 block">Exclusive Membership</span>
                            <h1 className="text-7xl font-serif leading-tight">Your Gateway <br /> To <span className="italic">Elegance.</span></h1>
                        </motion.div>
                    </div>
                    <p className="text-white/40 text-xs tracking-widest uppercase">© 2024 PropertyHub Luxury Real Estate</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-serif text-[#080E4B] mb-3">Welcome Back</h2>
                        <p className="text-gray-400 font-medium">Please enter your credentials to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="relative group">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A358] mb-2 block">Email Address</label>
                            <div className="flex items-center border-b-2 border-gray-100 group-focus-within:border-[#080E4B] transition-all py-3">
                                <Mail className="text-gray-300 group-focus-within:text-[#C5A358] transition-colors" size={20} />
                                <input
                                    type="email"
                                    {...register("email", { required: "Email is required" })}
                                    className="w-full bg-transparent px-4 outline-none text-gray-700 font-medium placeholder:text-gray-200"
                                    placeholder="Enter your registered email"
                                />
                            </div>
                            {errors.email && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase">{errors.email.message}</p>}
                        </div>

                        <div className="relative group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A358] block">Password</label>
                                <Link to="/forgot-password" intrinsic="true" className="text-[10px] font-bold text-gray-400 hover:text-[#080E4B] transition-colors">Forgot?</Link>
                            </div>
                            <div className="flex items-center border-b-2 border-gray-100 group-focus-within:border-[#080E4B] transition-all py-3">
                                <Lock className="text-gray-300 group-focus-within:text-[#C5A358] transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: "Password is required" })}
                                    className="w-full bg-transparent px-4 outline-none text-gray-700 font-medium placeholder:text-gray-200"
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="pr-2 text-gray-400 hover:text-[#C5A358] transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase">{errors.password.message}</p>}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-[#080E4B] text-white flex items-center justify-center gap-4 group relative overflow-hidden transition-all active:scale-95"
                            >
                                <span className="relative z-10 font-black text-xs uppercase tracking-[0.3em]">Authorize Access</span>
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                                )}
                                <div className="absolute inset-0 bg-[#C5A358] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </div>
                    </form>
                    <div className="mt-12">
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="absolute w-full h-[1px] bg-gray-100" />
                            <span className="relative bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Arrival?</span>
                        </div>
                        <Link to="/register" className="w-full h-16 border-2 border-gray-100 flex items-center justify-center gap-2 text-[#080E4B] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors">
                            Create Luxury Account
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;