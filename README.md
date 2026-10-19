# THE COASTLINE EVENTS — React + Express + MySQL

```
/                React + Vite website and admin panel (src/, src/admin/)
/server          Express API (server/src), MySQL schema + seed (server/database)
```

## 1. Requirements
Node 18+ and MySQL 8 (or MariaDB 10.5+).

## 2. Set up the database and API
```bash
cd server
npm install
cp .env.example .env          # then edit .env: DB_* and JWT_SECRET (32+ random chars)
npm run db:init               # creates database `coastline_events`, tables and starter content
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-passphrase' npm run create-admin
npm run dev                   # API on http://localhost:4000
```
Recommended: don't run the site as MySQL `root`. Create a limited user and put it in `.env`:
```sql
CREATE USER 'coastline'@'localhost' IDENTIFIED BY 'choose-a-strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON coastline_events.* TO 'coastline'@'localhost';
```
(`db:init` and `create-admin` need a user that can create tables — run `db:init` once with root, then switch `.env` to the limited user.)

## 3. Run the website
```bash
# in the project root (second terminal)
npm install
npm run dev                   # http://localhost:5173  (proxies /api and /uploads to port 4000)
```
Admin panel: **http://localhost:5173/admin** (sign in with the admin you created).

## 4. What the admin panel manages
Events (with linked artists), Artists, Gallery (image upload), FAQs, contact Messages, newsletter Subscribers (CSV export) and Settings (ticket site URL, contact details, tagline).
Anything published there appears on the public site on next page load. If the API is down the site falls back to the starter content in `src/data/site.js`.

## 5. Tickets
This site does not sell tickets. Put your ticketing site's address in **Admin → Settings → Ticket site URL** (an event can override it with its own link). Until it is set, “Get tickets” buttons open the contact page.

## 6. Production
```bash
npm run build                       # builds ./dist
cd server && NODE_ENV=production npm start    # serves the API and the built site on one port
```
Put it behind HTTPS (nginx/Caddy) and set `TRUST_PROXY=1` in `server/.env`. Cookies are `Secure` in production, so HTTPS is required for admin login.

## 7. API overview
Public: `GET /api/settings|events|artists|gallery|faqs`, `POST /api/contact`, `POST /api/newsletter`
Auth: `POST /api/auth/login|logout`, `GET /api/auth/me`
Admin (login required): `/api/admin/events|artists|gallery|faqs|messages|subscribers|settings|stats|upload`

## 8. Security notes
httpOnly + SameSite=Strict session cookie, bcrypt passwords, login/contact/newsletter rate limits, parameterised SQL only, input validation on every field, CSRF header check on all changes, image uploads checked by real file signature (8 MB, JPG/PNG/WEBP/GIF), Helmet security headers. Deleting a record does not delete its uploaded image file from `server/uploads`.

## 9. Still needed from the client
Ticket site URL, venue/time/lineup for the 24 Dec SOIRÉE, artist bios and social links, confirmed rights to use the photos, and legal review of the Privacy Policy and Terms.
