const express = require('express');

const router = express.Router();

const { signup, login, getUser, checkEmailOrUsernameExists, getMe, logout } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { upload,handleMulterError } = require('../config/uploadConfig');



router.get('/verify', checkEmailOrUsernameExists);
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);
router.get('/:username', getUser)



module.exports = router;
