const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const aysncHandler = require("express-async-handler");

exports.protect = aysncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0]
  ) {
    try {
      token = req.headers.authorization;

      //decoded id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
});
