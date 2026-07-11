// Petits utilitaires pour lire/écrire des cookies simples (non httpOnly, côté client)

export function lireCookie(nom) {
  const cible = `${nom}=`;
  const valeur = document.cookie.split('; ').find((c) => c.startsWith(cible));
  if (!valeur) return null;
  try {
    return decodeURIComponent(valeur.slice(cible.length));
  } catch {
    return null;
  }
}

export function ecrireCookie(nom, valeur, jours = 90) {
  const expiration = new Date(Date.now() + jours * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${nom}=${encodeURIComponent(valeur)}; expires=${expiration}; path=/; SameSite=Lax`;
}
