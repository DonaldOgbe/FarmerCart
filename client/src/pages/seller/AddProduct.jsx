import { useState } from "react";
import { assets, categories } from '../../assets/assets.js';
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('50kg Bag');
    const [location, setLocation] = useState('');

    const { axios } = useAppContext();

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            
            const productData = {
                name,
                description: description.split('\n'), // Splits multi-line description into bullets
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
                quantity: Number(quantity),
                unit,
                location
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            
            for (let i = 0; i < files.length; i++) {
                if (files[i]) {
                    formData.append('images', files[i]);
                }
            }

            const { data } = await axios.post('/api/product/add', formData);
            
            if (data.success) {
                toast.success(data.message);
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setQuantity('');
                setUnit('50kg Bag');
                setLocation('');
                setFiles([]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Produce Images (Up to 4)</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input onChange={(e) => {
                                    const updatedFiles = [...files];
                                    updatedFiles[index] = e.target.files[0];
                                    setFiles(updatedFiles);
                                }}
                                accept="image/*" type="file" id={`image${index}`} hidden />
                                <img className="max-w-24 cursor-pointer border rounded object-cover h-24 w-24" 
                                     src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                                     alt="uploadArea" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Produce Name</label>
                    <input onChange={(e) => setName(e.target.value)} value={name}
                         id="product-name" type="text" placeholder="e.g. Benue White Yam" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Description (Each line becomes a bullet point)</label>
                    <textarea onChange={(e) => setDescription(e.target.value)} value={description}
                         id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Freshly harvested&#10;Organic & chemical-free"></textarea>
                </div>

                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select onChange={(e) => setCategory(e.target.value)} value={category}
                         id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required>
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.text}</option>
                        ))}
                    </select>
                </div>

                {/* Produce Specific Fields: Unit & Location */}
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="unit">Sale Unit</label>
                        <select onChange={(e) => setUnit(e.target.value)} value={unit}
                             id="unit" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                            <option value="50kg Bag">50kg Bag</option>
                            <option value="100kg Bag">100kg Bag</option>
                            <option value="Crate">Crate</option>
                            <option value="Basket">Basket</option>
                            <option value="Paint Bucket">Paint Bucket</option>
                            <option value="Kg">Kg</option>
                            <option value="Tonne">Tonne</option>
                            <option value="Pieces">Pieces</option>
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="location">Farm Location</label>
                        <input onChange={(e) => setLocation(e.target.value)} value={location}
                             id="location" type="text" placeholder="e.g. Makurdi, Benue" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" />
                    </div>
                </div>

                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Regular Price (₦)</label>
                        <input onChange={(e) => setPrice(e.target.value)} value={price}
                             id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Discount / Offer Price (₦)</label>
                        <input onChange={(e) => setOfferPrice(e.target.value)} value={offerPrice}
                             id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="quantity">Available Stock Quantity</label>
                    <input onChange={(e) => setQuantity(e.target.value)} value={quantity}
                         id="quantity" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>

                <button className="px-8 py-2.5 bg-primary-dull text-white font-medium rounded cursor-pointer hover:opacity-95 transition">
                    LIST PRODUCE
                </button>
            </form>
        </div>
    );
};

export default AddProduct;