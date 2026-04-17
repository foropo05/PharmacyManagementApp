const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/inventory", inventoryRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

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