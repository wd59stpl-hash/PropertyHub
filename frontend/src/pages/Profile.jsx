import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { motion } from 'framer-motion'; 
import { 
    Camera, User, Mail, Phone, MapPin, FileText, 
    Loader2, Save, Briefcase, Award, ShieldCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        address: user?.address || '',
        companyName: user?.companyName || '',
        experience: user?.experience || '',
    });

    const [preview, setPreview] = useState(user?.profilePic || '');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                bio: user.bio || '',
                address: user.address || '',
                companyName: user.companyName || '',
                experience: user.experience || '',
            });
            setPreview(user.profilePic || '');
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        data.append('bio', formData.bio);
        data.append('address', formData.address);
        
        if (user?.role === 'seller') {
            data.append('companyName', formData.companyName);
            data.append('experience', formData.experience);
        }

        if (imageFile) data.append('profilePic', imageFile);

        const result = await dispatch(updateProfile(data));
        if (updateProfile.fulfilled.match(result)) {
            toast.success("Profile Updated!");
        }
    };

    return (
        <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen font-['Plus_Jakarta_Sans']">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-[#080E4B] opacity-[0.03]"></div>
                        <div className="relative inline-block mt-4">
                            <div className="w-36 h-36 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 mx-auto">
                                {preview ? <img src={preview} alt="Profile" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={56} /></div>}
                            </div>
                            <button onClick={() => fileInputRef.current.click()} className="absolute -bottom-2 -right-2 p-3 bg-[#C5A358] text-white rounded-2xl shadow-lg hover:scale-110 transition-transform"><Camera size={20} /></button>
                            <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
                        </div>
                        <h2 className="mt-6 text-2xl font-black text-[#080E4B]">{user?.name}</h2>
                        <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest"><ShieldCheck size={12} />{user?.role} Account</div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Legal Name</label>
                                    <div className="relative"><User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" /></div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mobile Contact</label>
                                    <div className="relative"><Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" /></div>
                                </div>
                            </div>

                            {user?.role === 'seller' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-blue-400">Company Name</label>
                                        <div className="relative"><Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={18} /><input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl font-bold text-sm" /></div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-blue-400">Experience</label>
                                        <div className="relative"><Award className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={18} /><input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl font-bold text-sm" /></div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400">About / Bio</label>
                                <textarea rows="4" name="bio" value={formData.bio} onChange={handleInputChange} className="w-full px-6 py-5 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-sm" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400">Locality / Address</label>
                                <div className="relative"><MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] outline-none font-bold text-sm" /></div>
                            </div>

                            <div className="pt-8 flex justify-end">
                                <button type="submit" disabled={loading} className="flex items-center gap-4 px-12 py-5 bg-[#080E4B] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#C5A358] transition-all disabled:opacity-50">
                                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} {loading ? "Updating..." : "Update Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;