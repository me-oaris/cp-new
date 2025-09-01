const express = require('express');
const { getUserProfile, updateProfile, getAllUsers } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
