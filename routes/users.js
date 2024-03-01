const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/users", (req, res) => {
  res.send(req.body);
});

router.post("/users/register", async (req, res) => {
  try {
    const users = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/users/emailcheck/:email", async (req, res) => {
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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = user.generateAuthToken();

    res.send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
