// api.js — petit client HTTP centralisé, envoie/reçoit le cookie de session
const BASE_URL = 'http://localhost:8000'; // adresse de votre backend PHP

async function appelApi(chemin, options = {}) {
  const reponse = await fetch(`${BASE_URL}${chemin}`, {
    credentials: 'include', // indispensable : envoie et reçoit le cookie httpOnly
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const donnees = await reponse.json().catch(() => ({}));

  if (!reponse.ok) {
    throw new Error(donnees.message || 'Une erreur est survenue.');
  }
  return donnees;
}

export const api = {
  login: (email, mot_de_passe) =>
    appelApi('/login.php', { method: 'POST', body: JSON.stringify({ email, mot_de_passe }) }),

  register: (nom, email, mot_de_passe) =>
    appelApi('/register.php', { method: 'POST', body: JSON.stringify({ nom, email, mot_de_passe }) }),

  logout: () => appelApi('/logout.php', { method: 'POST' }),

  moi: () => appelApi('/me.php'),

  listerUtilisateurs: () => appelApi('/utilisateurs.php'),

  creerUtilisateur: (payload) =>
    appelApi('/utilisateurs.php', { method: 'POST', body: JSON.stringify(payload) }),

  modifierUtilisateur: (id, payload) =>
    appelApi(`/utilisateurs.php?id=${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  supprimerUtilisateur: (id) =>
    appelApi(`/utilisateurs.php?id=${id}`, { method: 'DELETE' }),

  validerUtilisateur: (id, action) =>
    appelApi('/valider_utilisateur.php', { method: 'POST', body: JSON.stringify({ id, action }) }),
};