const express = require('express');
const router = express.Router();
const { signup, login, profile } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Protected Route
router.get('/profile', authenticate, profile);

module.exports = router;
