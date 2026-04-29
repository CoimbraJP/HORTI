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

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas');
    seedDatabase();
  })
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

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

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// ── SEEDING (Migrar do JSON para o MongoDB) ───────────
async function seedDatabase() {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('🌱 Banco vazio. Migrando produtos do JSON...');
    try {
      const jsonPath = path.join(__dirname, 'data', 'products.json');
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf8');
        const products = JSON.parse(raw);
        await Product.insertMany(products);
        console.log(`✅ ${products.length} produtos migrados com sucesso!`);
      }
    } catch (e) {
      console.error('⚠️ Erro na migração de produtos:', e);
    }
  }
}

// ── API ROUTES ───────────────────────────────────────

// 1. Produtos
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

// 2. Pedidos
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
    // Pegar o último ID para manter a sequência #1, #2, #3...
    const lastOrder = await Order.findOne().sort({ id: -1 });
    const nextId = lastOrder ? lastOrder.id + 1 : 1;
    
    const newOrder = new Order({
      ...req.body,
      id: nextId
    });
    
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor HORTI rodando em http://localhost:${PORT}`);
});
