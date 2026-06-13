const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "pending"
  },
  
  name: {
    type: String,
    required: true
  },

  speciality: {
    type: String,
    required: true
  },

  experience: {
    type: Number,
    required: true
  },

  fees: {
    type: Number,
    required: true
  },
  
  slots_booked: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model(
  "Doctor",
  doctorSchema
);