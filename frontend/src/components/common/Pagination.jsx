import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ current, total, onPageChange }) => {
    if (total <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-3 mt-10 pb-10">
            <button 
                disabled={current === 1}
                onClick={() => onPageChange(current - 1)}
                className="p-2 rounded-xl border border-gray-100 hover:bg-[#080E4B] hover:text-white transition-all disabled:opacity-20"
            >
                <ChevronLeft size={20} />
            </button>
            
            {[...Array(total)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                        current === i + 1 
                        ? 'bg-[#080E4B] text-white shadow-lg' 
                        : 'bg-white border border-gray-100 text-gray-400 hover:border-[#C5A358]'
                    }`}
                >
                    {i + 1}
                </button>
            ))}

            <button 
                disabled={current === total}
                onClick={() => onPageChange(current + 1)}
                className="p-2 rounded-xl border border-gray-100 hover:bg-[#080E4B] hover:text-white transition-all disabled:opacity-20"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination