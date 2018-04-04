-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.28


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema scheduler
--

CREATE DATABASE IF NOT EXISTS scheduler;
USE scheduler;

--
-- Definition of table `user_userpermission`
--

DROP TABLE IF EXISTS `user_userpermission`;
CREATE TABLE `user_userpermission` (
  `userId` int(11) unsigned NOT NULL,
  `userpermissionId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userId`,`userpermissionId`),
  KEY `FK_user_userpermission_userpermission` (`userpermissionId`),
  CONSTRAINT `FK_user_userpermission_user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_userpermission_userpermission` FOREIGN KEY (`userpermissionId`) REFERENCES `userpermission` (`userpermissionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_userpermission`
--

/*!40000 ALTER TABLE `user_userpermission` DISABLE KEYS */;
INSERT INTO `user_userpermission` (`userId`,`userpermissionId`) VALUES 
 (2,2),
 (3,2),
 (4,2),
 (5,2),
 (6,2),
 (7,2),
 (8,2),
 (9,2),
 (10,2),
 (11,2),
 (12,2),
 (13,2),
 (14,2),
 (15,2),
 (16,2),
 (17,2),
 (18,2),
 (19,2),
 (20,2),
 (21,2),
 (22,2),
 (23,2),
 (24,2),
 (25,2),
 (26,2),
 (27,2),
 (28,2),
 (29,2),
 (30,2),
 (31,2),
 (32,2),
 (33,2),
 (34,2),
 (35,2),
 (36,2),
 (37,2),
 (38,2),
 (39,2),
 (40,2),
 (41,2),
 (42,2),
 (43,2),
 (44,2),
 (45,2),
 (46,2),
 (47,2),
 (48,2),
 (49,2),
 (50,2),
 (51,2),
 (52,2),
 (53,2),
 (54,2),
 (55,2),
 (56,2),
 (57,2),
 (58,2),
 (59,2),
 (60,2),
 (61,2),
 (62,2),
 (63,2),
 (64,2),
 (65,2),
 (66,2),
 (67,2),
 (68,2),
 (69,2),
 (70,2),
 (71,2),
 (72,2),
 (73,2),
 (74,2),
 (75,2),
 (76,2),
 (77,2),
 (78,2),
 (79,2),
 (80,2),
 (81,2),
 (82,2),
 (83,2),
 (84,2),
 (85,2),
 (86,2),
 (87,2),
 (88,2),
 (89,2),
 (90,2),
 (91,2),
 (92,2),
 (93,2),
 (94,2),
 (95,2),
 (96,2),
 (97,2),
 (98,2),
 (99,2),
 (100,2),
 (101,2),
 (102,2),
 (103,2),
 (104,2),
 (105,2),
 (106,2),
 (107,2),
 (108,2),
 (109,2),
 (110,2),
 (111,2),
 (112,2),
 (113,2),
 (114,2),
 (115,2),
 (116,2),
 (117,2),
 (118,2),
 (119,2),
 (120,2),
 (121,2),
 (122,2),
 (123,2),
 (124,2),
 (125,2),
 (126,2),
 (127,2),
 (128,2),
 (129,2),
 (130,2),
 (131,2),
 (132,2),
 (133,2),
 (134,2),
 (135,2),
 (136,2),
 (137,2),
 (138,2),
 (139,2),
 (140,2),
 (141,2),
 (142,2),
 (143,2),
 (144,2),
 (145,2),
 (146,2),
 (147,2),
 (148,2),
 (149,2),
 (150,2),
 (151,2),
 (152,2),
 (153,2),
 (154,2);
/*!40000 ALTER TABLE `user_userpermission` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
