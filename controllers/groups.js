const { body, validationResult } = require('express-validator');
const Question = require('../models/question');
// const User = require('../models/user');
const Group = require('../models/group')
exports.createGroup = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.array({ onlyFirstError: true });
        return res.status(422).json({ errors });
    }
    try {
        const { name } = req.body
        const author = req.user.id
        let admin = []
        admin.push(author)
        const group = await Group.create({
            name,
            admin,
            author
        })
        res.status(201).json(group)
    }
    catch (error) {
        next(error);
    }
}
exports.listGroup = async (req, res, next) => {
    try {
        const { sortType = '-created' } = req.body;
        const groups = await Group.find().sort(sortType)
        res.json(groups)
    } catch (error) {
        next(error)
    }
}
exports.searchGroup = async (req, res, next) => {
    try {
        const group = await Group.find({ name: { $regex: req.params.search, $options: 'i' } });
        res.json(group);
    } catch (error) {
        next(error);
    }
};
exports.findGroup = async (req, res, next) => {
    const resValidate = {
        inGroup: "example",
        isUser: false,
        isAdmin: false,
        isAuthor: false,
        isWaiting: false
    };
    try {
        const author = req.user.id;
        resValidate.inGroup = req.group.name;
        resValidate.isUser = await req.group.findUser(author);
        resValidate.isAdmin = await req.group.findAdmin(author);
        resValidate.isAuthor = req.group.author.toString() === author;
        resValidate.isWaiting = await req.group.findWaitUser(author);
        res.json(resValidate);
    } catch (error) {
        console.error("findGroup error:", error);
        next(error);
    }
}
// create question group
exports.findQuestionGroup = async (req, res, next) => {
    const { name } = req.params;
    try {
        const { sortType = '-score' } = req.body;
        const group = await Group.findOne({ name: name })
        const questions = await Question.find({ _id: { $in: group.question } }).sort(sortType);
        res.json(questions);
    } catch (error) {
        next(error);
    }
};
//waitlist
exports.findWaitListQuestionGroup = async (req, res, next) => {
    const { name } = req.params;
    try {
        const { sortType = '-score' } = req.body;
        const group = await Group.findOne({ name: name })
        const questions = await Question.find({ _id: { $in: group.waitList } }).sort(sortType);
        res.json(questions);
    } catch (error) {
        next(error);
    }
};
//accept question in group
exports.acceptQuestionGroup = async (req, res, next) => {
    const { name } = req.params;
    const { question } = req.params;
    try {
        const group = await Group.findOne({ name: name })
        if (group.findInWaitList(question)) {
            group.removeWaitlist(question)
            group.addQuestion(question)
        }
        res.json(group);
    } catch (error) {
        next(error);
    }
};
//
exports.validateGroup = [
    body('name')
        .exists()
        .trim()
        .withMessage('Name group exited')
        .notEmpty()
        .withMessage('cannot be blank')
]