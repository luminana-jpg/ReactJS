import './StatsCards.css';

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconUserCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const IconUserX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="18" y1="8" x2="23" y2="13" />
    <line x1="23" y1="8" x2="18" y2="13" />
  </svg>
);

const IconKey = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
    <path d="m21 2-9.6 9.6" />
    <circle cx="7.5" cy="15.5" r="5.5" />
  </svg>
);

function StatsCards({ users }) {
  const total = users.length;

  const getStatut = (user) => String(user.statut ?? '').trim().toLowerCase();

  const approuves = users.filter((u) => getStatut(u) === 'approuve').length;
  const refuses = users.filter((u) => getStatut(u) === 'refuse').length;
  const admins = users.filter((u) => String(u.role).toLowerCase() === 'admin').length;

  return (
    <div className="stats-grid">
      <div className="stat-card stat-blue">
        <div className="stat-icon"><IconUsers /></div>
        <div className="stat-info">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total utilisateurs</span>
        </div>
      </div>

      <div className="stat-card stat-green">
        <div className="stat-icon"><IconUserCheck /></div>
        <div className="stat-info">
          <span className="stat-value">{approuves}</span>
          <span className="stat-label">Comptes approuvés</span>
        </div>
      </div>

      <div className="stat-card stat-red">
        <div className="stat-icon"><IconUserX /></div>
        <div className="stat-info">
          <span className="stat-value">{refuses}</span>
          <span className="stat-label">Comptes refusés</span>
        </div>
      </div>

      <div className="stat-card stat-purple">
        <div className="stat-icon"><IconKey /></div>
        <div className="stat-info">
          <span className="stat-value">{admins}</span>
          <span className="stat-label">Admins</span>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;