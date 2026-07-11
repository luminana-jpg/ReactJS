import { useState } from 'react';
import { api } from '../api';
import { lireCookie, ecrireCookie } from '../utils/cookies';

const COOKIE_EMAILS_RECENTS = 'emails_recents';
const NB_SUGGESTIONS_MAX = 5;

function lireEmailsRecents() {
  const brut = lireCookie(COOKIE_EMAILS_RECENTS);
  if (!brut) return [];
  try {
    const liste = JSON.parse(brut);
    return Array.isArray(liste) ? liste : [];
  } catch {
    return [];
  }
}

function memoriserEmail(email) {
  const existants = lireEmailsRecents().filter((e) => e !== email);
  const mis_a_jour = [email, ...existants].slice(0, NB_SUGGESTIONS_MAX);
  ecrireCookie(COOKIE_EMAILS_RECENTS, JSON.stringify(mis_a_jour));
}

export default function LoginForm({ onConnecte, onBasculerVersInscription, theme, onToggleTheme }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [emailsRecents] = useState(lireEmailsRecents);

  async function gererSoumission(e) {
    e.preventDefault();
    setErreur('');
    setEnCours(true);
    try {
      const donnees = await api.login(email, motDePasse);
      memoriserEmail(email);
      onConnecte(donnees.utilisateur);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="carte-auth">
      {onToggleTheme && (
        <button
          type="button"
          className="theme-toggle-auth"
          onClick={onToggleTheme}
          aria-label="Changer de thème"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      )}

      <h1 className="titre-auth">Connexion</h1>

      <form onSubmit={gererSoumission} className="formulaire-auth">
        <label className="champ">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@exemple.com"
            required
            autoFocus
            list="emails-recents"
          />
          {/*cookies tsy tapa-kevitra*/}
          {/* {emailsRecents.length > 0 && (
            <datalist id="emails-recents">
              {emailsRecents.map((e) => (
                <option key={e} value={e} />
              ))}
            </datalist>
          )} */}

        </label>

        <label className="champ">
          <span>Mot de passe</span>
          <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="••••••••" required />
        </label>

        {erreur && <div className="message-erreur">{erreur}</div>}

        <button type="submit" className="bouton-principal" disabled={enCours}>
          {enCours ? 'Vérification…' : 'Se connecter'}
        </button>
      </form>

      <button type="button" className="lien-secondaire" onClick={onBasculerVersInscription}>
        Pas encore de compte ? S'inscrire →
      </button>
    </div>
  );
}