/*
 Navicat Premium Data Transfer

 Source Server         : imjoye
 Source Server Type    : MySQL
 Source Server Version : 80027 (8.0.27)
 Source Host           : localhost:3306
 Source Schema         : imjoye

 Target Server Type    : MySQL
 Target Server Version : 80027 (8.0.27)
 File Encoding         : 65001

 Date: 01/07/2024 23:03:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for chatroom
-- ----------------------------
DROP TABLE IF EXISTS `chatroom`;
CREATE TABLE `chatroom` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('SINGLE','MULTIPLE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1819 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of chatroom
-- ----------------------------
BEGIN;
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1806, 'SINGLE', NULL, NULL, '2024-04-19 10:50:05');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1807, 'SINGLE', NULL, NULL, '2024-04-18 13:32:26');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1808, 'SINGLE', NULL, NULL, '2024-04-19 11:38:14');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1809, 'SINGLE', NULL, NULL, '2024-04-18 17:56:25');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1810, 'SINGLE', NULL, NULL, '2024-04-18 21:03:18');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1811, 'SINGLE', NULL, NULL, '2024-04-18 02:18:53');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1812, 'SINGLE', NULL, NULL, '2024-04-19 23:59:15');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1813, 'SINGLE', NULL, NULL, '2024-04-18 01:50:10');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1814, 'SINGLE', NULL, NULL, '2024-04-18 00:55:39');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1815, 'SINGLE', NULL, NULL, '2024-04-18 14:29:58');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1816, 'MULTIPLE', 'ttrawberry', 'https://www.yd2.net/AppsGames', '2024-04-17 06:30:56');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1817, 'MULTIPLE', 'Apple elite', 'http://www.xiong103.co.jp/CDsVinyl', '2024-04-18 09:58:41');
INSERT INTO `chatroom` (`id`, `type`, `name`, `avatar_url`, `create_time`) VALUES (1818, 'MULTIPLE', 'Cherry', 'https://drive.francescook4.co.jp/CellPhonesAccessories', '2024-04-18 00:21:19');
COMMIT;

-- ----------------------------
-- Table structure for friend_request
-- ----------------------------
DROP TABLE IF EXISTS `friend_request`;
CREATE TABLE `friend_request` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `from_id` int unsigned NOT NULL,
  `to_id` int unsigned NOT NULL,
  `status` enum('PENDING','REJECT','ACCEPT') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'PENDING',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of friend_request
-- ----------------------------
BEGIN;
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (1, 521, 505, 'ACCEPT', '2024-04-17 08:52:40', '2024-04-17 08:52:41');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (2, 519, 505, 'ACCEPT', '2024-04-17 17:39:58', '2024-04-17 17:39:59');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (3, 522, 505, 'ACCEPT', '2024-04-17 17:43:47', '2024-04-17 17:43:48');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (4, 513, 505, 'ACCEPT', '2024-04-16 14:43:44', '2024-04-16 14:43:45');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (5, 515, 505, 'ACCEPT', '2024-04-17 02:55:46', '2024-04-17 02:55:47');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (6, 505, 506, 'ACCEPT', '2024-04-17 20:10:46', '2024-04-17 20:10:47');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (7, 517, 506, 'ACCEPT', '2024-04-16 16:16:33', '2024-04-16 16:16:34');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (8, 522, 506, 'ACCEPT', '2024-04-16 05:59:50', '2024-04-16 05:59:51');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (9, 512, 506, 'ACCEPT', '2024-04-16 11:21:26', '2024-04-16 11:21:27');
INSERT INTO `friend_request` (`id`, `from_id`, `to_id`, `status`, `create_time`, `update_time`) VALUES (10, 516, 506, 'ACCEPT', '2024-04-16 01:46:17', '2024-04-16 01:46:18');
COMMIT;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `chatroom_id` int unsigned NOT NULL,
  `from` int unsigned NOT NULL,
  `content` text NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10700 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of message
-- ----------------------------
BEGIN;
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10088, 1818, 512, 'All journeys have secret destinations of which the traveler is unaware.', '2024-04-22 19:58:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10089, 1811, 505, 'The reason why a great man is great is that he resolves to be a great man.', '2024-04-24 17:50:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10090, 1817, 521, 'To connect to a database or schema, simply double-click it in the pane.', '2024-04-22 22:10:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10091, 1814, 506, 'Secure Sockets Layer(SSL) is a protocol for transmitting private documents via the Internet.', '2024-04-22 13:56:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10092, 1818, 512, 'All the Navicat Cloud objects are located under different projects. You can share                   ', '2024-04-24 11:59:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10093, 1811, 506, 'I destroy my enemies when I make them my friends. To successfully establish a new                   ', '2024-04-22 22:13:55');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10094, 1815, 506, 'It is used while your ISPs do not allow direct connections, but allows establishing                 ', '2024-04-24 14:45:06');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10095, 1810, 505, 'To open a query using an external editor, control-click it and select Open with External            ', '2024-04-22 04:26:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10096, 1807, 519, 'If the plan doesn’t work, change the plan, but never the goal.', '2024-04-23 16:39:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10097, 1810, 515, 'In the middle of winter I at last discovered that there was in me an invincible summer.             ', '2024-04-25 01:41:31');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10098, 1815, 516, 'How we spend our days is, of course, how we spend our lives.', '2024-04-25 19:23:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10099, 1818, 512, 'After comparing data, the window shows the number of records that will be inserted,                 ', '2024-04-22 19:05:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10100, 1813, 522, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-25 02:18:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10101, 1811, 506, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-24 00:48:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10102, 1814, 506, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-24 09:47:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10103, 1816, 510, 'If opportunity doesn’t knock, build a door. Navicat Data Modeler is a powerful                    ', '2024-04-23 16:02:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10104, 1808, 522, 'Anyone who has ever made anything of importance was disciplined. Navicat allows you                 ', '2024-04-24 03:36:33');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10105, 1814, 512, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-25 03:20:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10106, 1806, 505, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more.', '2024-04-24 15:20:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10107, 1818, 523, 'To get a secure connection, the first thing you need to do is to install OpenSSL                    ', '2024-04-24 14:43:59');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10108, 1814, 506, 'The On Startup feature allows you to control what tabs appear when you launch Navicat.', '2024-04-23 04:21:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10109, 1815, 506, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-23 23:34:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10110, 1808, 505, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-24 06:11:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10111, 1815, 516, 'Navicat Monitor is a safe, simple and agentless remote server monitoring tool that                  ', '2024-04-22 09:20:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10112, 1815, 516, 'With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and                  ', '2024-04-23 07:36:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10113, 1817, 521, 'Sometimes you win, sometimes you learn. Optimism is the one quality more associated                 ', '2024-04-22 17:49:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10114, 1808, 522, 'Creativity is intelligence having fun. Sometimes you win, sometimes you learn.                      ', '2024-04-25 18:08:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10115, 1815, 516, 'Navicat Monitor can be installed on any local computer or virtual machine and does                  ', '2024-04-22 17:36:31');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10116, 1817, 521, 'Navicat provides a wide range advanced features, such as compelling code editing                    ', '2024-04-24 22:19:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10117, 1818, 512, 'It wasn’t raining when Noah built the ark. Flexible settings enable you to set                    ', '2024-04-25 12:13:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10118, 1817, 513, 'Navicat allows you to transfer data from one database and/or schema to another with                 ', '2024-04-24 21:51:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10119, 1811, 505, 'Export Wizard allows you to export data from tables, collections, views, or query                   ', '2024-04-22 07:48:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10120, 1815, 516, 'To get a secure connection, the first thing you need to do is to install OpenSSL                    ', '2024-04-23 10:22:42');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10121, 1818, 523, 'Secure SHell (SSH) is a program to log in into another computer over a network, execute             ', '2024-04-24 01:53:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10122, 1813, 506, 'The Navigation pane employs tree structure which allows you to take action upon the                 ', '2024-04-23 11:23:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10123, 1809, 513, 'All journeys have secret destinations of which the traveler is unaware.', '2024-04-24 16:03:06');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10124, 1811, 506, 'If opportunity doesn’t knock, build a door. Navicat 15 has added support for the                  ', '2024-04-25 12:53:48');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10125, 1816, 507, 'Champions keep playing until they get it right.', '2024-04-25 12:38:44');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10126, 1809, 513, 'The past has no power over the present moment. Secure Sockets Layer(SSL) is a protocol              ', '2024-04-23 12:30:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10127, 1811, 505, 'Export Wizard allows you to export data from tables, collections, views, or query                   ', '2024-04-25 10:57:51');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10128, 1818, 523, 'With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and                  ', '2024-04-24 19:52:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10129, 1812, 517, 'In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram              ', '2024-04-23 12:49:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10130, 1807, 505, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-24 10:38:51');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10131, 1818, 509, 'Creativity is intelligence having fun. Sometimes you win, sometimes you learn.', '2024-04-23 00:28:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10132, 1810, 515, 'It provides strong authentication and secure encrypted communications between two                   ', '2024-04-23 01:15:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10133, 1812, 506, 'SSH serves to prevent such vulnerabilities and allows you to access a remote server\'s               ', '2024-04-23 17:18:42');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10134, 1811, 506, 'Navicat Cloud provides a cloud service for synchronizing connections, queries, model                ', '2024-04-23 02:54:50');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10135, 1814, 506, 'Such sessions are also susceptible to session hijacking, where a malicious user takes               ', '2024-04-23 20:44:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10136, 1807, 505, 'You cannot save people, you can just love them. Navicat Data Modeler is a powerful                  ', '2024-04-25 12:12:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10137, 1813, 506, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more.', '2024-04-24 18:40:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10138, 1814, 506, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-25 09:12:30');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10139, 1814, 512, 'Navicat is a multi-connections Database Administration tool allowing you to connect                 ', '2024-04-25 01:56:44');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10140, 1817, 517, 'It is used while your ISPs do not allow direct connections, but allows establishing                 ', '2024-04-22 09:39:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10141, 1816, 510, 'To clear or reload various internal caches, flush tables, or acquire locks, control-click           ', '2024-04-25 19:31:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10142, 1816, 507, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-25 02:47:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10143, 1809, 513, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more.', '2024-04-25 05:56:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10144, 1807, 505, 'I will greet this day with love in my heart. It provides strong authentication and                  ', '2024-04-25 16:09:07');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10145, 1815, 516, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-22 19:51:12');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10146, 1816, 507, 'Creativity is intelligence having fun. All journeys have secret destinations of which               ', '2024-04-25 23:16:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10147, 1812, 517, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-22 01:50:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10148, 1811, 505, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-22 02:49:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10149, 1808, 522, 'Navicat Data Modeler enables you to build high-quality conceptual, logical and physical             ', '2024-04-22 23:34:38');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10150, 1806, 521, 'The reason why a great man is great is that he resolves to be a great man.', '2024-04-25 01:55:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10151, 1810, 505, 'How we spend our days is, of course, how we spend our lives. You cannot save people,                ', '2024-04-23 04:07:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10152, 1807, 519, 'Anyone who has ever made anything of importance was disciplined. The Main Window                    ', '2024-04-25 13:19:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10153, 1812, 506, 'How we spend our days is, of course, how we spend our lives.', '2024-04-24 02:36:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10154, 1815, 516, 'Sometimes you win, sometimes you learn. To connect to a database or schema, simply                  ', '2024-04-24 09:08:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10155, 1815, 516, 'In other words, Navicat provides the ability for data in different databases and/or                 ', '2024-04-25 06:39:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10156, 1812, 517, 'The past has no power over the present moment. The repository database can be an                    ', '2024-04-25 16:07:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10157, 1817, 521, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-22 18:07:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10158, 1818, 512, 'It is used while your ISPs do not allow direct connections, but allows establishing                 ', '2024-04-25 08:53:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10159, 1817, 513, 'Such sessions are also susceptible to session hijacking, where a malicious user takes               ', '2024-04-23 21:48:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10160, 1809, 513, 'Optimism is the one quality more associated with success and happiness than any other.', '2024-04-22 09:51:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10161, 1818, 523, 'How we spend our days is, of course, how we spend our lives. Navicat Data Modeler                   ', '2024-04-22 04:52:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10162, 1806, 521, 'The reason why a great man is great is that he resolves to be a great man.', '2024-04-24 00:37:54');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10163, 1816, 523, 'After comparing data, the window shows the number of records that will be inserted,                 ', '2024-04-24 08:23:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10164, 1807, 519, 'Genius is an infinite capacity for taking pains.', '2024-04-23 04:16:51');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10165, 1813, 506, 'Remember that failure is an event, not a person.', '2024-04-25 22:11:02');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10166, 1814, 506, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more.', '2024-04-25 20:27:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10167, 1817, 517, 'If it scares you, it might be a good thing to try.', '2024-04-25 16:20:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10168, 1808, 505, 'Remember that failure is an event, not a person. The past has no power over the present moment.', '2024-04-25 10:42:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10169, 1810, 505, 'Navicat is a multi-connections Database Administration tool allowing you to connect                 ', '2024-04-24 22:20:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10170, 1806, 505, 'To clear or reload various internal caches, flush tables, or acquire locks, control-click           ', '2024-04-22 16:43:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10171, 1817, 521, 'All journeys have secret destinations of which the traveler is unaware.                             ', '2024-04-23 14:19:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10172, 1809, 505, 'Optimism is the one quality more associated with success and happiness than any other.', '2024-04-23 02:15:35');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10173, 1806, 505, 'If the plan doesn’t work, change the plan, but never the goal.', '2024-04-23 21:07:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10174, 1816, 510, 'I will greet this day with love in my heart.', '2024-04-23 14:24:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10175, 1814, 506, 'How we spend our days is, of course, how we spend our lives. Flexible settings enable               ', '2024-04-23 10:21:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10176, 1808, 522, 'The past has no power over the present moment.', '2024-04-25 15:44:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10177, 1812, 517, 'If it scares you, it might be a good thing to try.', '2024-04-25 16:54:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10178, 1817, 517, 'To start working with your server in Navicat, you should first establish a connection               ', '2024-04-24 06:52:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10179, 1806, 505, 'The On Startup feature allows you to control what tabs appear when you launch Navicat.', '2024-04-25 06:01:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10180, 1817, 521, 'Flexible settings enable you to set up a custom key for comparison and synchronization.             ', '2024-04-25 20:57:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10181, 1810, 515, 'It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud.              ', '2024-04-22 09:20:06');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10182, 1807, 519, 'It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud.              ', '2024-04-22 20:03:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10183, 1808, 522, 'In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram              ', '2024-04-24 18:49:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10184, 1815, 516, 'Such sessions are also susceptible to session hijacking, where a malicious user takes               ', '2024-04-22 00:36:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10185, 1812, 506, 'In other words, Navicat provides the ability for data in different databases and/or                 ', '2024-04-23 04:44:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10186, 1810, 515, 'SQL Editor allows you to create and edit SQL text, prepare and execute selected queries.', '2024-04-23 14:56:42');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10187, 1816, 510, 'Navicat Cloud provides a cloud service for synchronizing connections, queries, model                ', '2024-04-25 14:31:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10188, 1817, 521, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-25 00:58:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10189, 1807, 505, 'I will greet this day with love in my heart. You must be the change you wish to see in the world.', '2024-04-22 07:58:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10190, 1817, 513, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-23 18:50:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10191, 1810, 515, 'Navicat Monitor can be installed on any local computer or virtual machine and does                  ', '2024-04-25 10:28:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10192, 1817, 517, 'Remember that failure is an event, not a person. The past has no power over the present moment.', '2024-04-23 20:17:55');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10193, 1815, 516, 'Always keep your eyes open. Keep watching. Because whatever you see can inspire you.                ', '2024-04-23 01:01:59');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10194, 1816, 510, 'If you wait, all that happens is you get older. Typically, it is employed as an encrypted           ', '2024-04-23 15:23:51');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10195, 1817, 513, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more.', '2024-04-22 15:25:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10196, 1812, 506, 'HTTP Tunneling is a method for connecting to a server that uses the same protocol                   ', '2024-04-23 06:14:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10197, 1814, 506, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-22 09:08:07');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10198, 1818, 509, 'I destroy my enemies when I make them my friends. Champions keep playing until they get it right.', '2024-04-24 03:29:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10199, 1811, 505, 'I will greet this day with love in my heart. Navicat provides a wide range advanced                 ', '2024-04-22 19:36:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10200, 1817, 517, 'Navicat 15 has added support for the system-wide dark mode.', '2024-04-25 14:11:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10201, 1807, 505, 'Navicat Monitor is a safe, simple and agentless remote server monitoring tool that                  ', '2024-04-22 15:38:07');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10202, 1813, 506, 'The Main Window consists of several toolbars and panes for you to work on connections,              ', '2024-04-23 20:14:40');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10203, 1811, 506, 'The Synchronize to Database function will give you a full picture of all database differences.', '2024-04-22 07:50:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10204, 1815, 506, 'In other words, Navicat provides the ability for data in different databases and/or                 ', '2024-04-22 23:23:20');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10205, 1818, 509, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-22 12:24:35');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10206, 1806, 505, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server,                  ', '2024-04-24 04:12:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10207, 1813, 506, 'It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud.              ', '2024-04-23 13:52:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10208, 1816, 523, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-25 20:54:35');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10209, 1808, 522, 'Actually it is just in an idea when feel oneself can achieve and cannot achieve.', '2024-04-24 15:09:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10210, 1810, 515, 'All journeys have secret destinations of which the traveler is unaware.                             ', '2024-04-22 23:19:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10211, 1814, 506, 'If you wait, all that happens is you get older. You will succeed because most people are lazy.      ', '2024-04-24 04:13:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10212, 1817, 517, 'The Navigation pane employs tree structure which allows you to take action upon the                 ', '2024-04-23 08:20:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10213, 1810, 515, 'A comfort zone is a beautiful place, but nothing ever grows there.', '2024-04-23 14:21:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10214, 1816, 523, 'Secure SHell (SSH) is a program to log in into another computer over a network, execute             ', '2024-04-23 02:26:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10215, 1814, 506, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-25 16:46:48');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10216, 1817, 517, 'Navicat allows you to transfer data from one database and/or schema to another with                 ', '2024-04-22 15:28:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10217, 1811, 505, 'Such sessions are also susceptible to session hijacking, where a malicious user takes               ', '2024-04-22 05:17:33');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10218, 1815, 516, 'Navicat Data Modeler enables you to build high-quality conceptual, logical and physical             ', '2024-04-25 17:49:06');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10219, 1808, 522, 'After comparing data, the window shows the number of records that will be inserted,                 ', '2024-04-22 08:54:46');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10220, 1809, 505, 'SSH serves to prevent such vulnerabilities and allows you to access a remote server\'s               ', '2024-04-25 22:54:30');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10221, 1813, 506, 'If the plan doesn’t work, change the plan, but never the goal.', '2024-04-23 02:38:51');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10222, 1809, 505, 'Actually it is just in an idea when feel oneself can achieve and cannot achieve.', '2024-04-24 17:06:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10223, 1815, 506, 'Navicat Monitor requires a repository to store alerts and metrics for historical analysis.', '2024-04-25 03:38:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10224, 1817, 513, 'Navicat Data Modeler enables you to build high-quality conceptual, logical and physical             ', '2024-04-23 12:11:50');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10225, 1815, 516, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-24 12:05:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10226, 1808, 522, 'The past has no power over the present moment.', '2024-04-22 10:07:00');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10227, 1811, 505, 'The reason why a great man is great is that he resolves to be a great man.                          ', '2024-04-23 12:24:00');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10228, 1816, 523, 'After comparing data, the window shows the number of records that will be inserted,                 ', '2024-04-25 08:06:12');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10229, 1818, 512, 'All the Navicat Cloud objects are located under different projects. You can share                   ', '2024-04-23 04:27:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10230, 1814, 512, 'The Main Window consists of several toolbars and panes for you to work on connections,              ', '2024-04-22 07:30:07');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10231, 1816, 523, 'After logged in the Navicat Cloud feature, the Navigation pane will be divided into                 ', '2024-04-23 14:50:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10232, 1816, 507, 'To clear or reload various internal caches, flush tables, or acquire locks, control-click           ', '2024-04-22 18:56:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10233, 1818, 523, 'Navicat Monitor is a safe, simple and agentless remote server monitoring tool that                  ', '2024-04-22 06:41:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10234, 1816, 510, 'If it scares you, it might be a good thing to try. You will succeed because most people are lazy.', '2024-04-22 03:38:12');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10235, 1813, 522, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-25 01:56:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10236, 1814, 512, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-24 12:23:06');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10237, 1817, 517, 'Difficult circumstances serve as a textbook of life for people.', '2024-04-23 03:35:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10238, 1817, 513, 'A man’s best friends are his ten fingers.', '2024-04-22 07:56:33');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10239, 1806, 521, 'The On Startup feature allows you to control what tabs appear when you launch Navicat.              ', '2024-04-23 10:56:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10240, 1816, 507, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server,                  ', '2024-04-23 06:13:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10241, 1809, 513, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more.', '2024-04-22 17:15:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10242, 1817, 517, 'To start working with your server in Navicat, you should first establish a connection               ', '2024-04-23 12:20:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10243, 1817, 521, 'Always keep your eyes open. Keep watching. Because whatever you see can inspire you.', '2024-04-24 00:19:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10244, 1809, 505, 'What you get by achieving your goals is not as important as what you become by achieving your goals.', '2024-04-24 14:23:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10245, 1811, 505, 'A comfort zone is a beautiful place, but nothing ever grows there.', '2024-04-22 21:43:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10246, 1812, 517, 'Champions keep playing until they get it right.', '2024-04-25 00:57:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10247, 1817, 513, 'Secure SHell (SSH) is a program to log in into another computer over a network, execute             ', '2024-04-23 20:27:00');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10248, 1808, 505, 'All journeys have secret destinations of which the traveler is unaware.', '2024-04-23 20:54:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10249, 1811, 505, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-22 22:03:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10250, 1808, 522, 'I will greet this day with love in my heart. I will greet this day with love in my heart.', '2024-04-22 07:43:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10251, 1810, 505, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-23 17:01:44');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10252, 1811, 506, 'If opportunity doesn’t knock, build a door.', '2024-04-25 07:50:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10253, 1814, 512, 'If you wait, all that happens is you get older. What you get by achieving your goals                ', '2024-04-22 12:49:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10254, 1814, 506, 'What you get by achieving your goals is not as important as what you become by achieving your goals.', '2024-04-22 21:29:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10255, 1816, 510, 'How we spend our days is, of course, how we spend our lives.', '2024-04-22 17:45:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10256, 1811, 505, 'Creativity is intelligence having fun. In the middle of winter I at last discovered                 ', '2024-04-22 20:22:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10257, 1816, 523, 'Creativity is intelligence having fun. Secure Sockets Layer(SSL) is a protocol for                  ', '2024-04-24 09:05:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10258, 1811, 506, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-24 21:27:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10259, 1809, 513, 'The Navigation pane employs tree structure which allows you to take action upon the                 ', '2024-04-23 04:37:00');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10260, 1818, 509, 'A man is not old until regrets take the place of dreams.', '2024-04-25 12:06:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10261, 1816, 507, 'With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and                  ', '2024-04-25 04:49:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10262, 1815, 516, 'In the middle of winter I at last discovered that there was in me an invincible summer.', '2024-04-24 14:50:48');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10263, 1817, 517, 'All journeys have secret destinations of which the traveler is unaware.', '2024-04-22 02:45:31');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10264, 1812, 517, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-22 19:13:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10265, 1815, 516, 'Navicat Data Modeler enables you to build high-quality conceptual, logical and physical             ', '2024-04-24 22:29:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10266, 1807, 505, 'All journeys have secret destinations of which the traveler is unaware.                             ', '2024-04-24 20:13:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10267, 1812, 517, 'Navicat authorizes you to make connection to remote servers running on different                    ', '2024-04-24 11:51:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10268, 1806, 505, 'After logged in the Navicat Cloud feature, the Navigation pane will be divided into                 ', '2024-04-24 09:09:20');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10269, 1809, 513, 'Remember that failure is an event, not a person.', '2024-04-25 07:14:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10270, 1818, 512, 'Such sessions are also susceptible to session hijacking, where a malicious user takes               ', '2024-04-22 10:41:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10271, 1810, 515, 'It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud.              ', '2024-04-25 15:10:48');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10272, 1815, 516, 'Export Wizard allows you to export data from tables, collections, views, or query                   ', '2024-04-22 22:47:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10273, 1816, 507, 'If you wait, all that happens is you get older. Navicat 15 has added support for                    ', '2024-04-25 09:14:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10274, 1817, 517, 'If your Internet Service Provider (ISP) does not provide direct access to its server,               ', '2024-04-22 05:47:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10275, 1816, 507, 'It provides strong authentication and secure encrypted communications between two                   ', '2024-04-22 01:38:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10276, 1815, 506, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-23 22:14:55');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10277, 1817, 513, 'You will succeed because most people are lazy. It collects process metrics such as                  ', '2024-04-25 06:38:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10278, 1810, 505, 'To start working with your server in Navicat, you should first establish a connection               ', '2024-04-23 09:00:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10279, 1814, 512, 'Navicat Cloud provides a cloud service for synchronizing connections, queries, model                ', '2024-04-24 18:13:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10280, 1813, 506, 'Export Wizard allows you to export data from tables, collections, views, or query                   ', '2024-04-22 01:09:48');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10281, 1814, 506, 'In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram              ', '2024-04-25 04:38:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10282, 1810, 515, 'Difficult circumstances serve as a textbook of life for people.', '2024-04-23 07:01:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10283, 1811, 505, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-24 02:32:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10284, 1812, 506, 'If the plan doesn’t work, change the plan, but never the goal.', '2024-04-22 06:10:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10285, 1817, 521, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-24 11:47:33');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10286, 1812, 517, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-25 01:19:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10287, 1808, 522, 'I will greet this day with love in my heart. Navicat allows you to transfer data                    ', '2024-04-23 09:23:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10288, 1814, 506, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-24 22:42:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10289, 1817, 517, 'You can select any connections, objects or projects, and then select the corresponding              ', '2024-04-25 02:39:00');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10290, 1810, 505, 'The past has no power over the present moment. In the Objects tab, you can use the                  ', '2024-04-23 16:33:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10291, 1809, 513, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-22 12:09:30');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10292, 1817, 517, 'You cannot save people, you can just love them.', '2024-04-24 00:20:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10293, 1816, 523, 'Anyone who has never made a mistake has never tried anything new. In a Telnet session,              ', '2024-04-25 00:54:46');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10294, 1811, 505, 'If it scares you, it might be a good thing to try.', '2024-04-23 16:36:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10295, 1814, 506, 'Always keep your eyes open. Keep watching. Because whatever you see can inspire you.', '2024-04-24 06:44:30');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10296, 1818, 523, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-22 18:27:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10297, 1813, 522, 'If the plan doesn’t work, change the plan, but never the goal.', '2024-04-22 21:34:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10298, 1816, 507, 'Champions keep playing until they get it right. Optimism is the one quality more                    ', '2024-04-22 10:36:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10299, 1813, 522, 'Success consists of going from failure to failure without loss of enthusiasm.', '2024-04-22 04:27:45');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10300, 1808, 505, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-24 15:32:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10301, 1809, 505, 'Navicat authorizes you to make connection to remote servers running on different                    ', '2024-04-22 07:13:44');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10302, 1812, 517, 'SSH serves to prevent such vulnerabilities and allows you to access a remote server\'s               ', '2024-04-25 00:14:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10303, 1809, 513, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-22 21:48:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10304, 1817, 513, 'Creativity is intelligence having fun. Navicat 15 has added support for the system-wide dark mode.', '2024-04-24 01:04:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10305, 1818, 523, 'Genius is an infinite capacity for taking pains.', '2024-04-24 03:45:12');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10306, 1814, 506, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-22 20:21:55');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10307, 1813, 522, 'A man’s best friends are his ten fingers.', '2024-04-24 13:16:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10308, 1816, 523, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server,                  ', '2024-04-23 07:07:33');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10309, 1807, 519, 'The Main Window consists of several toolbars and panes for you to work on connections,              ', '2024-04-25 03:33:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10310, 1814, 506, 'Navicat authorizes you to make connection to remote servers running on different                    ', '2024-04-23 07:23:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10311, 1817, 521, 'There is no way to happiness. Happiness is the way. A man’s best friends are his ten fingers.', '2024-04-24 13:51:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10312, 1814, 506, 'The On Startup feature allows you to control what tabs appear when you launch Navicat.', '2024-04-24 00:06:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10313, 1812, 506, 'If it scares you, it might be a good thing to try.', '2024-04-23 08:07:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10314, 1817, 513, 'The Navigation pane employs tree structure which allows you to take action upon the                 ', '2024-04-24 20:01:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10315, 1811, 505, 'Secure Sockets Layer(SSL) is a protocol for transmitting private documents via the Internet.', '2024-04-25 02:52:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10316, 1818, 512, 'The Main Window consists of several toolbars and panes for you to work on connections,              ', '2024-04-25 13:03:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10317, 1817, 513, 'To open a query using an external editor, control-click it and select Open with External            ', '2024-04-23 13:50:44');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10318, 1810, 515, 'There is no way to happiness. Happiness is the way. After comparing data, the window                ', '2024-04-24 08:31:05');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10319, 1815, 516, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-23 09:29:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10320, 1812, 517, 'Sometimes you win, sometimes you learn. Navicat Data Modeler is a powerful and cost-effective       ', '2024-04-24 18:07:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10321, 1810, 505, 'To get a secure connection, the first thing you need to do is to install OpenSSL                    ', '2024-04-25 18:48:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10322, 1809, 505, 'A comfort zone is a beautiful place, but nothing ever grows there. It is used while                 ', '2024-04-23 05:08:42');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10323, 1817, 517, 'The past has no power over the present moment. Always keep your eyes open. Keep watching.           ', '2024-04-24 09:20:20');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10324, 1812, 506, 'Navicat Cloud provides a cloud service for synchronizing connections, queries, model                ', '2024-04-23 22:03:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10325, 1816, 507, 'What you get by achieving your goals is not as important as what you become by achieving your goals.', '2024-04-22 19:13:12');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10326, 1817, 513, 'SQL Editor allows you to create and edit SQL text, prepare and execute selected queries.', '2024-04-25 21:24:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10327, 1807, 505, 'Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud                  ', '2024-04-22 08:31:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10328, 1813, 506, 'Difficult circumstances serve as a textbook of life for people.', '2024-04-23 21:37:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10329, 1815, 506, 'You will succeed because most people are lazy. Navicat allows you to transfer data                  ', '2024-04-25 12:39:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10330, 1813, 506, 'In the middle of winter I at last discovered that there was in me an invincible summer.', '2024-04-25 05:20:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10331, 1816, 523, 'Optimism is the one quality more associated with success and happiness than any other.', '2024-04-22 09:50:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10332, 1811, 506, 'To open a query using an external editor, control-click it and select Open with External            ', '2024-04-24 02:38:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10333, 1808, 505, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-25 11:39:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10334, 1812, 506, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-24 06:46:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10335, 1810, 505, 'Always keep your eyes open. Keep watching. Because whatever you see can inspire you.', '2024-04-24 03:00:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10336, 1812, 506, 'The first step is as good as half over. You can select any connections, objects or                  ', '2024-04-23 22:51:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10337, 1806, 505, 'A man is not old until regrets take the place of dreams.', '2024-04-23 11:09:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10338, 1806, 521, 'Export Wizard allows you to export data from tables, collections, views, or query                   ', '2024-04-25 13:54:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10339, 1815, 506, 'Sometimes you win, sometimes you learn.', '2024-04-24 12:35:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10340, 1815, 506, 'Anyone who has ever made anything of importance was disciplined. To get a secure                    ', '2024-04-23 14:28:30');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10341, 1807, 519, 'A comfort zone is a beautiful place, but nothing ever grows there. Export Wizard                    ', '2024-04-23 02:59:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10342, 1808, 522, 'SSH serves to prevent such vulnerabilities and allows you to access a remote server\'s               ', '2024-04-22 07:39:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10343, 1818, 509, 'You can select any connections, objects or projects, and then select the corresponding              ', '2024-04-23 12:34:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10344, 1816, 523, 'Navicat 15 has added support for the system-wide dark mode.', '2024-04-23 10:35:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10345, 1815, 516, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-24 11:28:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10346, 1810, 515, 'The Navigation pane employs tree structure which allows you to take action upon the                 ', '2024-04-23 04:52:05');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10347, 1814, 512, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-24 23:30:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10348, 1816, 510, 'Navicat authorizes you to make connection to remote servers running on different                    ', '2024-04-23 10:59:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10349, 1818, 509, 'Navicat Cloud provides a cloud service for synchronizing connections, queries, model                ', '2024-04-24 09:05:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10350, 1811, 506, 'To connect to a database or schema, simply double-click it in the pane.', '2024-04-25 19:20:35');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10351, 1816, 510, 'HTTP Tunneling is a method for connecting to a server that uses the same protocol                   ', '2024-04-22 03:34:40');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10352, 1813, 522, 'I destroy my enemies when I make them my friends. All journeys have secret destinations             ', '2024-04-24 12:57:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10353, 1817, 521, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-25 00:58:07');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10354, 1816, 507, 'The Synchronize to Database function will give you a full picture of all database differences.      ', '2024-04-23 12:18:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10355, 1815, 516, 'You must be the change you wish to see in the world. SSH serves to prevent such vulnerabilities     ', '2024-04-23 03:58:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10356, 1816, 523, 'The Information Pane shows the detailed object information, project activities, the                 ', '2024-04-23 14:26:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10357, 1809, 505, 'There is no way to happiness. Happiness is the way. Navicat Monitor requires a repository           ', '2024-04-23 22:44:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10358, 1809, 513, 'Remember that failure is an event, not a person.', '2024-04-24 16:12:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10359, 1813, 522, 'Champions keep playing until they get it right. To successfully establish a new connection          ', '2024-04-22 09:12:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10360, 1809, 513, 'Success consists of going from failure to failure without loss of enthusiasm.                       ', '2024-04-23 01:03:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10361, 1817, 517, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-24 07:10:06');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10362, 1814, 506, 'To connect to a database or schema, simply double-click it in the pane.                             ', '2024-04-22 06:33:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10363, 1818, 512, 'Navicat Monitor can be installed on any local computer or virtual machine and does                  ', '2024-04-25 00:49:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10364, 1809, 513, 'It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud.              ', '2024-04-25 21:12:45');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10365, 1818, 512, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-23 17:41:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10366, 1814, 506, 'If your Internet Service Provider (ISP) does not provide direct access to its server,               ', '2024-04-22 19:48:12');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10367, 1809, 513, 'Navicat provides powerful tools for working with queries: Query Editor for editing                  ', '2024-04-22 14:48:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10368, 1810, 505, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-23 21:23:06');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10369, 1810, 515, 'Actually it is just in an idea when feel oneself can achieve and cannot achieve.', '2024-04-23 07:57:05');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10370, 1810, 505, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-25 20:45:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10371, 1816, 507, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-22 20:07:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10372, 1806, 505, 'The past has no power over the present moment.', '2024-04-22 22:37:40');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10373, 1812, 517, 'The Information Pane shows the detailed object information, project activities, the                 ', '2024-04-22 01:28:38');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10374, 1807, 505, 'The Information Pane shows the detailed object information, project activities, the                 ', '2024-04-24 02:27:50');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10375, 1818, 512, 'You cannot save people, you can just love them. Navicat is a multi-connections Database             ', '2024-04-23 11:09:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10376, 1812, 506, 'Navicat is a multi-connections Database Administration tool allowing you to connect                 ', '2024-04-25 17:35:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10377, 1807, 505, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-22 14:51:31');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10378, 1813, 522, 'I destroy my enemies when I make them my friends. A man is not old until regrets                    ', '2024-04-23 12:07:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10379, 1813, 522, 'Success consists of going from failure to failure without loss of enthusiasm.', '2024-04-25 23:09:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10380, 1817, 513, 'Sometimes you win, sometimes you learn. If opportunity doesn’t knock, build a door.', '2024-04-22 17:05:44');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10381, 1806, 505, 'In the middle of winter I at last discovered that there was in me an invincible summer.', '2024-04-22 05:45:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10382, 1806, 521, 'Navicat provides a wide range advanced features, such as compelling code editing                    ', '2024-04-25 13:44:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10383, 1814, 512, 'Navicat is a multi-connections Database Administration tool allowing you to connect                 ', '2024-04-23 07:30:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10384, 1811, 505, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server,                  ', '2024-04-25 10:37:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10385, 1807, 519, 'The Main Window consists of several toolbars and panes for you to work on connections,              ', '2024-04-22 05:10:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10386, 1817, 517, 'Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud                  ', '2024-04-25 13:31:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10387, 1816, 510, 'To connect to a database or schema, simply double-click it in the pane.                             ', '2024-04-22 05:03:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10388, 1817, 521, 'I destroy my enemies when I make them my friends. SQL Editor allows you to create                   ', '2024-04-23 12:09:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10389, 1809, 505, 'A comfort zone is a beautiful place, but nothing ever grows there. If you wait, all                 ', '2024-04-23 15:42:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10390, 1806, 505, 'Always keep your eyes open. Keep watching. Because whatever you see can inspire you.', '2024-04-25 17:16:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10391, 1813, 506, 'You cannot save people, you can just love them. Success consists of going from failure              ', '2024-04-23 05:54:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10392, 1807, 505, 'Navicat 15 has added support for the system-wide dark mode. Success consists of going               ', '2024-04-24 16:24:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10393, 1811, 505, 'The Main Window consists of several toolbars and panes for you to work on connections,              ', '2024-04-25 09:21:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10394, 1813, 506, 'You cannot save people, you can just love them.', '2024-04-22 01:56:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10395, 1815, 506, 'To get a secure connection, the first thing you need to do is to install OpenSSL                    ', '2024-04-22 13:42:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10396, 1817, 517, 'If it scares you, it might be a good thing to try. All journeys have secret destinations            ', '2024-04-23 22:13:46');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10397, 1818, 509, 'Navicat authorizes you to make connection to remote servers running on different                    ', '2024-04-23 11:14:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10398, 1815, 506, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-22 21:38:40');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10399, 1816, 507, 'The first step is as good as half over. All journeys have secret destinations of                    ', '2024-04-25 22:59:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10400, 1813, 506, 'The Navigation pane employs tree structure which allows you to take action upon the                 ', '2024-04-22 05:55:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10401, 1811, 505, 'The Information Pane shows the detailed object information, project activities, the                 ', '2024-04-23 19:24:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10402, 1810, 515, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server,                  ', '2024-04-22 21:01:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10403, 1815, 506, 'The reason why a great man is great is that he resolves to be a great man.', '2024-04-24 11:31:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10404, 1809, 505, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-25 07:10:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10405, 1812, 506, 'How we spend our days is, of course, how we spend our lives.', '2024-04-22 17:40:59');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10406, 1809, 505, 'A man is not old until regrets take the place of dreams. It collects process metrics                ', '2024-04-23 09:36:45');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10407, 1818, 509, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-23 12:58:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10408, 1808, 505, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-24 02:44:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10409, 1814, 506, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-25 16:53:38');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10410, 1810, 515, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-25 14:37:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10411, 1811, 505, 'Navicat Monitor requires a repository to store alerts and metrics for historical analysis.', '2024-04-25 13:58:05');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10412, 1815, 506, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-24 16:19:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10413, 1814, 506, 'Navicat Data Modeler enables you to build high-quality conceptual, logical and physical             ', '2024-04-24 20:51:48');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10414, 1813, 506, 'The On Startup feature allows you to control what tabs appear when you launch Navicat.', '2024-04-22 10:51:00');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10415, 1813, 506, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-25 03:21:05');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10416, 1815, 516, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-22 01:08:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10417, 1816, 510, 'If you wait, all that happens is you get older. You will succeed because most people are lazy.', '2024-04-24 07:54:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10418, 1818, 509, 'A man is not old until regrets take the place of dreams.', '2024-04-22 14:19:31');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10419, 1816, 510, 'Navicat authorizes you to make connection to remote servers running on different                    ', '2024-04-25 03:17:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10420, 1818, 523, 'Secure SHell (SSH) is a program to log in into another computer over a network, execute             ', '2024-04-23 17:51:07');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10421, 1817, 513, 'You cannot save people, you can just love them. Navicat is a multi-connections Database             ', '2024-04-23 14:23:51');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10422, 1812, 517, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-23 20:09:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10423, 1818, 523, 'Secure SHell (SSH) is a program to log in into another computer over a network, execute             ', '2024-04-25 22:27:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10424, 1812, 506, 'All journeys have secret destinations of which the traveler is unaware.                             ', '2024-04-25 01:17:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10425, 1818, 512, 'Such sessions are also susceptible to session hijacking, where a malicious user takes               ', '2024-04-25 16:37:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10426, 1806, 521, 'All journeys have secret destinations of which the traveler is unaware.                             ', '2024-04-23 16:25:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10427, 1815, 506, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-22 22:20:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10428, 1818, 509, 'Navicat 15 has added support for the system-wide dark mode. What you get by achieving               ', '2024-04-22 12:33:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10429, 1812, 517, 'To get a secure connection, the first thing you need to do is to install OpenSSL                    ', '2024-04-22 09:06:50');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10430, 1811, 506, 'In a Telnet session, all communications, including username and password, are transmitted           ', '2024-04-25 21:49:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10431, 1812, 506, 'Actually it is just in an idea when feel oneself can achieve and cannot achieve.', '2024-04-24 14:30:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10432, 1816, 510, 'The first step is as good as half over. In a Telnet session, all communications,                    ', '2024-04-23 22:55:02');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10433, 1815, 516, 'With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and                  ', '2024-04-23 06:05:05');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10434, 1811, 505, 'I will greet this day with love in my heart.', '2024-04-25 17:08:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10435, 1813, 506, 'In other words, Navicat provides the ability for data in different databases and/or                 ', '2024-04-24 09:47:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10436, 1809, 513, 'In other words, Navicat provides the ability for data in different databases and/or                 ', '2024-04-23 17:36:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10437, 1810, 505, 'Actually it is just in an idea when feel oneself can achieve and cannot achieve.                    ', '2024-04-22 22:39:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10438, 1813, 522, 'A man’s best friends are his ten fingers.', '2024-04-25 19:46:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10439, 1818, 512, 'Remember that failure is an event, not a person. If you wait, all that happens is you get older.', '2024-04-23 04:42:06');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10440, 1808, 522, 'Navicat Cloud provides a cloud service for synchronizing connections, queries, model                ', '2024-04-24 15:52:31');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10441, 1816, 507, 'How we spend our days is, of course, how we spend our lives. To successfully establish              ', '2024-04-23 00:44:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10442, 1815, 516, 'Anyone who has never made a mistake has never tried anything new.', '2024-04-24 18:28:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10443, 1816, 507, 'Creativity is intelligence having fun.', '2024-04-22 12:43:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10444, 1817, 513, 'Navicat allows you to transfer data from one database and/or schema to another with                 ', '2024-04-22 21:28:33');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10445, 1816, 507, 'The Navigation pane employs tree structure which allows you to take action upon the                 ', '2024-04-24 06:36:31');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10446, 1807, 505, 'Secure Sockets Layer(SSL) is a protocol for transmitting private documents via the Internet.', '2024-04-22 21:25:42');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10447, 1806, 505, 'It provides strong authentication and secure encrypted communications between two                   ', '2024-04-24 07:36:51');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10448, 1814, 512, 'How we spend our days is, of course, how we spend our lives. The Navigation pane                    ', '2024-04-22 15:29:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10449, 1815, 516, 'Typically, it is employed as an encrypted version of Telnet.', '2024-04-23 21:46:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10450, 1817, 521, 'The past has no power over the present moment. Import Wizard allows you to import                   ', '2024-04-24 17:04:54');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10451, 1810, 505, 'In the middle of winter I at last discovered that there was in me an invincible summer.', '2024-04-22 16:15:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10452, 1808, 505, 'You can select any connections, objects or projects, and then select the corresponding              ', '2024-04-22 07:34:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10453, 1816, 510, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-23 09:14:20');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10454, 1817, 517, 'After logged in the Navicat Cloud feature, the Navigation pane will be divided into                 ', '2024-04-24 09:28:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10455, 1817, 513, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-25 22:05:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10456, 1810, 505, 'Optimism is the one quality more associated with success and happiness than any other.', '2024-04-22 09:23:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10457, 1806, 505, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-25 02:30:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10458, 1816, 507, 'HTTP Tunneling is a method for connecting to a server that uses the same protocol                   ', '2024-04-22 12:02:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10459, 1814, 512, 'To start working with your server in Navicat, you should first establish a connection               ', '2024-04-22 12:38:40');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10460, 1816, 523, 'Typically, it is employed as an encrypted version of Telnet. A query is used to extract             ', '2024-04-22 06:57:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10461, 1817, 513, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-22 20:49:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10462, 1814, 506, 'Success consists of going from failure to failure without loss of enthusiasm.', '2024-04-22 08:06:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10463, 1814, 506, 'Navicat provides a wide range advanced features, such as compelling code editing                    ', '2024-04-25 17:12:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10464, 1807, 505, 'SQL Editor allows you to create and edit SQL text, prepare and execute selected queries.', '2024-04-25 18:07:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10465, 1818, 512, 'You cannot save people, you can just love them. SQL Editor allows you to create and                 ', '2024-04-22 20:42:12');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10466, 1812, 506, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-24 06:21:54');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10467, 1816, 507, 'Export Wizard allows you to export data from tables, collections, views, or query                   ', '2024-04-24 10:20:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10468, 1817, 521, 'Genius is an infinite capacity for taking pains. If your Internet Service Provider                  ', '2024-04-22 15:29:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10469, 1810, 515, 'In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram              ', '2024-04-22 16:00:46');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10470, 1816, 510, 'Monitored servers include MySQL, MariaDB and SQL Server, and compatible with cloud                  ', '2024-04-23 10:39:35');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10471, 1810, 515, 'What you get by achieving your goals is not as important as what you become by achieving your goals.', '2024-04-25 17:38:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10472, 1810, 505, 'How we spend our days is, of course, how we spend our lives.', '2024-04-24 18:55:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10473, 1815, 506, 'Navicat Cloud provides a cloud service for synchronizing connections, queries, model                ', '2024-04-25 20:52:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10474, 1818, 512, 'Navicat authorizes you to make connection to remote servers running on different                    ', '2024-04-24 17:54:54');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10475, 1816, 507, 'What you get by achieving your goals is not as important as what you become by achieving your goals.', '2024-04-22 11:07:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10476, 1811, 506, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-22 14:49:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10477, 1815, 516, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-23 12:12:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10478, 1818, 523, 'You will succeed because most people are lazy.', '2024-04-24 06:16:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10479, 1813, 506, 'How we spend our days is, of course, how we spend our lives. To open a query using                  ', '2024-04-22 08:00:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10480, 1807, 519, 'Import Wizard allows you to import data to tables/collections from CSV, TXT, XML, DBF and more.', '2024-04-25 04:34:46');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10481, 1809, 505, 'I will greet this day with love in my heart.', '2024-04-23 18:26:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10482, 1817, 513, 'Navicat Monitor is a safe, simple and agentless remote server monitoring tool that                  ', '2024-04-25 03:49:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10483, 1811, 505, 'Navicat 15 has added support for the system-wide dark mode.', '2024-04-24 11:01:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10484, 1809, 513, 'In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram              ', '2024-04-24 15:17:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10485, 1806, 505, 'Difficult circumstances serve as a textbook of life for people.', '2024-04-25 18:46:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10486, 1818, 509, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server,                  ', '2024-04-24 17:10:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10487, 1809, 513, 'After comparing data, the window shows the number of records that will be inserted,                 ', '2024-04-24 10:07:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10488, 1814, 512, 'If the plan doesn’t work, change the plan, but never the goal.', '2024-04-25 18:43:38');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10489, 1814, 506, 'There is no way to happiness. Happiness is the way.', '2024-04-22 16:02:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10490, 1810, 515, 'What you get by achieving your goals is not as important as what you become by achieving your goals.', '2024-04-22 19:03:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10491, 1816, 523, 'SQL Editor allows you to create and edit SQL text, prepare and execute selected queries.', '2024-04-24 00:01:50');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10492, 1818, 512, 'It can also manage cloud databases such as Amazon Redshift, Amazon RDS, Alibaba Cloud.              ', '2024-04-24 06:13:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10493, 1806, 505, 'The Information Pane shows the detailed object information, project activities, the                 ', '2024-04-23 07:52:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10494, 1809, 505, 'It is used while your ISPs do not allow direct connections, but allows establishing                 ', '2024-04-22 18:40:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10495, 1812, 506, 'How we spend our days is, of course, how we spend our lives. The first step is as good as half over.', '2024-04-24 09:28:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10496, 1812, 506, 'Anyone who has ever made anything of importance was disciplined.', '2024-04-22 07:02:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10497, 1815, 506, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server,                  ', '2024-04-22 08:26:54');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10498, 1806, 505, 'A comfort zone is a beautiful place, but nothing ever grows there. Navicat Data Modeler             ', '2024-04-24 16:14:38');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10499, 1813, 506, 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-24 03:06:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10500, 1814, 506, 'You cannot save people, you can just love them. The Navigation pane employs tree                    ', '2024-04-23 05:54:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10501, 1810, 505, 'In the Objects tab, you can use the List List, Detail Detail and ER Diagram ER Diagram              ', '2024-04-22 23:23:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10502, 1811, 506, 'Navicat 15 has added support for the system-wide dark mode.', '2024-04-25 16:38:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10503, 1815, 516, 'After logged in the Navicat Cloud feature, the Navigation pane will be divided into                 ', '2024-04-25 14:07:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10504, 1807, 519, 'A man is not old until regrets take the place of dreams. To get a secure connection,                ', '2024-04-25 22:28:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10505, 1810, 505, 'Navicat provides a wide range advanced features, such as compelling code editing                    ', '2024-04-22 17:30:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10506, 1818, 512, 'The reason why a great man is great is that he resolves to be a great man.', '2024-04-24 17:48:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10507, 1817, 521, 'The On Startup feature allows you to control what tabs appear when you launch Navicat.', '2024-04-24 07:09:44');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10508, 1818, 523, 'Anyone who has ever made anything of importance was disciplined. Sometimes you win,                 ', '2024-04-25 04:57:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10509, 1807, 519, 'If it scares you, it might be a good thing to try. To start working with your server                ', '2024-04-24 07:34:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10510, 1808, 505, 'I destroy my enemies when I make them my friends.', '2024-04-22 09:46:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10511, 1817, 513, 'Navicat Monitor can be installed on any local computer or virtual machine and does                  ', '2024-04-25 20:00:59');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10512, 1812, 517, 'If you wait, all that happens is you get older.', '2024-04-24 03:18:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10513, 1809, 513, 'Anyone who has ever made anything of importance was disciplined.', '2024-04-22 01:20:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10514, 1810, 505, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-24 00:05:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10515, 1818, 509, 'It wasn’t raining when Noah built the ark. To get a secure connection, the first                  ', '2024-04-24 22:58:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10516, 1807, 519, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-22 02:10:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10517, 1816, 523, 'To get a secure connection, the first thing you need to do is to install OpenSSL                    ', '2024-04-22 00:01:31');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10518, 1806, 505, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-22 17:56:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10519, 1815, 516, 'Flexible settings enable you to set up a custom key for comparison and synchronization.', '2024-04-22 03:47:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10520, 1818, 509, 'SQL Editor allows you to create and edit SQL text, prepare and execute selected queries.', '2024-04-22 03:24:02');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10521, 1817, 513, 'In other words, Navicat provides the ability for data in different databases and/or                 ', '2024-04-24 03:45:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10522, 1808, 505, 'Remember that failure is an event, not a person. All journeys have secret destinations              ', '2024-04-24 23:25:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10523, 1807, 519, 'Anyone who has never made a mistake has never tried anything new.', '2024-04-25 19:22:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10524, 1812, 506, 'It is used while your ISPs do not allow direct connections, but allows establishing                 ', '2024-04-25 22:32:45');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10525, 1812, 517, 'Secure SHell (SSH) is a program to log in into another computer over a network, execute             ', '2024-04-22 14:51:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10526, 1812, 517, 'Navicat Monitor is a safe, simple and agentless remote server monitoring tool that                  ', '2024-04-23 14:09:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10527, 1809, 505, 'A comfort zone is a beautiful place, but nothing ever grows there.', '2024-04-25 09:44:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10528, 1807, 505, 'Secure SHell (SSH) is a program to log in into another computer over a network, execute             ', '2024-04-24 15:36:38');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10529, 1817, 513, 'The first step is as good as half over.', '2024-04-25 20:21:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10530, 1811, 506, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-22 22:45:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10531, 1806, 505, 'Actually it is just in an idea when feel oneself can achieve and cannot achieve.', '2024-04-24 13:38:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10532, 1811, 505, 'If the plan doesn’t work, change the plan, but never the goal.', '2024-04-25 13:51:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10533, 1806, 521, 'The first step is as good as half over.', '2024-04-24 22:56:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10534, 1811, 506, 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-24 01:12:54');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10535, 1808, 505, 'The repository database can be an existing MySQL, MariaDB, PostgreSQL, SQL Server,                  ', '2024-04-22 15:28:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10536, 1811, 505, 'Champions keep playing until they get it right. Champions keep playing until they get it right.', '2024-04-25 11:40:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10537, 1815, 506, 'With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and                  ', '2024-04-22 01:15:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10538, 1811, 506, 'Secure Sockets Layer(SSL) is a protocol for transmitting private documents via the Internet.', '2024-04-22 21:08:54');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10539, 1817, 513, 'Success consists of going from failure to failure without loss of enthusiasm.', '2024-04-25 20:07:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10540, 1813, 506, 'The past has no power over the present moment. Optimism is the one quality more associated          ', '2024-04-25 18:13:40');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10541, 1818, 512, 'Anyone who has ever made anything of importance was disciplined. Navicat Data Modeler               ', '2024-04-24 15:41:20');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10542, 1809, 505, 'Genius is an infinite capacity for taking pains.', '2024-04-25 04:34:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10543, 1807, 505, 'Navicat is a multi-connections Database Administration tool allowing you to connect                 ', '2024-04-25 08:15:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10544, 1807, 505, 'Always keep your eyes open. Keep watching. Because whatever you see can inspire you.', '2024-04-24 20:50:50');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10545, 1817, 521, 'I destroy my enemies when I make them my friends. Such sessions are also susceptible                ', '2024-04-24 03:25:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10546, 1811, 505, 'A man’s best friends are his ten fingers. Navicat provides powerful tools for working             ', '2024-04-24 02:36:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10547, 1812, 506, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-22 01:11:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10548, 1813, 506, 'Navicat provides a wide range advanced features, such as compelling code editing                    ', '2024-04-23 12:57:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10549, 1806, 505, 'You must be the change you wish to see in the world. Navicat provides a wide range                  ', '2024-04-23 21:55:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10550, 1807, 505, 'Anyone who has never made a mistake has never tried anything new.', '2024-04-24 03:27:42');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10551, 1808, 505, 'The On Startup feature allows you to control what tabs appear when you launch Navicat.', '2024-04-24 01:14:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10552, 1814, 512, 'It wasn’t raining when Noah built the ark. Typically, it is employed as an encrypted              ', '2024-04-24 11:50:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10553, 1816, 510, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-22 21:07:46');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10554, 1811, 505, 'The first step is as good as half over. The repository database can be an existing                  ', '2024-04-24 13:26:20');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10555, 1811, 505, 'It wasn’t raining when Noah built the ark. The repository database can be an existing             ', '2024-04-24 23:57:20');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10556, 1818, 523, 'To successfully establish a new connection to local/remote server - no matter via                   ', '2024-04-25 14:16:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10557, 1809, 505, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-22 01:28:59');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10558, 1818, 509, 'Navicat Monitor requires a repository to store alerts and metrics for historical analysis.', '2024-04-23 05:23:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10559, 1814, 506, 'Navicat Monitor requires a repository to store alerts and metrics for historical analysis.', '2024-04-25 18:19:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10560, 1816, 523, 'Navicat allows you to transfer data from one database and/or schema to another with                 ', '2024-04-23 00:33:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10561, 1811, 505, 'You can select any connections, objects or projects, and then select the corresponding              ', '2024-04-23 05:16:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10562, 1813, 522, 'Difficult circumstances serve as a textbook of life for people.', '2024-04-24 10:25:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10563, 1810, 515, 'SSH serves to prevent such vulnerabilities and allows you to access a remote server\'s               ', '2024-04-25 20:21:40');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10564, 1814, 512, 'A comfort zone is a beautiful place, but nothing ever grows there.', '2024-04-23 07:40:53');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10565, 1810, 505, 'You will succeed because most people are lazy.', '2024-04-24 08:40:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10566, 1813, 522, 'Navicat Monitor requires a repository to store alerts and metrics for historical analysis.', '2024-04-23 11:10:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10567, 1813, 506, 'The first step is as good as half over. The Navigation pane employs tree structure                  ', '2024-04-25 12:41:05');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10568, 1816, 507, 'Instead of wondering when your next vacation is, maybe you should set up a life you                 ', '2024-04-25 02:14:55');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10569, 1817, 517, 'All the Navicat Cloud objects are located under different projects. You can share                   ', '2024-04-24 14:11:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10570, 1818, 512, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-22 06:42:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10571, 1812, 506, 'Navicat provides a wide range advanced features, such as compelling code editing                    ', '2024-04-23 11:50:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10572, 1812, 506, 'Navicat authorizes you to make connection to remote servers running on different                    ', '2024-04-24 00:29:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10573, 1806, 521, 'The past has no power over the present moment. Navicat Cloud provides a cloud service               ', '2024-04-24 05:34:48');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10574, 1818, 512, 'A query is used to extract data from the database in a readable format according                    ', '2024-04-23 18:58:46');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10575, 1809, 505, 'Difficult circumstances serve as a textbook of life for people.', '2024-04-24 02:58:32');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10576, 1810, 505, 'In the middle of winter I at last discovered that there was in me an invincible summer.', '2024-04-25 11:27:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10577, 1808, 505, 'You can select any connections, objects or projects, and then select the corresponding              ', '2024-04-22 22:48:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10578, 1817, 513, 'It wasn’t raining when Noah built the ark. The Synchronize to Database function                   ', '2024-04-23 22:45:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10579, 1815, 506, 'Navicat Monitor requires a repository to store alerts and metrics for historical analysis.', '2024-04-23 11:09:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10580, 1812, 517, 'You can select any connections, objects or projects, and then select the corresponding              ', '2024-04-22 13:32:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10581, 1817, 517, 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-23 07:56:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10582, 1813, 522, 'To connect to a database or schema, simply double-click it in the pane.', '2024-04-22 20:21:42');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10583, 1808, 505, 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-22 15:39:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10584, 1810, 505, 'With its well-designed Graphical User Interface(GUI), Navicat lets you quickly and                  ', '2024-04-25 08:04:33');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10585, 1813, 506, 'Flexible settings enable you to set up a custom key for comparison and synchronization.', '2024-04-25 22:47:12');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10586, 1808, 505, 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.', '2024-04-25 23:41:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10587, 1817, 521, 'Always keep your eyes open. Keep watching. Because whatever you see can inspire you.', '2024-04-25 00:17:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10588, 1816, 507, '消息', '2024-06-26 23:27:49');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10589, 1816, 507, '可以吗', '2024-06-26 23:28:00');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10590, 1816, 507, '可以吗', '2024-06-26 23:28:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10591, 1811, 505, 'hello', '2024-06-30 02:27:40');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10592, 1811, 505, 'hello', '2024-06-30 02:27:42');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10593, 1811, 505, 'hello', '2024-06-30 02:27:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10594, 1811, 505, 'fasfasfsfaasfa\n', '2024-06-30 02:32:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10595, 1811, 505, '你好\n', '2024-06-30 02:32:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10596, 1811, 505, '测试\n', '2024-06-30 02:33:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10597, 1811, 505, 'try\n', '2024-06-30 02:34:35');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10598, 1811, 505, '我测试一下咯\n', '2024-06-30 02:45:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10599, 1811, 505, '再测试一下\n', '2024-06-30 02:46:00');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10600, 1811, 505, '怎么养呢\n', '2024-06-30 02:46:58');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10601, 1811, 505, '嘶\n', '2024-06-30 02:47:07');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10602, 1811, 505, '可以吗\n', '2024-06-30 02:47:46');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10603, 1811, 505, '可以吗\n\n\n\ntest', '2024-06-30 02:47:55');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10604, 1811, 505, '可以吗\n\n\n\ntest\n', '2024-06-30 02:47:55');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10605, 1811, 505, '12\n', '2024-06-30 02:49:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10606, 1811, 505, '123\n', '2024-06-30 02:50:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10607, 1811, 505, '测试哦\n', '2024-06-30 02:50:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10608, 1811, 505, '再测试一下\n', '2024-06-30 02:50:55');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10609, 1811, 505, '可以吗\n\n\n\n可以哦\n', '2024-06-30 02:51:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10610, 1811, 505, '可以的呢\n', '2024-06-30 02:51:54');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10611, 1811, 505, '可以了\n', '2024-06-30 02:54:35');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10612, 1811, 505, '我在看看呢\n', '2024-06-30 02:54:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10613, 1808, 505, '再测试！\n', '2024-06-30 02:56:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10614, 1808, 505, '可以啦\n', '2024-06-30 02:56:04');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10615, 1811, 505, '可以吗\n', '2024-06-30 18:43:08');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10616, 1811, 505, '可以的！nice', '2024-06-30 18:43:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10617, 1811, 505, '\n', '2024-06-30 18:43:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10618, 1811, 505, 'test\n', '2024-06-30 18:49:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10619, 1811, 505, 'test 可以的呢\n可以的呢\n', '2024-06-30 18:49:35');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10620, 1807, 519, '发送！\n', '2024-06-30 22:46:34');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10621, 1807, 505, 'test\n', '2024-06-30 23:14:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10622, 1807, 505, '你好 徐璐\n', '2024-06-30 23:15:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10623, 1807, 505, '很高兴认识你\n', '2024-06-30 23:16:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10624, 1807, 505, '能看见吗\n', '2024-06-30 23:17:37');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10625, 1807, 519, '什么情况呢\n', '2024-06-30 23:19:03');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10626, 1807, 505, '消息\n', '2024-07-01 00:07:38');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10627, 1807, 519, '测试\n', '2024-07-01 00:08:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10628, 1807, 519, '你好\n', '2024-07-01 00:09:38');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10629, 1807, 519, '再度测试\n', '2024-07-01 00:11:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10630, 1807, 519, '你好呢\n', '2024-07-01 00:13:41');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10631, 1807, 519, '什么情况呢\n', '2024-07-01 00:14:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10632, 1807, 519, '有收到吗\n', '2024-07-01 00:27:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10633, 1807, 519, '触发\n', '2024-07-01 00:34:39');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10634, 1807, 519, '触发了吗\n', '2024-07-01 00:36:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10635, 1807, 519, '有了\n', '2024-07-01 00:37:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10636, 1807, 519, '123\n', '2024-07-01 00:38:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10637, 1807, 519, '456\n', '2024-07-01 00:39:17');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10638, 1807, 519, '789\n', '2024-07-01 00:40:43');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10639, 1807, 519, '890\n', '2024-07-01 00:41:36');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10640, 1807, 519, 'try', '2024-07-01 00:41:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10641, 1807, 519, 'rrr\n', '2024-07-01 00:42:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10642, 1807, 505, 'hi\n', '2024-07-01 00:44:47');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10643, 1807, 519, '什么？\n', '2024-07-01 00:45:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10644, 1807, 519, '这次应该没问题了\n', '2024-07-01 00:47:01');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10645, 1807, 519, '可以了\n', '2024-07-01 00:48:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10646, 1807, 505, 'test', '2024-07-01 00:48:45');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10647, 1807, 519, '1111\n', '2024-07-01 00:48:52');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10648, 1807, 505, '41242144124\n1', '2024-07-01 00:48:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10649, 1807, 505, '24\n', '2024-07-01 00:48:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10650, 1807, 505, '\n12', '2024-07-01 00:48:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10651, 1807, 505, '4\n', '2024-07-01 00:48:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10652, 1807, 505, '2\n1', '2024-07-01 00:48:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10653, 1807, 505, '\n2', '2024-07-01 00:48:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10654, 1807, 505, '1\n14', '2024-07-01 00:48:56');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10655, 1807, 505, '2\n', '2024-07-01 00:48:57');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10656, 1807, 505, '嗯\n', '2024-07-01 00:49:02');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10657, 1807, 505, 'rqwrqrw\n', '2024-07-01 00:49:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10658, 1807, 505, 'qw\n', '2024-07-01 00:49:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10659, 1807, 505, 'qw\n', '2024-07-01 00:49:23');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10660, 1807, 505, 'rqw\nr', '2024-07-01 00:49:24');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10661, 1807, 505, 'qw\nr', '2024-07-01 00:49:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10662, 1807, 505, 'qw\nr', '2024-07-01 00:49:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10663, 1807, 505, 'qwr\n', '2024-07-01 00:49:25');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10664, 1807, 505, 'sadf\n', '2024-07-01 00:50:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10665, 1807, 505, '\nsadf', '2024-07-01 00:50:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10666, 1807, 505, 'sad\n', '2024-07-01 00:50:09');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10667, 1807, 505, '\nas', '2024-07-01 00:50:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10668, 1807, 505, 'fd\n', '2024-07-01 00:50:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10669, 1807, 505, 'adsf\n', '2024-07-01 00:50:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10670, 1807, 505, 'sad\nf', '2024-07-01 00:50:10');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10671, 1807, 505, 'sda\n', '2024-07-01 00:50:11');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10672, 1807, 505, '1\n', '2024-07-01 00:50:13');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10673, 1807, 505, '2\n', '2024-07-01 00:50:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10674, 1807, 505, '3\n', '2024-07-01 00:50:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10675, 1807, 505, '4\n', '2024-07-01 00:50:14');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10676, 1807, 505, '5\n', '2024-07-01 00:50:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10677, 1807, 505, '6\n', '2024-07-01 00:50:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10678, 1807, 505, '7\n', '2024-07-01 00:50:15');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10679, 1807, 505, '8\n', '2024-07-01 00:50:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10680, 1807, 505, '9\n', '2024-07-01 00:50:16');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10681, 1807, 505, '10\n', '2024-07-01 00:50:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10682, 1807, 505, '11\n', '2024-07-01 00:50:18');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10683, 1807, 505, '12\n', '2024-07-01 00:50:19');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10684, 1807, 505, '13\n', '2024-07-01 00:50:20');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10685, 1807, 505, '14\n', '2024-07-01 00:50:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10686, 1807, 505, '15\n', '2024-07-01 00:50:21');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10687, 1807, 505, '16\n', '2024-07-01 00:50:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10688, 1807, 505, '17\n', '2024-07-01 00:50:22');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10689, 1807, 505, 'q\n', '2024-07-01 00:50:26');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10690, 1807, 505, 'w\n', '2024-07-01 00:50:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10691, 1807, 505, 'e\n', '2024-07-01 00:50:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10692, 1807, 505, 'r\n', '2024-07-01 00:50:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10693, 1807, 505, 't\n', '2024-07-01 00:50:27');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10694, 1807, 505, 'y\n', '2024-07-01 00:50:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10695, 1807, 505, 'u\n', '2024-07-01 00:50:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10696, 1807, 505, '\ni', '2024-07-01 00:50:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10697, 1807, 505, 'o\n', '2024-07-01 00:50:28');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10698, 1807, 505, '\np', '2024-07-01 00:50:29');
INSERT INTO `message` (`id`, `chatroom_id`, `from`, `content`, `create_time`) VALUES (10699, 1808, 505, '可以发送吗\n', '2024-07-01 01:42:54');
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar_url` varchar(255) NOT NULL,
  `description` varchar(4096) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_EMAIL` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=527 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (505, 'Nakajima Takuya', 'takunakajima@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'To open a query using an external editor, control-click it and select Open with External            ', '2024-04-07 19:15:53');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (506, 'Amanda Mason', 'amandamas8@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'Sometimes you win, sometimes you learn. Navicat Monitor requires a repository to                    ', '2024-04-14 19:27:19');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (507, 'Josephine Graham', 'graj@icloud.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-09 16:37:04');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (508, 'Kevin Mendoza', 'mendozakevi822@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'If it scares you, it might be a good thing to try.', '2024-04-10 22:48:07');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (509, 'Sakamoto Mitsuki', 'sakmitsuki6@gmail.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'If the Show objects under schema in navigation pane option is checked at the Preferences            ', '2024-04-11 08:02:39');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (510, '高安琪', 'gao7@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'Sometimes you win, sometimes you learn. Anyone who has never made a mistake has never               ', '2024-04-02 01:05:53');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (511, 'Tamura Daichi', 'daichitamur@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'After comparing data, the window shows the number of records that will be inserted,                 ', '2024-04-07 11:03:43');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (512, 'Ng Chiu Wai', 'ngchiuwai@gmail.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'Navicat Data Modeler enables you to build high-quality conceptual, logical and physical             ', '2024-04-03 23:55:25');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (513, 'Melissa Lopez', 'lopemelissa@gmail.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'To clear or reload various internal caches, flush tables, or acquire locks, control-click           ', '2024-04-01 02:53:04');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (514, 'Matsuda Sakura', 'sakma67@gmail.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'Navicat 15 has added support for the system-wide dark mode.', '2024-04-14 22:08:32');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (515, 'John Kelly', 'kelljohn3@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'The first step is as good as half over. Creativity is intelligence having fun.', '2024-04-01 00:02:34');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (516, 'Liao Jiehong', 'jiehliao@yahoo.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'You cannot save people, you can just love them. Sometimes you win, sometimes you learn.', '2024-04-02 02:34:48');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (517, '何杰宏', 'hej418@yahoo.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'Navicat Cloud could not connect and access your databases. By which it means, it                    ', '2024-04-04 23:58:04');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (518, 'Ma Lan', 'lan909@mail.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'Anyone who has ever made anything of importance was disciplined. Such sessions are                  ', '2024-04-05 23:59:08');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (519, '徐璐', 'lux8@gmail.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'It collects process metrics such as CPU load, RAM usage, and a variety of other resources           ', '2024-04-06 16:58:32');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (520, 'Yu Xiuying', 'xiuyiyu525@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'All the Navicat Cloud objects are located under different projects. You can share                   ', '2024-04-09 03:37:59');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (521, 'Norma Stephens', 'stephensnorma@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'Navicat Data Modeler is a powerful and cost-effective database design tool which                    ', '2024-04-09 11:41:26');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (522, 'Yan Shihan', 'yans@icloud.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'If opportunity doesn’t knock, build a door. A comfort zone is a beautiful place,                  ', '2024-04-13 11:12:54');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (523, '贾岚', 'jiala4@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'Navicat provides powerful tools for working with queries: Query Editor for editing                  ', '2024-04-03 17:04:18');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (524, 'Yue Wing Sze', 'wingsze7@outlook.com', '$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', 'The first step is as good as half over.', '2024-04-14 21:12:29');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (525, 'gamejoye', 'gamejoye@gmail.com', '$2b$10$.wMyvS0C4iTzDRu1dVf3ZObazuX2jtMsMGXAhlhleygscoFeLLEkO', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', '', '2024-06-28 00:13:23');
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `avatar_url`, `description`, `create_time`) VALUES (526, 'coke', 'coke@gmail.com', '$2b$10$jVMr8uq2/sm2serrjKRBE.rVWfa/706KQG0BY/Hxc3zp4mDBzIxFi', 'http://localhost:8081/avatars/440395aae304e3daf589afb78a67469c.jpg', '', '2024-06-28 00:16:47');
COMMIT;

-- ----------------------------
-- Table structure for user_chatroom
-- ----------------------------
DROP TABLE IF EXISTS `user_chatroom`;
CREATE TABLE `user_chatroom` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `chatroom_id` int unsigned NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `latest_visit_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`chatroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2341 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_chatroom
-- ----------------------------
BEGIN;
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2312, 521, 1806, '2024-04-19 10:50:05', '2024-04-19 10:50:05');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2313, 505, 1806, '2024-04-19 10:50:05', '2024-06-30 22:45:55');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2314, 519, 1807, '2024-04-18 13:32:26', '2024-07-01 00:54:07');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2315, 505, 1807, '2024-04-18 13:32:26', '2024-07-01 01:42:48');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2316, 522, 1808, '2024-04-19 11:38:14', '2024-04-19 11:38:14');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2317, 505, 1808, '2024-04-19 11:38:14', '2024-07-01 01:43:14');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2318, 513, 1809, '2024-04-18 17:56:25', '2024-04-18 17:56:25');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2319, 505, 1809, '2024-04-18 17:56:25', '2024-07-01 01:42:47');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2320, 515, 1810, '2024-04-18 21:03:18', '2024-04-18 21:03:18');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2321, 505, 1810, '2024-04-18 21:03:18', '2024-06-30 19:02:01');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2322, 505, 1811, '2024-04-18 02:18:53', '2024-06-30 18:54:37');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2323, 506, 1811, '2024-04-18 02:18:53', '2024-04-18 02:18:53');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2324, 517, 1812, '2024-04-19 23:59:15', '2024-04-19 23:59:15');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2325, 506, 1812, '2024-04-19 23:59:15', '2024-04-19 23:59:15');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2326, 522, 1813, '2024-04-18 01:50:10', '2024-04-18 01:50:10');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2327, 506, 1813, '2024-04-18 01:50:10', '2024-04-18 01:50:10');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2328, 512, 1814, '2024-04-18 00:55:39', '2024-04-18 00:55:39');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2329, 506, 1814, '2024-04-18 00:55:39', '2024-04-18 00:55:39');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2330, 516, 1815, '2024-04-18 14:29:58', '2024-04-18 14:29:58');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2331, 506, 1815, '2024-04-18 14:29:58', '2024-04-18 14:29:58');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2332, 510, 1816, '2024-04-17 06:30:56', '2024-04-17 06:30:56');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2333, 523, 1816, '2024-04-17 06:30:56', '2024-04-17 06:30:56');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2334, 507, 1816, '2024-04-17 06:30:56', '2024-06-26 23:28:05');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2335, 513, 1817, '2024-04-18 09:58:41', '2024-04-18 09:58:41');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2336, 521, 1817, '2024-04-18 09:58:41', '2024-04-18 09:58:41');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2337, 517, 1817, '2024-04-18 09:58:41', '2024-04-18 09:58:41');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2338, 509, 1818, '2024-04-18 00:21:19', '2024-04-18 00:21:19');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2339, 512, 1818, '2024-04-18 00:21:19', '2024-04-18 00:21:19');
INSERT INTO `user_chatroom` (`id`, `user_id`, `chatroom_id`, `create_time`, `latest_visit_time`) VALUES (2340, 523, 1818, '2024-04-18 00:21:19', '2024-04-18 00:21:19');
COMMIT;

-- ----------------------------
-- Table structure for user_friendship
-- ----------------------------
DROP TABLE IF EXISTS `user_friendship`;
CREATE TABLE `user_friendship` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `from_id` int unsigned NOT NULL,
  `to_id` int unsigned NOT NULL,
  `chatroom_id` int unsigned DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1054 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_friendship
-- ----------------------------
BEGIN;
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1007, 521, 505, 1806, '2024-04-17 08:52:41');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1008, 519, 505, 1807, '2024-04-17 17:39:59');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1010, 522, 505, 1808, '2024-04-17 17:43:48');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1015, 513, 505, 1809, '2024-04-16 14:43:45');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1019, 515, 505, 1810, '2024-04-17 02:55:47');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1045, 505, 506, 1811, '2024-04-17 20:10:47');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1046, 517, 506, 1812, '2024-04-16 16:16:34');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1047, 522, 506, 1813, '2024-04-16 05:59:51');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1048, 512, 506, 1814, '2024-04-16 11:21:27');
INSERT INTO `user_friendship` (`id`, `from_id`, `to_id`, `chatroom_id`, `create_time`) VALUES (1052, 516, 506, 1815, '2024-04-16 01:46:18');
COMMIT;

-- ----------------------------
-- Procedure structure for CorrectMessageSender
-- ----------------------------
DROP PROCEDURE IF EXISTS `CorrectMessageSender`;
delimiter ;;
CREATE PROCEDURE `CorrectMessageSender`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE m_id, m_chatroom_id, m_from_id INT;
    DECLARE new_chatroom_id, new_from_id INT;

    
    DECLARE message_cursor CURSOR FOR
        SELECT id, chatroom_id, `from` FROM message WHERE chatroom_id = 0 AND `from` = 0;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN message_cursor;

    message_loop: LOOP
        FETCH message_cursor INTO m_id, m_chatroom_id, m_from_id;
        IF done THEN
            LEAVE message_loop;
        END IF;

        
        SELECT chatroom_id INTO new_chatroom_id FROM user_chatroom
        ORDER BY RAND()
        LIMIT 1;

        
        IF new_chatroom_id IS NOT NULL THEN
            SELECT user_id INTO new_from_id FROM user_chatroom
            WHERE chatroom_id = new_chatroom_id
            ORDER BY RAND()
            LIMIT 1;

            
            IF new_from_id IS NOT NULL THEN
                UPDATE message SET chatroom_id = new_chatroom_id, `from` = new_from_id
                WHERE id = m_id;
            END IF;
        END IF;
    END LOOP;

    CLOSE message_cursor;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for CreateFriendRequest
-- ----------------------------
DROP PROCEDURE IF EXISTS `CreateFriendRequest`;
delimiter ;;
CREATE PROCEDURE `CreateFriendRequest`()
BEGIN
  #Routine body goes here...
	-- 首先，确保 FriendRequestType 表存在并包含 ACCEPT 的枚举值
-- INSERT INTO FriendRequestType (name) VALUES ('ACCEPT');

-- 创建临时表来保存符合条件的 userfriend 记录
CREATE TEMPORARY TABLE temp_userfriend AS
SELECT *
FROM user_friendship
WHERE create_time > '2024-04-14 01:00:00';

-- 插入符合条件的 friendrequest 记录
INSERT INTO friend_request (from_id, to_id, status, create_time, update_time)
SELECT uf.from_id, uf.to_id, 'ACCEPT', uf.create_time - INTERVAL 1 SECOND, uf.create_time
FROM temp_userfriend uf
WHERE NOT EXISTS (
    SELECT 1
    FROM friend_request fr
    WHERE fr.from_id = uf.from_id
      AND fr.to_id = uf.to_id
      AND fr.status = 'ACCEPT'
      AND fr.create_time < uf.create_time
);

-- 删除临时表
DROP TABLE temp_userfriend;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for CreateSingleChatroomsForFriends
-- ----------------------------
DROP PROCEDURE IF EXISTS `CreateSingleChatroomsForFriends`;
delimiter ;;
CREATE PROCEDURE `CreateSingleChatroomsForFriends`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE f_from_id, f_to_id INT;
    DECLARE f_update_time DATETIME;
    DECLARE new_chatroom_id INT;
    DECLARE cur1 CURSOR FOR 
        SELECT from_id, to_id, update_time FROM user_friendship
        WHERE status = 'ACCEPT';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur1;

    read_loop: LOOP
        FETCH cur1 INTO f_from_id, f_to_id, f_update_time;
        IF done THEN
            LEAVE read_loop;
        END IF;

        
        INSERT INTO chatroom (type, name, avatar_url, create_time)
        VALUES ('SINGLE', NULL, NULL, f_update_time);
        SET new_chatroom_id = LAST_INSERT_ID();

        
        INSERT INTO user_chatroom (user_id, chatroom_id, create_time, latest_visit_time)
        VALUES (f_from_id, new_chatroom_id, f_update_time, f_update_time),
               (f_to_id, new_chatroom_id, f_update_time, f_update_time);
    END LOOP;

    CLOSE cur1;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for InsertMultipleUserChatroomsImproved
-- ----------------------------
DROP PROCEDURE IF EXISTS `InsertMultipleUserChatroomsImproved`;
delimiter ;;
CREATE PROCEDURE `InsertMultipleUserChatroomsImproved`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE cr_id INT;
    DECLARE cr_create_time DATETIME;
    DECLARE user_id INT;
    DECLARE users_added INT;
    DECLARE attempts INT;

    
    DECLARE chatroom_cursor CURSOR FOR SELECT id, create_time FROM chatroom WHERE type = 'MULTIPLE';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN chatroom_cursor;

    chatroom_loop: LOOP
        FETCH chatroom_cursor INTO cr_id, cr_create_time;
        IF done THEN
            LEAVE chatroom_loop;
        END IF;

        SET users_added = 0;
        SET attempts = 0;

        
        WHILE users_added < 3 AND attempts < 10 DO
            
            SELECT id INTO user_id FROM user
            WHERE id NOT IN (
                SELECT user_id FROM user_chatroom WHERE chatroom_id = cr_id
            )
            ORDER BY RAND()
            LIMIT 1;

            IF user_id IS NOT NULL THEN
                INSERT INTO user_chatroom (user_id, chatroom_id, create_time, latest_visit_time)
                VALUES (user_id, cr_id, cr_create_time, cr_create_time);
                SET users_added = users_added + 1;
            END IF;
            SET attempts = attempts + 1;
        END WHILE;

        
        SET done = FALSE;
    END LOOP;

    CLOSE chatroom_cursor;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for UpdateChatroomIdInFriendship
-- ----------------------------
DROP PROCEDURE IF EXISTS `UpdateChatroomIdInFriendship`;
delimiter ;;
CREATE PROCEDURE `UpdateChatroomIdInFriendship`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE f_id, f_from_id, f_to_id, found_chatroom_id INT;
    DECLARE cur1 CURSOR FOR 
        SELECT id, from_id, to_id FROM user_friendship
        WHERE status = 'ACCEPT' AND chatroom_id IS NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur1;

    read_loop: LOOP
        FETCH cur1 INTO f_id, f_from_id, f_to_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        
        SELECT id INTO found_chatroom_id FROM chatroom
        WHERE id IN (
            SELECT chatroom_id FROM user_chatroom 
            WHERE user_id = f_from_id OR user_id = f_to_id
            GROUP BY chatroom_id
            HAVING COUNT(*) = 2
        )
        ORDER BY create_time DESC
        LIMIT 1;

        
        IF found_chatroom_id IS NOT NULL THEN
            UPDATE user_friendship
            SET chatroom_id = found_chatroom_id
            WHERE id = f_id;
        END IF;
    END LOOP;

    CLOSE cur1;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table user_friendship
-- ----------------------------
DROP TRIGGER IF EXISTS `uc_friendship_unique`;
delimiter ;;
CREATE TRIGGER `uc_friendship_unique` BEFORE INSERT ON `user_friendship` FOR EACH ROW BEGIN
    DECLARE existing_count INT;

    
    SELECT COUNT(*) INTO existing_count FROM user_friendship
    WHERE (from_id = NEW.from_id AND to_id = NEW.to_id)
       OR (from_id = NEW.to_id AND to_id = NEW.from_id);

    
    IF existing_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Friendship relation already exists.';
    END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
