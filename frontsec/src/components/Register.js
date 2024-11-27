import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordStrength = () => {
    if (password.length > 10) return "Fuerte";
    if (password.length > 6) return "Media";
    return "Débil";
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/register", {
        email,
        password,
        username,
        selectedColor,
      })
      .then((response) => {
        alert("¡Registro exitoso!");
      })
      .catch((error) => {
        alert("Error en el registro.");
      });
    console.log("Correo:", email);
    console.log("Contraseña:", password);
    console.log("Nombre de usuario:", username);
    console.log("Color seleccionado:", selectedColor);
    alert("¡Registro exitoso!");
  };

  return (
    <div className="register-container">
      {/* Header con logo y título en la misma fila */}
      <div className="register-header">
        <img
          src="/login_principal.jpg"
          alt="Password Manager UTEC"
          className="register-logo"
        />
        <h2>Regístrate</h2>
      </div>
      {/* Formulario */}
      <form className="register-form" onSubmit={handleRegister}>
        <label>Ingresa tu correo:</label>
        <input
          type="email"
          placeholder="Completar"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Crea una contraseña maestra:</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Completar"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="password-strength">
          Password es{" "}
          <span
            className={`strength-indicator ${checkPasswordStrength().toLowerCase()}`}
          >
            {checkPasswordStrength()}
          </span>
        </div>

        <label>Ingresa tu nombre de usuario:</label>
        <input
          type="text"
          placeholder="Completar"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Selecciona un color:</label>
        <div className="color-picker">
          {["#7ed957", "#ffde59", "#ff5757", "#004aad"].map((color) => (
            <div
              key={color}
              className={`color-box ${
                selectedColor === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            ></div>
          ))}
        </div>

        <button type="submit" className="register-button">
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;
