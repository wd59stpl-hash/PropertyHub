import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, ShieldCheck } from 'lucide-react';
import { resetPassword } from '../../redux/slices/authSlice';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.auth);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        dispatch(resetPassword({ token, password: data.password })).then((res) => {
            if (!res.error) {
                toast.success("Password reset! You can now login.");
                navigate('/login');
            } else {
                toast.error(res.payload);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck size={32}/>
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-6">Set New Password</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-3 top-4 text-slate-400" size={18} />
                        <input type="password" {...register("password", { required: true, minLength: 6 })} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="New Password" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-4 text-slate-400" size={18} />
                        <input type="password" {...register("confirmPassword", { 
                            validate: value => value === watch('password') || "Passwords do not match" 
                        })} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Confirm Password" />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold px-2">{errors.confirmPassword.message}</p>}

                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-blue-600 transition-all disabled:opacity-50">
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;