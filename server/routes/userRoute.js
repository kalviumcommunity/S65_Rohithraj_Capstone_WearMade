const express = require('express');

const router = express.Router();
const { getUsers, addUser } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/', addUser);

module.exports = router;
