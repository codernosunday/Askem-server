const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Group = require('../models/group');
exports.joinGroup = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true });
        return res.status(422).json({ errors });
    }
    try {
        const author = req.user.id
        const group = req.group.addWaitUser(author)
        res.status(201).json(group)
    }
    catch (error) {
        next(error);
    }
}
exports.leaveGroup = async (req, res, next) => {
    try {
        const { name } = req.body
        const author = req.user.id
        const group = await Group.findOne({ name: name })
        if (group.user(author)) {
            group.removeUser(author)
        }
        res.json(group);
    } catch (error) {
        next(error);
    }
}
exports.listWaitUser = async (req, res, next) => {
    const { name } = req.params
    try {
        const { sortType = '-created' } = req.body;
        const group = await Group.findOne({ name: name })
        const users = await User.find({ _id: { $in: group.waitUser } }).sort(sortType);
        if (users) {
            res.json(users);
        }
        else {
            res.json(null);
        }
    } catch (error) {
        next(error);
    }
}
exports.listAdmin = async (req, res, next) => {
    const { name } = req.params
    try {
        const { sortType = '-created' } = req.body;
        const group = await Group.findOne({ name: name })
        const users = await User.find({ _id: { $in: group.admin } }).sort(sortType);
        if (users) {
            res.json(users);
        }
        else {
            res.json(null);
        }
    } catch (error) {
        next(error);
    }
}
exports.searchUser = async (req, res, next) => {
    try {
        const users = await User.find({ username: { $regex: req.params.search, $options: 'i' } });
        res.json(users);
    } catch (error) {
        next(error);
    }
};
exports.listUserGroup = async (req, res, next) => {
    const { name } = req.params
    try {
        const { sortType = '-created' } = req.body;
        const group = await Group.findOne({ name: name })
        const users = await User.find({ _id: { $in: group.user } }).sort(sortType);
        if (users) {
            res.json(users);
        }
        else {
            res.json(null);
        }
    } catch (error) {
        next(error);
    }
}
// user
exports.acceptMemberGroup = async (req, res, next) => {
    try {
        const { name } = req.body
        const { group } = req.body
        const user = await User.findOne({ username: name })
        const author = user.id
        const groups = await Group.findOne({ name: group })
        if (groups.findWaitUser(author)) {
            groups.removeWaitUser(author)
            groups.addUser(author)
        }
        res.json(groups);
    } catch (error) {
        next(error);
    }
}
exports.unAcceptMemberGroup = async (req, res, next) => {
    try {
        const { name } = req.body
        const { group } = req.body
        const user = await User.findOne({ username: name })
        const author = user.id
        const groups = await Group.findOne({ name: group })
        if (groups.findWaitUser(author)) {
            groups.removeWaitUser(author)
        }
        res.json(groups);
    } catch (error) {
        next(error);
    }
}
exports.kickUserGroup = async (req, res, next) => {
    try {
        const { name } = req.body
        const { group } = req.body
        const user = await User.findOne({ username: name })
        const author = user.id
        const groups = await Group.findOne({ name: group })
        if (groups.findUser(author)) {

            groups.removeUser(author)
        }
        res.json(groups);
    } catch (error) {
        next(error);
    }
}
// admin
exports.adminGroup = async (req, res, next) => {
    try {
        const { name } = req.body
        const { group } = req.body
        const user = await User.findOne({ username: name })
        const author = user.id
        const groups = await Group.findOne({ name: group })
        if (groups.findAdmin(author) == false && groups.findUser(author) == true) {
            groups.addAdmin(author)
            groups.removeUser(author)
        }
        res.json(groups);
    } catch (error) {
        next(error);
    }
}
exports.removeAdminGroup = async (req, res, next) => {
    try {
        const { name } = req.params
        const author = req.user.id
        const group = await Group.findOne({ name: name })
        if (group.user(author)) {
            group.removeAdmin(author)
            group.addUser(author)
        }
        res.json(group);
    } catch (error) {
        next(error);
    }
}