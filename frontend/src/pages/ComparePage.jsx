import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCompare, toggleCompare } from '../redux/slices/compareSlice';
import { X, CheckCircle2 } from 'lucide-react';

const ComparePage = () => {
    const { items } = useSelector(state => state.compare);
    const dispatch = useDispatch();

    if (items.length < 2) return <div className="p-20 text-center font-serif">Select at least 2 properties to compare.</div>;

    const specs = [
        { label: 'Price', key: 'price', format: (v) => `₹${v.toLocaleString()}` },
        { label: 'Bedrooms', key: 'bedrooms' },
        { label: 'Bathrooms', key: 'bathrooms' },
        { label: 'Area', key: 'area' },
        { label: 'Type', key: 'type' },
        { label: 'Status', key: 'furnishedStatus' }
    ];

    return (
        <div className="p-10 max-w-7xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-serif text-[#080E4B]">Property <span className="italic">Comparison</span></h1>
                <button onClick={() => dispatch(clearCompare())} className="text-xs font-black uppercase text-red-500 hover:underline">Clear All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-[2rem] overflow-hidden shadow-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-8 text-left text-gray-400 uppercase text-[10px] tracking-widest border-b">Specifications</th>
                            {items.map(prop => (
                                <th key={prop._id} className="p-8 border-b min-w-[250px] relative">
                                    <button onClick={() => dispatch(toggleCompare(prop))} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><X size={16}/></button>
                                    <img src={prop.images[0]} className="w-full h-32 object-cover rounded-2xl mb-4" />
                                    <h3 className="text-sm font-bold text-[#080E4B] line-clamp-1">{prop.name}</h3>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map(spec => (
                            <tr key={spec.key} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-8 border-b font-black text-[#C5A358] text-[10px] uppercase tracking-widest bg-gray-50/30">{spec.label}</td>
                                {items.map(prop => (
                                    <td key={prop._id} className="p-8 border-b text-sm font-bold text-gray-600 text-center">
                                        {spec.format ? spec.format(prop[spec.key]) : prop[spec.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparePage;