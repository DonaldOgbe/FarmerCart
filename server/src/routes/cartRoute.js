import express from 'express';
import { getCart, updateCartItem, clearCart } from '../controllers/cartController.js';
import authUser from '../middlewares/authUser.js';

const cartRouter = express.Router();

cartRouter.get('/', authUser, getCart);
cartRouter.post('/update', authUser, updateCartItem);
cartRouter.post('/clear', authUser, clearCart);

export default cartRouter;