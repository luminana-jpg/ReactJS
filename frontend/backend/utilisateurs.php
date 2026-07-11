<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
envoyerEntetes();

exigerAdmin();

$pdo = getConnexion();
$methode = $_SERVER['REQUEST_METHOD'];

switch ($methode) {

    case 'GET':
        if (!empty($_GET['id'])) {
            $stmt = $pdo->prepare('SELECT id, nom, email, role, date_creation FROM utilisateurs WHERE id = :id');
            $stmt->execute(['id' => $_GET['id']]);
            $utilisateur = $stmt->fetch();
            if (!$utilisateur) {
                http_response_code(404);
                echo json_encode(['succes' => false, 'message' => 'Utilisateur introuvable.']);
                exit;
            }
            echo json_encode(['succes' => true, 'utilisateur' => $utilisateur]);
        } else {
            $stmt = $pdo->query('SELECT id, nom, email, role, date_creation FROM utilisateurs ORDER BY id DESC');
            echo json_encode(['succes' => true, 'utilisateurs' => $stmt->fetchAll()]);
        }
        break;

    case 'POST':
        $donnees = lireJSON();
        $nom = trim($donnees['nom'] ?? '');
        $email = trim($donnees['email'] ?? '');
        $motDePasse = $donnees['mot_de_passe'] ?? '';
        $role = in_array($donnees['role'] ?? '', ['admin', 'utilisateur']) ? $donnees['role'] : 'utilisateur';

        if ($nom === '' || $email === '' || $motDePasse === '') {
            http_response_code(400);
            echo json_encode(['succes' => false, 'message' => 'Nom, email et mot de passe sont obligatoires.']);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['succes' => false, 'message' => 'Adresse email invalide.']);
            exit;
        }

        $stmt = $pdo->prepare('SELECT id FROM utilisateurs WHERE email = :email');
        $stmt->execute(['email' => $email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['succes' => false, 'message' => 'Cet email est déjà utilisé.']);
            exit;
        }

        $stmt = $pdo->prepare(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (:nom, :email, :mdp, :role)'
        );
        $stmt->execute([
            'nom' => $nom,
            'email' => $email,
            'mdp' => password_hash($motDePasse, PASSWORD_BCRYPT),
            'role' => $role,
        ]);

        echo json_encode(['succes' => true, 'message' => 'Utilisateur créé.', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        if (empty($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['succes' => false, 'message' => 'Identifiant manquant.']);
            exit;
        }
        $donnees = lireJSON();
        $nom = trim($donnees['nom'] ?? '');
        $email = trim($donnees['email'] ?? '');
        $role = in_array($donnees['role'] ?? '', ['admin', 'utilisateur']) ? $donnees['role'] : 'utilisateur';

        if ($nom === '' || $email === '') {
            http_response_code(400);
            echo json_encode(['succes' => false, 'message' => 'Nom et email sont obligatoires.']);
            exit;
        }

        $stmt = $pdo->prepare('UPDATE utilisateurs SET nom = :nom, email = :email, role = :role WHERE id = :id');
        $stmt->execute(['nom' => $nom, 'email' => $email, 'role' => $role, 'id' => $_GET['id']]);

        echo json_encode(['succes' => true, 'message' => 'Utilisateur mis à jour.']);
        break;

    case 'DELETE':
        if (empty($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['succes' => false, 'message' => 'Identifiant manquant.']);
            exit;
        }
        $stmt = $pdo->prepare('DELETE FROM utilisateurs WHERE id = :id');
        $stmt->execute(['id' => $_GET['id']]);

        echo json_encode(['succes' => true, 'message' => 'Utilisateur supprimé.']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['succes' => false, 'message' => 'Méthode non autorisée.']);
}