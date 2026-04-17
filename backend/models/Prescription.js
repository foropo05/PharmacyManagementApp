const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);