const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, default: "", trim: true },
  dateOfBirth: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", patientSchema);