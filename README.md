# MERN E-Commerce Store

A full-featured e-commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js) with Razorpay payment integration and Cloudinary image hosting.

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React 18, Vite, Redux Toolkit, Tailwind   |
| Backend    | Node.js, Express.js                       |
| Database   | MongoDB + Mongoose                        |
| Auth       | JWT + bcryptjs                            |
| Payments   | Razorpay                                  |
| Images     | Cloudinary + Multer                       |

## Features

- 🔐 User registration & login (JWT-based, HTTP-only cookie)
- 🛍️ Product catalog with category filters and search
- 🛒 Persistent shopping cart (Redux)
- 💳 Checkout with Razorpay (test + live modes)
- 📦 Order tracking with status updates
- ⭐ Product reviews and ratings
- 🔧 Admin dashboard — manage products and orders
- 📸 Image upload via Cloudinary

## Project Structure

```
mern-ecommerce/
├── server/                 # Express backend
│   ├── config/             # DB + Cloudinary config
│   ├── controllers/        # Route logic
│   ├── middleware/         # Auth + error middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── .env.example
│   └── server.js
└── client/                 # React + Vite frontend
    └── src/
        ├── components/     # Shared UI components
        ├── pages/          # Route-level pages
        ├── redux/          # Store + slices + RTK Query
        └── utils/
```

## Setup

### 1. Clone and install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Environment variables

```bash
cp server/.env.example server/.env
# Fill in your MongoDB URI, JWT secret, Razorpay keys, Cloudinary credentials
```

### 3. Run in development

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

App runs at `http://localhost:5173`. API at `http://localhost:5000`.

### 4. Seed sample data (optional)

```bash
cd server && node seed.js
```

Creates 10 sample products, 1 admin user (`admin@store.com` / `Admin@123`), and 1 regular user (`user@store.com` / `User@123`).

## API Routes

| Method | Endpoint                      | Access   |
|--------|-------------------------------|----------|
| POST   | /api/auth/register            | Public   |
| POST   | /api/auth/login               | Public   |
| GET    | /api/products                 | Public   |
| GET    | /api/products/:id             | Public   |
| POST   | /api/orders                   | Auth     |
| GET    | /api/orders/my                | Auth     |
| POST   | /api/orders/verify-payment    | Auth     |
| GET    | /api/admin/products           | Admin    |
| POST   | /api/admin/products           | Admin    |
| PUT    | /api/admin/products/:id       | Admin    |
| DELETE | /api/admin/products/:id       | Admin    |
| GET    | /api/admin/orders             | Admin    |
| PUT    | /api/admin/orders/:id         | Admin    |

## Viva Questions to Prepare

1. Why did you use JWT instead of sessions?
2. How does Razorpay payment verification work?
3. Explain the Redux cart flow end-to-end.
4. How does Cloudinary image upload work in your architecture?
5. What is the difference between a regular user and an admin in your system?
6. How would you scale this to handle 10,000 concurrent users?

## License

For academic use. See your institution's academic integrity policy.
