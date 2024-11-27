import React, { useState } from "react";
import axios from "axios";
import "./PasswordGenerator.css";
import { useNavigate } from "react-router-dom";

function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState("");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  React.useEffect(() => {
    const handleToken = async () => {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        navigate("/");
      }
      axios
        .get("http://localhost:5000/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          setUsuario(localStorage.getItem("user"));
          generatePassword();
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
        });
    };
    handleToken();
  }, []);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#&_,.-;¿?";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const goToDashboard = () => {
    navigate("/dashboard"); // Redirige al Dashboard
  };

  const goToGenerator = () => {
    navigate("/generatorpassword"); // Redirige al Password Generator
  };

  return (
    <div className="generator-container">
      {/* Header */}
      <div className="generator-header">
        <img src="/login_principal.jpg" alt="Logo" className="generator-logo" />
        <h2>¡Bienvenido {usuario}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="generator-main">
        {/* Sidebar */}
        <div className="generator-sidebar">
          <div
            className="sidebar-button"
            onClick={goToDashboard} // Maneja el clic para ir al Dashboard
          >
            WEBSITES
          </div>
          <div className="sidebar-button active">PASSWORD GENERATOR</div>
        </div>

        {/* Generator Content */}
        <div className="generator-content">
          <div className="password-card">
            <div className="password-display">
              {password}
              <button
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(password)}
              >
                Copy Password
              </button>
            </div>
            <p>
              Password strength: <span style={{ color: "green" }}>strong</span>
            </p>
            <p>Password length: 12</p>
            <p>Password characters: A-Z, a-b, 0-9, ($,#,&,_,.-,;,¿?)</p>
            <button className="generate-button" onClick={generatePassword}>
              Generate New Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordGenerator;
