USE coastline_events;

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
