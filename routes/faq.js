const express = require('express');
const router = express.Router();
const { getFAQs, createFAQ } = require('../controllers/faqController');
const { authenticateAdmin } = require('../middleware/auth');

router.get('/', getFAQs);
router.post('/', authenticateAdmin, createFAQ);

module.exports = router;