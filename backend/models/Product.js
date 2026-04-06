import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
