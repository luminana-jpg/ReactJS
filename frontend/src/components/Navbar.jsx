import { useState, useEffect, useRef } from 'react';
import './Navbar.css';        // Ou le nom de ton fichier CSS
// import { api } from '../api'; // Décommente si tu en as besoin plus tard

function Navbar({ onDeconnexion, theme, onToggleTheme }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fermeture du dropdown en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await onDeconnexion();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚙️</span>
        <span className="brand-title">Panneau d'administration</span>
      </div>

      <div className="navbar-actions">
        <button
          className="theme-toggle-btn"
          type="button"
          onClick={onToggleTheme}
          aria-label="Changer de thème"
        >
          <span className="theme-toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span className="theme-toggle-label">{theme === 'dark' ? 'Clair' : 'Sombre'}</span>
        </button>

        {/* Zone utilisateur */}
        <div
          className={`navbar-user ${showDropdown ? 'open' : ''}`}
          onClick={toggleDropdown}
          ref={dropdownRef}
        >
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Administrateur</span>
          </div>
          <span className="dropdown-arrow">▼</span>

          {showDropdown && (
            <div className="user-dropdown">
              <button className="dropdown-item">
                👤 Mon profil
              </button>
              <button className="dropdown-item">
                ⚙️ Paramètres
              </button>
              <hr className="dropdown-divider" />
              <button
                className="dropdown-item logout-btn"
                onClick={handleLogout}
              >
                🚪 Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;