# Role-Based Store Rating Dashboard

This project is a full-stack role-based dashboard system that allows:
- Admins to manage users and stores
- Store Owners to view user ratings and update their password
- Normal Users to browse stores and rate them

---

## Tech Stack

- **Frontend:** React.js (Vite)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Deployment Ready:** Localhost (can be adapted to any cloud setup)

---

## Features & Roles

###  Admin
- Login and logout
- Add new users (admin/user/store)
- View and sort all registered users and stores
- See total stats (users/stores/ratings)

###  Store Owner
- Login and logout
- View a list of users who rated their store
- View average rating
- Update password

###  User
- Login and logout
- Browse all stores
- Submit or update ratings (1–5)
- Update password

---

## 📂 Folder Structure

project-root/
├── client/ # React frontend
├── server/ # Express backend
│ ├── routes/
│ ├── config/
│ └── index.js
└── database/
└── schema.sql # SQL setup script


---

## 🧪 Evaluation Checklist (for Review Team)

✅ A clearly defined database schema  
✅ SQL file with relevant scripts (see `/database/schema.sql`)  
✅ Role-based routing and UI logic  
✅ Clean and functional UI with responsive layout  
✅ Password update and rating submission flows  
✅ GitHub repository is **public** and accessible  

---

## 🧬 Database Schema

### `users` table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  address TEXT,
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user', 'store'))
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  store_id INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5)
);

psql -U postgres -d yourdbname -f database/schema.sql


