const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const Inventory = require("../models/Inventory");

// CREATE prescription
router.post("/", async (req, res) => {
  try {
    const newPrescription = new Prescription(req.body);
    const saved = await newPrescription.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all prescriptions
router.get("/", async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (dispense)
router.put("/:id/dispense", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    const item = await Inventory.findOne({
      medicationName: prescription.medication
    });

    // check stock
    if (!item || item.stock < prescription.quantity) {
      return res.status(400).json({
        error: "Not enough stock to dispense"
      });
    }

    // reduce stock
    item.stock -= prescription.quantity;
    await item.save();

    // update prescription
    prescription.status = "Dispensed";
    await prescription.save();

    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;