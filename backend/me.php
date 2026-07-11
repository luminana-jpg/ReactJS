<?php
/**
 * me.php — Renvoie l'utilisateur actuellement connecté
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
envoyerEntetes();

$utilisateur = utilisateurConnecte();

if (!$utilisateur) {
    http_response_code(401);
    echo json_encode(['succes' => false, 'message' => 'Non authentifié.']);
    exit;
}

echo json_encode(['succes' => true, 'utilisateur' => $utilisateur]);