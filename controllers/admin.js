const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Group = require('../models/group');
exports.viewUser = async (req, res, next) => {
    try {
        const user = await User.find({ role: "user" });
        res.json(user)
    }
    catch (error) {
        next(error);
    }
}
exports.deleteUser = async (req, res, next) => {
    try {
        const { username } = req.params;
        console.log("Username to delete:", username);

        const result = await User.deleteOne({ username: username });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }

}