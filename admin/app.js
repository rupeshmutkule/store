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

// ✅ CORS: allow frontend domain to call API (added)
const normalizeOrigin = (value) => {
  if (!value) return null;
  try { return new URL(value).origin; } catch { return value; }
};
const frontendOrigin = normalizeOrigin(process.env.FRONTEND_URL);
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    frontendOrigin || 'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Serve static files on BOTH paths (local + VPS)
app.use('/store/admin/css', express.static(path.join(__dirname, 'public/css')));
app.use('/store/admin/js', express.static(path.join(__dirname, 'public/js')));
app.use('/store/admin/images', express.static(path.join(__dirname, 'public/images')));
app.use('/store/admin/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/store/admin/libs', express.static(path.join(__dirname, 'public/libs')));

// ✅ Local paths working too
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/libs', express.static(path.join(__dirname, 'public/libs')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// ✅ basePath variable for EJS templates
app.locals.basePath = process.env.BASE_PATH || '';

const authRoutes  = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/store/admin', authRoutes);
app.use('/store/admin', adminRoutes);

// ✅ Product API routes (added)
const productRoutes = require('./routes/products');
app.use('/api', productRoutes);

// ✅ Optional: sandbox routes placed under /api-sandbox (added)
// Note: this is the router file you asked to keep under views/api
const sandboxApiRoutes = require('./views/api/products.route');
app.use('/api-sandbox', sandboxApiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
