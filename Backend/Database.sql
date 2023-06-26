-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: bed_ca1_db
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `airports`
--

DROP TABLE IF EXISTS `airports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airports` (
  `AirportID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Country` varchar(45) NOT NULL,
  `Description` varchar(255) NOT NULL,
  PRIMARY KEY (`AirportID`),
  UNIQUE KEY `AirportID_UNIQUE` (`AirportID`),
  UNIQUE KEY `Name_UNIQUE` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airports`
--

LOCK TABLES `airports` WRITE;
/*!40000 ALTER TABLE `airports` DISABLE KEYS */;
INSERT INTO `airports` VALUES (2,'Changi Airport','Singapore','Main International Airport of Singapore'),(10,'Pearce Air Force Base','Australia','Air Force Base in Australia'),(11,'Narita Airport','Japan','International Airport in Japan'),(12,'Charles De Gaulle Airport','France','International Airport in France'),(13,'Osaka Airport','Japan','International Airport in Japan'),(14,'Frankfurt Airport','Germany','Largest Airport in Germany'),(16,'Hokkaido Airport','Japan','Airport in Japan'),(20,'Tokyo Airport','Japan','Japan\'s International Airport'),(21,'Incheon Airport','Korea, Republic of Korea','International Airport in Korea'),(28,'Munich Airport','Germany','International Airport in Germany');
/*!40000 ALTER TABLE `airports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `BookingID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Passport` varchar(45) NOT NULL,
  `Nationality` varchar(45) NOT NULL,
  `Age` int NOT NULL,
  `UserID` int NOT NULL,
  `Flight` int NOT NULL,
  PRIMARY KEY (`BookingID`),
  UNIQUE KEY `BookingsID_UNIQUE` (`BookingID`),
  KEY `FlightID_idx` (`Flight`),
  CONSTRAINT `FlightID` FOREIGN KEY (`Flight`) REFERENCES `flights` (`FlightID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'John Tan','E1234555Z','Singaporean',20,18,18),(17,'Duncan','D9238923O','singaporean',20,18,17),(19,'Duncan','E9034759O','slovakian',21,46,18),(20,'Oli','D9072340F','singaporean',21,18,27),(21,'Marcel','R2564364P','french',28,18,21),(22,'Louis','P756456T7','ethiopian',35,18,21),(23,'Edwin','R329G5466','dutch',20,18,21),(24,'Luke','RG8734509','cypriot',40,18,21),(25,'Danielle','D82934L42','indonesian',22,18,21),(26,'Elijah','E8432748J','haitian',64,54,21),(27,'Charles','C92984421','german',18,18,21),(28,'Tester','T2348732D','singaporean',33,46,18),(29,'Tester','T2348732D','singaporean',33,46,29),(30,'dUNCAN','E38492579','slovakian',25,18,18),(31,'dUNCAN','E38492579','slovakian',25,18,29);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flights` (
  `FlightID` int NOT NULL AUTO_INCREMENT,
  `FlightCode` varchar(45) NOT NULL,
  `Aircraft` varchar(45) NOT NULL,
  `OriginAirport` int NOT NULL,
  `DestinationAirport` int NOT NULL,
  `EmbarkDate` datetime NOT NULL,
  `ArrivalDate` datetime NOT NULL,
  `TravelTime` varchar(45) NOT NULL,
  `Price` decimal(19,2) NOT NULL,
  `CreatedTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`FlightID`),
  UNIQUE KEY `FlightID_UNIQUE` (`FlightID`),
  KEY `AirportID_idx` (`OriginAirport`,`DestinationAirport`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES (17,'SP110','BOEING 737',2,11,'2022-12-22 08:20:00','2022-12-22 08:20:00','6 Hour(s) 50 Min(s)',855.50,'2022-06-07 16:37:23'),(18,'SP111','Lockheed Martin F-15 Strike Eagle',11,10,'2022-12-22 08:20:00','2022-12-22 08:20:00','2 Hour(s) 50 Min(s)',2599.00,'2022-06-07 16:38:47'),(21,'SP150','Mitsubishi F-2',11,13,'2022-12-22 06:25:10','2022-12-22 08:20:00','1 Hour(s) 20 Min(s)',3255.00,'2022-06-07 16:38:47'),(25,'SP151','BOEING 747',12,16,'2022-12-22 06:25:10','2022-12-22 08:20:00','2 Hour(s) 50 Min(s)',3452.22,'2022-06-07 16:38:47'),(27,'SP112','V22 OSPREY',11,10,'2022-08-24 16:04:00','2022-08-25 08:10:00','16 Hours(s) 6 Min(s)',3321.23,'2022-08-06 08:05:32'),(28,'SP152','JAS 39 GRIPEN',12,16,'2022-08-31 16:06:00','2022-09-01 09:34:00','17 Hours(s) 28 Min(s)',8212.05,'2022-08-06 08:07:41'),(29,'SP153','F16C-VIPER',10,11,'2022-08-16 18:21:00','2022-08-17 05:20:00','10 Hours(s) 59 Min(s)',23124.21,'2022-08-07 07:20:02'),(30,'SP154','AC130-GUNSHIP',10,11,'2022-08-31 15:20:00','2022-09-01 07:25:00','16 Hours(s) 5 Min(s)',3435.03,'2022-08-07 07:21:27');
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `PromoID` int NOT NULL AUTO_INCREMENT,
  `Code` varchar(45) NOT NULL,
  `Value` decimal(19,2) NOT NULL,
  `CreationDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ExpiryDate` datetime NOT NULL,
  `PromoCondition` varchar(45) NOT NULL,
  PRIMARY KEY (`PromoID`),
  UNIQUE KEY `DiscountID_UNIQUE` (`PromoID`),
  UNIQUE KEY `Code_UNIQUE` (`Code`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (9,'Fly55',55.00,'2022-06-09 15:36:01','2022-08-05 11:12:01','Japan'),(10,'Airshow25',25.00,'2022-06-20 10:17:21','2022-08-05 11:12:01','Australia'),(13,'BED18',18.00,'2022-08-07 22:32:42','2022-10-10 20:34:00','France');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Contact` int NOT NULL,
  `Password` varchar(45) NOT NULL,
  `Role` varchar(45) NOT NULL,
  `Profile_Pic_URL` varchar(2048) DEFAULT NULL,
  `Timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `UserID_UNIQUE` (`UserID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  UNIQUE KEY `Contact_UNIQUE` (`Contact`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (13,'John','john@gmail.com',88099090,'1QWER$#@!','Customer','','2022-05-23 02:21:26'),(18,'OliviaSN','oli@gmail.com',93229490,'P@$$w0rd','Customer','Olivia_Profile_Pic.jpg','2022-05-23 02:21:26'),(33,'Adam11213','Adam@gmail.com',91190091,'P@$$w0rd','Customer','','2022-05-26 12:32:00'),(46,'Cillian Murphy','CillianM@gmail.com',91229490,'1QWER$#@!','Customer','','2022-06-08 12:03:25'),(54,'Terry Tan','NEWterry@gmail.com',91234567,'abc123456','Customer','','2022-06-20 09:11:52'),(56,'Admin','admin@gmail.com',67875421,'P@$$w0rd','Admin','Admin_Profile_Pic.jpg','2022-07-06 01:26:57'),(111,'asdfsd','sjhf@gmail.com',23847237,'P@$$w0rd','Customer','','2022-08-01 09:10:37'),(115,'asfsdf','szdfs',32423452,'qwer','Customer','','2022-08-03 14:36:32'),(124,'TestUser','Tester@gmail.com',98989132,'P@$$w0rd123','Customer','ProfilePicture-1659718384240.jpg','2022-08-04 07:57:07'),(125,'skldjfjkjs','jjshfg@gmail.com',98734573,'P@$$w0rd','Customer','ProfilePicture-1659680579454.jpg','2022-08-05 06:22:59'),(126,'kslhgskjfd','kjdjfg@gmail.com',87340957,'P@$$w0rd','Customer','','2022-08-05 06:29:14'),(127,'jzdsjgb','jdsfngj@gmail.com',98739847,'P@$$w0rd','Customer','','2022-08-05 06:31:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-08  6:44:15
