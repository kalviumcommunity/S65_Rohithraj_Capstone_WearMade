const users = require('../mockData');

const getUsers = (req, res) => {
    try {
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = { getUsers };