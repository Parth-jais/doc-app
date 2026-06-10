// Add these two lines at the VERY top of seclearrver.js
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '1.0.0.1']); // Forces Node to use Cloudflare directly

require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/User_routes.js");
const doctorRouter = require("./routes/Doctor_routes.js");
const appointmentRouter = require("./routes/Appointment_routes.js");

const app=express();
const connectDB = require("./config/db.js");

connectDB();

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointmentRouter);

app.get("/",(req,res)=>{res.send("Doctor appointment API running")});

app.listen(5000, ()=>{console.log("Server running on port 5000")});