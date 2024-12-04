const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const questionSchema = require('./questionGroup');
const groupModel = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    avartar: {
        type: String, default: function () {
            return `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`
        }
    },
    mode: { type: Boolean, required: false, default: false }, // true : private false: public
    name: { type: String, required: true },
    user: [{ type: String, required: false }],
    question: [{ type: String, required: false }],
    waitList: [{ type: String, required: false }],
    admin: [{ type: String, required: true }],
    created: { type: Date, default: Date.now },
    waitUser: [{ type: String, required: false }]

})
groupModel.methods = {
    addWaitList: function (question) {
        try {
            this.waitList.push(question);
            this.save();
        } catch { }
        return
    },
    addQuestion: function (question) {
        try {
            this.question.push(question);
        } catch { }
    },
    findInWaitList: function (item) {
        return this.waitList.includes(item);
    },
    removeWaitlist: function (item) {
        const index = this.waitList.indexOf(item)
        if (index > -1) {
            this.waitList.splice(index, 1);
        }
        return this.save();
    },
    //user group
    addUser: function (user) {
        this.user.push(user);
        return this.save();
    },
    removeUser: function (item) {
        const index = this.user.indexOf(item)
        if (index > -1) {
            this.user.splice(index, 1);
        }
        return this.save();
    },
    addWaitUser: function (id) {
        this.waitUser.push(id);
        return this.save();
    },
    removeWaitUser: function (item) {
        const index = this.waitUser.indexOf(item)
        if (index > -1) {
            this.waitUser.splice(index, 1);
        }
        return this.save();
    },
    addAdmin: function (id) {
        this.admin.push(id);
        return this.save();
    },
    removeAdmin: function (id) {
        const index = this.admin.indexOf(id)
        if (index > -1) {
            this.admin.splice(index, 1);
        }
        return this.save();
    },
    findAdmin: function (item) {
        return this.admin.includes(item);
    },
    findWaitUser: function (item) {
        return this.waitUser.includes(item);
    },
    findUser: function (item) {
        return this.user.includes(item);
    }
}
groupModel.set('toJSON', { getters: true });
groupModel.options.toJSON.transform = (doc, ret) => {
    const obj = { ...ret };
    delete obj._id;
    delete obj.__v;
    delete obj.question;
    delete obj.waitList;
    delete obj.user;
    delete obj.waitUser;
    return obj;
};
module.exports = mongoose.model('group', groupModel);