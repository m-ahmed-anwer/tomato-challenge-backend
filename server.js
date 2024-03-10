require("dotenv").config();
const usersRoutes = require("./routes/users.js");
const emailRoutes = require("./routes/email.js");
const express = require("express");
const mongoose = require("mongoose");

const connection = require("./db.js");
connection();
const app = express();

app.use(express.json());

app.use("/users", usersRoutes);

app.use("", emailRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
