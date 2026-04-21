const express = require("express");

const router = express.Router();

const pickResponse = (responses) => responses[Math.floor(Math.random() * responses.length)];

const getHelpResponse = (message) => {
  const text = String(message || "").toLowerCase();

  if (!text.trim()) {
    return pickResponse([
      "Ask me about patients, medications, prescriptions, reports, or dispensing.",
      "Try questions like 'how do I add a patient' or 'how do I delete a medication'."
    ]);
  }

  if (text.includes("patient") && (text.includes("add") || text.includes("create"))) {
    return pickResponse([
      "Open Patients, then click Add, fill in the full name, phone, and date of birth, then save.",
      "Use the Patients section and choose Add to create a new patient record."
    ]);
  }

  if (text.includes("patient") && (text.includes("edit") || text.includes("update"))) {
    return pickResponse([
      "Open Patients, go to Edit, select the patient, change the details, and save.",
      "Choose a patient from Patients > Edit, update the fields, then click Update Patient."
    ]);
  }

  if (text.includes("patient") && (text.includes("delete") || text.includes("remove"))) {
    return pickResponse([
      "Open Patients and click Delete beside the patient you want to remove.",
      "Use Patients > View or Edit, then press Delete for the selected patient."
    ]);
  }

  if (text.includes("medication") || text.includes("inventory") || text.includes("stock")) {
    if (text.includes("add")) {
      return pickResponse([
        "Open Medications, click Add, enter the medication name, stock, and minimum stock, then save.",
        "Go to Medications > Add to create a new inventory item."
      ]);
    }

    if (text.includes("edit") || text.includes("update")) {
      return pickResponse([
        "Go to Medications > Edit, select the medication, change the values, then click Update Medication.",
        "Open the Medications edit page, choose an item, edit it, and save your changes."
      ]);
    }

    if (text.includes("delete") || text.includes("remove")) {
      return pickResponse([
        "Open Medications and click Delete beside the item you want to remove.",
        "Use the Medications view page and press Delete for the selected medication."
      ]);
    }

    return pickResponse([
      "Check the Medications page. Stock at or below minimum stock is treated as low stock.",
      "Inventory helps you track medication quantities and low-stock alerts."
    ]);
  }

  if (text.includes("prescription")) {
    if (text.includes("add") || text.includes("create")) {
      return pickResponse([
        "Open Prescriptions, click Add, choose a patient and medication, enter dosage and quantity, then save.",
        "Create a prescription from Prescriptions > Add by filling the form and submitting it."
      ]);
    }

    if (text.includes("edit") || text.includes("update")) {
      return pickResponse([
        "Open Prescriptions > Edit, select the prescription, change the details, and update it.",
        "Choose a prescription from the Edit page, modify the fields, then click Update Prescription."
      ]);
    }

    if (text.includes("delete") || text.includes("remove")) {
      return pickResponse([
        "Open Prescriptions and click Delete beside the prescription you want to remove.",
        "Use the Prescriptions view or edit page, then press Delete for the selected item."
      ]);
    }

    if (text.includes("dispense") || text.includes("dispensed")) {
      return pickResponse([
        "Click Dispense beside a pending prescription. The system checks stock before updating it.",
        "Dispense a prescription from the View page; it will reduce inventory if enough stock is available."
      ]);
    }

    return pickResponse([
      "Create or manage prescriptions from the Prescriptions section.",
      "I can help with adding, editing, deleting, and dispensing prescriptions."
    ]);
  }

  if (text.includes("report")) {
    return pickResponse([
      "Open Reports to see totals for patients, pending and dispensed prescriptions, and low stock medications.",
      "The Reports page summarizes patient counts, prescription status, and stock warnings."
    ]);
  }

  if (text.includes("dispense") || text.includes("dispensed")) {
    return pickResponse([
      "Click Dispense beside a pending prescription. The system reduces inventory and blocks dispensing when stock is not enough.",
      "Use the Dispense button in Prescriptions View to mark a prescription as dispensed."
    ]);
  }

  if (text.includes("login") || text.includes("register") || text.includes("account")) {
    return pickResponse([
      "Use the login section at the top. Register first if you are new, then log in with your email and password.",
      "If you do not have an account, sign up first, then sign in with your credentials."
    ]);
  }

  return pickResponse([
    "I can help with patients, medications, prescriptions, reports, and dispensing.",
    "Try asking me how to add, edit, or delete a patient, medication, or prescription."
  ]);
};

router.post("/help", (req, res) => {
  const { message } = req.body;
  return res.json({ reply: getHelpResponse(message) });
});

module.exports = router;