-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.48


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
-- Definition of table `scheduleclasssection`
--

DROP TABLE IF EXISTS `scheduleclasssection`;
CREATE TABLE `scheduleclasssection` (
  `scheduleclassId` int(10) unsigned NOT NULL,
  `scheduleclassSection` varchar(3) NOT NULL,
  PRIMARY KEY (`scheduleclassId`,`scheduleclassSection`),
  KEY `scheduleclasssection_scheduleclassid` (`scheduleclassId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `scheduleclasssection`
--

/*!40000 ALTER TABLE `scheduleclasssection` DISABLE KEYS */;
/*!40000 ALTER TABLE `scheduleclasssection` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
