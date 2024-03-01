require("dotenv").config();

const mongoose = require("mongoose");

module.exports = async function () {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(process.env.DATABASE_URL, connectionParams);
    console.log("Connected to database.");
  } catch (error) {
    console.error(`Error connecting to the database. \n${error}`);
  }
};
