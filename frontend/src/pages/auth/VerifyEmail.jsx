import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { verifyOTP } from '../../redux/slices/authSlice';

const VerifyEmail = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading } = useSelector((state) => state.auth);

    const userEmail = location.state?.email || "";

    const handleChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== "" && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleVerify = () => {
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) return toast.error("Please enter 6-digit OTP");

        dispatch(verifyOTP({ email: userEmail, otp: fullOtp })).then((res) => {
            if (!res.error) {
                toast.success("Email Verified! Welcome aboard.");
                const role = res.payload.user.role;
                navigate(role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard');
            } else {
                toast.error(res.payload || "Verification failed");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="bg-blue-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto">
                    <Mail size={40} className="text-blue-600" />
                </div>
                
                <div>
                    <h2 className="text-4xl font-black text-slate-800">Verify Email</h2>
                    <p className="text-slate-500 mt-2 font-medium">We sent a code to <span className="text-slate-900 font-bold">{userEmail}</span></p>
                </div>

                <div className="flex justify-center gap-2">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            className="w-12 h-14 text-2xl font-black text-center bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                            value={data}
                            onChange={(e) => handleChange(e.target.value, index)}
                        />
                    ))}
                </div>

                <button 
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify & Continue"}
                </button>
            </div>
        </div>
    );
};

export default VerifyEmail;