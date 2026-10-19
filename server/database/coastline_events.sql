-- ============================================================================
-- THE COASTLINE EVENTS — MySQL / MariaDB database (structure + starter content)
-- Import with phpMyAdmin (Import tab), MySQL Workbench, or:  mysql -u root -p < coastline_events.sql
-- Safe to import more than once: it never drops tables or overwrites existing rows.
-- Creates the database `coastline_events`. Admin login is NOT included: run `npm run create-admin`
-- in /server (it stores a bcrypt hash of a password you choose).
-- ============================================================================
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS coastline_events CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coastline_events;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(60) PRIMARY KEY,
  `value` TEXT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS artists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  img VARCHAR(255) NULL,
  pos VARCHAR(30) NOT NULL DEFAULT '50% 50%',
  bio TEXT NULL,
  instagram VARCHAR(255) NULL,
  soundcloud VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(190) NOT NULL,
  series ENUM('soiree','one-love','exclusive') NOT NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(80) NULL,
  venue VARCHAR(190) NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Announced',
  img VARCHAR(255) NULL,
  description TEXT NULL,
  ticket_url VARCHAR(500) NULL,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_events_date (event_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event_artists (
  event_id INT NOT NULL,
  artist_id INT NOT NULL,
  PRIMARY KEY (event_id, artist_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cat ENUM('soiree','one-love','exclusive') NOT NULL,
  src VARCHAR(255) NOT NULL UNIQUE,
  alt VARCHAR(255) NOT NULL,
  ar VARCHAR(10) NOT NULL DEFAULT '3/2',
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(190) NOT NULL UNIQUE,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  type VARCHAR(60) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------- starter content ----------------
-- Safe to re-run: INSERT IGNORE skips rows that already exist.
INSERT IGNORE INTO settings (`key`,`value`) VALUES
('ticket_url',''),('email','thecoastlineevents@gmail.com'),('phone','077 713 7266'),('location','Colombo, Sri Lanka'),('instagram','https://www.instagram.com/thecoastlineevents'),('facebook',''),('tagline','BEYOND THE BEATS.'),
('description','Conducting the best accompanied coastal events to your shores. Follow us towards electrifying beats — the ultimate coastal event experience.');

INSERT IGNORE INTO artists (slug,name,img,pos,bio,sort_order) VALUES
('adora','ADORA','/images/artists/adora.jpg','50% 18%','Artist profile coming soon — bio and social links to be supplied.',1),
('echo-daft','ECHO DAFT','/images/artists/echo-daft.jpg','56% 50%','Artist profile coming soon — bio and social links to be supplied.',2),
('jayy-vibes','JAYY VIBES','/images/artists/jayy-vibes.jpg','64% 50%','Artist profile coming soon — bio and social links to be supplied.',3),
('kryptone','KRYPTONE','/images/artists/kryptone.jpg','56% 50%','Artist profile coming soon — bio and social links to be supplied.',4),
('perc-capsule','PERC CAPSULE','/images/artists/perc-capsule.jpg','68% 50%','Artist profile coming soon — bio and social links to be supplied.',5),
('universe-sl','UNIVERSE SL','/images/artists/universe-sl.jpg','68% 50%','Artist profile coming soon — bio and social links to be supplied.',6);

INSERT IGNORE INTO events (slug,title,series,event_date,event_time,venue,status,img,description) VALUES
('soiree-open-to-close','SOIRÉE — Open to Close','soiree','2026-12-24','Time to be announced','Venue to be announced','Announced','/images/gallery/event-02.jpg','The next SOIRÉE: progressive house, light and sound from open to close. Venue, timings and lineup will be announced soon.');

INSERT IGNORE INTO gallery (cat,src,alt,ar,sort_order) VALUES
('soiree','/images/gallery/event-01.jpg','Event atmosphere still 1','16/9',1),
('soiree','/images/gallery/event-02.jpg','Event atmosphere still 2','16/9',2),
('soiree','/images/gallery/event-03.jpg','Event atmosphere still 3','16/9',3),
('soiree','/images/gallery/event-04.jpg','Event atmosphere still 4','16/9',4),
('soiree','/images/gallery/event-05.jpg','Event atmosphere still 5','16/9',5),
('soiree','/images/gallery/event-06.jpg','Event atmosphere still 6','16/9',6),
('soiree','/images/gallery/soiree-reveal-01.jpg','SOIRÉE neon logo reveal still 1','16/9',7),
('soiree','/images/gallery/soiree-reveal-02.jpg','SOIRÉE neon logo reveal still 2','16/9',8),
('soiree','/images/gallery/soiree-reveal-03.jpg','SOIRÉE neon logo reveal still 3','16/9',9),
('soiree','/images/gallery/soiree-reveal-04.jpg','SOIRÉE neon logo reveal still 4','16/9',10),
('one-love','/images/one-love/hero.jpg','ONE LOVE main stage at dusk','3/2',11),
('one-love','/images/one-love/stage.jpg','DJ on the ONE LOVE stage in front of the LED screen','4/5',12),
('one-love','/images/one-love/florals.jpg','ONE LOVE LED screen with floral truss and butterfly lights','3/2',13),
('exclusive','/images/exclusive/hero.jpg','DJ at THE COASTLINE EXCLUSIVE','3/2',14),
('exclusive','/images/exclusive/dj.jpg','DJ behind the decks at THE COASTLINE EXCLUSIVE','4/5',15),
('exclusive','/images/exclusive/sign.jpg','THE COASTLINE lettering and white flower garland on the DJ booth','16/9',16);

INSERT IGNORE INTO faqs (question,answer,sort_order) VALUES
('Are the events on this site real?','Events are added by THE COASTLINE EVENTS as they are confirmed. Check the Events page for the latest.',1),
('Where do I buy tickets?','Tickets are sold on our separate ticketing site. Use any Get Tickets button on this website to go there.',2),
('What is the difference between SOIRÉE, ONE LOVE and THE COASTLINE EXCLUSIVE?','SOIRÉE is our night series, ONE LOVE is our tropical brunch concept, and THE COASTLINE EXCLUSIVE is our premium, curated concept.',3),
('Is there an age limit or dress code?','This is set per event and will be shown on the event page once confirmed.',4),
('How can I enquire about a private event or collaboration?','Use the contact page, email thecoastlineevents@gmail.com or call 077 713 7266.',5);

-- ----------------------------------------------------------------------------
-- Optional: create the admin directly in SQL instead of `npm run create-admin`.
-- Replace the hash with a bcrypt hash (cost 12) of your own password, then remove the leading "-- ".
-- ----------------------------------------------------------------------------
-- INSERT INTO admins (email, password_hash, name) VALUES ('you@example.com', '<BCRYPT_HASH>', 'Admin');
