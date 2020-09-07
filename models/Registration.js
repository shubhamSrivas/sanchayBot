const mongoose = require("mongoose");
const { stringify } = require("uuid");
const { Schema } = mongoose;

const registrationSchema = new Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  registrationDate: Date,
});

mongoose.model("registration", registrationSchema);
