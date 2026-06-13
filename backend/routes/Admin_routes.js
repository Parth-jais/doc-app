const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// require("dotenv").config();

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const {adminAuth} = require("../middleware/auth.js");

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        {
            id: "admin",
            role: "admin"
        },
        process.env.JWT_SECRET
    );

    res.json({
        success: true,
        token
    });

});


router.post(
    "/approve-doctor",
    adminAuth,
    async (req, res) => {

        const { doctorId } = req.body;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
        return res.status(404).json({
            success: false,
            message: "Doctor not found"
        });
        }

        await Doctor.findByIdAndUpdate(
            doctorId,
            {
                status: "approved"
            }
        );

        res.json({
            success: true,
            message: "Doctor approved"
        });

});


router.get(
  "/dashboard",
  adminAuth,
  async (req, res) => {

    try {

      const totalUsers =
        await User.countDocuments();

      const totalDoctors =
        await Doctor.countDocuments({
          status: "approved"
        });

      const appointments =
        await Appointment.find({});

      const totalAppointments =
        appointments.length;

      const totalRevenue =
        appointments.reduce(
          (sum, item) =>
            item.status !== "Cancelled"
              ? sum + item.amount
              : sum,
          0
        );

      res.json({
        success: true,
        dashboardData: {
          totalUsers,
          totalDoctors,
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


router.get(
  "/doctors",
  adminAuth,
  async (req, res) => {

    try {

      const doctors =
        await Doctor.find({})
                    .select("-password");

      res.json({
        success: true,
        doctors
      });

    } catch (error) {

      res.json({
        success: false,
        message: error.message
      });

    }

});

router.get(
  "/pending-doctors",
  adminAuth,
  async (req, res) => {

    const doctors =
      await Doctor.find({
        status: "pending"
      }).select("-password");

    res.json({
      success: true,
      doctors
    });

});


router.get(
  "/appointments",
  adminAuth,
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({})
          .populate("userId")
          .populate("doctorId");

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


router.post(
  "/remove-doctor",
  adminAuth,
  async (req, res) => {

    const { doctorId } = req.body;
    
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
    return res.status(404).json({
        success: false,
        message: "Doctor not found"
    });
    }

    findByIdAndUpdate(doctorId,
        {
            available: false
        }
    )

    res.json({
      success: true,
      message: "Doctor removed"
    });

});


module.exports = router;