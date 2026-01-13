const express = require("express");
const Application = require("../models/Application");
const UserApplications = require("../models/UserApplications");

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


router.post("/save", async (req, res) => {
  try {
    const { applicationId, data } = req.body;
    const email = data?.email;

    let application;

    if (applicationId) {
      application = await Application.findByIdAndUpdate(
        applicationId,
        { $set: data },
        { new: true }
      );
    } else {
      application = await Application.create(data);

      if (email) {
        await UserApplications.findOneAndUpdate(
          { email },
          { $addToSet: { applications: application._id } }, // ✅ ObjectId only
          { upsert: true }
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/create", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // 1️⃣ Create blank application
    const application = await Application.create({
      status: "IN_PROGRESS",
    });

    // 2️⃣ Attach to user
    await UserApplications.findOneAndUpdate(
      { email },
      { $push: { applications: application._id } },
      { upsert: true }
    );

    // 3️⃣ Return ONLY the new applicationId
    res.json({
      success: true,
      applicationId: application._id,
    });

  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({ error: "Application ID required" });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      {
        submitted: true,
        submittedAt: new Date(),
        status: "SUBMITTED",
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;
