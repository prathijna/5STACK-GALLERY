const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user-model");
const jwt = require("jsonwebtoken");
const store = require("./middleware/multer");
const imageModel = require("./models/imageModel");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    //create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.signup(name, email, password);
    //create a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/api/upload", store.single("images"), async (req, res, next) => {
  const { filename } = req.file;
  const { category } = req.body;
  if (!category || !filename) {
    res.status(401).json({ status: 401, message: "All fields required" });
  }
  try {
    const imgData = new imageModel({
      category: category,
      imgName: filename,
    });
    const finalData = await imgData.save();
    res.status(201).json({ status: 201, finalData, message: "Successfull" });
  } catch (error) {
    res.status(401).json({ status: 401, error, message: "Some error occured" });
  }
});
//connect to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "connected to mongoDB && listening on port",
        process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
