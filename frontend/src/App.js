import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import { FaComments, FaPaperPlane, FaPencilAlt, FaPlus, FaRobot, FaTimes, FaTrashAlt } from "react-icons/fa";
import "./App.css";

const API_BASE = "http://localhost:5000";

function AppHeader({ currentUser, onLogout }) {
  return (
    <header className="topbar-wrap">
      <div className="topbar">
        <h1 className="brand-title">Pharmacy Management</h1>
        <nav className="topnav">
          <NavLink to="/inventory/view" className="topnav-link">
            Medications
          </NavLink>
          <NavLink to="/patients/view" className="topnav-link">
            Patients
          </NavLink>
          <NavLink to="/prescriptions/view" className="topnav-link">
            Prescriptions
          </NavLink>
          <NavLink to="/reports" className="topnav-link">
            Reports
          </NavLink>
        </nav>
      </div>
      <div className="topbar-sub">
        <span>
          Signed in as {currentUser.name} ({currentUser.email})
        </span>
        <button type="button" className="ghost-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

function AuthScreen({ authMode, authForm, setAuthForm, setAuthMode, authError, authInfo, onSubmit }) {
  return (
    <div className="auth-page">
      <h1 className="auth-brand">Pharmacy Management App</h1>
      <div className="auth-card">
        <h2>{authMode === "login" ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={onSubmit}>
          {authMode === "register" && (
            <input
              placeholder="Full Name"
              value={authForm.name}
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          />
          <button type="submit">{authMode === "login" ? "Sign In" : "Sign Up"}</button>
        </form>

        <p>
          {authMode === "login" ? "Need an account? " : "Already have an account? "}
          <button
            type="button"
            className="text-btn"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>

        {authInfo && <p className="msg-ok">{authInfo}</p>}
        {authError && <p className="msg-error">{authError}</p>}
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="section-card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ViewTools({ lineText, onAdd }) {
  return (
    <div className="section-tools">
      <p className="section-line">{lineText}</p>
      <button type="button" className="secondary-btn" onClick={onAdd}>
        <FaPlus aria-hidden="true" />
        <span>Add</span>
      </button>
    </div>
  );
}

function InventoryView({ inventory, onAdd, onEdit, onDelete }) {
  return (
    <SectionCard title="Medications - View">
      <ViewTools lineText="View medications" onAdd={onAdd} />
      <table className="data-table">
        <thead>
          <tr>
            <th>Medication</th>
            <th>Stock</th>
            <th>Minimum</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item._id}>
              <td>{item.medicationName}</td>
              <td>{item.stock}</td>
              <td>{item.minimumStock}</td>
              <td>{item.stock <= item.minimumStock ? "Low Stock" : "OK"}</td>
              <td>
                <button type="button" className="secondary-btn" onClick={() => onEdit(item._id)}>
                  <FaPencilAlt aria-hidden="true" />
                  <span>Edit</span>
                </button>
                <button type="button" className="danger-btn" onClick={() => onDelete(item._id)}>
                  <FaTrashAlt aria-hidden="true" />
                  <span>Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

function InventoryAdd({ onAdd }) {
  const [form, setForm] = useState({ medicationName: "", stock: "", minimumStock: "" });

  return (
    <SectionCard title="Medications - Add">
      <form
        className="grid-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await onAdd(form);
          setForm({ medicationName: "", stock: "", minimumStock: "" });
        }}
      >
        <input
          placeholder="Medication Name"
          value={form.medicationName}
          onChange={(e) => setForm({ ...form, medicationName: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Minimum Stock"
          value={form.minimumStock}
          onChange={(e) => setForm({ ...form, minimumStock: e.target.value })}
        />
        <button type="submit">Save Medication</button>
      </form>
    </SectionCard>
  );
}

function InventoryEdit({ inventory, onEdit, onDelete }) {
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(location.state?.selectedId || "");
  const selected = useMemo(
    () => inventory.find((item) => item._id === selectedId) || null,
    [inventory, selectedId]
  );
  const [form, setForm] = useState({ medicationName: "", stock: "", minimumStock: "" });

  useEffect(() => {
    if (selected) {
      setForm({
        medicationName: selected.medicationName || "",
        stock: String(selected.stock ?? ""),
        minimumStock: String(selected.minimumStock ?? "")
      });
    }
  }, [selected]);

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    }
  }, [location.state]);

  return (
    <SectionCard title="Medications - Edit">
      <div className="grid-form">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select Medication</option>
          {inventory.map((item) => (
            <option key={item._id} value={item._id}>
              {item.medicationName}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <form
          className="grid-form"
          onSubmit={async (e) => {
            e.preventDefault();
            await onEdit(selected._id, form);
          }}
        >
          <input
            value={form.medicationName}
            onChange={(e) => setForm({ ...form, medicationName: e.target.value })}
            required
          />
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <input
            type="number"
            value={form.minimumStock}
            onChange={(e) => setForm({ ...form, minimumStock: e.target.value })}
          />
          <button type="submit">Update Medication</button>
          <button type="button" className="danger-btn" onClick={() => onDelete(selected._id)}>
            <FaTrashAlt aria-hidden="true" />
            <span>Delete Medication</span>
          </button>
        </form>
      )}
    </SectionCard>
  );
}

function PatientsView({ patients, onAdd, onEdit, onDelete }) {
  return (
    <SectionCard title="Patients - View">
      <ViewTools lineText="View patients" onAdd={onAdd} />
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>DOB</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td>{patient.fullName}</td>
              <td>{patient.phone || "-"}</td>
              <td>{patient.dateOfBirth || "-"}</td>
              <td>
                <button type="button" className="secondary-btn" onClick={() => onEdit(patient._id)}>
                  <FaPencilAlt aria-hidden="true" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => onDelete(patient._id)}
                >
                  <FaTrashAlt aria-hidden="true" />
                  <span>Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

function PatientsAdd({ onAdd }) {
  const [form, setForm] = useState({ fullName: "", phone: "", dateOfBirth: "" });

  return (
    <SectionCard title="Patients - Add">
      <form
        className="grid-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await onAdd(form);
          setForm({ fullName: "", phone: "", dateOfBirth: "" });
        }}
      >
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
        />
        <button type="submit">Save Patient</button>
      </form>
    </SectionCard>
  );
}

function PatientsEdit({ patients, onEdit, onDelete }) {
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(location.state?.selectedId || "");
  const selected = useMemo(
    () => patients.find((patient) => patient._id === selectedId) || null,
    [patients, selectedId]
  );
  const [form, setForm] = useState({ fullName: "", phone: "", dateOfBirth: "" });

  useEffect(() => {
    if (selected) {
      setForm({
        fullName: selected.fullName || "",
        phone: selected.phone || "",
        dateOfBirth: selected.dateOfBirth || ""
      });
    }
  }, [selected]);

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    }
  }, [location.state]);

  return (
    <SectionCard title="Patients - Edit">
      <div className="grid-form">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.fullName}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <form
          className="grid-form"
          onSubmit={async (e) => {
            e.preventDefault();
            await onEdit(selected._id, form);
          }}
        >
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />
          <button type="submit">Update Patient</button>
          <button type="button" className="danger-btn" onClick={() => onDelete(selected._id)}>
            <FaTrashAlt aria-hidden="true" />
            <span>Delete Patient</span>
          </button>
        </form>
      )}
    </SectionCard>
  );
}

function PrescriptionsView({ prescriptions, onAdd, onEdit, onDispense, onDelete }) {
  return (
    <SectionCard title="Prescriptions - View">
      <ViewTools lineText="View prescriptions" onAdd={onAdd} />
      <table className="data-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => (
            <tr key={prescription._id}>
              <td>{prescription.patientName}</td>
              <td>{prescription.medication}</td>
              <td>{prescription.dosage}</td>
              <td>{prescription.quantity}</td>
              <td>{prescription.status}</td>
              <td>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => onEdit(prescription._id)}
                >
                  <FaPencilAlt aria-hidden="true" />
                  <span>Edit</span>
                </button>
                {prescription.status !== "Dispensed" && (
                  <button type="button" onClick={() => onDispense(prescription._id)}>
                    Dispense
                  </button>
                )}
                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => onDelete(prescription._id)}
                >
                  <FaTrashAlt aria-hidden="true" />
                  <span>Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

function PrescriptionsAdd({ onAdd, patients, inventory }) {
  const [form, setForm] = useState({ patientName: "", medication: "", dosage: "", quantity: "" });

  return (
    <SectionCard title="Prescriptions - Add">
      <form
        className="grid-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await onAdd(form);
          setForm({ patientName: "", medication: "", dosage: "", quantity: "" });
        }}
      >
        <input
          placeholder="Patient Name"
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          list="patients-for-prescriptions"
          required
        />
        <datalist id="patients-for-prescriptions">
          {patients.map((patient) => (
            <option key={patient._id} value={patient.fullName} />
          ))}
        </datalist>

        <select
          value={form.medication}
          onChange={(e) => setForm({ ...form, medication: e.target.value })}
          required
        >
          <option value="">Select Medication</option>
          {inventory.map((item) => (
            <option key={item._id} value={item.medicationName}>
              {item.medicationName}
            </option>
          ))}
        </select>

        <input
          placeholder="Dosage"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button type="submit">Save Prescription</button>
      </form>
    </SectionCard>
  );
}

function PrescriptionsEdit({ prescriptions, inventory, onEdit, onDelete }) {
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(location.state?.selectedId || "");
  const selected = useMemo(
    () => prescriptions.find((prescription) => prescription._id === selectedId) || null,
    [prescriptions, selectedId]
  );
  const [form, setForm] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    quantity: "",
    status: "Pending"
  });

  useEffect(() => {
    if (selected) {
      setForm({
        patientName: selected.patientName || "",
        medication: selected.medication || "",
        dosage: selected.dosage || "",
        quantity: String(selected.quantity ?? ""),
        status: selected.status || "Pending"
      });
    }
  }, [selected]);

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    }
  }, [location.state]);

  return (
    <SectionCard title="Prescriptions - Edit">
      <div className="grid-form">
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">Select Prescription</option>
          {prescriptions.map((prescription) => (
            <option key={prescription._id} value={prescription._id}>
              {prescription.patientName} - {prescription.medication}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <form
          className="grid-form"
          onSubmit={async (e) => {
            e.preventDefault();
            await onEdit(selected._id, form);
          }}
        >
          <input
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            required
          />
          <select
            value={form.medication}
            onChange={(e) => setForm({ ...form, medication: e.target.value })}
            required
          >
            <option value="">Select Medication</option>
            {inventory.map((item) => (
              <option key={item._id} value={item.medicationName}>
                {item.medicationName}
              </option>
            ))}
          </select>
          <input
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            required
          />
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="Pending">Pending</option>
            <option value="Dispensed">Dispensed</option>
          </select>
          <button type="submit">Update Prescription</button>
          <button type="button" className="danger-btn" onClick={() => onDelete(selected._id)}>
            <FaTrashAlt aria-hidden="true" />
            <span>Delete Prescription</span>
          </button>
        </form>
      )}
    </SectionCard>
  );
}

function ReportsPage({ prescriptions, patients, inventory }) {
  const dispensedCount = prescriptions.filter((p) => p.status === "Dispensed").length;
  const pendingCount = prescriptions.filter((p) => p.status !== "Dispensed").length;
  const lowStockCount = inventory.filter((item) => item.stock <= item.minimumStock).length;

  return (
    <SectionCard title="Reports">
      <div className="stats-grid">
        <article className="stat-box">
          <h3>Total Patients</h3>
          <p>{patients.length}</p>
        </article>
        <article className="stat-box">
          <h3>Pending Prescriptions</h3>
          <p>{pendingCount}</p>
        </article>
        <article className="stat-box">
          <h3>Dispensed Prescriptions</h3>
          <p>{dispensedCount}</p>
        </article>
        <article className="stat-box">
          <h3>Low Stock Medications</h3>
          <p>{lowStockCount}</p>
        </article>
      </div>
    </SectionCard>
  );
}

function ChatWidget({ isOpen, onOpen, onClose, messages, chatInput, chatLoading, onInputChange, onSend }) {
  if (!isOpen) {
    return (
      <button type="button" className="chat-fab" onClick={onOpen} aria-label="Open chat">
        <FaComments aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <h3>
          <FaRobot aria-hidden="true" />
          <span>PharmacyBot</span>
        </h3>
        <button type="button" className="chat-close-btn" onClick={onClose} aria-label="Close chat">
          <FaTimes aria-hidden="true" />
        </button>
      </div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <p
            key={`${msg.role}-${index}`}
            className={msg.role === "user" ? "chat-msg chat-msg-user" : "chat-msg chat-msg-assistant"}
          >
            {msg.text}
          </p>
        ))}
      </div>

      <form className="chat-form" onSubmit={onSend}>
        <input
          placeholder="Ask me anything..."
          value={chatInput}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <button type="submit" disabled={chatLoading} className="chat-send-btn" aria-label="Send message">
          <FaPaperPlane aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

function AppShell({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm PharmacyBot. Ask me about patients, medications, prescriptions, or reports!"
    }
  ]);

  const fetchPrescriptions = useCallback(async () => {
    const res = await fetch(`${API_BASE}/api/prescriptions`);
    const data = await res.json();
    setPrescriptions(data);
  }, []);

  const fetchInventory = useCallback(async () => {
    const res = await fetch(`${API_BASE}/api/inventory`);
    const data = await res.json();
    setInventory(data);
  }, []);

  const fetchPatients = useCallback(async () => {
    const res = await fetch(`${API_BASE}/api/patients`);
    const data = await res.json();
    setPatients(data);
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchPrescriptions(), fetchInventory(), fetchPatients()]);
  }, [fetchPrescriptions, fetchInventory, fetchPatients]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const createInventory = async (payload) => {
    await fetch(`${API_BASE}/api/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await fetchInventory();
    navigate("/inventory/view");
  };

  const updateInventory = async (id, payload) => {
    await fetch(`${API_BASE}/api/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await fetchInventory();
    navigate("/inventory/view");
  };

  const deleteInventory = async (id) => {
    if (!window.confirm("Delete this medication?")) {
      return;
    }

    await fetch(`${API_BASE}/api/inventory/${id}`, {
      method: "DELETE"
    });
    await fetchInventory();
    navigate("/inventory/view");
  };

  const openInventoryAdd = () => {
    navigate("/inventory/add");
  };

  const openInventoryEdit = (id) => {
    navigate("/inventory/edit", { state: { selectedId: id } });
  };

  const createPatient = async (payload) => {
    await fetch(`${API_BASE}/api/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await fetchPatients();
    navigate("/patients/view");
  };

  const updatePatient = async (id, payload) => {
    await fetch(`${API_BASE}/api/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await fetchPatients();
    navigate("/patients/view");
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) {
      return;
    }

    await fetch(`${API_BASE}/api/patients/${id}`, {
      method: "DELETE"
    });
    await fetchPatients();
    navigate("/patients/view");
  };

  const openPatientAdd = () => {
    navigate("/patients/add");
  };

  const openPatientEdit = (id) => {
    navigate("/patients/edit", { state: { selectedId: id } });
  };

  const createPrescription = async (payload) => {
    await fetch(`${API_BASE}/api/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await refreshAll();
    navigate("/prescriptions/view");
  };

  const updatePrescription = async (id, payload) => {
    await fetch(`${API_BASE}/api/prescriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await fetchPrescriptions();
    navigate("/prescriptions/view");
  };

  const deletePrescription = async (id) => {
    if (!window.confirm("Delete this prescription?")) {
      return;
    }

    await fetch(`${API_BASE}/api/prescriptions/${id}`, {
      method: "DELETE"
    });
    await fetchPrescriptions();
    navigate("/prescriptions/view");
  };

  const openPrescriptionAdd = () => {
    navigate("/prescriptions/add");
  };

  const openPrescriptionEdit = (id) => {
    navigate("/prescriptions/edit", { state: { selectedId: id } });
  };

  const dispensePrescription = async (id) => {
    const res = await fetch(`${API_BASE}/api/prescriptions/${id}/dispense`, {
      method: "PUT"
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to dispense prescription");
      return;
    }

    await refreshAll();
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    const message = chatInput.trim();

    if (!message) {
      return;
    }

    setChatMessages((prev) => [...prev, { role: "user", text: message }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat/help`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();
      const reply = data.reply || "I could not generate a response.";
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Server unavailable. Please try again." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <AppHeader currentUser={currentUser} onLogout={onLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/inventory/view" replace />} />

          <Route
            path="/inventory/view"
            element={
              <InventoryView
                inventory={inventory}
                onAdd={openInventoryAdd}
                onEdit={openInventoryEdit}
                onDelete={deleteInventory}
              />
            }
          />
          <Route path="/inventory/add" element={<InventoryAdd onAdd={createInventory} />} />
          <Route
            path="/inventory/edit"
            element={
              <InventoryEdit
                inventory={inventory}
                onEdit={updateInventory}
                onDelete={deleteInventory}
              />
            }
          />

          <Route
            path="/patients/view"
            element={
              <PatientsView
                patients={patients}
                onAdd={openPatientAdd}
                onEdit={openPatientEdit}
                onDelete={deletePatient}
              />
            }
          />
          <Route path="/patients/add" element={<PatientsAdd onAdd={createPatient} />} />
          <Route
            path="/patients/edit"
            element={
              <PatientsEdit patients={patients} onEdit={updatePatient} onDelete={deletePatient} />
            }
          />

          <Route
            path="/prescriptions/view"
            element={
              <PrescriptionsView
                prescriptions={prescriptions}
                onAdd={openPrescriptionAdd}
                onEdit={openPrescriptionEdit}
                onDispense={dispensePrescription}
                onDelete={deletePrescription}
              />
            }
          />
          <Route
            path="/prescriptions/add"
            element={<PrescriptionsAdd onAdd={createPrescription} patients={patients} inventory={inventory} />}
          />
          <Route
            path="/prescriptions/edit"
            element={
              <PrescriptionsEdit
                prescriptions={prescriptions}
                inventory={inventory}
                onEdit={updatePrescription}
                onDelete={deletePrescription}
              />
            }
          />

          <Route
            path="/reports"
            element={<ReportsPage prescriptions={prescriptions} patients={patients} inventory={inventory} />}
          />

          <Route path="*" element={<Navigate to="/inventory/view" replace />} />
        </Routes>
      </main>

      <ChatWidget
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        chatInput={chatInput}
        chatLoading={chatLoading}
        onInputChange={setChatInput}
        onSend={sendChatMessage}
      />
    </div>
  );
}

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || "");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");

  const isAuthenticated = Boolean(authToken && currentUser);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthInfo("");

    const endpoint = authMode === "login" ? "login" : "register";
    const payload =
      authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password };

    const res = await fetch(`${API_BASE}/api/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      setAuthError(data.error || "Authentication failed");
      return;
    }

    if (authMode === "register") {
      setAuthForm({ name: "", email: authForm.email, password: "" });
      setAuthMode("login");
      setAuthInfo("Registration successful. Please log in.");
      return;
    }

    setAuthToken(data.token);
    setCurrentUser(data.user);
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    setAuthForm({ name: "", email: "", password: "" });
  };

  const logout = () => {
    setAuthToken("");
    setCurrentUser(null);
    setAuthMode("login");
    setAuthInfo("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen
        authMode={authMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        setAuthMode={setAuthMode}
        authError={authError}
        authInfo={authInfo}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <BrowserRouter>
      <AppShell currentUser={currentUser} onLogout={logout} />
    </BrowserRouter>
  );
}

export default App;
