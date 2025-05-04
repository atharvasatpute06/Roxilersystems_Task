#  Role-Based Store Rating Dashboard (React + Node + PostgreSQL)

This is a full-stack web application built to manage and rate local stores based on user roles. It supports three types of users: Admin, Store Owner, and Normal User — each with tailored dashboard functionality.

---
**Demo Video:**  
The screen recording of the project is included in this repository.  
Please download the video file from the (.demovideo) folder to view the full working of the project.


##  Overview

This project was built as part of a technical evaluation and showcases:
- Role-based login and navigation
- Dynamic data fetching via REST APIs
- Store rating functionality
- Password update flow for all roles
- Professional, responsive UI

---

## Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Frontend    | React.js (Vite)      |
| Backend     | Node.js + Express    |
| Database    | PostgreSQL           |
| Styling     | Inline CSS / Flexbox |
| Hosting     | Localhost-ready      |

---

##  Features by Role

###  Admin
- Secure login
- View total users, stores, and ratings count
- Add new users with roles (Admin / Store Owner / User)
- View, search, and sort all users and stores
- Logout

###  Store Owner
- Secure login
- View a list of users who rated their store
- View average store rating
- Update their password
- Logout

###  Normal User
- Secure login
- View list of stores
- Submit or update store ratings (1–5)
- Search by name/address
- Update password
- Logout

---

##  Folder Structure

project-root/
├── client/ # React frontend
│ ├── pages/
│ └── components/
├── server/ # Express backend
│ ├── routes/
│ └── config/
├── database/
└── README.md # Project documentation



---

##  Database Schema

###  `users` Table

| Field     | Type     | Description                     |
|-----------|----------|---------------------------------|
| id        | SERIAL   | Primary Key                     |
| name      | TEXT     | Full Name                       |
| email     | TEXT     | Unique Email                    |
| password  | TEXT     | Plain or encrypted password     |
| address   | TEXT     | Address                         |
| role      | TEXT     | 'user', 'store', or 'admin'     |

###  `ratings` Table

| Field     | Type     | Description                     |
|-----------|----------|---------------------------------|
| id        | SERIAL   | Primary Key                     |
| user_id   | INTEGER  | FK → users.id (who rated)       |
| store_id  | INTEGER  | FK → users.id (store rated)     |
| rating    | INTEGER  | 1 to 5                          |

---

##  Why These Tables?

- `users`: Manages all users under one roof with a `role` column for distinction.
- `ratings`: Keeps track of who rated whom and the score, forming a many-to-many relationship.

---

## Backend Filtering Logic

### Route: `/api/stores/all-with-ratings?userId=1`

- Fetches **only store owners**
- Joins `ratings` table to:
  - Calculate the **average rating** for each store
  - Show the **current user's rating** (if any) using a **LEFT JOIN** with `userId`

### SQL Snippet:

```sql
SELECT 
  u.id,
  u.name,
  u.address,
  COALESCE(AVG(r.rating), 0) AS average_rating,
  ur.rating AS user_rating
FROM users u
LEFT JOIN ratings r ON u.id = r.store_id


**Demo Video:**  
The screen recording of the project is included in this repository.  
Please download the video file from the (.demovideo) folder to view the full working of the project.
LEFT JOIN ratings ur ON u.id = ur.store_id AND ur.user_id = $1
WHERE u.role = 'store'
GROUP BY u.id, ur.rating;


[▶️ Watch Demo](./demo/demo-video.mp4)
