const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const isAuth = async (req, res, next) => {

  try {
    const token = req.headers['x-auth-token'];
    if (!token)
    return res.status(401).json({ msg: 'No Token, authorization denied' });

    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await User.findById(decoded.id);
    if (!user) {
    return res.status(401).json({ msg: 'authorization denied' });
    }

    req.user = user;
    next();

} catch (error) {
    console.log('Token is not valid', error)
    return res.status(400).json({ msg: 'Token is not valid' });
}
};

module.exports = isAuth;