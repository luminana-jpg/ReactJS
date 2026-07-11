import './Pagination.css';

const getPageNumbers = (pageActuelle, totalPages) => {
  const delta = 1;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= pageActuelle - delta && i <= pageActuelle + delta)) {
      pages.push(i);
    }
  }

  const avecPoints = [];
  let precedent = 0;
  pages.forEach((page) => {
    if (precedent && page - precedent === 2) {
      avecPoints.push(precedent + 1);
    } else if (precedent && page - precedent > 2) {
      avecPoints.push('...');
    }
    avecPoints.push(page);
    precedent = page;
  });

  return avecPoints;
};

function Pagination({ pageActuelle, totalPages, totalElements, elementsParPage, onChangerPage }) {
  if (totalElements === 0) return null;

  const premierElement = (pageActuelle - 1) * elementsParPage + 1;
  const dernierElement = Math.min(pageActuelle * elementsParPage, totalElements);
  const pages = getPageNumbers(pageActuelle, totalPages);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Affichage <strong>{premierElement}-{dernierElement}</strong> sur <strong>{totalElements}</strong> utilisateur(s)
      </span>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-btn pagination-nav"
            onClick={() => onChangerPage(pageActuelle - 1)}
            disabled={pageActuelle === 1}
            aria-label="Page précédente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {pages.map((page, index) =>
            page === '...' ? (
              <span key={`dots-${index}`} className="pagination-dots">…</span>
            ) : (
              <button
                key={page}
                type="button"
                className={`pagination-btn ${page === pageActuelle ? 'pagination-btn-active' : ''}`}
                onClick={() => onChangerPage(page)}
                aria-current={page === pageActuelle ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            className="pagination-btn pagination-nav"
            onClick={() => onChangerPage(pageActuelle + 1)}
            disabled={pageActuelle === totalPages}
            aria-label="Page suivante"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
