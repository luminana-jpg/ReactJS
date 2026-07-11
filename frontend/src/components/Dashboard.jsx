import { useEffect, useMemo, useState } from 'react';
import '../styles/App.css';
import '../App.css';
import { api } from '../api';
import Navbar from './Navbar.jsx';
import StatsCards from './StatsCards.jsx';
import Tableau from './Tableau.jsx';
import Modal from './Modal.jsx';
import Pagination from './Pagination.jsx';
import ConfirmModal from './ConfirmModal.jsx';

const ELEMENTS_PAR_PAGE = 5;

const formatLabel = (valeur) => {
  const texte = String(valeur ?? '').trim();
  if (!texte) return 'Non défini';
  return texte
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
};

const statutLabel = (statut) => {
  const s = String(statut ?? '').trim().toLowerCase();
  if (s === 'approuve') return 'Approuvé';
  if (s === 'en_attente') return 'En attente';
  if (s === 'refuse') return 'Refusé';
  return formatLabel(statut);
};

const statutColor = (statut) => {
  const s = String(statut ?? '').trim().toLowerCase();
  if (s === 'approuve') return 'var(--success)';
  if (s === 'en_attente') return 'var(--warning)';
  if (s === 'refuse') return 'var(--danger)';
  return undefined;
};

function Dashboard({ onDeconnexion, theme, onToggleTheme }) {
  const [users, setUsers]                     = useState([]);
  const [chargement, setChargement]           = useState(true);
  const [erreur, setErreur]                   = useState('');
  const [showModal, setShowModal]              = useState(false);
  const [userAModifier, setUserAModifier]      = useState(null);
  const [recherche, setRecherche]              = useState('');
  const [filtreRole, setFiltreRole]            = useState('tous');
  const [filtreStatut, setFiltreStatut]        = useState('tous');
  const [pageActuelle, setPageActuelle]        = useState(1);
  const [showModalDelete, setShowModalDelete]  = useState(false);
  const [userToDelete, setUserToDelete]        = useState(null);
  const [succesSuppression, setSuccesSuppression] = useState(null);
  const [messageSucces, setMessageSucces]      = useState('');
  const [compteAApprouver, setCompteAApprouver] = useState(null);
  const [compteARefuser, setCompteARefuser]    = useState(null);
  const [compteCree, setCompteCree]            = useState(null);

  useEffect(() => {
    chargerUsers();
  }, []);

  useEffect(() => {
    if (!messageSucces) return undefined;

    const timer = window.setTimeout(() => {
      setMessageSucces('');
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [messageSucces]);

  async function chargerUsers() {
    setChargement(true);
    try {
      const donnees = await api.listerUtilisateurs();
      setUsers(donnees.utilisateurs);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  // Options de filtre déduites des données réelles
  const rolesDisponibles = useMemo(
    () => [...new Set(users.map((u) => u.role).filter(Boolean))].sort(),
    [users]
  );
  const statutsDisponibles = useMemo(
    () => [...new Set(users.map((u) => u.statut).filter(Boolean))].sort(),
    [users]
  );

  // Filtrage par recherche + rôle + statut
  const usersFiltres = users.filter((u) => {
    const texte = recherche.toLowerCase();
    const correspondRecherche =
      u.nom.toLowerCase().includes(texte) ||
      u.email.toLowerCase().includes(texte) ||
      u.role.toLowerCase().includes(texte);
    const correspondRole = filtreRole === 'tous' || u.role === filtreRole;
    const correspondStatut = filtreStatut === 'tous' || u.statut === filtreStatut;

    return correspondRecherche && correspondRole && correspondStatut;
  });

  const filtresActifs = recherche !== '' || filtreRole !== 'tous' || filtreStatut !== 'tous';

  const reinitialiserFiltres = () => {
    setRecherche('');
    setFiltreRole('tous');
    setFiltreStatut('tous');
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(usersFiltres.length / ELEMENTS_PAR_PAGE));

  useEffect(() => {
    setPageActuelle(1);
  }, [recherche, filtreRole, filtreStatut, users.length]);

  useEffect(() => {
    if (pageActuelle > totalPages) setPageActuelle(totalPages);
  }, [pageActuelle, totalPages]);

  const usersAffiches = usersFiltres.slice(
    (pageActuelle - 1) * ELEMENTS_PAR_PAGE,
    pageActuelle * ELEMENTS_PAR_PAGE
  );


  // CREATE ou UPDATE — écrit réellement en base
  const sauvegarder = async (form) => {
    try {
      setErreur('');
      if (userAModifier) {
        await api.modifierUtilisateur(form.id, {
          nom: form.nom,
          email: form.email,
          role: form.role,
        });
        setMessageSucces(`Les informations de ${form.nom} ont ete modifiees avec succes.`);
      } else {
        await api.creerUtilisateur({
          nom: form.nom,
          email: form.email,
          role: form.role,
          mot_de_passe: form.mot_de_passe,
        });
        setCompteCree(form.nom);
      }
      await chargerUsers();
      fermerModal();
    } catch (err) {
      setErreur(err.message);
    }
  };

  // DELETE
  const supprimer = (id) => {
    setUserToDelete(id);
    setShowModalDelete(true);
  };

  const confirmerSuppression = async () => {
    const utilisateur = users.find((u) => u.id === userToDelete);
    try {
      setErreur('');
      await api.supprimerUtilisateur(userToDelete);
      setUsers(users.filter(u => u.id !== userToDelete));
      setSuccesSuppression(utilisateur?.nom || 'Cet utilisateur');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setShowModalDelete(false);
      setUserToDelete(null);
    }
  };

  const annulerSuppression = () => {
    setShowModalDelete(false);
    setUserToDelete(null);
  };

  // Approuver / refuser un compte en attente
  const validerCompte = async (id, action) => {
    try {
      setErreur('');
      const utilisateur = users.find((u) => u.id === id);
      await api.validerUtilisateur(id, action);
      await chargerUsers();
      const actionLabel = action === 'approuver' ? 'approuve' : 'refuse';
      setMessageSucces(`Le compte de ${utilisateur?.nom || 'cet utilisateur'} a ete ${actionLabel} avec succes.`);
    } catch (err) {
      setErreur(err.message);
    }
  };

  // L'approbation et le refus passent tous deux par une confirmation
  const demanderValidation = (id, action) => {
    if (action === 'approuver') {
      setCompteAApprouver(id);
    } else {
      setCompteARefuser(id);
    }
  };

  const confirmerApprobation = async () => {
    const id = compteAApprouver;
    setCompteAApprouver(null);
    await validerCompte(id, 'approuver');
  };

  const confirmerRefus = async () => {
    const id = compteARefuser;
    setCompteARefuser(null);
    await validerCompte(id, 'refuser');
  };

  // Ouvrir modal modification
  const ouvrirEdition = (user) => {
    setUserAModifier(user);
    setShowModal(true);
  };

  // Ouvrir modal ajout
  const ouvrirAjout = () => {
    setUserAModifier(null);
    setShowModal(true);
  };

  const fermerModal = () => {
    setShowModal(false);
    setUserAModifier(null);
  };

  return (
    <div className="app">
      <Navbar onDeconnexion={onDeconnexion} theme={theme} onToggleTheme={onToggleTheme} />

      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Gestion des utilisateurs</h1>
            <p className="page-subtitle">{users.length} utilisateur(s) au total</p>
          </div>
          <button className="btn-ajouter" onClick={ouvrirAjout}>
            + Ajouter un utilisateur
          </button>
        </div>

        {messageSucces && (
          <div className="message-affirmation" role="status" aria-live="polite">
            <span className="message-affirmation-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span>{messageSucces}</span>
            <button type="button" onClick={() => setMessageSucces('')} aria-label="Fermer le message">x</button>
          </div>
        )}

        {erreur && <div className="message-erreur">{erreur}</div>}

        <StatsCards users={users} />


        <div className="toolbar">
          <div className="search-bar">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par nom, email ou rôle..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
            {recherche && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setRecherche('')}
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>

          <div className="filters-group">
            <div className="filter-select-wrap">
              <select
                className="filter-select"
                value={filtreRole}
                onChange={(e) => setFiltreRole(e.target.value)}
                aria-label="Filtrer par rôle"
              >
                <option value="tous">Tous les rôles</option>
                {rolesDisponibles.map((role) => (
                  <option key={role} value={role}>{formatLabel(role)}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrap">
              <select
                className="filter-select"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                aria-label="Filtrer par statut"
              >
                <option value="tous">Tous les statuts</option>
                {statutsDisponibles.map((statut) => (
                  <option key={statut} value={statut} style={{ color: statutColor(statut) }}>
                    {statutLabel(statut)}
                  </option>
                ))}
              </select>
            </div>

            {filtresActifs && (
              <button type="button" className="filter-reset" onClick={reinitialiserFiltres}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                Réinitialiser
              </button>
            )}
          </div>

          <span className="result-count">
            {usersFiltres.length} résultat(s)
          </span>
        </div>

        {chargement ? (
          <p className="texte-discret">Chargement…</p>
        ) : (
          <>
            <Tableau
              users={usersAffiches}
              onEdit={ouvrirEdition}
              onDelete={supprimer}
              onValidate={demanderValidation}
            />
            <Pagination
              pageActuelle={pageActuelle}
              totalPages={totalPages}
              totalElements={usersFiltres.length}
              elementsParPage={ELEMENTS_PAR_PAGE}
              onChangerPage={setPageActuelle}
            />
          </>
        )}
      </div>

      {showModalDelete && (
        <ConfirmModal
          variant="danger"
          title="Supprimer l'utilisateur ?"
          message={`Voulez-vous vraiment supprimer ${users.find((u) => u.id === userToDelete)?.nom || 'cet utilisateur'} ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={confirmerSuppression}
          onCancel={annulerSuppression}
        />
      )}

      {compteAApprouver && (
        <ConfirmModal
          variant="success"
          title="Approuver ce compte ?"
          message={`Voulez-vous vraiment approuver le compte de ${users.find((u) => u.id === compteAApprouver)?.nom || 'cet utilisateur'} ? Il aura alors accès à l'application.`}
          confirmLabel="Approuver"
          cancelLabel="Annuler"
          onConfirm={confirmerApprobation}
          onCancel={() => setCompteAApprouver(null)}
        />
      )}

      {compteCree && (
        <ConfirmModal
          variant="success"
          title="Compte créé"
          message={`Le compte de ${compteCree} a été créé avec succès.`}
          confirmLabel="OK"
          singleAction
          onConfirm={() => setCompteCree(null)}
          onCancel={() => setCompteCree(null)}
        />
      )}

      {compteARefuser && (
        <ConfirmModal
          variant="danger"
          title="Refuser ce compte ?"
          message={`Voulez-vous vraiment refuser le compte de ${users.find((u) => u.id === compteARefuser)?.nom || 'cet utilisateur'} ? Il n'aura pas accès à l'application.`}
          confirmLabel="Refuser"
          cancelLabel="Annuler"
          onConfirm={confirmerRefus}
          onCancel={() => setCompteARefuser(null)}
        />
      )}

      {succesSuppression && (
        <ConfirmModal
          variant="success"
          title="Utilisateur supprimé"
          message={`${succesSuppression} a été supprimé avec succès.`}
          confirmLabel="OK"
          singleAction
          onConfirm={() => setSuccesSuppression(null)}
          onCancel={() => setSuccesSuppression(null)}
        />
      )}

      {showModal && (
        <Modal
          userAModifier={userAModifier}
          onSave={sauvegarder}
          onClose={fermerModal}
        />
      )}
    </div>
  );
}

export default Dashboard;
