const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Mentor = require("./Models/mentorModel");
const Student = require("./Models/studentModel");

const PORT =  4000;

//Middleware to parse into JSON
app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.status(200).send({ message: "Welcome to ZEN-Class" });
  } catch (err) {
    res.status(404).send({ message: "Page Not Found" });
  }
});

// 1.API to create Mentor
app.post("/mentor", async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(200).send(mentor);
  } catch (err) {
    res.status(404).send({ message: `Page Not Found Error:${err}` });
  }
});

//2.API to create Student
app.post("/student", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(200).send(student);
  } catch (err) {
    res.status(404).send({ message: `Page Not Found Error:${err}` });
  }
});

// 3 a. API to assign a student to a mentor
app.put("/student/:studentId/assign-mentor/:mentorId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const mentorId = req.params.mentorId;

    // Find the student by studentId and update the mentor field
    const student = await Student.findByIdAndUpdate(
      studentId,
      { mentor: mentorId },
      { new: true }
    );

    res.status(200).send(student);
  } catch (err) {
    res.status(404).send({ message: `Error:${err}` });
  }
});

// b. API to get the list of unassigned students
app.get("/students/unassigned", async (req, res) => {
  try {
    // Find students with no mentors (where mentor is null or undefined)
    const unassignedStudents = await Student.find({
      mentor: { $in: [null, undefined] },
    });
    res.status(200).send(unassignedStudents);
  } catch (err) {
    res.status(404).send({ message: `Error:${err}` });
  }
});

// 4.API to assign or change a mentor for a specific student
app.put("/student/:studentId/assign-mentor/:mentorId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const mentorId = req.params.mentorId;
    // Check if the student and mentor exist in the database
    const student = await Student.findById(studentId);
    const mentor = await Mentor.findById(mentorId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    if (!mentor) {
      return res.status(404).send({ message: "Mentor not found" });
    }
    // Update the student's mentor field with the new mentor's ObjectId
    student.mentor = mentorId;
    await student.save();
    res.status(200).send({ message: "Mentor assigned successfully", student });
  } catch (err) {
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// 5.API to get all students for a particular mentor
app.get("/mentor/:mentorId/students", async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    // Check if the mentor exists in the database
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).send({ message: "Mentor not found" });
    }
    // Find all students assigned to the mentor
    const students = await Student.find({ mentor: mentorId });
    res.status(200).send(students);
  } catch (err) {
    res.status(500).send({ message: `Error: ${err}` });
  }
});

// 6.API to get the previously assigned mentor for a particular student
app.get("/student/:studentId/previous-mentor", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    // Check if the student exists in the database
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    // Check if the student has a mentor
    if (!student.mentor) {
      return res
        .status(200)
        .send({ message: "No previous mentor assigned", mentor: null });
    }
    // Find the mentor of the student
    const mentor = await Mentor.findById(student.mentor);
    if (!mentor) {
      return res.status(404).send({ message: "Previous mentor not found" });
    }
    res.status(200).send({ message: "Previous mentor found", mentor });
  } catch (err) {
    res.status(500).send({ message: `Error: ${err}` });
  }
});
//Running Status of PORT
app.listen(PORT, (err) => {
  if (err) {
    console.log(`PORT:${PORT} is not Running`);
  } else {
    console.log(`PORT:${PORT} is running`);
  }
});

//DB is Connectivity Check
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("Your DB is Connected");
  })
  .catch(() => {
    console.log("Error in connecting DB");
  });
