DROP TABLE IF EXISTS chatroom;
CREATE TABLE `chatroom` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('SINGLE','MULTIPLE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chatroom`
--

LOCK TABLES `chatroom` WRITE;
INSERT INTO `chatroom` VALUES (1,'SINGLE','gamejoye_mikasa','2024-03-29 15:54:07'),(2,'MULTIPLE','爱之诗','2024-03-29 15:55:20'),(3,'SINGLE','gamejoye_sakura','2024-03-30 01:20:18');
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `chatroom_id` int unsigned NOT NULL,
  `from` int unsigned NOT NULL,
  `content` text NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
INSERT INTO `message` VALUES (1,2,1,'我爱你们， 宝宝','2024-03-29 20:48:25'),(2,2,1,'爱来自gamejoye','2024-03-31 00:57:27'),(3,1,1,'如有天樱花再开','2024-03-31 00:58:14'),(4,2,1,'你们是否也会迷茫呢','2024-03-31 00:58:31'),(5,2,1,'我应该如何诉说我一路的艰辛了。 我有许多的话想说， 可话到了嘴边却又被我咽下去了。 就这样， 所有的艰辛我都自己消化了','2024-03-31 20:43:57'),(6,2,2,'我还需要更强~','2024-03-31 21:06:58'),(7,2,2,'为了我所要保护的人','2024-03-31 21:07:44'),(8,2,3,'樱花','2024-03-31 21:07:58'),(9,2,3,'如果有天樱花再开','2024-03-31 21:08:41'),(10,2,1,'如果不能保护心爱的人， 剑就成了无用的兵器','2024-03-31 21:25:46'),(11,2,1,'我需要变得更强','2024-03-31 21:26:19'),(12,2,3,'有你的四月， 我很快乐','2024-03-31 21:26:38'),(13,2,3,'做你想做的吧， fight~','2024-03-31 21:27:00'),(14,2,2,'你刚刚不是玩的很开心嘛！','2024-03-31 21:27:29'),(15,2,1,'如果你也能听见我的心','2024-03-31 21:27:47'),(16,2,1,' 我真的很高兴认识你们~','2024-03-31 21:28:43'),(17,2,1,'这是从swagerapi发送过去的数据','2024-04-01 19:54:57'),(18,2,1,'这是从swagerapi发送过去的数据','2024-04-01 19:55:02'),(19,2,1,'请再给我一些时间吧， 我可以的','2024-04-01 20:12:53'),(20,2,2,'我相信你！','2024-04-01 20:21:57');
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
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

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES (1,'gamejoye','gamejoye@gmail.com','$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru','https://avatars.githubusercontent.com/u/88575063?v=4','hello world','2024-03-29 15:52:40'),(2,'mikasa','mikasa@gmail.com','$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru','https://gamejoye.top/static/media/hg.93ec2beb1dc1340c3791.jpeg','welcome to the world','2024-03-29 15:53:26'),(3,'sakura','sakura@gmail.com','$2b$10$TANlyb1owgNPLbTZv9.i2ehqubUqNIwWZK4ESvD9lbgc5aWgjt4Ru','https://gamejoye.top/static/media/bg.6885a3ed90df348b4f7a.jpeg','i like sakura','2024-03-29 15:54:55');
UNLOCK TABLES;

--
-- Table structure for table `user_chatroom`
--

DROP TABLE IF EXISTS `user_chatroom`;
CREATE TABLE `user_chatroom` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `chatroom_id` int unsigned NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`chatroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_chatroom`
--

LOCK TABLES `user_chatroom` WRITE;
INSERT INTO `user_chatroom` VALUES (1,1,1,'2024-03-29 15:55:52'),(2,1,2,'2024-03-29 15:56:09'),(3,2,1,'2024-03-29 15:55:55'),(4,2,2,'2024-03-29 15:56:28'),(5,3,2,'2024-03-29 15:56:32'),(6,1,3,'2024-03-30 01:20:34'),(7,3,3,'2024-03-30 01:20:40');
UNLOCK TABLES;
