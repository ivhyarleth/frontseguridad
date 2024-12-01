import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simulación de validación de credenciales
    if (email && password) {
      await axios
        .post("http://localhost:5000/auth/login", {
          username: email,
          password,
        })
        .then((response) => {
          console.log(response);
          // Guardar el token en localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", response.data.username);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.log(error);
          alert("Credenciales incorrecta");
          //navigate("/dashboard");
        });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleRegister = () => {
    navigate("/register"); // Navega a la página de registro
  };

  return (
    <div className="login-container">
      {/* Columna izquierda con el color azul y las imágenes */}
      <div className="login-left">
        <img src="/logo_login.jpg" alt="Logo" className="login-logo" />
        <img
          src="/imagen_login.jpg"
          alt="Imagen decorativa"
          className="login-image"
        />
      </div>

      {/* Columna derecha con el formulario */}
      <div className="login-right">
        <h2>¡Bienvenido de nuevo!</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña maestra"
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
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
        <p className="forgot-password">
          ¿Todavía no tienes una cuenta?{" "}
          <button onClick={handleRegister} className="link-button">
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
