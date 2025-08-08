const express = require('express');
const router = express.Router();
const { register, login,getUsers } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/users', getUsers);

module.exports = router;