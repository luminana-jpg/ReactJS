<?php
/**
 * valider_utilisateur.php — Approuver ou refuser un compte en attente
 * Réservé aux admins connectés.
 * POST { id, action: "approuver" | "refuser" }
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
envoyerEntetes();

exigerAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['succes' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$donnees = lireJSON();
$id = $donnees['id'] ?? null;
$action = $donnees['action'] ?? '';

if (!$id || !in_array($action, ['approuver', 'refuser'], true)) {
    http_response_code(400);
    echo json_encode(['succes' => false, 'message' => 'Requête invalide.']);
    exit;
}

$statut = $action === 'approuver' ? 'approuve' : 'refuse';

$pdo = getConnexion();
$stmt = $pdo->prepare('UPDATE utilisateurs SET statut = :statut WHERE id = :id');
$stmt->execute(['statut' => $statut, 'id' => $id]);

echo json_encode([
    'succes' => true,
    'message' => $action === 'approuver' ? 'Compte approuvé.' : 'Compte refusé.',
]);