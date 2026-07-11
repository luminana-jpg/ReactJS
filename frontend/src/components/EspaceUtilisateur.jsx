import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  AppBar, 
  Toolbar, 
  Menu, 
  MenuItem 
} from '@mui/material';

import { 
  Terminal as TerminalIcon, 
  Folder, 
  Settings, 
  Language as ChromeIcon, 
  AccountCircle,
  LightMode,
  DarkMode
} from '@mui/icons-material';

import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';

// ====================== Composant Fenêtre ======================
const Window = ({ title, children, onClose, width = 720, height = 520 }) => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) return null;

  return (
    <Paper
      elevation={12}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: width,
        height: height,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)'
      }}
    >
      <AppBar position="static" sx={{ bgcolor: 'var(--surface-strong)', height: 42, minHeight: 42, color: 'var(--text)' }}>
        <Toolbar variant="dense" sx={{ minHeight: 42, justifyContent: 'space-between', px: 2 }}>
          <Typography variant="body1" sx={{ color: 'var(--text)', fontWeight: 500 }}>
            {title}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => setMinimized(true)} sx={{ color: 'var(--muted)', mr: 0.5 }}>
              <MinimizeIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onClose} sx={{ color: 'var(--danger)' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: 'calc(100% - 42px)', bgcolor: 'var(--surface)', color: 'var(--text)', p: 3, overflow: 'auto' }}>
        {children}
      </Box>
    </Paper>
  );
};

// ====================== Composant Principal ======================
export default function EspaceUtilisateur({ onDeconnexion, theme, onToggleTheme }) {
  const [openWindows, setOpenWindows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const openApp = (app) => {
    setOpenWindows(prev => [...prev, { id: Date.now(), ...app }]);
  };

  const closeWindow = (id) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  };

  const desktopApps = [
    { title: "Terminal", icon: TerminalIcon, content: <TerminalApp /> },
    { title: "Fichiers", icon: Folder, content: <FileManager /> },
    { title: "Navigateur", icon: ChromeIcon, content: <BrowserMock /> },
    { title: "Paramètres", icon: Settings, content: <SettingsPanel /> },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, var(--desktop-gradient-start) 0%, var(--desktop-gradient-end) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Barre supérieure style GNOME */}
      <AppBar position="static" sx={{ bgcolor: 'var(--surface-strong)', backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold', color: 'var(--title)' }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Linux Workspace
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'var(--text)' }}>14:32</Typography>
            <IconButton color="inherit" onClick={onToggleTheme} sx={{ color: 'var(--text)' }}>
              {theme === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: 'var(--text)' }}>
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Zone du Bureau */}
      <Box sx={{ height: 'calc(100vh - 64px)', p: 5, position: 'relative' }}>
        {/* Icônes du bureau */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {desktopApps.map((app, index) => (
            <Box
              key={index}
              onClick={() => openApp(app)}
              sx={{
                width: 90,
                color: 'var(--text)',
                cursor: 'pointer',
                borderRadius: 1,
                p: 1,
                '&:hover': { bgcolor: 'var(--surface-soft)' }
              }}
            >
              <app.icon sx={{ fontSize: 52, mb: 1 }} />
              <Typography variant="caption" sx={{ textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                {app.title}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Fenêtres ouvertes */}
        {openWindows.map((win) => (
          <Window
            key={win.id}
            title={win.title}
            onClose={() => closeWindow(win.id)}
          >
            {win.content}
          </Window>
        ))}
      </Box>

      {/* Menu Utilisateur */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: '#1e1b3a',
              color: '#e5e3ff',
              border: '1px solid #3730a5',
              boxShadow: '0 20px 50px rgba(0,0,0,.35)',
            }
          }
        }}
      >
        <MenuItem
          sx={{ color: '#e5e3ff', '&:hover': { bgcolor: '#2d2860' } }}
          onClick={() => setAnchorEl(null)}
        >
          Mon Profil
        </MenuItem>
        <MenuItem
          sx={{ color: '#e5e3ff', '&:hover': { bgcolor: '#2d2860' } }}
          onClick={() => setAnchorEl(null)}
        >
          Paramètres
        </MenuItem>
        <MenuItem
          sx={{ color: '#f87171', '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.16)' } }}
          onClick={() => {
            setAnchorEl(null);
            if (typeof onDeconnexion === 'function') {
              onDeconnexion();
            }
          }}
        >
          Se déconnecter
        </MenuItem>
      </Menu>
    </Box>
  );
}

/* ====================== Applications ====================== */
const TerminalApp = () => (
  <Box sx={{ fontFamily: 'monospace', bgcolor: 'var(--surface-strong)', p: 3, height: '100%', color: 'var(--success)' }}>
    <Typography variant="body2">$ Bienvenue sur le terminal</Typography>
    <Typography variant="body2">$ Vous êtes connecté en tant qu'utilisateur</Typography>
  </Box>
);

const FileManager = () => (
  <Box>
    <Typography variant="h6" gutterBottom sx={{ color: 'var(--title)' }}>Explorateur de fichiers</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 2 }}>
      {['Documents', 'Images', 'Musique', 'Projets', 'Téléchargements'].map(item => (
        <Paper key={item} sx={{ p: 3, textAlign: 'center', bgcolor: 'var(--surface-strong)' }}>
          📁 {item}
        </Paper>
      ))}
    </Box>
  </Box>
);

const BrowserMock = () => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h5">🌐 Navigateur Web</Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>Simulation de navigateur internet</Typography>
  </Box>
);

const SettingsPanel = () => (
  <Box>
    <Typography variant="h6">Paramètres du système</Typography>
    <Typography variant="body2" sx={{ mt: 2, color: '#94a3b8' }}>
      Apparence • Réseau • Comptes • Sécurité
    </Typography>
  </Box>
);