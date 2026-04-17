const express = require("express");

const router = express.Router();

const getHelpResponse = (message) => {
  const text = String(message || "").toLowerCase();

  if (!text.trim()) {
    return "Ask me about prescriptions, inventory, dispensing, or low stock alerts.";
  }

  if (text.includes("low stock") || text.includes("stock") || text.includes("inventory")) {
    return "Check the Inventory section. Any item with stock less than or equal to minimum stock is marked LOW STOCK.";
  }

  if (text.includes("dispense") || text.includes("dispensed")) {
    return "To dispense, click Dispense beside a pending prescription. The system reduces inventory and blocks dispensing when stock is not enough.";
  }

  if (text.includes("prescription") || text.includes("patient")) {
    return "Create a prescription by entering patient details, selecting a medication from the dropdown, adding dosage and quantity, then click Add Prescription.";
  }

  if (text.includes("login") || text.includes("register") || text.includes("account")) {
    return "Use the login section at the top. Register first if you are new, then log in with your email and password.";
  }

  return "I can help with login, adding prescriptions, dispensing medication, and inventory stock checks. What would you like to do?";
};

router.post("/help", (req, res) => {
  const { message } = req.body;
  return res.json({ reply: getHelpResponse(message) });
});

module.exports = router;