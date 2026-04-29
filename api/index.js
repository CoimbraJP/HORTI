import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── MONGODB CONNECTION ────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

// No Vercel, a conexão pode ser aberta em cada request ou mantida
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
    .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));
}

// ── SCHEMAS ──────────────────────────────────────────
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  price: Number,
  icon: String
});

const orderSchema = new mongoose.Schema({
  id: Number,
  client: {
    name: String,
    document: String,
    phone: String
  },
  items: Array,
  timestamp: String,
  total: Number,
  status: { type: String, default: 'pending' },
  printed: { type: Boolean, default: false }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// ── API ROUTES ───────────────────────────────────────

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    const product = new Product({ ...req.body, id: newId });
    await product.save();
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.deleteOne({ id: parseInt(req.params.id) });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ id: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const lastOrder = await Order.findOne().sort({ id: -1 });
    const nextId = lastOrder ? lastOrder.id + 1 : 1;
    const newOrder = new Order({ ...req.body, id: nextId });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { printed } = req.body;
    await Order.updateOne({ id: parseInt(req.params.id) }, { $set: { printed } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Para o Vercel funcionar como Serverless
export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Local Server: http://localhost:${PORT}`);
  });
}
