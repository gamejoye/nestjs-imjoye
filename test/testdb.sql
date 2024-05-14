-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (arm64)
--
-- Host: localhost    Database: testdb
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chatroom`
--

DROP TABLE IF EXISTS `chatroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatroom` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('SINGLE','MULTIPLE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatroom`
--

LOCK TABLES `chatroom` WRITE;
/*!40000 ALTER TABLE `chatroom` DISABLE KEYS */;
INSERT INTO `chatroom` VALUES (1,'SINGLE','gamejoye_mikasa',NULL,'2024-03-29 15:54:07'),(2,'MULTIPLE','爱之诗',NULL,'2024-03-29 15:55:20'),(3,'SINGLE','gamejoye_sakura',NULL,'2024-03-30 01:20:18');
/*!40000 ALTER TABLE `chatroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `chatroom_id` int unsigned NOT NULL,
  `from` int unsigned NOT NULL,
  `content` text NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,2,1,'我爱你们， 宝宝','2024-03-29 20:48:25'),(2,2,1,'爱来自gamejoye','2024-03-31 00:57:27'),(3,1,1,'如有天樱花再开','2024-03-31 00:58:14'),(4,2,1,'你们是否也会迷茫呢','2024-03-31 00:58:31'),(5,2,1,'我应该如何诉说我一路的艰辛了。 我有许多的话想说， 可话到了嘴边却又被我咽下去了。 就这样， 所有的艰辛我都自己消化了','2024-03-31 20:43:57'),(6,2,2,'我还需要更强~','2024-03-31 21:06:58'),(7,2,2,'为了我所要保护的人','2024-03-31 21:07:44'),(8,2,3,'樱花','2024-03-31 21:07:58'),(9,2,3,'如果有天樱花再开','2024-03-31 21:08:41'),(10,2,1,'如果不能保护心爱的人， 剑就成了无用的兵器','2024-03-31 21:25:46'),(11,2,1,'我需要变得更强','2024-03-31 21:26:19'),(12,2,3,'有你的四月， 我很快乐','2024-03-31 21:26:38'),(13,2,3,'做你想做的吧， fight~','2024-03-31 21:27:00'),(14,2,2,'你刚刚不是玩的很开心嘛！','2024-03-31 21:27:29'),(15,2,1,'如果你也能听见我的心','2024-03-31 21:27:47'),(16,2,1,' 我真的很高兴认识你们~','2024-03-31 21:28:43'),(17,2,1,'这是从swagerapi发送过去的数据','2024-04-01 19:54:57'),(18,2,1,'这是从swagerapi发送过去的数据','2024-04-01 19:55:02'),(19,2,1,'请再给我一些时间吧， 我可以的','2024-04-01 20:12:53'),(20,2,2,'我相信你！','2024-04-01 20:21:57');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `avatar_url` varchar(255) NOT NULL,
  `description` varchar(4096) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'gamejoye','gamejoye@gmail.com','$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru','https://avatars.githubusercontent.com/u/88575063?v=4','hello world','2024-03-29 15:52:40'),(2,'mikasa','mikasa@gmail.com','$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru','https://gamejoye.top/static/media/hg.93ec2beb1dc1340c3791.jpeg','welcome to the world','2024-03-29 15:53:26'),(3,'sakura','sakura@gmail.com','$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru','https://gamejoye.top/static/media/bg.6885a3ed90df348b4f7a.jpeg','i like sakura','2024-03-29 15:54:55');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_chatroom`
--

DROP TABLE IF EXISTS `user_chatroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_chatroom` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `chatroom_id` int unsigned NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `latest_visit_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`chatroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_chatroom`
--

LOCK TABLES `user_chatroom` WRITE;
/*!40000 ALTER TABLE `user_chatroom` DISABLE KEYS */;
INSERT INTO `user_chatroom` VALUES (1,1,1,'2024-03-29 15:55:52','2024-05-06 01:38:02'),(2,1,2,'2024-03-29 15:56:09','2024-05-06 01:38:02'),(3,2,1,'2024-03-29 15:55:55','2024-05-06 01:38:02'),(4,2,2,'2024-03-29 15:56:28','2024-05-06 01:38:02'),(5,3,2,'2024-03-29 15:56:32','2024-05-06 01:38:02'),(6,1,3,'2024-03-30 01:20:34','2024-05-06 01:38:02'),(7,3,3,'2024-03-30 01:20:40','2024-05-06 01:38:02');
/*!40000 ALTER TABLE `user_chatroom` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-14 21:51:08
