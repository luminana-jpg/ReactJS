import { useState, useEffect } from 'react';
import './Modal.css';

function Modal({ userAModifier, onSave, onClose }) {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    role: 'utilisateur',
    mot_de_passe: ''
  });

  useEffect(() => {
    if (userAModifier) {
      setForm({
        id: userAModifier.id,
        nom: userAModifier.nom,
        email: userAModifier.email,
        role: userAModifier.role,
        mot_de_passe: '' // jamais pré-rempli, non modifié si laissé vide
      });
    } else {
      setForm({ nom: '', email: '', role: 'utilisateur', mot_de_passe: '' });
    }
  }, [userAModifier]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.email.trim()) {
      alert('Veuillez remplir tous les champs obligatoires !');
      return;
    }
    if (!userAModifier && !form.mot_de_passe.trim()) {
      alert('Le mot de passe est obligatoire pour créer un compte !');
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {userAModifier ? '✏️ Modifier l\'utilisateur' : '➕ Ajouter un utilisateur'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nom complet *</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="ex: Rakoto Jean"
            />
          </div>

          <div className="form-group">
            <label>Adresse email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@exemple.com"
            />
          </div>

          {!userAModifier && (
            <div className="form-group">
              <label>Mot de passe *</label>
              <input
                type="password"
                name="mot_de_passe"
                value={form.mot_de_passe}
                onChange={handleChange}
                placeholder="8 caractères minimum"
              />
            </div>
          )}

          <div className="form-group">
            <label>Rôle</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="utilisateur">Utilisateur</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-annuler" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-sauvegarder">
              {userAModifier ? 'Enregistrer les modifications' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;