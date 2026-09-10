import { useEffect, useState } from "react";
import { useAppContext } from '../context/AppContext.jsx';
import { assets } from "../assets/assets.js";
import toast from "react-hot-toast";

const Cart = () => {
    const { products, currency, cartItems, setCartItems, removeFromCart, getCartCount, updateCartItem,
        navigate, getCartAmount, axios, user } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("Online");

    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error("Please select a delivery address");
            }
            
            // Place order with COD
            if (paymentOption === 'COD') {
                const { data } = await axios.post('/api/order/cod', {
                    addressId: selectedAddress.id
                });
                if (data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            }
            // Place order with Paystack Online Payment
            else {
                const { data } = await axios.post('/api/order/paystack', {
                    addressId: selectedAddress.id
                });
                if (data.success) {
                    setCartItems({});
                    window.location.replace(data.url); // Redirects to Paystack Checkout URL
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item.id === key);
            if (product) {
                product.quantity = cartItems[key];
                tempArray.push(product);
            }
        }
        setCartArray(tempArray);
    };

    const getUserAddress = async () => {
        try {
            // Updated to use your new clean route GET /api/address
            const { data } = await axios.get('/api/address');
            if (data.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    useEffect(() => {
        if (user) {
            getUserAddress();
        }
    }, [user]);

    return products.length > 0 && Object.keys(cartItems).length > 0 ? (
        <div className="flex flex-col md:flex-row mt-12 gap-10">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary-dull font-semibold">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b border-gray-200">
                    <p className="text-left">Produce Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium py-4 border-b border-gray-100">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product.id}`); window.scrollTo(0, 0); }} 
                                 className="cursor-pointer w-20 h-20 flex items-center justify-center border border-gray-300 rounded overflow-hidden bg-gray-50">
                                <img className="max-w-full h-full object-cover" src={product.images[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{product.name}</p>
                                <div className="font-normal text-gray-500 text-xs md:text-sm mt-1">
                                    <p>Unit: <span className="font-semibold text-primary-dull">{product.unit}</span></p>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <p>Qty:</p>
                                        <select onChange={e => updateCartItem(product.id, Number(e.target.value))}
                                             value={cartItems[product.id]} className='outline-none border border-gray-300 rounded px-1.5 py-0.5 bg-white'>
                                            {Array(cartItems[product.id] > 9 ? cartItems[product.id] : 9).fill('').map((_, idx) => (
                                                <option key={idx} value={idx + 1}>{idx + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center font-semibold text-gray-800">{currency}{Number(product.offerPrice || product.price) * product.quantity}</p>
                        <button onClick={() => removeFromCart(product.id)} className="cursor-pointer mx-auto hover:opacity-75">
                            <img src={assets.remove_icon} alt="remove icon" className="inline-block w-5 h-5" />
                        </button>
                    </div>
                ))}

                <button onClick={() => { navigate("/products"); window.scrollTo(0, 0); }} className="group cursor-pointer flex items-center mt-6 gap-2 text-primary-dull font-medium">
                    <img src={assets.arrow_right_icon_colored} className="group-hover:-translate-x-1 transition rotate-180" alt="arrow icon" />
                    Continue Shopping
                </button>
            </div>

            {/* Order Summary & Checkout */}
            <div className="max-w-[380px] w-full bg-gray-50 p-6 rounded-lg border border-gray-200 self-start">
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                <hr className="border-gray-200 my-4" />

                <div className="mb-6 space-y-4">
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-400">Delivery Address</p>
                        <div className="relative flex justify-between items-start mt-1 bg-white p-3 rounded border border-gray-200">
                            <p className="text-gray-600 text-xs"> {selectedAddress ? `${selectedAddress.street}, 
                                ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                                 : "No address found. Please add one."}
                            </p>
                            <button onClick={() => setShowAddress(!showAddress)} className="text-primary-dull hover:underline cursor-pointer text-xs font-medium ml-2 shrink-0">
                                Change
                            </button>
                            {showAddress && (
                                <div className="absolute top-14 left-0 py-1 bg-white border border-gray-300 shadow-md text-sm w-full z-20 rounded">
                                    {addresses.map((address, idx) => (
                                        <p key={idx} onClick={() => { setSelectedAddress(address); setShowAddress(false); }} 
                                            className="text-gray-600 text-xs p-2.5 hover:bg-gray-100 cursor-pointer border-b last:border-0">
                                            {address.street}, {address.city}, {address.state}.
                                        </p>
                                    ))}
                                    <p onClick={() => navigate("/add-address")} className="text-primary font-semibold text-center cursor-pointer p-2.5 hover:bg-gray-50 text-xs">
                                        + Add New Address
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-400">Payment Method</p>
                        <select onChange={e => setPaymentOption(e.target.value)} value={paymentOption} className="w-full border border-gray-200 bg-white px-3 py-2 mt-1 rounded text-sm outline-none">
                            <option value="Online">Paystack Online Payment</option>
                            <option value="COD">Cash On Delivery</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-200" />

                <div className="text-gray-600 mt-4 space-y-2 text-sm">
                    <p className="flex justify-between">
                        <span>Subtotal</span><span>{currency}{getCartAmount() / 1.02}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Logistics / Delivery</span><span className="text-green-600 font-medium">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{getCartAmount() - (getCartAmount() / 1.02)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-bold text-gray-900 mt-3 pt-2 border-t border-gray-200">
                        <span>Total:</span>
                        <span>{currency}{getCartAmount()}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3.5 mt-6 cursor-pointer bg-primary text-white font-semibold rounded hover:bg-primary-dull transition shadow-sm">
                    {paymentOption === "Online" ? "Proceed to Paystack" : "Place COD Order"}
                </button>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Explore our fresh farm produce and add items to your cart.</p>
            <button onClick={() => navigate('/products')} className="px-8 py-3 bg-primary text-white font-medium rounded-full cursor-pointer hover:bg-primary-dull transition">
                Browse Marketplace
            </button>
        </div>
    );
};

export default Cart;