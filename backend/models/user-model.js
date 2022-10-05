const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "user-data" }
);

//static sign up method
User.statics.signup = async function (name, email, password) {
  if (!email || !password) {
    throw Error("Email and Password required!!");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not Valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not Strong Enough!!");
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email Already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hash });
  return user;
};

//static login method
User.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Email and Password required!!");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect Password");
  }
  return user;
};

const model = mongoose.model("UserData", User);
module.exports = model;
