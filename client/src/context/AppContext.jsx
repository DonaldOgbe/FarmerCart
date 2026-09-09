/* eslint-disable react-refresh/only-export-components */

import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || '₦';
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                if (data.user.cart && data.user.cart.items) {
                    const cartMap = {};
                    data.user.cart.items.forEach(item => {
                        cartMap[item.productId] = item.quantity;
                    });
                    setCartItems(cartMap);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const addToCart = async (productId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[productId]) {
            cartData[productId] += 1;
        } else {
            cartData[productId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added To Cart");

        if (user) {
            try {
                await axios.post('/api/cart/update', { productId, quantity: cartData[productId] });
            } catch (error) {
                toast.error("Failed to sync cart");
            }
        }
    };

    const updateCartItem = async (productId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity <= 0) {
            delete cartData[productId];
        } else {
            cartData[productId] = quantity;
        }
        setCartItems(cartData);
        toast.success("Cart updated");

        if (user) {
            try {
                await axios.post('/api/cart/update', { productId, quantity });
            } catch (error) {
                toast.error("Failed to sync cart");
            }
        }
    };

    const removeFromCart = async (productId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[productId]) {
            cartData[productId] -= 1;
            if (cartData[productId] <= 0) {
                delete cartData[productId];
            }
        }
        setCartItems(cartData);
        toast.success("Removed from cart");

        if (user) {
            try {
                const newQty = cartData[productId] || 0;
                await axios.post('/api/cart/update', { productId, quantity: newQty });
            } catch (error) {
                toast.error("Failed to sync cart");
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const productId in cartItems) {
            let itemInfo = products.find((product) => product.id === productId);
            if (itemInfo && cartItems[productId] > 0) {
                const price = Number(itemInfo.offerPrice || itemInfo.price);
                totalAmount += price * cartItems[productId];
            }
        }
        const tax = totalAmount * 0.02;
        return Math.floor((totalAmount + tax) * 100) / 100;
    };

    useEffect(() => {
        fetchUser();
        fetchProducts();
    }, []);

    const value = { 
        navigate, 
        user, 
        setUser, 
        showUserLogin, 
        setShowUserLogin, 
        products, 
        currency, 
        addToCart, 
        updateCartItem,
        removeFromCart, 
        cartItems, 
        setCartItems,
        searchQuery, 
        setSearchQuery, 
        getCartAmount, 
        getCartCount, 
        axios,
        fetchProducts, 
        fetchUser 
    };
    
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>;
};

import { useContext } from "react";

export const useAppContext = () => {
    return useContext(AppContext);
};