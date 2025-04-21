const express = require('express');

const router = express.Router();

const { signup, login, getUsers } = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { upload,handleMulterError } = require('../config/uploadConfig');


router.get('/',auth, getUsers)
router.post('/signup', upload.single('profilePicture'),handleMulterError, signup);
router.post('/login', login);


module.exports = router;
