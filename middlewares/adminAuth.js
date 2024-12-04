const adminAuth = async (req, res, next) => {
    try {
        if (req.user.role == "admin") {
            next();
        }
        else {
            return res.status(401).json({
                message: error.message
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};
module.exports = adminAuth;