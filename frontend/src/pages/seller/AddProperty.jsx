import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    Building2, MapPin, IndianRupee, BedDouble, Bath,
    Maximize, Camera, Video, CheckCircle2, ChevronRight,
    ChevronLeft, Loader2, ArrowLeft, ImageIcon, Sparkles, Trash2, Plus
} from 'lucide-react';
import { createProperty, resetState } from '../../redux/slices/propertySlice';
import { fetchPropertyTypes } from '../../redux/slices/propertyTypeSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AMENITIES_LIST = ["Gym", "Swimming Pool", "Club House", "Security", "Power Backup", "Garden", "Parking", "Playground", "Wifi", "Lift"];

const AddProperty = () => {
    const [step, setStep] = useState(1);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, success } = useSelector((state) => state.properties);
    const { list: propertyTypes } = useSelector((state) => state.propertyTypes);
    const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm({
        defaultValues: {
            type: 'apartment', category: 'sale', furnishedStatus: 'unfurnished', constructionStatus: 'N/A'
        }
    });

    const isNewProject = watch("newProject", false);

    useEffect(() => { dispatch(fetchPropertyTypes()); }, [dispatch]);
    useEffect(() => {
        if (success) {
            toast.success("Estate Published Successfully!");
            dispatch(resetState());
            navigate('/seller/dashboard');
        }
    }, [success, dispatch, navigate]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedImages.length > 10) return toast.error("Max 10 images allowed");
        setSelectedImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => setSelectedImages(prev => prev.filter((_, i) => i !== index));

    const nextStep = async () => {
        const fields = step === 1 ? ['name', 'type', 'description'] :
                       step === 2 ? ['price', 'area'] : 
                       step === 4 ? ['address', 'city', 'state', 'pincode'] : [];
        
        if (await trigger(fields)) setStep(s => s + 1);
        else toast.error("Please fill required fields");
    };

    const onSubmit = (data) => {
        if (selectedImages.length === 0) return toast.error("Upload at least one image");
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key !== 'amenities') formData.append(key, data[key]);
        });
        if (data.amenities) data.amenities.forEach(am => formData.append('amenities', am));
        selectedImages.forEach(file => formData.append('images', file));
        if (selectedVideo) formData.append('video', selectedVideo);

        dispatch(createProperty(formData));
    };

    const steps = [
        { id: 1, name: 'Identity', icon: <Building2 size={16} /> },
        { id: 2, name: 'Specials', icon: <Maximize size={16} /> },
        { id: 3, name: 'Curation', icon: <Camera size={16} /> },
        { id: 4, name: 'Location', icon: <MapPin size={16} /> }
    ];

    return (
        <div className="max-w-5xl mx-auto py-10 px-6 min-h-screen font-sans">
            <div className="mb-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <Link to="/seller/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                            <ArrowLeft size={14} /> Back to Portal
                        </Link>
                        <h1 className="text-4xl font-serif text-[#080E4B]">List Your Estate</h1>
                    </div>
                    <div className="bg-[#080E4B] px-4 py-2 rounded-full hidden md:flex items-center gap-2">
                        <Sparkles size={14} className="text-[#C5A358]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Elite Listing</span>
                    </div>
                </div>

                <div className="flex justify-between relative max-w-3xl mx-auto">
                    <div className="absolute top-5 left-0 w-full h-[1px] bg-gray-100 -z-10"></div>
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${step >= s.id ? 'bg-[#080E4B] border-[#C5A358] text-[#C5A358]' : 'bg-white border-gray-100 text-gray-300'}`}>
                                {step > s.id ? <CheckCircle2 size={18} /> : s.icon}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest">{s.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-50 overflow-hidden">
                <div className="p-8 md:p-14">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-[#080E4B]">Property Name*</label>
                                        <input {...register("name", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl outline-none font-bold text-[#080E4B]" placeholder="Skyline Villa" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-[#080E4B]">Property Type*</label>
                                        <select {...register("type", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl outline-none font-bold text-[#080E4B] cursor-pointer">
                                            {propertyTypes.map((pt) => <option key={pt._id} value={pt.name.toLowerCase()}>{pt.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase text-[#080E4B]">New Launch Project?</h4>
                                        <p className="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">Mark for newly constructed builder projects</p>
                                    </div>
                                    <input type="checkbox" {...register("newProject")} className="w-6 h-6 accent-[#C5A358] cursor-pointer" />
                                </div>

                                {isNewProject && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid md:grid-cols-2 gap-6 overflow-hidden">
                                        <input {...register("reraId")} placeholder="RERA ID" className="w-full p-5 bg-white border border-blue-100 rounded-2xl font-bold text-[#080E4B]" />
                                        <input {...register("possessionDate")} placeholder="Possession Date (e.g. Dec 2025)" className="w-full p-5 bg-white border border-blue-100 rounded-2xl font-bold text-[#080E4B]" />
                                        <select {...register("constructionStatus")} className="w-full p-5 bg-white border border-blue-100 rounded-2xl font-bold text-[#080E4B] md:col-span-2">
                                            <option value="Newly Launched">Newly Launched</option>
                                            <option value="Under Construction">Under Construction</option>
                                            <option value="Ready to Move">Ready to Move</option>
                                        </select>
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-[#080E4B]">Narrative Description</label>
                                    <textarea {...register("description", { required: true })} rows="5" className="w-full p-5 bg-[#F8F9FB] rounded-2xl outline-none" placeholder="Describe the estate..."></textarea>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-[#F8F9FB] rounded-3xl">
                                        <label className="text-[9px] font-black uppercase text-[#080E4B]">Price (₹)</label>
                                        <input type="number" {...register("price", { required: true })} className="bg-transparent w-full text-xl font-serif mt-2 outline-none" />
                                    </div>
                                    <div className="p-6 bg-[#F8F9FB] rounded-3xl">
                                        <label className="text-[9px] font-black uppercase text-[#080E4B]">Area (sq.ft)</label>
                                        <input type="number" {...register("area", { required: true })} className="bg-transparent w-full text-xl font-serif mt-2 outline-none" />
                                    </div>
                                    <div className="p-6 bg-[#F8F9FB] rounded-3xl">
                                        <label className="text-[9px] font-black uppercase text-[#080E4B]">Furnished</label>
                                        <select {...register("furnishedStatus")} className="bg-transparent w-full font-bold mt-2 outline-none">
                                            <option value="unfurnished">Unfurnished</option>
                                            <option value="semi">Semi-Furnished</option>
                                            <option value="fully">Fully Furnished</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['bedrooms', 'bathrooms', 'kitchen', 'balcony'].map(f => (
                                        <div key={f} className="p-6 bg-white border rounded-3xl text-center shadow-sm">
                                            <label className="text-[9px] font-black uppercase text-[#080E4B] mb-2 block">{f}</label>
                                            <input type="number" defaultValue="1" {...register(f)} className="w-full bg-transparent text-center text-3xl font-serif outline-none" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {AMENITIES_LIST.map(am => (
                                        <label key={am} className="flex items-center justify-center p-4 border rounded-2xl cursor-pointer hover:bg-gray-50 has-[:checked]:bg-[#080E4B] has-[:checked]:text-white transition-all duration-300">
                                            <input type="checkbox" value={am} {...register("amenities")} className="hidden" />
                                            <span className="text-[10px] font-bold uppercase">{am}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="relative border-2 border-dashed border-gray-100 rounded-[2rem] p-10 text-center bg-[#F8F9FB] hover:border-[#C5A358] transition-colors group">
                                        <ImageIcon className="mx-auto text-[#C5A358] mb-4 group-hover:scale-110 transition-transform" size={32} />
                                        <p className="text-xs font-black uppercase text-[#080E4B]">Estate Photos</p>
                                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{selectedImages.length} of 10 Images</p>
                                        <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                    <div className="relative border-2 border-dashed border-gray-100 rounded-[2rem] p-10 text-center bg-[#F8F9FB] hover:border-[#C5A358] h-fit">
                                        <Video className="mx-auto text-[#C5A358] mb-4" size={32} />
                                        <p className="text-xs font-black uppercase text-[#080E4B]">Video Tour</p>
                                        <input type="file" onChange={(e) => setSelectedVideo(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-[#080E4B]">Full Address*</label>
                                    <input {...register("address", { required: true })} className="w-full p-5 bg-[#F8F9FB] rounded-2xl outline-none font-bold" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <input {...register("city", { required: true })} placeholder="City" className="p-5 bg-[#F8F9FB] rounded-2xl outline-none font-bold" />
                                    <input {...register("state", { required: true })} placeholder="State" className="p-5 bg-[#F8F9FB] rounded-2xl outline-none font-bold" />
                                    <input {...register("pincode", { required: true })} placeholder="Pincode" className="p-5 bg-[#F8F9FB] rounded-2xl outline-none font-bold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input {...register("lng", { required: true })} placeholder="Longitude" className="p-4 bg-gray-50 rounded-xl text-xs font-mono" />
                                    <input {...register("lat", { required: true })} placeholder="Latitude" className="p-4 bg-gray-50 rounded-xl text-xs font-mono" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="px-10 py-8 bg-[#F8F9FB] border-t flex justify-between">
                    <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1} className={`text-[10px] font-black uppercase ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400'}`}>Back</button>
                    {step < 4 ? (
                        <button type="button" onClick={nextStep} className="px-12 py-4 bg-[#080E4B] text-white rounded-xl text-[10px] font-black uppercase shadow-xl hover:bg-[#C5A358] hover:text-[#080E4B] transition-all">Next Step</button>
                    ) : (
                        <button type="submit" disabled={loading} className="px-14 py-4 bg-[#C5A358] text-[#080E4B] rounded-xl text-[10px] font-black uppercase shadow-xl shadow-[#C5A358]/20">
                            {loading ? <Loader2 className="animate-spin" /> : "Publish Estate"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddProperty;