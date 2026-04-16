import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(express.json());


// Routes will be imported here
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import adminRoutes from './routes/admin.js';



app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://book-store-1-p9x9.onrender.com',
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
  .then(async () => {
    console.log('Connected to MongoDB');

    // --- AUTOMATIC ADMIN SEEDING ---
    try {
      const adminEmail = 'mohitkumart2x@gmail.com';
      const existingAdmin = await User.findOne({ email: adminEmail });

      if (!existingAdmin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await User.create({
          name: 'Super Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        });
        console.log(`✅ Automatic Admin Setup Complete -> Email: ${adminEmail} | Password: admin123`);
      } else if (existingAdmin.role !== 'admin') {
        // Automatically promote if they already created an account normally
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`✅ User ${adminEmail} automatically promoted to Admin!`);
      }
    } catch (seedErr) {
      console.error('Failed to auto-seed admin:', seedErr);
    }
    // -------------------------------

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
