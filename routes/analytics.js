const express = require('express');
const router = express.Router();
const { getSalesReport, getTopProducts, getUserActivity } = require('../controllers/analyticsController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/sales', authenticateAdmin, getSalesReport);
router.get('/top-products', authenticateAdmin, getTopProducts);
router.get('/user-activity', authenticateAdmin, getUserActivity);

module.exports = router;