const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const generateAuthToken = require("../config/generateToke.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(req.body);
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateAuthToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/emailcheck/:email", async (req, res) => {
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
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateAuthToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
