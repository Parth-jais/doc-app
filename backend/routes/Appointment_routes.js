const express = require("express");
const Doctor = require("../models/Doctor.js");
const Appointment = require("../models/Appointment.js");
const authUser = require("../middleware/auth.js");
const router = express.Router();

router.post("/book", authUser, async (req, res) => {

  try {

    const { doctorId, slotDate, slotTime } = req.body;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    const appointment = await Appointment.create({
      userId: req.userId,
      doctorId,
      slotDate,
      slotTime,
      amount: doctor.fees
    });

    res.json({
      success: true,
      appointment
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }

});

module.exports = router;