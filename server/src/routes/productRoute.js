import express from 'express';
import { addProduct, productList, productById, changeStock, getFarmerProducts } from '../controllers/productController.js';
import { upload } from '../configs/multer.js';
import authUser from '../middlewares/authUser.js';
import authFarmer from '../middlewares/authFarmer.js';

const productRouter = express.Router();

// Public Routes
productRouter.get('/list', productList);
productRouter.get('/:id', productById);

// Farmer Protected Routes
productRouter.post('/add', authUser, authFarmer, upload.array("images"), addProduct);
productRouter.get('/farmer/my-products', authUser, authFarmer, getFarmerProducts);
productRouter.post('/stock', authUser, authFarmer, changeStock);

export default productRouter;