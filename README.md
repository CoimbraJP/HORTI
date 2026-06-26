# 🥬 HORTI — Order Management System for Produce Vendor

A web order management system built for a fruit and vegetable retailer at CEASA, eliminating manual transcription errors and speeding up stock picking.

> **Delivered and running in production.**

---

## 📋 About

### The problem

The entire order flow was manual and error-prone:

1. Customer sent an order via WhatsApp
2. Attendant wrote it down on paper
3. Paper was carried to the stockroom
4. Stock worker read the paper and picked the items

Result: wrong quantities, lost orders, slow service, and constant rework.

### The solution

HORTI digitizes the entire flow:

- **Customer** places the order directly on the website — no middleman
- **Stockroom** receives the order printed automatically via a PC running in **kiosk mode** (full-screen browser, no other access) — no need to check WhatsApp
- **Retailer** receives a WhatsApp copy of the confirmed order for a double-check

### Result

Transcription errors eliminated, orders reaching the stockroom in real time, and significant operational efficiency gains.

---

## ✨ Features

- Product catalog with prices
- Shopping cart and order checkout
- Automatic order printing at the stockroom
- WhatsApp notification to the retailer
- Admin panel for managing products and orders

---

## 🛠️ Tech Stack

- **Framework:** React + Vite
- **Language:** JavaScript
- **Styling:** CSS
- **Backend:** Node.js (custom API)
- **Deployment:** Vercel

---

## 🚀 Running locally

```bash
git clone https://github.com/CoimbraJP/HORTI.git
cd HORTI
npm install
# Create a .env file with the required variables
npm run dev
```

Open `http://localhost:5173`

---

## 🌐 Live

[horti-gilt.vercel.app](https://horti-gilt.vercel.app)

---

## 👨‍💻 Author

**João Paulo Coimbra**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-coimbrajp-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/coimbrajp/)
[![GitHub](https://img.shields.io/badge/GitHub-CoimbraJP-181717?style=flat&logo=github)](https://github.com/CoimbraJP)
