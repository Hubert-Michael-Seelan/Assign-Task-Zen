const mongoose = require("mongoose");

const mentorSchema = mongoose.Schema({
  mentorId: {
    type: String,
    required: [true, "Please Enter the Id"],
  },
  name: {
    type: String,
    required: [true, "Please Enter the Mentor name"],
  },
  expertise: {
    type: String,
    required: [true, "Please Enter your specialization"],
  },
  email: {
    type: String,
    required: [true, "Please the Mail Id"],
  },
  phone: {
    type: String,
    required: [true, "Please Enter the Mobile NUmber"],
  },
});

const Mentor = mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;
