const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS — allow frontend (Next.js) to call this API
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Serve static files on BOTH paths (local + VPS)
app.use('/store/admin/css',    express.static(path.join(__dirname, 'public/css')));
app.use('/store/admin/js',     express.static(path.join(__dirname, 'public/js')));
app.use('/store/admin/images', express.static(path.join(__dirname, 'public/images')));
app.use('/store/admin/fonts',  express.static(path.join(__dirname, 'public/fonts')));
app.use('/store/admin/libs',   express.static(path.join(__dirname, 'public/libs')));

// ✅ Local paths working too
app.use('/css',    express.static(path.join(__dirname, 'public/css')));
app.use('/js',     express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/fonts',  express.static(path.join(__dirname, 'public/fonts')));
app.use('/libs',   express.static(path.join(__dirname, 'public/libs')));

app.use(session({
   secret: process.env.SESSION_SECRET || 'okab-secret-123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// ✅ basePath variable for EJS templates
app.locals.basePath = process.env.BASE_PATH || '';

// ── Existing routes ───────────────────────────────────────
const authRoutes  = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/store/admin', authRoutes);
app.use('/store/admin', adminRoutes);

// ── NEW: Product API routes for frontend ──────────────────
const productRoutes = require('./routes/products');
app.use('/api', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Product API → http://localhost:${PORT}/api/products`);
  console.log(`📦 Variants   → http://localhost:${PORT}/api/products/6684/variants`);
  console.log(`📦 Price      → http://localhost:${PORT}/api/products/6684/price?color=blue&size=l`);
});
