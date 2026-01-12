const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();


app.get("/", (req, res) => {
  res.send("Pace Application Tracker Backend is running");
});
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://pkks:welcome2024@mycluster.5dby58b.mongodb.net/pace-app?retryWrites=true&w=majority&appName=myCluster");

app.use("/api/application", applicationRoutes);
app.use("/api/auth", require("./routes/auth"));



app.listen(5000, () => {
  console.log("Server running on port 5000");
});

