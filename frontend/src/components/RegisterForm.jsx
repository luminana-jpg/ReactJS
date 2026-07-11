import { useEffect, useState } from 'react';
import { api } from '../api';

export default function RegisterForm({ onBasculerVersConnexion }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [confirmationCreation, setConfirmationCreation] = useState(false);

  useEffect(() => {
    if (!confirmationCreation) return undefined;

    const timer = window.setTimeout(() => {
      onBasculerVersConnexion();
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [confirmationCreation, onBasculerVersConnexion]);

  async function gererSoumission(e) {
    e.preventDefault();
    setErreur('');

    if (motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    if (motDePasse.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setEnCours(true);
    try {
      await api.register(nom, email, motDePasse);
      setConfirmationCreation(true);
      setNom('');
      setEmail('');
      setMotDePasse('');
      setConfirmation('');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <>
      <div className="carte-auth">
        <h1 className="titre-auth">Inscription</h1>
        <p>Un administrateur devra valider votre compte avant votre première connexion.</p>

        <form onSubmit={gererSoumission} className="formulaire-auth">
          <label className="champ">
            <span>Nom complet</span>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              autoFocus
              disabled={enCours || confirmationCreation}
            />
          </label>

          <label className="champ">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              disabled={enCours || confirmationCreation}
            />
          </label>

          <label className="champ">
            <span>Mot de passe</span>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="8 caractères minimum"
              required
              disabled={enCours || confirmationCreation}
            />
          </label>

          <label className="champ">
            <span>Confirmer le mot de passe</span>
            <input
              type="password"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              required
              disabled={enCours || confirmationCreation}
            />
          </label>

          {erreur && <div className="message-erreur">{erreur}</div>}

          <button type="submit" className="bouton-principal" disabled={enCours || confirmationCreation}>
            {enCours ? 'Création...' : 'Créer le compte'}
          </button>
        </form>

        <button type="button" className="lien-secondaire" onClick={onBasculerVersConnexion} disabled={enCours}>
          J'ai déjà un compte ← Se connecter
        </button>
      </div>

      {confirmationCreation && (
        <div className="auth-modal-overlay" role="presentation">
          <div className="auth-success-modal" role="dialog" aria-modal="true" aria-labelledby="creation-compte-titre">
            <div className="auth-success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 id="creation-compte-titre">Compte créé avec succès</h2>
            <p>
              Votre demande est envoyée à l'administrateur. Vous allez être redirigé vers la connexion.
            </p>
            <button type="button" className="bouton-principal auth-success-action" onClick={onBasculerVersConnexion}>
              Se connecter maintenant
            </button>
          </div>
        </div>
      )}
    </>
  );
}