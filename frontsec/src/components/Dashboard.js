import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  // Datos simulados para las tarjetas
  const websites = [
    {
      website: 'www.amazon.com',
      email: 'usuario@gmail.com',
      password: '****************',
    },
    {
      website: 'www.facebook.com',
      email: 'usuario@outlook.com',
      password: '****************',
    },
    {
      website: 'www.instagram.com',
      email: 'usuario@gmail.com',
      password: '****************',
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Fila fija: logo y saludo */}
      <header className="dashboard-header">
        <img src="/login_principal.jpg" alt="Logo" className="dashboard-logo" />
        <h2>¡Bienvenido USUARIO!</h2>
      </header>

      {/* Contenido principal: dividido en dos partes */}
      <div className="dashboard-main">
        {/* Botones de navegación */}
        <aside className="dashboard-sidebar">
          <button
            className="sidebar-button active"
          >
            WEBSITES
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate('/password-generator')}
          >
            PASSWORD GENERATOR
          </button>
        </aside>

        {/* Tarjetas */}
        <div className="dashboard-content">
          {websites.map((site, index) => (
            <div className="website-card" key={index}>
              <div className="website-info">
                <i className="fas fa-globe"></i>
                <p>{site.website}</p>
              </div>
              <div className="website-info">
                <i className="fas fa-user"></i>
                <p>{site.email}</p>
              </div>
              <div className="website-info">
                <i className="fas fa-lock"></i>
                <p>{site.password}</p>
              </div>
              <div className="website-action">
                <i className="fas fa-share"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
