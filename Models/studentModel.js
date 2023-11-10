const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  studentId: {
    type: String,
    required: [true, "Please Enter the Id"],
  },
  name: {
    type: String,
    required: [true, "Please Enter the Mentor name"],
  },
  email: {
    type: String,
    required: [true, "Please the Mail Id"],
  },
  phone: {
    type: String,
    required: [true, "Please Enter the Mobile NUmber"],
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    default: null,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
