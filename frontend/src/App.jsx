import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AdminDashboard from './components/Dashboard';           // ton ancien dashboard admin
import EspaceUtilisateur from './components/EspaceUtilisateur'; // → Interface Linux
import PageAttente from './components/PageAttente';
import { api } from './api';
import './styles/App.css';

export default function App() {
  const [utilisateur, setUtilisateur] = useState(null);
  const [verificationInitiale, setVerificationInitiale] = useState(true);
  const [theme, setTheme] = useState(() => {
    return window.localStorage.getItem('theme') || 'light';
  });
  const [afficherBienvenue, setAfficherBienvenue] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // Vérification de la session au démarrage
  useEffect(() => {
    api.moi()
      .then((donnees) => setUtilisateur(donnees.utilisateur))
      .catch(() => setUtilisateur(null))
      .finally(() => setVerificationInitiale(false));
  }, []);

  const basculerTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  function gererConnexionReussie(utilisateurConnecte) {
    setUtilisateur(utilisateurConnecte);
    setAfficherBienvenue(utilisateurConnecte.statut === 'approuve');
  }

  async function gererDeconnexion() {
    await api.logout().catch(() => {});
    setUtilisateur(null);
    setAfficherBienvenue(false);
    navigate('/login');           // → Important : redirige vers login après déconnexion
  }

  if (verificationInitiale) {
    return <div className="ecran-chargement">Vérification de la session…</div>;
  }

  return (
    <>
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          utilisateur ? <Navigate to="/" replace /> : (
            <div className="app-conteneur">
              <div className="fond-grille" />
              <LoginForm
                onConnecte={gererConnexionReussie}
                onBasculerVersInscription={() => navigate('/register')}
                theme={theme}
                onToggleTheme={basculerTheme}
              />
            </div>
          )
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          utilisateur ? <Navigate to="/" replace /> : (
            <div className="app-conteneur">
              <div className="fond-grille" />
              <RegisterForm onBasculerVersConnexion={() => navigate('/login')} />
            </div>
          )
        }
      />

      {/* Route principale intelligente selon le rôle */}
      <Route
        path="/"
        element={
          utilisateur ? (
            utilisateur.statut !== 'approuve' ? (
              <PageAttente utilisateur={utilisateur} onDeconnexion={gererDeconnexion} />
            ) : utilisateur.role === 'admin' ? (
              <AdminDashboard onDeconnexion={gererDeconnexion} theme={theme} onToggleTheme={basculerTheme} />
            ) : (
              <EspaceUtilisateur onDeconnexion={gererDeconnexion} theme={theme} onToggleTheme={basculerTheme} />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Route explicite pour l'interface utilisateur (optionnel) */}
      <Route
        path="/desktop"
        element={
          utilisateur && utilisateur.role !== 'admin' ? (
            utilisateur.statut !== 'approuve' ? (
              <PageAttente utilisateur={utilisateur} onDeconnexion={gererDeconnexion} />
            ) : (
              <EspaceUtilisateur onDeconnexion={gererDeconnexion} theme={theme} onToggleTheme={basculerTheme} />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>

    {afficherBienvenue && utilisateur && (
      <div className="welcome-modal-overlay" role="presentation">
        <div className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <div className="welcome-modal-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="welcome-eyebrow">Authentification validee</p>
          <h2 id="welcome-title">Bienvenue, {utilisateur.nom}</h2>
          <p className="welcome-message">
            Ravi de vous revoir. Votre espace est pret et vous pouvez commencer à gérer vos activités.
          </p>
          <div className="welcome-meta">
            <span>{utilisateur.role}</span>
            <span>Session securisee</span>
          </div>
          <button type="button" className="bouton-principal welcome-action" onClick={() => setAfficherBienvenue(false)}>
            Commencer
          </button>
        </div>
      </div>
    )}
    </>
  );
}
