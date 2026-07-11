<?php

require_once __DIR__ . '/config.php';
envoyerEntetes();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['succes' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$donnees = lireJSON();
$nom = trim($donnees['nom'] ?? '');
$email = trim($donnees['email'] ?? '');
$motDePasse = $donnees['mot_de_passe'] ?? '';

if ($nom === '' || $email === '' || $motDePasse === '') {
    http_response_code(400);
    echo json_encode(['succes' => false, 'message' => 'Tous les champs sont obligatoires.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['succes' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

if (strlen($motDePasse) < 8) {
    http_response_code(400);
    echo json_encode(['succes' => false, 'message' => 'Le mot de passe doit contenir au moins 8 caractères.']);
    exit;
}

$pdo = getConnexion();

$stmt = $pdo->prepare('SELECT id FROM utilisateurs WHERE email = :email');
$stmt->execute(['email' => $email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['succes' => false, 'message' => 'Cet email est déjà utilisé.']);
    exit;
}

$stmt = $pdo->prepare(
    'INSERT INTO utilisateurs (nom, email, mot_de_passe, role, statut)
     VALUES (:nom, :email, :mdp, "utilisateur", "en_attente")'
);
$stmt->execute([
    'nom' => $nom,
    'email' => $email,
    'mdp' => password_hash($motDePasse, PASSWORD_BCRYPT),
]);

echo json_encode([
    'succes' => true,
    'message' => 'Compte créé avec succès. Il doit être validé par un administrateur avant votre première connexion.',
]);