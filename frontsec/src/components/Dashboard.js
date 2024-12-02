import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = React.useState([]);
  const [usuario, setUsuario] = React.useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchWebsites = async () => {
    const usuario = localStorage.getItem("user");
    const token = localStorage.getItem("token") || "";
    try {
      const response = await axios.post(
        "http://localhost:5000/passwords", 
        { username: usuario },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWebsites(response.data); // Actualiza las tarjetas desde el servidor
      setUsuario(usuario);
    } catch (error) {
      console.error("Error al obtener los sitios web:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    }
  };

  // Agregar una nueva tarjeta al servidor
  const handleAddCard = async () => {
    const newCard = { website: "Nuevo sitio", email: "nuevo@ejemplo.com", password: "12345" };
    const token = localStorage.getItem("token") || "";
    try {
      const response = await axios.post(
        "http://localhost:5000/passwords", 
        newCard,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWebsites([...websites, response.data]); //actualiza nueva tarjeta
    } catch (error) {
      console.error("Error al agregar un nuevo sitio:", error);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  return (
    <div className="dashboard-container">
    <header className="dashboard-header">
      <img src="/login_principal.jpg" alt="Logo" className="dashboard-logo" />
      <h2>¡Bienvenido!</h2>
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
        {websites.map((site, index) => (
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
              <p>{site.password}</p>
              <button
                className="copy-button"
                onClick={() => navigator.clipboard.writeText(site.password)}
              >
                Copiar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default Dashboard;
