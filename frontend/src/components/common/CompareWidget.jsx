const CompareWidget = () => {
    const { items } = useSelector(state => state.compare);
    const navigate = useNavigate();

    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-4 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-xl">
            <div className="flex -space-x-4">
                {items.map(item => (
                    <img key={item._id} src={item.images[0]} className="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" />
                ))}
            </div>
            <p className="text-xs font-bold">{items.length} Properties in Comparison</p>
            <button 
                onClick={() => navigate('/compare')}
                className="bg-blue-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all"
            >
                Compare Now
            </button>
        </div>
    );
};