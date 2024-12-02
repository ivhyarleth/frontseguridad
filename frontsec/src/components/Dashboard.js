import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import forge from "node-forge";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [visiblePassword, setVisiblePassword] = useState({});
  const [websites, setWebsites] = useState([]);
  const [usuario, setUsuario] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Para mostrar el formulario
  const [newPasswordData, setNewPasswordData] = useState({
    website: "",
    email: "",
    password: "",
  });

  const resetForm = () => {
    setNewPasswordData({
      website: "",
      email: "",
      password: "",
    });
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchPublicKey = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth/public-key");
      return response.data.public_key;
    } catch (error) {
      console.error("Error al obtener la clave pública:", error);
      throw new Error("No se pudo obtener la clave pública");
    }
  };

  const encryptWithRSA = async (password) => {
    try {
      const publicKeyPem = await fetchPublicKey();
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      const encryptedPassword = publicKey.encrypt(password, "RSA-OAEP", {
        md: forge.md.sha256.create(),
      });
      return forge.util.encode64(encryptedPassword);
    } catch (error) {
      console.error("Error al cifrar la contraseña:", error);
      throw new Error("No se pudo cifrar la contraseña");
    }
  };

  const fetchWebsites = async () => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      const response = await axios.post(
        "http://localhost:5000/passwords/passwords",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWebsites(response.data);
      setUsuario(JSON.parse(localStorage.getItem("user")));
    } catch (error) {
      console.error("Error al obtener los sitios web:", error);
      /*if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }*/
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    setShowForm(true); // Muestra el formulario
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const token = JSON.parse(localStorage.getItem("token"));  
    try {
      const encryptedPassword = await encryptWithRSA(newPasswordData.password);
  
      const response = await axios.post(
        "http://localhost:5000/passwords/add",
        {
          website: newPasswordData.website,
          email: newPasswordData.email,
          password: encryptedPassword, // Asegúrate de enviar 'password' cifrada
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Procesa la respuesta si todo está bien
      fetchWebsites(); // Refresca la lista de contraseñas
      resetForm();
      setShowForm(false); // Cierra el formulario
    } catch (error) {
      console.error("Error al agregar un nuevo sitio:", error);
      if (error.response) {
        console.error(error.response.data);  // Imprime la respuesta de error del servidor
      }
    }
  };
  

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/");
    } else {
      setUsuario(user);
      fetchWebsites();
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src="/login_principal.jpg" alt="Logo" className="dashboard-logo" />
        <h2>¡Bienvenido {usuario}!</h2>
        <div className="header-actions">
          <button onClick={handleAddCard} className="add-card-button">
            + AGREGAR
          </button>
          <button onClick={handleLogout} className="logout-button">
            SALIR
          </button>
        </div>
      </header>

      <div className="dashboard-main">
        <aside className="dashboard-sidebar">
          <button className="sidebar-button active">WEBSITES</button>
          <button
            className="sidebar-button"
            onClick={() => navigate("/password-generator")}
          >
            PASSWORD GENERATOR
          </button>
        </aside>

        <div className="dashboard-content">
          {loading ? (
            <p>Cargando tus contraseñas...</p>
          ) : websites.map((site, index) => (
            <div className="website-card" key={index}>
              <div className="website-info">
                <i className="fas fa-globe"></i>
                <a
                  href={site.website.startsWith("http") ? site.website : `https://${site.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.website}
                </a>
              </div>
              <div className="website-info">
                <i className="fas fa-user"></i>
                <p>{site.email}</p>
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText(site.email)}
                >
                  Copiar
                </button>
              </div>
              <div className="website-info">
                <i className="fas fa-lock"></i>
                {visiblePassword[index] ? (
                  <p>{site.password}</p>
                ) : (
                  <p>******</p> // Muestra asteriscos si la contraseña no es visible
                )}
                <button
                  className="toggle-password-button"
                  onClick={() => setVisiblePassword((prev) => ({
                    ...prev,
                    [index]: !prev[index]  // Alterna la visibilidad de la contraseña
                  }))}
                >
                  {visiblePassword[index] ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText(site.password)}
                >
                  Copiar
                </button>
              </div>
            </div>
          ))}
          

    {showForm && (
      <div className="modal-overlay">
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="add-password-form">
            <h3>Agregar nueva contraseña</h3>
            <label>
              Sitio Web:
              <input
                type="text"
                value={newPasswordData.website}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, website: e.target.value })}
                required
              />
            </label>
            <label>
              Correo Electrónico:
              <input
                type="email"
                value={newPasswordData.email}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, email: e.target.value })}
                required
              />
            </label>
            <label>
              Contraseña:
              <input
                type="password"
                value={newPasswordData.password}
                onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
                required
              />
            </label>
            <div className="form-buttons">
              <button type="submit">Agregar</button>
              <button type="button" onClick={() => { resetForm(); setShowForm(false); }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}


        </div>
      </div>
    </div>
  );
}

export default Dashboard;
