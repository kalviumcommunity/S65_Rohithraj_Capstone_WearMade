const users = require('../mockData');


const getUsers = (req, res) => {
    try {
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const addUser = (req, res) => {
    try {
        const user = req.body;
        users.push(user);
        res.status(201).json({message: "user created succesfully", user});
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const updateUser = (req, res) => {
    try {
        const { email } = req.params;
        const user = req.body;
        const userIndex = users.findIndex(user => user.email === email);
        users[userIndex] = { ...users[userIndex], ...user };
        res.status(200).json({ message: "user updated successfully", user: users[userIndex] });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}



module.exports = { getUsers, addUser, updateUser };