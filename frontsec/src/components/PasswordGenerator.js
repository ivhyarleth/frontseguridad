import React, { useState } from 'react';
import './PasswordGenerator.css';
import { useNavigate } from 'react-router-dom';

function PasswordGenerator() {
  const [password, setPassword] = useState('Fo3WU6hv&4T3');
  const navigate = useNavigate();

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#&_,.-;¿?';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const goToDashboard = () => {
    navigate('/dashboard'); // Redirige al Dashboard
  };

  const goToGenerator = () => {
    navigate('/generatorpassword'); // Redirige al Password Generator
  };

  return (
    <div className="generator-container">
      {/* Header */}
      <div className="generator-header">
        <img src="/login_principal.jpg" alt="Logo" className="generator-logo" />
        <h2>¡Bienvenido USUARIO!</h2>
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
          <div
            className="sidebar-button active"
          >
            PASSWORD GENERATOR
          </div>
        </div>

        {/* Generator Content */}
        <div className="generator-content">
          <div className="password-card">
            <div className="password-display">{password}</div>
            <p>Password strength: <span style={{ color: 'green' }}>strong</span></p>
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
