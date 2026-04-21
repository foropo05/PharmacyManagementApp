const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// CREATE patient
router.post("/", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const saved = await patient.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT patient
router.put("/:id", async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE patient
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;