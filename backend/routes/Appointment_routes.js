const express = require("express");
const Doctor = require("../models/Doctor.js");
const Appointment = require("../models/Appointment.js");
const {authUser} = require("../middleware/auth.js");
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

    let slots_booked = doctor["slots_booked"];
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {

      return res.json({
          success: false,
          message: "Slot not available"
      });
    }

    if(!slots_booked[slotDate]){
      slots_booked[slotDate]=[];
    }
    slots_booked[slotDate].push(slotTime);

    const appointment = await Appointment.create({
      userId: req.userId,
      doctorId,
      slotDate,
      slotTime,
      amount: doctor.fees
    });

    await Doctor.findByIdAndUpdate(
    doctorId,
    { slots_booked }
    );

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


router.get("/my-appointments", authUser, async (req, res) => {

  try {

    const appointments = await Appointment.find({
      userId: req.userId
    }).populate("doctorId");

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


router.post("/cancel", authUser, async (req, res) => {
  try {

    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(
      appointmentId
    );

    if (!appointment) {
      return res.json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (appointment.userId.toString() !== req.userId) {
      return res.json({
        success: false,
        message: "Unauthorized"
      });
    }

    slotDate = appointment.slotDate;
    slotTime = appointment.slotTime;
    const doctor = await Doctor.findById(
      appointment.doctorId
    );

    let slots_booked = doctor.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
        item => item !== slotTime
    );

    if (slots_booked[slotDate].length === 0) {
      delete slots_booked[slotDate];
    }

    await Doctor.findByIdAndUpdate(
      doctor._id,
      { slots_booked }
    );

    
    appointment.status = "Cancelled";

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment Cancelled"
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }
});

module.exports = router;