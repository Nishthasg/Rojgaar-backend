const express = require('express');
const router = express.Router();
const {protect, authorize} = require('../middleware/authMiddleware');

const authController = require('../controllers/authController');

// router.get('/health', authController.healthCheck);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/profile',protect,authController.getProfile);
router.get('/admin', protect, authorize('admin'),
 (req,res) => {
    return res.status(200).json({
        success: true,
        message:  'Welcome Admin !'
    });
 }
);
router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);    
router.post('/reset-password', (req, res, next) => {
  console.log('RESET PASSWORD ROUTE HIT');
  next();
}, authController.resetPassword);

module.exports = router;