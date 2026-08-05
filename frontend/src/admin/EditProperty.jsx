import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    Building2, MapPin, IndianRupee, BedDouble, Bath,
    Maximize, Camera, Video, CheckCircle2, ChevronRight,
    ChevronLeft, LayoutDashboard, Loader2, Save, ArrowLeft,
    Sparkles, Trash2, ImageIcon, Edit3
} from 'lucide-react';
import { fetchPropertyById, updateProperty, resetState } from '../redux/slices/propertySlice';
import { fetchPropertyTypes } from '../redux/slices/propertyTypeSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AMENITIES_LIST = ["Gym", "Swimming Pool", "Club House", "Security", "Power Backup", "Garden", "Parking", "Playground", "Wifi", "Lift"];

const EditProperty = () => {
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, success, singleProperty } = useSelector((state) => state.properties);
    const { list: propertyTypes } = useSelector((state) => state.propertyTypes);
    const { register, handleSubmit, reset, trigger, watch, formState: { errors } } = useForm();

    useEffect(() => {
        dispatch(fetchPropertyById(id));
        dispatch(fetchPropertyTypes());
    }, [id, dispatch]);

    useEffect(() => {
        if (singleProperty) {
            reset({
                name: singleProperty.name,
                type: singleProperty.type,
                description: singleProperty.description,
                price: singleProperty.price,
                area: singleProperty.area,
                furnishedStatus: singleProperty.furnishedStatus,
                bedrooms: singleProperty.bedrooms,
                bathrooms: singleProperty.bathrooms,
                kitchens: singleProperty.kitchen,
                balcony: singleProperty.balcony,
                amenities: singleProperty.amenities,
                address: singleProperty.location?.address,
                city: singleProperty.location?.city,
                state: singleProperty.location?.state,
                pincode: singleProperty.location?.pincode,
                lat: singleProperty.location?.geo?.coordinates[1],
                lng: singleProperty.location?.geo?.coordinates[0],
                newProject: singleProperty.newProject,

            });
        }
    }, [singleProperty, reset]);
    const isNewProject = watch("newProject");
    useEffect(() => {
        if (success) {
            toast.success("Portfolio Updated Successfully");
            dispatch(resetState());
            navigate('/seller/manage-listings');
        }
    }, [success, dispatch, navigate]);

    const nextStep = async () => {
        const fields = step === 1 ? ['name', 'type', 'description'] :
            step === 2 ? ['price', 'area'] :
                step === 4 ? ['address', 'city', 'state', 'pincode'] : [];

        const isStepValid = await trigger(fields);
        if (isStepValid) setStep(s => s + 1);
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key !== 'amenities') formData.append(key, data[key]);
        });
        if (data.amenities) data.amenities.forEach(am => formData.append('amenities', am));
        selectedImages.forEach(file => formData.append('images', file));
        if (selectedVideo) formData.append('video', selectedVideo);

        dispatch(updateProperty({ id, formData }));
    };

    const steps = [
        { id: 1, name: 'Identity', icon: <Building2 size={16} /> },
        { id: 2, name: 'Specials', icon: <Maximize size={16} /> },
        { id: 3, name: 'Media', icon: <Camera size={16} /> },
        { id: 4, name: 'Location', icon: <MapPin size={16} /> }
    ];

    if (loading && !singleProperty) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#C5A358] rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Retrieving Estate Data...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto py-10 px-6 min-h-screen font-sans">
            <div className="mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link to="/seller/manage-listings" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#C5A358] transition-colors mb-4">
                            <ArrowLeft size={14} /> Back to Inventory
                        </Link>
                        <h1 className="text-4xl font-serif text-[#080E4B]">Edit Portfolio Item</h1>
                    </motion.div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#C5A358]/10 rounded-full border border-[#C5A358]/20">
                        <Edit3 size={14} className="text-[#C5A358]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A358]">Modification Mode</span>
                    </div>
                </div>
                <div className="flex justify-between relative max-w-3xl mx-auto">
                    <div className="absolute top-5 left-0 w-full h-[1px] bg-gray-100 -z-10"></div>
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${step >= s.id ? 'bg-[#080E4B] border-[#C5A358] text-[#C5A358] shadow-lg shadow-blue-900/20 scale-110' : 'bg-white border-gray-100 text-gray-300'}`}>
                                {step > s.id ? <CheckCircle2 size={18} /> : s.icon}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${step >= s.id ? 'text-[#080E4B]' : 'text-gray-300'}`}>{s.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
                <div className="p-8 md:p-14">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#080E4B]">Estate Title*</label>
                                        <input {...register("name", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl border-none focus:ring-2 focus:ring-[#080E4B]/5 outline-none font-bold text-[#080E4B] transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#080E4B]">Architecture Type*</label>
                                        <select {...register("type", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl border-none focus:ring-2 focus:ring-[#080E4B]/5 outline-none font-bold text-[#080E4B] appearance-none cursor-pointer">
                                            {propertyTypes.map((pt) => <option key={pt._id} value={pt.name.toLowerCase()}>{pt.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#080E4B]">Updated Description</label>
                                    <textarea {...register("description")} rows="5" className="w-full p-5 bg-[#F8F9FB] rounded-2xl border-none focus:ring-2 focus:ring-[#080E4B]/5 outline-none font-medium text-gray-600 resize-none"></textarea>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2 p-6 bg-[#F8F9FB] rounded-3xl">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#080E4B]">Revised Price (₹)</label>
                                        <div className="flex items-center gap-2 mt-2">
                                            <IndianRupee size={18} className="text-[#C5A358]" />
                                            <input type="number" {...register("price", { required: true })} className="bg-transparent w-full text-xl font-serif text-[#080E4B] outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 p-6 bg-[#F8F9FB] rounded-3xl">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#080E4B]">Total Area (sq.ft)</label>
                                        <input type="number" {...register("area")} className="bg-transparent w-full text-xl font-serif text-[#080E4B] outline-none mt-2" />
                                    </div>
                                    <div className="space-y-2 p-6 bg-[#F8F9FB] rounded-3xl">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#080E4B]">Status</label>
                                        <select {...register("furnishedStatus")} className="bg-transparent w-full text-sm font-bold text-[#080E4B] outline-none cursor-pointer mt-2">
                                            <option value="unfurnished">Unfurnished</option>
                                            <option value="semi">Semi-Furnished</option>
                                            <option value="fully">Fully Furnished</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['bedrooms', 'bathrooms', 'kitchens', 'balcony'].map(field => (
                                        <div key={field} className="p-6 bg-white border border-gray-100 rounded-3xl text-center shadow-sm">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#080E4B] mb-3 block">{field}</label>
                                            <input type="number" {...register(field)} className="w-full bg-transparent text-center text-3xl font-serif text-[#080E4B] outline-none" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#080E4B]">Update Amenities</label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {AMENITIES_LIST.map(am => (
                                            <label key={am} className="flex items-center justify-center p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 has-[:checked]:bg-[#080E4B] has-[:checked]:text-white transition-all">
                                                <input type="checkbox" value={am} {...register("amenities")} className="hidden" />
                                                <span className="text-[10px] font-bold uppercase tracking-tight">{am}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="relative border-2 border-dashed border-gray-100 rounded-[2rem] p-10 text-center bg-[#F8F9FB] hover:border-[#C5A358] transition-colors group">
                                            <ImageIcon className="mx-auto text-[#C5A358] mb-4 group-hover:scale-110 transition-transform" size={32} />
                                            <p className="text-xs font-black uppercase tracking-widest text-[#080E4B]">Replace Photography</p>
                                            <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{selectedImages.length} New Selected</p>
                                            <input type="file" multiple onChange={(e) => setSelectedImages(Array.from(e.target.files))} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest text-center italic">Uploading new images will replace existing ones.</p>
                                    </div>

                                    <div className="relative border-2 border-dashed border-gray-100 rounded-[2rem] p-10 text-center bg-[#F8F9FB] hover:border-[#C5A358] transition-colors group">
                                        <Video className="mx-auto text-[#C5A358] mb-4" size={32} />
                                        <p className="text-xs font-black uppercase tracking-widest text-[#080E4B]">Update Video Tour</p>
                                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{selectedVideo ? "New File Ready" : "Current Video Retained"}</p>
                                        <input type="file" onChange={(e) => setSelectedVideo(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#080E4B]">Full Estate Address*</label>
                                    <input {...register("address", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl border-none font-bold text-[#080E4B]" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#080E4B]">City</label>
                                        <input {...register("city", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl border-none font-bold text-[#080E4B]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#080E4B]">State</label>
                                        <input {...register("state", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl border-none font-bold text-[#080E4B]" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#080E4B]">Pincode</label>
                                        <input {...register("pincode", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl border-none font-bold text-[#080E4B]" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="px-10 py-8 bg-[#F8F9FB] border-t border-gray-100 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => setStep(s => s - 1)}
                        disabled={step === 1}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${step === 1 ? 'opacity-0' : 'text-gray-400 hover:text-[#080E4B]'}`}
                    >
                        Previous
                    </button>

                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="group px-12 py-4 bg-[#080E4B] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-[#C5A358] hover:text-[#080E4B] transition-all shadow-xl shadow-blue-900/10"
                        >
                            Next Section <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-14 py-4 bg-[#C5A358] text-[#080E4B] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-xl shadow-[#C5A358]/20 transition-all hover:bg-[#080E4B] hover:text-white"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            Finalize Updates
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditProperty;