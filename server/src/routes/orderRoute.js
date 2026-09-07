import express from 'express';
import { 
    placeOrderCOD, 
    placeOrderPaystack, 
    paystackWebhook, 
    getUserOrders, 
    getFarmerOrders, 
    updateOrderStatus 
} from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authFarmer from '../middlewares/authFarmer.js';

const orderRouter = express.Router();

// Buyer Routes
orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/paystack', authUser, placeOrderPaystack);
orderRouter.get('/user', authUser, getUserOrders);

// Paystack Webhook
orderRouter.post('/paystack-webhook', paystackWebhook);

// Farmer Routes
orderRouter.get('/farmer/sales', authUser, authFarmer, getFarmerOrders);
orderRouter.post('/status', authUser, authFarmer, updateOrderStatus);

export default orderRouter;