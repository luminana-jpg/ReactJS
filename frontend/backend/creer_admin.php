<?php
/**
 * creer_admin.php — Usage : php creer_admin.php "Nom" email@exemple.com MotDePasse
 */

require_once __DIR__ . '/config.php';

if ($argc < 4) {
    echo "Usage : php creer_admin.php \"Nom\" email@exemple.com MotDePasse\n";
    exit(1);
}

[, $nom, $email, $motDePasse] = $argv;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Email invalide.\n";
    exit(1);
}
if (strlen($motDePasse) < 8) {
    echo "Le mot de passe doit contenir au moins 8 caractères.\n";
    exit(1);
}

$pdo = getConnexion();

$stmt = $pdo->prepare('SELECT id FROM utilisateurs WHERE email = :email');
$stmt->execute(['email' => $email]);
if ($stmt->fetch()) {
    echo "Un utilisateur avec cet email existe déjà.\n";
    exit(1);
}

$stmt = $pdo->prepare(
    'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (:nom, :email, :mdp, "admin")'
);
$stmt->execute([
    'nom' => $nom,
    'email' => $email,
    'mdp' => password_hash($motDePasse, PASSWORD_BCRYPT),
]);

echo "Compte administrateur créé pour {$email}.\n";