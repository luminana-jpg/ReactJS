-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 24 sep. 2026 à 10:16
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `db`
--

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(10) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` varchar(32) NOT NULL DEFAULT 'utilisateur',
  `statut` varchar(32) NOT NULL DEFAULT 'en_attente',
  `statut_session` varchar(32) DEFAULT NULL,
  `date_creation` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `email`, `mot_de_passe`, `role`, `statut`, `statut_session`, `date_creation`) VALUES
(1, 'Allie', 'allie@gmail.com', '$2y$10$naG9bV4zLH58huvQ3kkCbefA7Ch2r301g.RuXjyyCmdM.Fkra4qVm', 'admin', 'approuve', NULL, '2026-07-26 15:54:56'),
(2, 'Lulu', 'lulu@gmail.com', '$2y$10$qTMVwwdPLb5Vzi1pWe5Ff.N6h8Z89Z2lbgJE6u0OV6j6G2R1SyJNW', 'utilisateur', 'approuve', NULL, '2026-07-26 16:14:20'),
(3, 'nana', 'nana@gmail.com', '$2y$10$AbMTL1OVn8TaEBlPS4gi..g9bEbNYTPuL2ZkmTdYOHuEMQtm1il6W', 'utilisateur', 'en_attente', NULL, '2026-07-26 16:41:08'),
(4, 'baby', 'baby@gmail.com', '$2y$10$xG.wmDopgRnFWZzkTytS3efySZdQdDWlelbKCibGGkLhn2jVH6pbG', 'utilisateur', 'en_attente', NULL, '2026-07-26 16:45:49');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
