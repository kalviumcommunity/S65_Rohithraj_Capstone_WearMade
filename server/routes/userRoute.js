const express = require('express');

const router = express.Router();

const { signup, login, getUsers } = require('../controllers/userController');
const auth = require('../middlewares/auth');


router.get('/',auth, getUsers)
router.post('/signup', signup);
router.post('/login', login);


module.exports = router;
