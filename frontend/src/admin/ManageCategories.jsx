import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, removeCategory } from '../redux/slices/categorySlice';
import { Trash2, Plus, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageCategories = () => {
    const [newName, setNewName] = useState("");
    const dispatch = useDispatch();
    const { list: categories, loading } = useSelector(state => state.categories);

    const handleAdd = () => {
        if (!newName) return toast.error("Enter category name");
        dispatch(addCategory({ name: newName })).then(res => {
            if (!res.error) {
                toast.success("Category added successfully!");
                setNewName("");
            } else {
                toast.error(res.payload);
            }
        });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
                <Tag className="text-blue-600" /> Manage Property Types
            </h1>
            <div className="bg-white p-6 rounded-[2rem] shadow-xl mb-10 flex gap-4 border border-slate-100">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Add new type (e.g. Penthouse, Farmhouse)"
                    className="flex-1 p-4 bg-slate-50 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
                <button
                    onClick={handleAdd}
                    className="bg-slate-900 text-white px-8 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all"
                >
                    <Plus size={20} /> Add Type
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {categories.map(cat => (
                    <div key={cat._id} className="bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-slate-50 group hover:border-blue-100 transition-all">
                        <div>
                            <p className="font-black text-slate-800">{cat.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Type</p>
                        </div>
                        <button
                            onClick={() => dispatch(removeCategory(cat._id))}
                            className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCategories;