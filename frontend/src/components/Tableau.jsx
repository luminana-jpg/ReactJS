import './Tableau.css';

const icons = {
  approve: (
    <path d="M20 6 9 17l-5-5" />
  ),
  refuse: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  delete: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      className="action-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Tableau({ users, onEdit, onDelete, onValidate }) {
  const normaliser = (valeur) => String(valeur ?? '').trim().toLowerCase();

  const estEnAttente = (statut) => normaliser(statut) === 'en_attente';

  const getStatutClass = (statut) => {
    const statutNormalise = normaliser(statut);

    if (statutNormalise === 'actif' || statutNormalise === 'approuve') return 'badge badge-actif';
    if (statutNormalise === 'en_attente') return 'badge badge-attente';
    return 'badge badge-inactif';
  };

  const getStatutLabel = (statut) => {
    const statutNormalise = normaliser(statut);

    if (statutNormalise === 'approuve') return 'Approuvé';
    if (statutNormalise === 'en_attente') return 'En attente';
    if (statutNormalise === 'refuse') return 'Refusé';
    return statut;
  };

  const getRoleClass = (role) => {
    if (role === 'Admin')   return 'role role-admin';
    if (role === 'Editeur') return 'role role-editeur';
    return 'role role-lecteur';
  };

  const getInitiales = (nom) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (users.length === 0) {
    return (
      <div className="table-empty">
        <p>Aucun utilisateur trouvé.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="tableau">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id} className={estEnAttente(u.statut) ? 'row-attente' : undefined}>
              <td className="td-index">{index + 1}</td>
              <td>
                <div className="user-cell">
                  <div className="avatar">{getInitiales(u.nom)}</div>
                  <span>{u.nom}</span>
                </div>
              </td>
              <td className="td-email">{u.email}</td>
              <td><span className={getRoleClass(u.role)}>{u.role}</span></td>
              <td><span className={getStatutClass(u.statut)}>{getStatutLabel(u.statut)}</span></td>
              <td>
                <div className="action-btns">
                  {estEnAttente(u.statut) && (
                    <>
                      <button
                        type="button"
                        className="action-btn action-btn-approve"
                        onClick={() => onValidate(u.id, 'approuver')}
                        title="Approuver le compte"
                        aria-label={`Approuver le compte de ${u.nom}`}
                      >
                        <Icon name="approve" />
                        <span>Approuver</span>
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn-refuse"
                        onClick={() => onValidate(u.id, 'refuser')}
                        title="Refuser le compte"
                        aria-label={`Refuser le compte de ${u.nom}`}
                      >
                        <Icon name="refuse" />
                        <span>Refuser</span>
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="action-btn action-btn-edit"
                    onClick={() => onEdit(u)}
                    title="Modifier l'utilisateur"
                    aria-label={`Modifier ${u.nom}`}
                  >
                    <Icon name="edit" />
                    <span>Modifier</span>
                  </button>
                  <button
                    type="button"
                    className="action-btn action-btn-delete"
                    onClick={() => onDelete(u.id)}
                    title="Supprimer l'utilisateur"
                    aria-label={`Supprimer ${u.nom}`}
                  >
                    <Icon name="delete" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tableau;