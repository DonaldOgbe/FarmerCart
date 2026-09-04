import cookieParser from 'cookie-parser';
import express from 'express';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';

const app = express();

const port = process.env.PORT || 8000;


app.use(express.json()); 

app.get('/', (req, res) => res.send('API is working!'));
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`PORT connected on ${port}`);
})