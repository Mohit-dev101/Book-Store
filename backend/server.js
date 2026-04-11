import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());


// Routes will be imported here
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import adminRoutes from './routes/admin.js';

 

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://book-store-5-hps6.onrender.com',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));




app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
