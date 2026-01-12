const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  personalBackground: Object,
  programOfStudy: Object,
  additionalInformation: Object,
  previousEducation: Array,
  employmentHistory: Object,

  testScores: {
    englishTestFile: String,
    gmatFile: String,
    greFile: String,
  },

  essay: {
    fileName: String,
  },

  resume: {
    fileName: String,
  },

  recommendations: Array,

  signature: {
    fullName: String,
    signedAt: Date,
  },

  status: {
    type: String,
    default: "IN_PROGRESS",
  },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
