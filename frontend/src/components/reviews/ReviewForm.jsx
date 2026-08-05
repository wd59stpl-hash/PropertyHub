const ReviewForm = ({ propertyId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('propertyId', propertyId);
        formData.append('rating', rating);
        formData.append('comment', comment);
        images.forEach(img => formData.append('images', img));

        try {
            await api.post('/buyer/reviews/add', formData);
            alert("Review submitted!");
            window.location.reload();
        } catch (err) { alert(err.response.data.message); }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-blue-50 p-8 rounded-[2.5rem] space-y-4">
            <h4 className="font-black text-blue-900">Share your experience</h4>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                    <Star
                        key={s} size={24}
                        onClick={() => setRating(s)}
                        className={s <= rating ? 'fill-amber-500 text-amber-500 cursor-pointer' : 'text-slate-300 cursor-pointer'}
                    />
                ))}
            </div>

            <textarea
                className="w-full p-4 rounded-2xl border-none outline-none text-sm"
                placeholder="How was the property? Mention location, neighborhood, etc."
                onChange={(e) => setComment(e.target.value)}
            />

            <input type="file" multiple onChange={(e) => setImages([...e.target.files])} />

            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100">
                Submit Review
            </button>
        </form>
    );
};