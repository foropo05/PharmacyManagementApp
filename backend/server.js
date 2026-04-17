const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Inventory = require("./models/Inventory");

const seedInventory = async () => {
  const meds = [
    "tylenol",
    "ibuprofen",
    "amoxicillin",
    "paracetamol",
    "aspirin",
    "cetirizine",
    "metformin",
    "atorvastatin",
    "lisinopril",
    "omeprazole",
    "azithromycin",
    "salbutamol"
  ];

  for (const med of meds) {
    const exists = await Inventory.findOne({ medicationName: med });

    if (!exists) {
      await Inventory.create({
        medicationName: med,
        stock: 10,
        minimumStock: 3
      });
    }
  }

  // Normalize legacy bad data from earlier versions.
  await Inventory.updateMany(
    { stock: { $lt: 0 } },
    { $set: { stock: 0 } }
  );

  console.log("Inventory seed check complete");
};

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/chat", chatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedInventory();
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Pharmacy Management Backend is running");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});