const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuth = async (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decode.user.id);

    if (!user) {
      return res.json({
        success: false,
        message: "Unauthorized access no user found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: "Error" });
  }
};
