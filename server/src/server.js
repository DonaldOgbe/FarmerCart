import cookieParser from 'cookie-parser';
import express from 'express';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import corsOptions from './middlewares/cors.middleware.js';
import { PORT } from './env.js';

const app = express();

app.use(corsOptions);
app.use(express.json());
app.use(cookieParser()); 

app.get('/', (req, res) => res.send('API is working!'));
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use("/api/cart/", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order/", orderRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})