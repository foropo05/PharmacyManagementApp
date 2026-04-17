const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

// CREATE inventory item
router.post("/", async (req, res) => {
  try {
    const item = new Inventory(req.body);
    const saved = await item.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all inventory
router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;