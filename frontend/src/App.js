import React, { useEffect, useState } from "react";

function App() {
  const API_BASE = "http://localhost:5000";
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryForm, setInventoryForm] = useState({
    medicationName: "",
    stock: "",
    minimumStock: ""
  });
  const [form, setForm] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    quantity: ""
  });
  const medicationOptions = [...new Set(inventory.map((item) => item.medicationName))];

  const fetchPrescriptions = () => {
    fetch(`${API_BASE}/api/prescriptions`)
      .then((res) => res.json())
      .then((data) => setPrescriptions(data));
  };

  const fetchInventory = () => {
    fetch(`${API_BASE}/api/inventory`)
      .then((res) => res.json())
      .then((data) => setInventory(data));
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/api/prescriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({
      patientName: "",
      medication: "",
      dosage: "",
      quantity: ""
    });

    fetchPrescriptions();
    fetchInventory();
  };

  const dispense = async (id) => {
    const res = await fetch(`${API_BASE}/api/prescriptions/${id}/dispense`, {
      method: "PUT"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    fetchPrescriptions();
    fetchInventory();
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/api/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inventoryForm)
    });

    setInventoryForm({
      medicationName: "",
      stock: "",
      minimumStock: ""
    });

    fetchInventory();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pharmacy Management App</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Patient Name"
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
        />
        <select
          value={form.medication}
          onChange={(e) => setForm({ ...form, medication: e.target.value })}
        >
          <option value="">Select Medication</option>
          {medicationOptions.map((med) => (
            <option key={med} value={med}>
              {med}
            </option>
          ))}
        </select>
        <input
          placeholder="Dosage"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <button type="submit">Add Prescription</button>
      </form>

      <h2>Prescriptions</h2>
      <ul>
        {prescriptions.map((p) => (
          <li key={p._id}>
            {p.patientName} - {p.medication} ({p.status})
            {p.status !== "Dispensed" && (
              <button onClick={() => dispense(p._id)}>Dispense</button>
            )}
          </li>
        ))}
      </ul>

      <h2>Inventory</h2>

      <form onSubmit={handleInventorySubmit}>
        <input
          placeholder="Medication Name"
          value={inventoryForm.medicationName}
          onChange={(e) =>
            setInventoryForm({ ...inventoryForm, medicationName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Stock"
          value={inventoryForm.stock}
          onChange={(e) =>
            setInventoryForm({ ...inventoryForm, stock: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Minimum Stock"
          value={inventoryForm.minimumStock}
          onChange={(e) =>
            setInventoryForm({ ...inventoryForm, minimumStock: e.target.value })
          }
        />
        <button type="submit">Add Inventory</button>
      </form>

      <ul>
        {inventory.map((item) => (
          <li key={item._id}>
            {item.medicationName} - Stock: {item.stock}
            {item.stock <= item.minimumStock && (
              <span style={{ color: "red", marginLeft: "10px" }}>
                LOW STOCK ⚠
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;