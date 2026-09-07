import prisma from '../configs/prisma.js';

// Get Buyer's Cart
export const getCart = async (req, res) => {
    try {
        let cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                farmer: {
                                    select: {
                                        id: true,
                                        farmName: true,
                                        state: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // If user doesn't have a cart yet, create one
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.userId },
                include: { items: true }
            });
        }

        res.json({ success: true, cart });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Add or Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

    
        let cart = await prisma.cart.findUnique({
            where: { userId: req.userId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.userId }
            });
        }

        const parsedQuantity = parseInt(quantity);

        
        if (parsedQuantity <= 0) {
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                    productId: productId
                }
            });
            return res.json({ success: true, message: "Item removed from cart" });
        }

        
        await prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId
                }
            },
            update: {
                quantity: parsedQuantity
            },
            create: {
                cartId: cart.id,
                productId: productId,
                quantity: parsedQuantity
            }
        });

        res.json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Clear All Items from Cart
export const clearCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: req.userId }
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }

        res.json({ success: true, message: "Cart cleared" });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};