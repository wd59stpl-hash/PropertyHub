import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Mail, Phone, MapPin, ArrowUpRight, ArrowRight, Send } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { toast } from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState("");
    const primary = "#080E4B";
    const accent = "#C5A358";
    const socialLinks = [
        { Icon: FaFacebookF, href: "#" },
        { Icon: FaTwitter, href: "#" },
        { Icon: FaInstagram, href: "#" },
        { Icon: FaLinkedinIn, href: "#" }
    ];

    const footerLinks = {
        curation: ["Lakeside Villas", "Urban Penthouses", "Historic Estates", "Modern Mansions"],
        firm: ["Our Advisors", "About Legacy", "Market Reports", "Privacy Charter"],
        support: ["Press Release", "Careers", "Legal Inquiry", "Contact Us"]
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter a valid email");
        toast.success("Welcome to the Elite Club!");
        setEmail("");
    };

    return (
        <footer className="pt-24 pb-12 px-6 lg:px-24 text-white relative overflow-hidden bg-[#080E4B]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A358] to-transparent opacity-30"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-0"></div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col lg:flex-row justify-between items-center gap-10 mb-20 p-12 bg-white/[0.03] rounded-[3rem] border border-white/5 backdrop-blur-md"
                >
                    <div className="text-center lg:text-left space-y-3">
                        <h2 className="text-3xl md:text-5xl font-serif leading-none tracking-tight">
                            Join the <span className="italic text-[#C5A358]">Elite Club.</span>
                        </h2>
                        <p className="text-slate-400 text-sm font-medium">Get early access to off-market luxury listings.</p>
                    </div>

                    <form onSubmit={handleSubscribe} className="relative w-full max-w-md group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Professional email address"
                            className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 outline-none focus:border-[#C5A358] transition-all text-sm font-medium placeholder:text-slate-600"
                        />
                        <button className="absolute right-2 top-2 bottom-2 px-6 bg-[#C5A358] text-[#080E4B] rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all flex items-center gap-2">
                            Join <Send size={12} />
                        </button>
                    </form>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-white p-2.5 rounded-2xl group-hover:rotate-12 transition-transform">
                                <Home style={{ color: primary }} size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-serif tracking-tight">
                                    Property<span className="italic text-[#C5A358]">Hub</span>
                                </span>
                                <span className="text-[7px] font-black uppercase tracking-[0.5em] text-slate-500">Global Realty</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed pr-4 font-medium">
                            Setting the gold standard in luxury real estate. We find the world's most prestigious addresses with absolute discretion.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, i) => (
                                <a key={i} href={social.href} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#C5A358] hover:text-[#080E4B] transition-all duration-500 shadow-xl">
                                    <social.Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Collections</h4>
                        <ul className="space-y-4">
                            {footerLinks.curation.map((link, i) => (
                                <li key={i}>
                                    <Link to="/properties" className="text-slate-400 hover:text-[#C5A358] transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 group">
                                        <div className="w-0 h-[1px] bg-[#C5A358] group-hover:w-4 transition-all" /> {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">The Firm</h4>
                        <ul className="space-y-4">
                            {footerLinks.firm.map((link, i) => (
                                <li key={i}>
                                    <Link to="#" className="text-slate-400 hover:text-[#C5A358] transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 group">
                                        <div className="w-0 h-[1px] bg-[#C5A358] group-hover:w-4 transition-all" /> {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Concierge</h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <MapPin size={18} className="text-[#C5A358] shrink-0" />
                                <p className="text-xs text-slate-400 font-bold leading-relaxed">10-A, Imperial Plaza, Indore, <br />India 122002</p>
                            </div>
                            <div className="flex gap-4">
                                <Mail size={18} className="text-[#C5A358] shrink-0" />
                                <p className="text-xs text-slate-400 font-black tracking-widest">advisors@propertyhub.com</p>
                            </div>
                            <button className="group flex items-center gap-3 py-4 px-8 bg-[#C5A358] text-[#080E4B] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                                Request Callback <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                        <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.4em]">© 2026 PROPERTYHUB</p>
                        <div className="hidden md:flex gap-6">
                            {['Terms', 'Privacy', 'Cookies'].map(l => (
                                <Link key={l} className="text-[8px] font-black uppercase tracking-widest text-slate-600 hover:text-white">{l}</Link>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#C5A358] hover:text-[#080E4B] transition-all group shadow-2xl"
                    >
                        <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;