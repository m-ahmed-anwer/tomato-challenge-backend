const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateAuthToken = require("../config/generateToke.js");
const User = require("../models/userModel.js");
const { sendEmail } = require("../utils/nodemailer.js");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name score");
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateScore = async (req, res) => {
  try {
    const { score } = req.body;
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(userId, { score }, { new: true });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Score updated successfully", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
      score: 0,
    });
      if (user) {
        
      await sendEmail(
        email,
        "Welcome to Tomato Mystery Challenge!",
        `Hello ${name}, welcome to Tomato Mystery Challenge!`
      );

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        score: user.score,
        token: generateAuthToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const checkEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password or email" });
    }

    const token = generateAuthToken(user._id);

    res.json({
      login: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        score: user.score,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyToken = async (req, res) => {
  const token = req.params.token;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById(decode.id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.json({
        login: true,
        user,
      });
    } catch (error) {
      console.error("JWT verification error:", error.message);
      res.json({
        login: false,
        data: "error",
      });
    }
  } else {
    res.json({
      login: false,
      data: "error",
    });
  }
};

module.exports = {
  getUsers,
  updateScore,
  registerUser,
  checkEmail,
  loginUser,
  verifyToken,
};
