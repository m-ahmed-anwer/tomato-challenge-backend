require("dotenv").config();
const usersRoutes = require("./routes/users.js");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const connection = require("./db.js");
connection();

app.use(express.json());

app.use("/", usersRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}.`);
});
