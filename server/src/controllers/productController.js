import cloudinary from "../configs/cloudinary.js";
import prisma from '../configs/prisma.js';

// Add Produce Listing
export const addProduct = async (req, res) => {
    try {
        let productData = typeof req.body.productData === 'string' 
            ? JSON.parse(req.body.productData) 
            : req.body;

        const { name, description, price, offerPrice, category, unit, location, quantity } = productData;

        if (!name || !description || !price || !category) {
            return res.json({ success: false, message: "Missing required produce details" });
        }

        // Upload images to Cloudinary
        const images = req.files || [];
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // Fetch farmer details to auto-set location if not provided
        const farmerProfile = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { state: true, lga: true }
        });

        const produceLocation = location || `${farmerProfile?.lga || ''}, ${farmerProfile?.state || ''}`.trim();

        
        const product = await prisma.product.create({
            data: {
                farmerId: req.userId,
                name,
                description: Array.isArray(description) ? description.join('\n') : description,
                price: parseFloat(price),
                offerPrice: offerPrice ? parseFloat(offerPrice) : null,
                category,
                unit: unit || "50kg Bag",
                location: produceLocation,
                quantity: quantity ? parseInt(quantity) : 0,
                inStock: (quantity ? parseInt(quantity) : 0) > 0,
                images: imagesUrl
            }
        });

        res.json({ success: true, message: "Produce Listed Successfully", product });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get All Produce Listings 
export const productList = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { inStock: true },
            include: {
                farmer: {
                    select: {
                        id: true,
                        name: true,
                        farmName: true,
                        state: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, products });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Single Produce Details
export const productById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                farmer: {
                    select: {
                        id: true,
                        name: true,
                        farmName: true,
                        state: true,
                        lga: true,
                        phone: true
                    }
                }
            }
        });

        if (!product) {
            return res.json({ success: false, message: "Produce not found" });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Listings Created by Logged-In Farmer
export const getFarmerProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { farmerId: req.userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, products });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update Produce Stock / Quantity
export const changeStock = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        const parsedQuantity = parseInt(quantity);

        if (parsedQuantity < 0) {
            return res.json({ success: false, message: "Quantity cannot be negative" });
        }

        // Ensure the product belongs to the requesting farmer (or Admin)
        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) {
            return res.json({ success: false, message: "Produce not found" });
        }

        if (existingProduct.farmerId !== req.userId && req.userRole !== 'ADMIN') {
            return res.json({ success: false, message: "Not authorized to update this listing" });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                quantity: parsedQuantity,
                inStock: parsedQuantity > 0
            }
        });

        res.json({ success: true, message: "Stock Updated Successfully", product: updatedProduct });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};