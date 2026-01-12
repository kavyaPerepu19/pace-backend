const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const UserApplications = require("../models/UserApplications");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // create empty applications list
    await UserApplications.create({
      email,
      applications: [],
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      // console.log("User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // console.log("Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
