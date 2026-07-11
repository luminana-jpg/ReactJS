import '../styles/App.css';

export default function PageAttente({ utilisateur, onDeconnexion }) {
  const refuse = utilisateur.statut === 'refuse';

  return (
    <div className="app-conteneur">
      <div className="fond-grille" />
      <div className={`carte-attente${refuse ? ' refuse' : ''}`}>
        <div className="attente-icon" aria-hidden="true">{refuse ? '⛔' : '⏳'}</div>

        <p className="attente-eyebrow">
          {refuse ? 'Accès refusé' : 'Validation en cours'}
        </p>

        {refuse ? (
          <>
            <h1>Compte refusé</h1>
            <p className="attente-message">
              Bonjour {utilisateur.nom}, votre demande de compte a été refusée par
              un administrateur. Vous n'avez pas accès à l'application.
            </p>
          </>
        ) : (
          <>
            <h1>Compte en attente de validation</h1>
            <p className="attente-message">
              Bonjour {utilisateur.nom}, votre compte a bien été créé mais doit
              d'abord être validé par un administrateur. Revenez plus tard ou
              rafraîchissez cette page.
            </p>
          </>
        )}

        <div className="attente-meta">
          <span>{utilisateur.email}</span>
          <span>{refuse ? 'Statut : refusé' : 'Statut : en attente'}</span>
        </div>

        <button className="btn-annuler" onClick={onDeconnexion}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}