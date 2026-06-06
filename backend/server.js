const express = require("express");

const app=express();
app.use(express.json());

app.get("/",(req,res)=>{res.send("Doctor appointment API running")});

app.get("/api/test", (req, res) => {
  res.send("API is working babbyyy");
});

app.get("/api/doctor", (req, res) => {
  res.json({
    name: "Dr. Sharma",
    speciality: "Cardiologist",
    experience: 10
  });
});

app.post("/api/register", (req, res) => {
    console.log(req.body);
    res.send("User registered");
});

app.listen(5000, ()=>{console.log("Server running on port 5000")});