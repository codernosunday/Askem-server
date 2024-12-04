const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const randomNumber = Math.floor(Math.random() * 100) + 1;
const userModel = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  profilePhoto: {
    type: String,
    default: function () {
      return `https://avatar.iran.liara.run/public/${randomNumber}`;
    }
  },
  group: [{ type: String, required: false }],
  adminGroup: [{ type: String, required: false }],
  created: { type: Date, default: Date.now }

});
userModel.methods = {
  addGroup: function async(idGroup) {
    try {
      this.group.push(idGroup);
      return this.save();
    } catch { }
  },
  addAdminGroup: function async(idGroup) {
    try {
      this.adminGroup.push(idGroup);
      return this.save();
    } catch { }
  },
  removeGroup: function async(idGroup) {
    const index = this.group.indexOf(idGroup)
    if (index > -1) {
      this.group.splice(index, 1);
    }
    return this.save();
  },
  removeAdminGroup: function async(idGroup) {
    const index = this.adminGroup.indexOf(idGroup)
    if (index > -1) {
      this.adminGroup.splice(index, 1);
    }
    return this.save();
  },
  isAdminGroup: function async(idGroup) {
    return this.adminGroup.includes(idGroup);
  },
  isInGroup: function async(idGroup) {
    return this.group.includes(idGroup);
  }
}
userModel.set('toJSON', { getters: true });
userModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userModel);
