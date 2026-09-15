import express from 'express';
import { addProduct, productList, productById, changeStock, getFarmerProducts, deleteProduct } from '../controllers/productController.js';
import { upload } from '../configs/multer.js';
import authUser from '../middlewares/authUser.js';
import authFarmer from '../middlewares/authFarmer.js';

const productRouter = express.Router();

productRouter.get('/', productList);

productRouter.post('/add', authUser, authFarmer, upload.array("images"), addProduct);
productRouter.get('/farmer/my-products', authUser, authFarmer, getFarmerProducts);
productRouter.post('/stock', authUser, authFarmer, changeStock);

productRouter.get('/:id', productById);
productRouter.delete('/:id', authUser, authFarmer, deleteProduct);

export default productRouter;