<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
envoyerEntetes();

detruireSession();
echo json_encode(['succes' => true, 'message' => 'Déconnexion réussie.']);