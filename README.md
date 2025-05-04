# ⭐️ Role-Based Store Rating Dashboard (React + Node + PostgreSQL)

This is a full-stack web application built to manage and rate local stores based on user roles. It supports three types of users: Admin, Store Owner, and Normal User — each with tailored dashboard functionality.

---

## 📌 Overview

This project was built as part of a technical evaluation and showcases:
- Role-based login and navigation
- Dynamic data fetching via REST APIs
- Store rating functionality
- Password update flow for all roles
- Professional, responsive UI

---

## 🛠 Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Frontend    | React.js (Vite)      |
| Backend     | Node.js + Express    |
| Database    | PostgreSQL           |
| Styling     | Inline CSS / Flexbox |
| Hosting     | Localhost-ready      |

---

## ✅ Features by Role

### 👤 Admin
- Secure login
- View total users, stores, and ratings count
- Add new users with roles (Admin / Store Owner / User)
- View, search, and sort all users and stores
- Logout

### 🏪 Store Owner
- Secure login
- View a list of users who rated their store
- View average store rating
- Update their password
- Logout

### 🙋 Normal User
- Secure login
- View list of stores
- Submit or update store ratings (1–5)
- Search by name/address
- Update password
- Logout

---

## 📁 Folder Structure

project-root/
├── client/ # React frontend
│ ├── pages/
│ └── components/
├── server/ # Express backend
│ ├── routes/
│ └── config/
├── database/
│ └── schema.sql # SQL setup script
└── README.md # Project documentation



---

## 🧬 Database Schema

### users table
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
