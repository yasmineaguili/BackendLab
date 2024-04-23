// userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Create a new user
router.post('/users', UserController.createUser);

// Get user info
router.get('/users/:userId', UserController.getUser);

// Update user info
router.put('/users/:userId', UserController.updateUser);

// User login
router.post('/login', UserController.login);

module.exports = router;
