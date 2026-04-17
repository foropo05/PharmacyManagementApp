const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  medicationName: { type: String, required: true },
  stock: { type: Number, required: true },
  minimumStock: { type: Number, default: 5 }
});

module.exports = mongoose.model("Inventory", inventorySchema);