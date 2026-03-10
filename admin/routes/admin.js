const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { showDashboard } = require('../controllers/dashboardController');

// All admin routes are protected
router.use(isAuthenticated);

router.get('/dashboard', showDashboard);

module.exports = router;