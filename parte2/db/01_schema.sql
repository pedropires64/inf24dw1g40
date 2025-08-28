DROP DATABASE IF EXISTS eventosdb;
CREATE DATABASE eventosdb;
USE eventosdb;

CREATE TABLE users (
  id_user INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE venues (
  id_venue INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  city VARCHAR(80) NOT NULL,
  capacity INT NULL
);

CREATE TABLE events (
  id_event INT PRIMARY KEY AUTO_INCREMENT,
  id_venue INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  date DATETIME NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  description TEXT NULL,
  CONSTRAINT fk_events_venue FOREIGN KEY (id_venue) REFERENCES venues(id_venue) ON DELETE CASCADE
);

CREATE TABLE tickets (
  id_ticket INT PRIMARY KEY AUTO_INCREMENT,
  id_event INT NOT NULL,
  type VARCHAR(40) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  CONSTRAINT fk_tickets_event FOREIGN KEY (id_event) REFERENCES events(id_event) ON DELETE CASCADE
);
