import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EditItem: React.FC = () => {
    const location = useLocation();
    const oldItem = location.state?.item;

    const expiryDate = new Date(oldItem.expiry_time);
    const timestampDate = new Date(oldItem.timestamp);
    const diffMs = expiryDate.getTime() - timestampDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const safeToEatHours = diffHours.toString();
    const [formData, setFormData] = useState({
        title: oldItem.title,
        type: oldItem.type,
        quantity: oldItem.quantity,
        unit: oldItem.unit,
        freshness: oldItem.freshness_level,
        location: oldItem.pickup_location,
        safeToEatHours: safeToEatHours,
        pickupStart: '',
        pickupEnd: '',
        specialInstructions: oldItem.special_instruction,
    });

    const foodTypes = [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'non-vegetarian', label: 'Non-Vegetarian' },
        { value: 'gluten-free', label: 'Gluten-Free' },
        { value: 'contains-dairy', label: 'Contains Dairy' },
    ];

    const freshnessLevels = [
        { value: 'excellent', label: 'Excellent - Just prepared' },
        { value: 'good', label: 'Good - Still fresh' },
        { value: 'fair', label: 'Fair - Best consumed soon' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    // User template
    interface User {
        name: string;
        username: string;
        role: string;
    }

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

    // Session Cheack
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
                    withCredentials: true,
                });
                setUser(response.data.user);
                console.log("Session:", response.data);
            } catch (err) {
                setUser(null);
                navigate('/');
                console.log(err);
            }
        };

        checkSession();
    }, []);

    // Add hours (can exceed 24, auto-adjusts day)
    const addHours = (date: Date, hours: number): Date => {
        return new Date(date.getTime() + hours * 60 * 60 * 1000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Submit logic here
        if (loading) return; // Prevent multiple submissions
        try {
            setLoading(true);
            setLoadingMessage("Confirming edit...");
            const now = new Date();
            const expiryTime = addHours(now, Number(formData.safeToEatHours));
            const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/admin/edit-item/", {
                id: oldItem.id,
                title: formData.title,
                type: formData.type,
                quantity: formData.quantity,
                unit: formData.unit,
                freshness_level: formData.freshness,
                pickup_location: formData.location,
                expiry_time: expiryTime.toISOString(),
                timestamp: now.toISOString(),
                special_instruction: formData.specialInstructions,
                image_url: imageUrl ? imageUrl : ""
            }, { withCredentials: true });
            console.log("Test:", response.data);
            setLoading(false);
            setLoadingMessage(null);
            navigate(-1);
            // alert('Edited!');
        }
        catch (err) {
            setLoading(false);
            setLoadingMessage(null);
            console.log("Submission Error: ", err);
            navigate("/signin");
        }
    };

    // Image upload part
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isImageSelected, setIsImageSelected] = useState<boolean>(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setIsImageSelected(true);
        } else {
            alert("Please select a valid image file!");
        }
    };

    const uploadImage = async () => {
        if (loading) return;
        if (!imageFile) return alert("No image selected!");
        const formData = new FormData();
        formData.append("file", imageFile);
        try {
            setLoading(true);
            setLoadingMessage("Uploading image...");
            const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/upload-image/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            setImageUrl(response.data.image_url); // Cloudinary returns this URL
            console.log("Uploaded Image URL:", response.data);
        } catch (err) {
            setLoading(false);
            setLoadingMessage(null);
            console.error("Upload failed:", err);
        } finally {
            setLoading(false);
            setLoadingMessage(null);
            setIsImageSelected(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-emerald-700">Add New Donation</h1>
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border">
                <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="mb-3"
                    />
                    {loading && loadingMessage && <p className="mb-2 text-gray-500 font-sm">{loadingMessage}</p>}
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="w-48 h-48 object-cover rounded-lg shadow"
                        />
                    )}
                    {isImageSelected && (
                        <button onClick={uploadImage} className="w-72 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">Upload Image</button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Food Title</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Fresh Vegetable Curry" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded">
                            {foodTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., 25" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border p-2 rounded">
                                <option value="servings">Servings</option>
                                <option value="kg">Kilograms</option>
                                <option value="pieces">Pieces</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Freshness Level</label>
                        <select name="freshness" value={formData.freshness} onChange={handleChange} className="w-full border p-2 rounded">
                            {freshnessLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                        <input name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Main Campus Canteen, Room 101" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Safe to Eat (Hours)</label>
                            <input name="safeToEatHours" type="number" min="1" max="24" value={formData.safeToEatHours} onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Window</label>
                            <div className="flex gap-2">
                                <input name="pickupStart" type="time" value={formData.pickupStart} onChange={handleChange} className="border p-2 rounded w-1/2" />
                                <input name="pickupEnd" type="time" value={formData.pickupEnd} onChange={handleChange} className="border p-2 rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                        <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} className="w-full border p-2 rounded" rows={3} placeholder="Any special handling instructions, containers needed, etc." />
                    </div>
                    {loading && loadingMessage && (<p className="mb-2 text-gray-500 font-sm">{loadingMessage}</p>)}
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">Confirm Edit</button>
                </form>
            </div>
        </div>
    );
};

export default EditItem;
