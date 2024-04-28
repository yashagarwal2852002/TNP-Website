const jwt = require('jsonwebtoken');
const User = require('../Models/userModel.js');

const verifyToken = async(req, res, next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];
            // decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch(error){
            if (error.name === "TokenExpiredError") {
                res.status(401).json({ isLoggedIn: false, message: "Token Expired" });
            } else if (error.name === "JsonWebTokenError") {
                res.status(401).json({ isLoggedIn: false, message: "Invalid Token" });
            } else if (error.name === "MongoError" && error.code === 404) {
                res.status(404).json({ isLoggedIn: false, message: "User Not Found" });
            } else {
                res.status(500).json({ isLoggedIn: false, message: "Server Error" });
            }
        }
    }
    if(!token){
        res.status(401).json({ message: 'Token is required' });
    }
};

module.exports = {verifyToken};