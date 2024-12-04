const Group = require('../models/group')
const groupAuth = async (req, res, next) => {
    try {
        const { name } = req.params
        const gr = await Group.findOne({ name: name });
        req.group = gr;
        next();
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

module.exports = groupAuth;