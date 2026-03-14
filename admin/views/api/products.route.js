/*
 * views/api/products.route.js
 * NOTE: This file is NOT wired into Express by default.
 * Per instructions, no existing backend files are modified.
 * To use these routes, import this module in app.js and mount it.
 */

const express = require('express');
const router = express.Router();

// Health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// List products (placeholder)
router.get('/products', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Not wired. Mount this router in app.js to activate.',
  });
});

// Product details (placeholder)
router.get('/products/:id', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Not wired. Mount this router in app.js to activate.',
  });
});

// Product variants (placeholder)
router.get('/products/:id/variants', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Not wired. Mount this router in app.js to activate.',
  });
});

// Product price (placeholder)
router.get('/products/:id/price', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Not wired. Mount this router in app.js to activate.',
  });
});

module.exports = router;
