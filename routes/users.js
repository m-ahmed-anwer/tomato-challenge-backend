const express = require("express");
const {
  getUsers,
  updateScore,
  registerUser,
  checkEmail,
  loginUser,
  verifyToken,
} = require("../controllers/user.controller.js");

const router = express.Router();

router.get("/score", getUsers);

router.post("/updateScore/:userId", updateScore);

router.post("/register", registerUser);

router.get("/emailcheck/:email", checkEmail);

router.post("/login", loginUser);

router.get("/verifyToken/:token", verifyToken);

module.exports = router;
