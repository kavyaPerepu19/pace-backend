const express = require("express");
const Application = require("../models/Application");

const router = express.Router();



// router.post("/save", async (req, res) => {
//   try {
//     const { applicationId, data } = req.body;

//     let application;

//     if (applicationId) {
//       application = await Application.findByIdAndUpdate(
//         applicationId,
//         { $set: data },   // ✅ CRITICAL FIX
//         { new: true, upsert: false }
//       );
//     } else {
//       application = await Application.create(data);
//     }

//     res.json({
//       success: true,
//       applicationId: application._id,
//       application,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });



/* ================= GET APPLICATION ================= */
router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    res.json(application);
  } catch {
    res.status(404).json({ error: "Application not found" });
  }
});

router.get("/by-email/:email", async (req, res) => {
  try {
    const record = await UserApplications.findOne({
      email: req.params.email,
    }).populate("applications");

    if (!record) {
      return res.json({ applications: [] });
    }

    res.json({ applications: record.applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= SAVE / UPDATE ================= */
router.post("/save", async (req, res) => {
  try {
    const { applicationId, data, email } = req.body;

    let application;

    if (applicationId) {
      application = await Application.findByIdAndUpdate(
        applicationId,
        { $set: data },
        { new: true }
      );
    } else {
      application = await Application.create(data);

      // 🔑 Attach application to user email
      if (email) {
        await UserApplications.findOneAndUpdate(
          { email },
          { $push: { applications: application._id } },
          { upsert: true }
        );
      }
    }

    res.json({
      success: true,
      applicationId: application._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
