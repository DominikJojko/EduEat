-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Cze 23, 2024 at 10:42 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `edueat`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `class`
--

CREATE TABLE `class` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`id`, `name`) VALUES
(1, 'SP 1A'),
(2, 'SP 2B'),
(14, 'nau');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `meal_descriptions`
--

CREATE TABLE `meal_descriptions` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meal_descriptions`
--

INSERT INTO `meal_descriptions` (`id`, `date`) VALUES
(1171, '2024-06-18'),
(1172, '2024-06-19'),
(1173, '2024-06-20'),
(1174, '2024-06-21'),
(1175, '2024-06-24'),
(1176, '2024-06-25'),
(1177, '2024-06-26'),
(1178, '2024-06-27'),
(1179, '2024-06-28'),
(1180, '2024-09-02'),
(1181, '2024-09-03'),
(1182, '2024-09-04'),
(1183, '2024-09-05'),
(1184, '2024-09-06'),
(1185, '2024-09-09'),
(1186, '2024-09-10'),
(1187, '2024-09-11'),
(1188, '2024-09-12'),
(1189, '2024-09-13'),
(1190, '2024-09-16'),
(1191, '2024-09-17'),
(1192, '2024-09-18'),
(1193, '2024-09-19'),
(1194, '2024-09-20'),
(1195, '2024-09-23'),
(1196, '2024-09-24'),
(1197, '2024-09-25'),
(1198, '2024-09-26'),
(1199, '2024-09-27'),
(1200, '2024-09-30'),
(1201, '2024-10-01'),
(1202, '2024-10-02'),
(1203, '2024-10-03'),
(1204, '2024-10-04'),
(1205, '2024-10-07'),
(1206, '2024-10-08'),
(1207, '2024-10-09'),
(1208, '2024-10-10'),
(1209, '2024-10-11'),
(1210, '2024-10-14'),
(1211, '2024-10-15'),
(1212, '2024-10-16'),
(1213, '2024-10-17'),
(1214, '2024-10-18'),
(1215, '2024-10-21'),
(1216, '2024-10-22'),
(1217, '2024-10-23'),
(1218, '2024-10-24'),
(1219, '2024-10-25'),
(1220, '2024-10-28'),
(1221, '2024-10-29'),
(1222, '2024-10-30'),
(1223, '2024-10-31'),
(1224, '2024-11-01'),
(1225, '2024-11-04'),
(1226, '2024-11-05'),
(1227, '2024-11-06'),
(1228, '2024-11-07'),
(1229, '2024-11-08'),
(1230, '2024-11-11'),
(1231, '2024-11-12'),
(1232, '2024-11-13'),
(1233, '2024-11-14'),
(1234, '2024-11-15'),
(1235, '2024-11-18'),
(1236, '2024-11-19'),
(1237, '2024-11-20'),
(1238, '2024-11-21'),
(1239, '2024-11-22'),
(1240, '2024-11-25'),
(1241, '2024-11-26'),
(1242, '2024-11-27'),
(1243, '2024-11-28'),
(1244, '2024-11-29'),
(1245, '2024-12-02'),
(1246, '2024-12-03'),
(1247, '2024-12-04'),
(1248, '2024-12-05'),
(1249, '2024-12-06'),
(1250, '2024-12-09'),
(1251, '2024-12-10'),
(1252, '2024-12-11'),
(1253, '2024-12-12'),
(1254, '2024-12-13'),
(1255, '2024-12-16'),
(1256, '2024-12-17'),
(1257, '2024-12-18'),
(1258, '2024-12-19'),
(1259, '2024-12-20'),
(1260, '2024-12-23'),
(1261, '2024-12-24'),
(1262, '2024-12-25'),
(1263, '2024-12-26'),
(1264, '2024-12-27'),
(1265, '2024-12-30'),
(1266, '2024-12-31'),
(1267, '2025-01-01'),
(1268, '2025-01-02'),
(1269, '2025-01-03'),
(1270, '2025-01-06'),
(1271, '2025-01-07'),
(1272, '2025-01-08'),
(1274, '2025-01-10'),
(1275, '2025-01-13'),
(1276, '2025-01-14'),
(1277, '2025-01-15'),
(1278, '2025-01-16'),
(1279, '2025-01-17'),
(1280, '2025-01-20'),
(1281, '2025-01-21'),
(1282, '2025-01-22'),
(1283, '2025-01-23'),
(1284, '2025-01-24'),
(1285, '2025-01-27'),
(1286, '2025-01-28'),
(1287, '2025-01-29'),
(1288, '2025-01-30'),
(1289, '2025-01-31'),
(1290, '2025-02-03'),
(1291, '2025-02-04'),
(1292, '2025-02-05'),
(1293, '2025-02-06'),
(1294, '2025-02-07'),
(1295, '2025-02-10'),
(1296, '2025-02-11'),
(1297, '2025-02-12'),
(1298, '2025-02-13'),
(1299, '2025-02-14'),
(1300, '2025-02-17'),
(1301, '2025-02-18'),
(1302, '2025-02-19'),
(1303, '2025-02-20'),
(1304, '2025-02-21'),
(1305, '2025-02-24'),
(1306, '2025-02-25'),
(1307, '2025-02-26'),
(1308, '2025-02-27'),
(1309, '2025-02-28'),
(1310, '2025-03-03'),
(1311, '2025-03-04'),
(1312, '2025-03-05'),
(1313, '2025-03-06'),
(1314, '2025-03-07'),
(1315, '2025-03-10'),
(1316, '2025-03-11'),
(1317, '2025-03-12'),
(1318, '2025-03-13'),
(1319, '2025-03-14'),
(1320, '2025-03-17'),
(1321, '2025-03-18'),
(1322, '2025-03-19'),
(1323, '2025-03-20'),
(1324, '2025-03-21'),
(1325, '2025-03-24'),
(1326, '2025-03-25'),
(1327, '2025-03-26'),
(1328, '2025-03-27'),
(1329, '2025-03-28'),
(1330, '2025-03-31'),
(1331, '2025-04-01'),
(1332, '2025-04-02'),
(1333, '2025-04-03'),
(1334, '2025-04-04'),
(1335, '2025-04-07'),
(1336, '2025-04-08'),
(1337, '2025-04-09'),
(1338, '2025-04-10'),
(1339, '2025-04-11'),
(1340, '2025-04-14'),
(1341, '2025-04-15'),
(1342, '2025-04-16'),
(1343, '2025-04-17'),
(1344, '2025-04-18'),
(1345, '2025-04-21'),
(1346, '2025-04-22'),
(1347, '2025-04-23'),
(1348, '2025-04-24'),
(1349, '2025-04-25'),
(1350, '2025-04-28'),
(1351, '2025-04-29'),
(1352, '2025-04-30'),
(1353, '2025-05-01'),
(1354, '2025-05-02'),
(1355, '2025-05-05'),
(1356, '2025-05-06'),
(1357, '2025-05-07'),
(1358, '2025-05-08'),
(1359, '2025-05-09'),
(1360, '2025-05-12'),
(1361, '2025-05-13'),
(1362, '2025-05-14'),
(1363, '2025-05-15'),
(1364, '2025-05-16'),
(1365, '2025-05-19'),
(1366, '2025-05-20'),
(1367, '2025-05-21'),
(1368, '2025-05-22'),
(1369, '2025-05-23'),
(1370, '2025-05-26'),
(1371, '2025-05-27'),
(1372, '2025-05-28'),
(1373, '2025-05-29'),
(1374, '2025-05-30'),
(1375, '2025-06-02'),
(1376, '2025-06-03'),
(1377, '2025-06-04'),
(1378, '2025-06-05'),
(1379, '2025-06-06'),
(1380, '2025-06-09'),
(1381, '2025-06-10'),
(1382, '2025-06-11'),
(1383, '2025-06-12'),
(1384, '2025-06-13'),
(1385, '2025-06-16'),
(1386, '2025-06-17'),
(1387, '2025-06-18'),
(1388, '2025-06-19'),
(1389, '2025-06-20'),
(1390, '2025-06-23'),
(1391, '2025-06-24'),
(1392, '2025-06-25'),
(1393, '2025-06-26'),
(1394, '2025-06-27'),
(1396, '2024-06-11'),
(1399, '2024-06-14');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `order_meals`
--

CREATE TABLE `order_meals` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `meal_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_meals`
--

INSERT INTO `order_meals` (`id`, `user_id`, `meal_id`) VALUES
(261, 1, 1175),
(262, 1, 1176),
(263, 1, 1177),
(264, 1, 1178),
(265, 1, 1179);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Uzytkownik'),
(2, 'Moderator/Ksiegowa'),
(3, 'Administrator');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user`
--

CREATE TABLE `user` (
  `id` int(255) NOT NULL,
  `login` mediumtext NOT NULL,
  `password` mediumtext NOT NULL,
  `imie` mediumtext NOT NULL,
  `nazwisko` mediumtext NOT NULL,
  `role_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `imie`, `nazwisko`, `role_id`, `class_id`) VALUES
(1, 'admin', '$2b$10$0rr2rVxvUZFn./ErctDpY.9s9FFokpRAKCuEnXJIKud5.qjjp6h5C', 'Dominik', 'Jojko', 3, 1),
(2, 'user', '$2b$10$V2FvWpnoBK2vbe0UcT8me.s2r9486DhkaD8OR68fg6FGZdvZSHAsO', 'Kamil', 'Dziura', 1, 2),
(25, 'aj', '$2a$10$n3BU62BcaGXZQsZDZSNvLOGpCYfQc.WPa1KkW3egwoIb9K.abXKQC', 'a', 'j', 1, 14),
(26, 'fb', '$2a$10$0AntnkXJsXBkdu33ypJqi.k83VzJFVLCsjZ0bONVsc/c5IZ9UrbNq', 'franek', 'bak', 1, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_balance`
--

CREATE TABLE `user_balance` (
  `user_id` int(11) NOT NULL,
  `balance` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `meal_descriptions`
--
ALTER TABLE `meal_descriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `order_meals`
--
ALTER TABLE `order_meals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `meal_id` (`meal_id`);

--
-- Indeksy dla tabeli `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `user_ibfk_2` (`class_id`);

--
-- Indeksy dla tabeli `user_balance`
--
ALTER TABLE `user_balance`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `meal_descriptions`
--
ALTER TABLE `meal_descriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1400;

--
-- AUTO_INCREMENT for table `order_meals`
--
ALTER TABLE `order_meals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=266;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_meals`
--
ALTER TABLE `order_meals`
  ADD CONSTRAINT `order_meals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `order_meals_ibfk_2` FOREIGN KEY (`meal_id`) REFERENCES `meal_descriptions` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`);

--
-- Constraints for table `user_balance`
--
ALTER TABLE `user_balance`
  ADD CONSTRAINT `user_balance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
