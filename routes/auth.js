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

    // 1️⃣ Verify user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2️⃣ Fetch user's applications
    const userApps = await UserApplications.findOne({ email });

    // 3️⃣ Pick most recent application
    let applicationId = null;
    if (userApps?.applications?.length) {
      applicationId =
        userApps.applications[userApps.applications.length - 1];
    }

    // 4️⃣ Send everything frontend needs
    res.json({
      success: true,
      email,
      applicationId, // 🔑 THIS FIXES EVERYTHING
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
