const mongoose = require("mongoose");

const userApplicationsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
});

module.exports = mongoose.model("UserApplications", userApplicationsSchema);
