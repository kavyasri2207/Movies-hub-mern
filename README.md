# 🎬 MERN Movies App — Final Enhanced Version

Full-stack movies application. MongoDB Atlas + Express + React 18 + Node.js.

---

## 🚀 Run in 3 commands

```bash
# 1. Install dependencies (run from project root)
npm install && cd frontend && npm install && cd ..

# 2. Seed database (20 movies, 8 genres, 3 users)
npm run seed

# 3. Start app
npm run fullstack
```

Open → **http://localhost:5173**

---

## 🔑 Login Accounts

| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@moviesapp.com  | admin123 |
| User  | john@example.com     | user123  |
| User  | jane@example.com     | user123  |

Anyone can also **register** from the Register page.

---

## ✨ Full Feature List

### User Features
- Register / Login / Logout / Update profile
- Browse all movies with live search
- Filter by genre (pill buttons), year, sort order
- Clear all filters with one click, result count shown
- Movie detail page with cinematic hero banner
- Watch trailer in modal popup (YouTube embed)
- Star rating display on movie cards and detail page
- Write reviews with click-to-pick star rating
- Similar movies section on detail page
- Personal Watchlist — add/remove movies, dedicated page
- Watchlist count shown on profile page

### Admin Features
- Dashboard with stats: total movies, users, reviews, avg rating
- Quick-action links on dashboard
- Top rated movies table on dashboard
- Create movie (name, year, runtime, detail, cast, genre, poster image or URL, trailer URL)
- Update / Delete movie
- Manage genres (create, edit, delete)
- All reviews list with movie poster, stars, delete with confirm
- All movies as sortable table with poster thumbnails

### Pages
| Route                        | Description             |
|------------------------------|-------------------------|
| /                            | Home with hero + sliders|
| /movies                      | Browse + filter all     |
| /movies/:id                  | Movie detail + trailer  |
| /login                       | Sign in                 |
| /register                    | Create account          |
| /profile                     | Edit profile + watchlist|
| /watchlist                   | My saved movies         |
| /admin/movies/dashboard      | Admin dashboard         |
| /admin/movies/create         | Add new movie           |
| /admin/movies-list           | All movies table        |
| /admin/movies/update/:id     | Edit movie              |
| /admin/movies/genre          | Manage genres           |
| /admin/movies/comments       | Moderate reviews        |
| *                            | 404 page                |

---

## 🚢 Deploy to Render (free)

1. Push project to GitHub
2. Go to render.com → New Web Service
3. Set:
   - Build: `npm install && cd frontend && npm install && npm run build`
   - Start: `node backend/index.js`
4. Add env vars:
   - `MONGO_URI` = your Atlas URI (already in .env)
   - `JWT_SECRET` = any long random string
   - `NODE_ENV` = `production`
5. Add to `backend/index.js` before `app.listen`:

```js
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"))
  );
}
```

---

## 🔄 Re-seed anytime

```bash
npm run seed
```
⚠️ Wipes all movies, genres, users and re-inserts fresh data.
