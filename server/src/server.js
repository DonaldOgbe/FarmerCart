import cookieParser from 'cookie-parser';
import express from 'express';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser()); 

app.get('/', (req, res) => res.send('API is working!'));
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

app.listen(port, () => {
    console.log(`PORT connected on ${port}`);
})