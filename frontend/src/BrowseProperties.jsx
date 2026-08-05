import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, LayoutGrid, List, Loader2, X, Mic, MapPin } from 'lucide-react';
import { fetchAllProperties } from './redux/slices/propertySlice';
import PropertyCard from './components/PropertyCard';
import debounce from 'lodash.debounce';

const BrowseProperties = () => {
    const dispatch = useDispatch();
    const { allProperties, loading, pagination } = useSelector((state) => state.properties);
    const [viewMode, setViewMode] = useState('grid');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: new URLSearchParams(window.location.search).get('search') || '',
        type: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        sort: '-createdAt',
        page: 1
    });

    const debouncedFetch = useMemo(
        () => debounce((f) => dispatch(fetchAllProperties(f)), 500),
        [dispatch]
    );

    useEffect(() => {
        debouncedFetch(filters);
    }, [filters, debouncedFetch]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleLoadMore = () => {
        if (pagination.currentPage < pagination.pages) {
            setFilters(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFD] dark:bg-slate-950 pt-28 pb-20 transition-colors">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
                    <div className="w-full relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A358] transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search city, area or project name..."
                            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-none outline-none focus:ring-2 focus:ring-[#C5A358]/20 transition-all dark:text-white"
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <select 
                            className="flex-1 md:w-64 px-6 py-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-none outline-none text-xs font-bold uppercase tracking-widest dark:text-white cursor-pointer"
                            value={filters.sort}
                            onChange={(e) => updateFilter('sort', e.target.value)}
                        >
                            <option value="-createdAt">Newest First</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="-area">Largest Area</option>
                        </select>
                        
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-gray-500"
                        >
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 lg:block w-full lg:w-80 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                        <div className="h-full bg-white dark:bg-slate-900 lg:bg-transparent p-8 lg:p-0 overflow-y-auto">
                            <div className="flex items-center justify-between lg:hidden mb-8">
                                <h3 className="text-xl font-bold dark:text-white">Filters</h3>
                                <button onClick={() => setIsSidebarOpen(false)}><X size={24} className="dark:text-white"/></button>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 space-y-10 sticky top-28">
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Property Type</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['apartment', 'villa', 'plot', 'office', 'studio'].map((type) => (
                                            <button 
                                                key={type}
                                                onClick={() => updateFilter('type', filters.type === type ? '' : type)}
                                                className={`px-6 py-3.5 rounded-xl text-xs font-bold capitalize text-left transition-all ${filters.type === type ? 'bg-[#080E4B] text-white shadow-lg' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 hover:bg-gray-100'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Budget Range</h4>
                                    <div className="space-y-3">
                                        <input type="number" placeholder="Min Price" className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs outline-none dark:text-white" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} />
                                        <input type="number" placeholder="Max Price" className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs outline-none dark:text-white" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Bedrooms</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['1', '2', '3', '4+'].map(num => (
                                            <button 
                                                key={num}
                                                onClick={() => updateFilter('bedrooms', num)}
                                                className={`py-3 rounded-xl text-xs font-black transition-all ${filters.bedrooms === num ? 'bg-[#C5A358] text-white' : 'bg-gray-50 dark:bg-slate-800 text-gray-400'}`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => setFilters({search: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', sort: '-createdAt', page: 1})} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[#C5A358] border border-[#C5A358]/20 rounded-xl hover:bg-[#C5A358]/5">
                                    Reset All
                                </button>
                            </div>
                        </div>
                    </aside>
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-10">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Showing <span className="text-gray-900 dark:text-white">{allProperties.length}</span> Results
                            </p>
                            <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-slate-800 text-[#080E4B]' : 'text-gray-400'}`}><LayoutGrid size={18}/></button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100 dark:bg-slate-800 text-[#080E4B]' : 'text-gray-400'}`}><List size={18}/></button>
                            </div>
                        </div>

                        {loading && filters.page === 1 ? (
                            <div className="h-96 flex flex-col items-center justify-center">
                                <Loader2 className="animate-spin text-[#C5A358] mb-4" size={40} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Estates</p>
                            </div>
                        ) : (
                            <>
                                <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                    {allProperties.map((prop) => (
                                        <PropertyCard key={prop._id} property={prop} viewMode={viewMode} />
                                    ))}
                                </div>

                                {allProperties.length === 0 && (
                                    <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
                                        <MapPin className="text-gray-200 mb-4" size={60} />
                                        <h3 className="text-xl font-serif dark:text-white">No properties found</h3>
                                        <p className="text-sm text-gray-400 mt-2">Try changing your filters or location.</p>
                                    </div>
                                )}

                                {pagination.currentPage < pagination.pages && (
                                    <div className="mt-16 text-center">
                                        <button 
                                            onClick={handleLoadMore}
                                            disabled={loading}
                                            className="px-12 py-5 bg-[#080E4B] dark:bg-[#C5A358] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Loading...' : 'Load More Properties'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BrowseProperties;