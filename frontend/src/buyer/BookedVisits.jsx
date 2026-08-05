import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyerBookings } from '../redux/slices/bookingSlice';
import { Calendar, Clock, MapPin, Loader2, CheckCircle, XCircle, Clock3 } from 'lucide-react';

const BookedVisits = () => {
    const dispatch = useDispatch();
const { buyerBookings, loading } = useSelector(state => state.bookings);

    useEffect(() => {
        dispatch(fetchBuyerBookings());
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'Rejected': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-amber-100 text-amber-600 border-amber-200';
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">My Scheduled Visits</h1>

            <div className="grid gap-6">
                {buyerBookings?.length > 0 ? buyerBookings.map((visit) => (
                    <div key={visit._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all">
                        <img 
                            src={visit.property?.images[0]} 
                            className="w-full md:w-40 h-32 object-cover rounded-2xl shadow-inner" 
                            alt="property"
                        />

                        <div className="flex-1 space-y-2 text-center md:text-left">
                            <h3 className="text-xl font-bold text-slate-800">{visit.property?.name}</h3>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Calendar size={14} className="text-blue-600"/> {visit.visitDate}</span>
                                <span className="flex items-center gap-1"><Clock size={14} className="text-blue-600"/> {visit.visitTime}</span>
                            </div>
                            <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-1 italic">
                                <MapPin size={14}/> {visit.property?.location?.city}
                            </p>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-3">
                            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(visit.status)}`}>
                                {visit.status}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Requested on: {new Date(visit.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed">
                        <Clock3 className="mx-auto text-slate-200 mb-4" size={48} />
                        <h2 className="text-slate-500 font-bold">No visits scheduled yet.</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookedVisits;