const CategoryManager = () => {
    const [name, setName] = useState("");
    const dispatch = useDispatch();

    const handleAdd = async () => {
        try {
            await api.post('/categories', { name });
            toast.success("Category added!");
            setName("");
            dispatch(fetchCategories()); 
        } catch (err) {
            toast.error("Failed to add category");
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Manage Property Types</h2>
            <div className="flex gap-2">
                <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="flex-1 p-3 border rounded-xl" 
                    placeholder="New Category Name (e.g. Penthouse)" 
                />
                <button onClick={handleAdd} className="bg-blue-600 text-white px-6 rounded-xl font-bold">
                    Add
                </button>
            </div>
        </div>
    );
};