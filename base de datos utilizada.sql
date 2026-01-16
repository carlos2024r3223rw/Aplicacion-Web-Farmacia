/*
SQLyog Community v13.1.8 (64 bit)
MySQL - 10.4.32-MariaDB : Database - pharmapro_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`pharmapro_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `pharmapro_db`;

/*Table structure for table `inventory` */

DROP TABLE IF EXISTS `inventory`;

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `price` decimal(10,2) DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `threshold` int(11) DEFAULT 10,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `inventory` */

insert  into `inventory`(`id`,`name`,`category`,`stock`,`price`,`expiryDate`,`threshold`) values 
(1,'Ibuprofeno 400mg','Analgesic',25,4.50,'2026-12-01',10),
(2,'Ibuprofeno 600mg','Analgesic',340,6.00,'2026-11-15',10),
(3,'Paracetamol 1g','Analgesic',96,5.00,'2027-01-20',10),
(4,'Aspirina Bayer','Analgesic',4,3.50,'2026-10-22',10),
(5,'Naproxeno 550mg','Analgesic',80,12.00,'2026-05-05',10),
(6,'Diclofenaco Gel','Analgesic',45,8.50,'2026-07-17',10),
(7,'Ketorolaco 10mg','Analgesic',200,7.00,'2026-04-18',10),
(8,'Tramadol 50mg','Analgesic',30,15.00,'2026-06-18',10),
(9,'Amoxicilina 500mg','Antibiotic',140,12.50,'2026-05-23',10),
(10,'Amoxicilina/Clavulánico','Antibiotic',60,22.00,'2025-07-20',10),
(11,'Azitromicina 500mg','Antibiotic',40,25.00,'2026-03-10',10),
(12,'Ciprofloxacino 500mg','Antibiotic',90,18.00,'2026-06-01',10),
(13,'Cefalexina 500mg','Antibiotic',110,14.00,'2026-05-15',10),
(14,'Doxiciclina 100mg','Antibiotic',75,16.50,'2026-04-15',10),
(15,'Gentamicina Iny.','Antibiotic',55,8.00,'2026-03-13',10),
(16,'Loratadina 10mg','Misc',286,3.00,'2027-05-01',10),
(17,'Desloratadina 5mg','Misc',150,6.50,'2027-06-15',10),
(18,'Clorfenamina','Misc',394,2.00,'2026-09-10',10),
(19,'Omeprazol 20mg','Misc',242,5.00,'2026-12-12',10),
(20,'Pantoprazol 40mg','Misc',100,12.00,'2026-10-30',10),
(21,'Ranitidina 150mg','Misc',80,4.00,'2025-08-05',10),
(22,'Metformina 850mg','Diabetes',500,6.00,'2027-02-28',10),
(23,'Metformina 500mg','Diabetes',292,5.00,'2027-03-15',10),
(24,'Glibenclamida 5mg','Diabetes',200,4.50,'2026-11-20',10),
(25,'Insulina Glargina','Diabetes',12,45.00,'2025-09-30',10),
(26,'Tiras Reactivas Glucosa','Diabetes',50,25.00,'2026-12-31',10),
(27,'Losartán 50mg','Cardiac',400,8.00,'2027-01-15',10),
(28,'Telmisartán 40mg','Cardiac',150,18.00,'2026-08-20',10),
(29,'Enalapril 10mg','Cardiac',300,5.50,'2026-07-10',10),
(30,'Amlodipino 5mg','Cardiac',247,7.00,'2026-10-05',10),
(31,'Atorvastatina 20mg','Statins',180,15.00,'2026-11-01',10),
(32,'Simvastatina 10mg','Statins',120,9.00,'2026-05-25',10),
(33,'Rosuvastatina 10mg','Statins',90,22.00,'2027-02-10',10),
(34,'Salbutamol Inhalador','Misc',60,12.00,'2026-03-30',10),
(35,'Jarabe para Tos','Misc',85,9.50,'2026-04-17',10),
(36,'Vitamina C 1g','Misc',200,6.00,'2026-09-20',10),
(37,'Complejo B Iny.','Misc',100,15.00,'2027-03-18',10),
(38,'Electrolitos Orales','Misc',300,2.50,'2027-04-05',10),
(39,'Alcohol Etílico 70%','Misc',50,3.00,'2028-01-01',10),
(40,'Agua Oxigenada','Misc',36,2.00,'2028-01-01',10),
(41,'Vendas Elásticas 5cm','Misc',100,1.50,'2030-01-01',10),
(42,'Curitas Caja','Misc',150,2.00,'2030-01-01',10),
(43,'Gasas Estériles','Misc',180,3.50,'2029-01-01',10),
(44,'Jeringas 3ml','Misc',500,0.50,'2029-06-01',10),
(45,'Jeringas 5ml','Misc',500,0.60,'2029-06-01',10),
(46,'Metoclopramida','Misc',80,5.00,'2026-04-10',10),
(47,'Buscapina Compositum','Analgesic',60,10.00,'2026-07-22',10),
(48,'Sildenafil 50mg','Misc',40,15.00,'2027-05-10',10),
(49,'Tadalafil 20mg','Misc',30,18.00,'2027-06-01',10);

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient` varchar(100) DEFAULT NULL,
  `items` text DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'Pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `orders` */

insert  into `orders`(`id`,`patient`,`items`,`total`,`date`,`status`) values 
(5,'Pedro ','[{\"name\":\"Omeprazol\",\"qty\":5,\"price\":5}]',25.00,'2026-01-10 22:57:51','Completed'),
(7,'Maria ','[{\"name\":\"Aspirina\",\"qty\":1,\"price\":3.5}]',3.50,'2026-01-09 22:57:51','Completed'),
(10,'Cliente General','[{\"id\":3,\"name\":\"Paracetamol 1g\",\"category\":\"Analgesic\",\"stock\":120,\"price\":\"5.00\",\"expiryDate\":\"2027-01-20T06:00:00.000Z\",\"threshold\":10,\"qty\":7},{\"id\":16,\"name\":\"Loratadina 10mg\",\"category\":\"Misc\",\"stock\":300,\"price\":\"3.00\",\"expiryDate\":\"2027-05-01T06:00:00.000Z\",\"threshold\":10,\"qty\":9},{\"id\":43,\"name\":\"Gasas Estériles\",\"category\":\"Misc\",\"stock\":200,\"price\":\"3.50\",\"expiryDate\":\"2029-01-01T06:00:00.000Z\",\"threshold\":10,\"qty\":10},{\"id\":30,\"name\":\"Amlodipino 5mg\",\"category\":\"Cardiac\",\"stock\":250,\"price\":\"7.00\",\"expiryDate\":\"2026-10-05T06:00:00.000Z\",\"threshold\":10,\"qty\":3}]',118.00,'2026-01-13 23:15:11','Completed'),
(13,'Maria Mendez','[{\"id\":4,\"name\":\"Aspirina Bayer\",\"category\":\"Analgesic\",\"stock\":50,\"price\":\"3.50\",\"expiryDate\":\"2026-10-22T06:00:00.000Z\",\"threshold\":10,\"qty\":10}]',35.00,'2026-01-13 23:47:28','Completed'),
(14,'Juan Pérez ','[{\"id\":9,\"name\":\"Amoxicilina 500mg\",\"category\":\"Antibiotic\",\"stock\":150,\"price\":\"12.50\",\"expiryDate\":\"2026-05-23T06:00:00.000Z\",\"threshold\":10,\"qty\":10},{\"id\":3,\"name\":\"Paracetamol 1g\",\"category\":\"Analgesic\",\"stock\":108,\"price\":\"5.00\",\"expiryDate\":\"2027-01-20T06:00:00.000Z\",\"threshold\":10,\"qty\":12}]',185.00,'2026-01-14 22:00:37','Completed');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'Staff',
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`role`,`name`) values 
(1,'admin','admin123','Owner','Administrador'),
(3,'Maria','1234','Pharmacist','Maria Garcia'),
(4,'Josue','1234','Cashier','Josue Marroquín');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
