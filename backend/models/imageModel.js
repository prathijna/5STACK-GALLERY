const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  category: String,
  imgName: String,
});

module.exports = ImageModel = mongoose.model("Image", imgSchema);
