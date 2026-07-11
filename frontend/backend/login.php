<?php
/**
 * login.php — Connexion administrateur, pose un cookie de session httpOnly
 * POST { email, mot_de_passe }
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
envoyerEntetes();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['succes' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$donnees = lireJSON();
$email = trim($donnees['email'] ?? '');
$motDePasse = $donnees['mot_de_passe'] ?? '';

if ($email === '' || $motDePasse === '') {
    http_response_code(400);
    echo json_encode(['succes' => false, 'message' => 'Email et mot de passe requis.']);
    exit;
}

$pdo = getConnexion();
$stmt = $pdo->prepare('SELECT id, nom, email, mot_de_passe, role FROM utilisateurs WHERE email = :email');
$stmt->execute(['email' => $email]);
$utilisateur = $stmt->fetch();

if (!$utilisateur || !password_verify($motDePasse, $utilisateur['mot_de_passe'])) {
    http_response_code(401);
    echo json_encode(['succes' => false, 'message' => 'Email ou mot de passe incorrect.']);
    exit;
}

if ($utilisateur['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['succes' => false, 'message' => 'Accès réservé aux administrateurs.']);
    exit;
}

creerSession((int) $utilisateur['id']);

echo json_encode([
    'succes' => true,
    'message' => 'Connexion réussie.',
    'utilisateur' => [
        'id'    => $utilisateur['id'],
        'nom'   => $utilisateur['nom'],
        'email' => $utilisateur['email'],
        'role'  => $utilisateur['role'],
    ],
]);