const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registerAdmin', authController.registerAdmin);
router.post('/register', authController.register);
router.get('/users', authController.getAllUsers);
router.post('/login', authController.login);
router.delete('/user/:id', authController.deleteUser);
router.put('/user/:id', authController.updatePassword);


module.exports = router;

