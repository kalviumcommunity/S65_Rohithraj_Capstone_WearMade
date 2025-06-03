const express = require('express');

const router = express.Router();

const { signup, login, getUsers, checkEmailOrUsernameExists, getMe } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { upload,handleMulterError } = require('../config/uploadConfig');


router.get('/',auth, getUsers)
router.get('/verify', checkEmailOrUsernameExists);
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, getMe);



module.exports = router;
