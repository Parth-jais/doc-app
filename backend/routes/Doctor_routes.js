const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {

    const doctor = await Doctor.create(req.body);

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

module.exports = router;