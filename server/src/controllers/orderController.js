import crypto from 'crypto';
import prisma from '../configs/prisma.js';

// Place Order - Cash on Delivery
export const placeOrderCOD = async (req, res) => {
    try {
        const { addressId } = req.body;

        if (!addressId) {
            return res.json({ success: false, message: "Please select a delivery address" });
        }

        // Fetch Buyer's Cart with Products
        const cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.json({ success: false, message: "Your cart is empty" });
        }

        let subtotal = cart.items.reduce((acc, item) => {
            const price = Number(item.product.offerPrice || item.product.price);
            return acc + (price * item.quantity);
        }, 0);

        const tax = subtotal * 0.02; // 2% Tax
        const totalAmount = Math.round(subtotal + tax);


        // Create Order and linked OrderItems in PostgreSQL
        const order = await prisma.order.create({
            data: {
                userId: req.userId,
                addressId: addressId,
                amount: totalAmount,
                paymentType: 'COD',
                isPaid: false,
                status: 'ORDER_PLACED',
                items: {
                    create: cart.items.map(item => ({
                        productId: item.product.id,
                        farmerId: item.product.farmerId,
                        quantity: item.quantity,
                        price: Number(item.product.offerPrice || item.product.price)
                    }))
                }
            }
        });

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        res.json({ success: true, message: "Order placed successfully!", orderId: order.id });

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Place Order - Paystack Payment Initialization
export const placeOrderPaystack = async (req, res) => {
    try {
        const { addressId } = req.body;
        const origin = req.headers.origin || "http://localhost:5173";

        if (!addressId) {
            return res.json({ success: false, message: "Please select a delivery address" });
        }

        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        const cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.json({ success: false, message: "Your cart is empty" });
        }

        let subtotal = cart.items.reduce((acc, item) => {
            const price = Number(item.product.offerPrice || item.product.price);
            return acc + (price * item.quantity);
        }, 0);

        const tax = subtotal * 0.02;
        const totalAmount = Math.round(subtotal + tax);

        const order = await prisma.order.create({
            data: {
                userId: req.userId,
                addressId: addressId,
                amount: totalAmount,
                paymentType: 'ONLINE',
                isPaid: false,
                status: 'ORDER_PLACED',
                items: {
                    create: cart.items.map(item => ({
                        productId: item.product.id,
                        farmerId: item.product.farmerId,
                        quantity: item.quantity,
                        price: Number(item.product.offerPrice || item.product.price)
                    }))
                }
            }
        });


        const amountInKobo = totalAmount * 100;

        const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                amount: amountInKobo,
                callback_url: `${origin}/loader?next=my-orders`,
                metadata: {
                    orderId: order.id,
                    userId: req.userId
                }
            })
        });

        const paystackData = await paystackResponse.json();

        if (paystackData.status) {
            // Return authorization_url so frontend redirects buyer to Paystack
            res.json({ success: true, url: paystackData.data.authorization_url });
        } else {
            res.json({ success: false, message: paystackData.message || "Paystack initialization failed" });
        }

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Paystack Webhook Handler
export const paystackWebhook = async (req, res) => {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;

        // Verify Paystack HMAC Signature
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(400).send("Invalid signature");
        }

        const event = req.body;

        // Verify Payment Success Event
        if (event.event === 'charge.success') {
            const { orderId, userId } = event.data.metadata;

            if (orderId) {
                // Mark Order as Paid
                await prisma.order.update({
                    where: { id: orderId },
                    data: { isPaid: true }
                });

                // Clear Buyer's Cart
                const cart = await prisma.cart.findUnique({ where: { userId } });
                if (cart) {
                    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
                }
            }
        }

        res.status(200).send("Webhook Processed");
    } catch (error) {
        console.error("Webhook Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
};

// Get Buyer Order History
export const getUserOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.userId },
            include: {
                address: true,
                items: {
                    include: {
                        product: true,
                        farmer: {
                            select: {
                                farmName: true,
                                state: true,
                                phone: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, orders });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Sales for Logged-In Farmer
export const getFarmerOrders = async (req, res) => {
    try {
        // Fetch all OrderItems where the farmer is the logged-in user
        const sales = await prisma.orderItem.findMany({
            where: { farmerId: req.userId },
            include: {
                product: true,
                order: {
                    include: {
                        address: true,
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, sales });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status (Farmer / Admin Action)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const validStatuses = ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid order status" });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        res.json({ success: true, message: "Order status updated", order: updatedOrder });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};