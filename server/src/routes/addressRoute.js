import express from 'express';
import { addAddress, getAddress, deleteAddress } from '../controllers/addressController.js';
import authUser from '../middlewares/authUser.js';

const addressRouter = express.Router();

addressRouter.post('/', authUser, addAddress);
addressRouter.get('/', authUser, getAddress);
addressRouter.delete('/:id', authUser, deleteAddress);

export default addressRouter;