<?php
/**
 * auth.php — Fonctions d'authentification par cookie de session
 */

require_once __DIR__ . '/config.php';

define('COOKIE_NOM', 'session_admin');
define('SESSION_DUREE_SECONDES', 60 * 60 * 2); // 2 heures

function creerSession(int $utilisateurId): string
{
    $pdo = getConnexion();
    $sessionId = bin2hex(random_bytes(32));

    $stmt = $pdo->prepare(
        'INSERT INTO sessions (id, utilisateur_id, date_expiration)
         VALUES (:id, :uid, DATE_ADD(NOW(), INTERVAL ' . (int) SESSION_DUREE_SECONDES . ' SECOND))'
    );
    $stmt->execute(['id' => $sessionId, 'uid' => $utilisateurId]);

    // Pas d'option 'expires' : le cookie est un cookie de session,
    // supprimé par le navigateur à sa fermeture.
    setcookie(COOKIE_NOM, $sessionId, [
        'path'     => '/',
        'httponly' => true,
        'secure'   => false,   // mettre à true en production (HTTPS)
        'samesite' => 'Lax',   // 'None' + secure=true si front et back sur domaines différents en prod
    ]);

    return $sessionId;
}

function utilisateurConnecte(): ?array
{
    if (empty($_COOKIE[COOKIE_NOM])) {
        return null;
    }

    $pdo = getConnexion();
    $stmt = $pdo->prepare(
        'SELECT u.id, u.nom, u.email, u.role, u.statut
         FROM sessions s
         JOIN utilisateurs u ON u.id = s.utilisateur_id
         WHERE s.id = :sid AND s.date_expiration > NOW()'
    );
    $stmt->execute(['sid' => $_COOKIE[COOKIE_NOM]]);
    $utilisateur = $stmt->fetch();

    return $utilisateur ?: null;
}

function exigerAdmin(): array
{
    $utilisateur = utilisateurConnecte();
    if (!$utilisateur || $utilisateur['role'] !== 'admin') {
        http_response_code(401);
        echo json_encode(['succes' => false, 'message' => 'Authentification requise.']);
        exit;
    }
    return $utilisateur;
}

/**
 * exigerApprouve — Middleware : bloque l'accès aux routes/services réservés
 * aux comptes dont le statut est "approuve". À utiliser sur toute route
 * appelée depuis l'espace utilisateur (front EspaceUtilisateur).
 */
function exigerApprouve(): array
{
    $utilisateur = utilisateurConnecte();

    if (!$utilisateur) {
        http_response_code(401);
        echo json_encode(['succes' => false, 'message' => 'Authentification requise.']);
        exit;
    }

    if ($utilisateur['statut'] !== 'approuve') {
        http_response_code(403);
        echo json_encode([
            'succes' => false,
            'message' => $utilisateur['statut'] === 'refuse'
                ? 'Votre demande de compte a été refusée.'
                : 'Votre compte est en attente de validation par un administrateur.',
        ]);
        exit;
    }

    return $utilisateur;
}

function detruireSession(): void
{
    if (!empty($_COOKIE[COOKIE_NOM])) {
        $pdo = getConnexion();
        $stmt = $pdo->prepare('DELETE FROM sessions WHERE id = :sid');
        $stmt->execute(['sid' => $_COOKIE[COOKIE_NOM]]);

        setcookie(COOKIE_NOM, '', [
            'expires'  => time() - 3600,
            'path'     => '/',
            'httponly' => true,
            'secure'   => false,
            'samesite' => 'Lax',
        ]);
    }
}