const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

router.get('/', authenticate, getOrders);
router.post('/', authenticate, createOrder);
router.put('/:id', authenticateAdmin, updateOrderStatus);

module.exports = router;