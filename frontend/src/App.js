import React, { useEffect, useState } from "react";

function App() {
  const API_BASE = "http://localhost:5000";
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || "");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");

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

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hi, I am your pharmacy help assistant. Ask me anything." }
  ]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/api/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ patientName: "", medication: "", dosage: "", quantity: "" });
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inventoryForm)
    });

    setInventoryForm({ medicationName: "", stock: "", minimumStock: "" });
    fetchInventory();
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

  const isAuthenticated = Boolean(authToken && currentUser);

  if (!isAuthenticated) {
    const pageStyle = {
      minHeight: "100vh",
      backgroundColor: "#d5dae8",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    };

    const brandTitleStyle = {
      position: "absolute",
      top: "18px",
      left: "24px",
      margin: 0,
      fontSize: "22px",
      fontWeight: 700,
      color: "#0d1b4c"
    };

    const cardStyle = {
      width: "100%",
      maxWidth: "420px",
      backgroundColor: "#f3f3f6",
      borderRadius: "14px",
      padding: "28px 30px",
      boxShadow: "0 12px 26px rgba(43, 51, 80, 0.10)"
    };

    const authHeadingStyle = {
      textAlign: "center",
      fontSize: "24px",
      margin: "2px 0 20px 0",
      color: "#141a2a"
    };

    const inputStyle = {
      width: "100%",
      boxSizing: "border-box",
      height: "46px",
      borderRadius: "10px",
      border: "1px solid #c5c8d0",
      backgroundColor: "#f7f7f8",
      padding: "0 14px",
      fontSize: "18px",
      marginBottom: "12px",
      color: "#1a1f2d"
    };

    const submitStyle = {
      width: "100%",
      height: "44px",
      border: "none",
      borderRadius: "10px",
      color: "#ffffff",
      fontSize: "18px",
      fontWeight: 600,
      cursor: "pointer",
      background: "linear-gradient(90deg, #4d46d9 0%, #4e44db 100%)",
      marginTop: "8px"
    };

    const switchLineStyle = {
      marginTop: "16px",
      textAlign: "center",
      fontSize: "17px",
      color: "#1f2432"
    };

    const switchButtonStyle = {
      border: "none",
      background: "transparent",
      color: "#4e46df",
      textDecoration: "underline",
      cursor: "pointer",
      fontSize: "17px",
      padding: 0
    };

    const messageStyle = {
      marginTop: "10px",
      textAlign: "center",
      fontSize: "14px"
    };

    return (
      <div style={pageStyle}>
        <h1 style={brandTitleStyle}>Pharmacy Management App</h1>
        <div style={cardStyle}>
          <h2 style={authHeadingStyle}>{authMode === "login" ? "Sign In" : "Sign Up"}</h2>
          <form onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <input
                placeholder="Full Name"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                style={inputStyle}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              style={inputStyle}
            />
            <button type="submit" style={submitStyle}>
              {authMode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p style={switchLineStyle}>
            {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              style={switchButtonStyle}
              onClick={() => {
                setAuthError("");
                setAuthInfo("");
                setAuthMode(authMode === "login" ? "register" : "login");
              }}
            >
              {authMode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>

          {authInfo && <p style={{ ...messageStyle, color: "#15803d" }}>{authInfo}</p>}
          {authError && <p style={{ ...messageStyle, color: "#dc2626" }}>{authError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pharmacy Management App</h1>
      <p>
        Signed in as {currentUser.name} ({currentUser.email})
      </p>

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
          onChange={(e) => setInventoryForm({ ...inventoryForm, stock: e.target.value })}
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
              <span style={{ color: "red", marginLeft: "10px" }}>LOW STOCK ⚠</span>
            )}
          </li>
        ))}
      </ul>

      <h2>AI Help Chat Box</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          maxWidth: "700px",
          marginBottom: "10px",
          maxHeight: "240px",
          overflowY: "auto"
        }}
      >
        {chatMessages.map((msg, index) => (
          <p key={`${msg.role}-${index}`}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.text}
          </p>
        ))}
      </div>

      <form onSubmit={sendChatMessage}>
        <input
          placeholder="Ask for help..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          style={{ width: "420px" }}
        />
        <button type="submit" disabled={chatLoading}>
          {chatLoading ? "Thinking..." : "Send"}
        </button>
      </form>

      <div style={{ marginTop: "16px" }}>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;