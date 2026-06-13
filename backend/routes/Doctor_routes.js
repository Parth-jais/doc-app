const express = require("express");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {doctorAuth} = require("../middleware/auth.js");
const Appointment = require("../models/Appointment.js");


const router = express.Router();

router.post("/register", async (req, res) => {
  try {

    const { name, email, password , speciality, experience, fees} = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !fees) {
        return res.status(400).json({
        success: false,
        message: "All fields are required"
        });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
        return res.status(400).json({
            success: false,
            message: "Doctor already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
    name,
    email,
    password: hashedPassword,
    speciality,
    experience,
    fees
    });

    res.json({
      success: true,
      doctor
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      doctor.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    
    if (doctor.status !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Doctor not approved yet"
    });
}

    const token = jwt.sign(
        { doctorId: doctor._id , role: "doctor"},
        process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



router.get(
  "/profile",
  doctorAuth,
  async (req, res) => {
    
    const user = await Doctor.findById(req.doctorId).select("-password");

    res.json({
        success: true,
        user
    });

});


router.get(
  "/appointments",
  doctorAuth,
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({
          doctorId: req.doctorId
        }).populate("userId");

      res.json({
        success: true,
        appointments
      });

    } catch (error) {

      res.json({
        success: false,
        message: error.message
      });

    }

});


router.get(
  "/dashboard",
  doctorAuth,
  async (req, res) => {
    try {

      const appointments =
        await Appointment.find({
          doctorId: req.doctorId
        });

      const totalAppointments =
        appointments.length;

      let totalRevenue = 0;
      for (let app of appointments) {
        if(app.status !== "Cancelled") totalRevenue += app.amount;
      }

      res.json({
        success: true,
        dashboardData: {
          totalAppointments,
          totalRevenue
        }
      });

    } catch (error) {

      res.json({
        success: false,
        message: error.message
      });

    }
});

module.exports = router;