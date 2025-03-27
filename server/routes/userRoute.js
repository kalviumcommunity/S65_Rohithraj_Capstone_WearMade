const express = require('express');

const router = express.Router();
const { getUsers, addUser, updateUser } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/', addUser);
router.put('/update/:email', updateUser);

module.exports = router;
