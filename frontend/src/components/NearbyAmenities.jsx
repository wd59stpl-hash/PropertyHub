import React, { useState, useEffect } from 'react';
import { School, Hospital, Loader2, MapPin, Navigation } from 'lucide-react';

const NearbyAmenities = ({ coordinates }) => {
    const [schools, setSchools] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNearby = async () => {
        if (!coordinates || coordinates.length < 2) return;
        
        const [lng, lat] = coordinates;
        const cacheKey = `amenities_${lat}_${lng}`;        
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            setSchools(parsed.schools);
            setHospitals(parsed.hospitals);
            return;
        }

        setLoading(true);
        setError(null);
        
        const radius = 2000; 
        const query = `
            [out:json][timeout:25];
            (
              node["amenity"~"school|college"](around:${radius},${lat},${lng});
              node["amenity"~"hospital|clinic"](around:${radius},${lat},${lng});
            );
            out body 10;
        `;

        try {
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);            
            if (response.status === 429) {
                throw new Error("Too many requests. Please wait a moment.");
            }

            if (!response.ok) {
                throw new Error("Location data temporarily unavailable.");
            }

            const data = await response.json();
            
            if (!data.elements) throw new Error("No data found");

            const foundSchools = data.elements.filter(el => el.tags.amenity === 'school' || el.tags.amenity === 'college');
            const foundHospitals = data.elements.filter(el => el.tags.amenity === 'hospital' || el.tags.amenity === 'clinic');

            const result = {
                schools: foundSchools.slice(0, 5),
                hospitals: foundHospitals.slice(0, 5)
            };

            sessionStorage.setItem(cacheKey, JSON.stringify(result));
            
            setSchools(result.schools);
            setHospitals(result.hospitals);

        } catch (err) {
            console.error("OSM Error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNearby();
    }, [coordinates]);

    if (loading) return (
        <div className="flex items-center gap-3 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <Loader2 className="animate-spin text-[#C5A358]" size={20} />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scanning Neighborhood...</p>
        </div>
    );

    if (error && !schools.length) return null; 

    return (
        <div className="space-y-8 mt-12 translate-no">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-[#080E4B] flex items-center gap-3">
                    <Navigation size={20} className="text-[#C5A358]" /> 
                    Neighborhood Insights
                </h3>
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">2KM Radius Analytics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:border-[#C5A358]/20 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><School size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-[#080E4B]">Educational Hubs</h4>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Schools & Colleges</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {schools.length > 0 ? schools.map((s, i) => (
                            <div key={i} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <span className="text-xs font-medium text-gray-600 truncate max-w-[200px]">{s.tags.name || "Academic Institution"}</span>
                                <MapPin size={12} className="text-gray-200 group-hover:text-[#C5A358]" />
                            </div>
                        )) : <p className="text-xs text-gray-400 italic p-3">No major schools nearby</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:border-[#C5A358]/20 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-50 rounded-xl text-red-600"><Hospital size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-[#080E4B]">Medical Care</h4>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Hospitals & Clinics</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {hospitals.length > 0 ? hospitals.map((h, i) => (
                            <div key={i} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <span className="text-xs font-medium text-gray-600 truncate max-w-[200px]">{h.tags.name || "Healthcare Center"}</span>
                                <MapPin size={12} className="text-gray-200 group-hover:text-[#C5A358]" />
                            </div>
                        )) : <p className="text-xs text-gray-400 italic p-3">No medical facilities found</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NearbyAmenities;