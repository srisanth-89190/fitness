# FitForge Gym Website
A complete gym management website built with HTML, CSS, JavaScript, PHP, and MySQL.

---

## 📁 Files Included
| File | Purpose |
|------|---------|
| `index.html` | Main website (all pages in one file) |
| `style.css` | All styles and responsive design |
| `script.js` | Frontend logic (BMI, Calories, Workout, Diet, Auth) |
| `register.php` | User registration API |
| `login.php` | User login API |
| `db.php` | MySQL database connection |
| `gym.sql` | Database schema (run this first!) |

---

## 🚀 Setup Instructions

### Step 1 — Install XAMPP
Download from: https://www.apachefriends.org/
Install and launch **XAMPP Control Panel**.
Start **Apache** and **MySQL**.

### Step 2 — Copy Files
Copy the entire `gym_website` folder to:
```
C:\xampp\htdocs\gym_website\
```

### Step 3 — Create Database
1. Open your browser and go to: http://localhost/phpmyadmin
2. Click **New** (left sidebar)
3. Create database named: `gym_db`
4. Click the `gym_db` database
5. Click **Import** tab
6. Click **Choose File** → select `gym.sql`
7. Click **Go**

**OR** run in the SQL tab:
```sql
CREATE DATABASE gym_db;
USE gym_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  age INT NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 4 — Configure DB (if needed)
Open `db.php` and verify:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');   // your MySQL username
define('DB_PASS', '');       // your MySQL password (empty by default in XAMPP)
define('DB_NAME', 'gym_db');
```

### Step 5 — Open the Website
Go to: **http://localhost/gym_website/**

---

## ✨ Features
- 🏠 **Home** — Hero section with stats and CTA
- 📊 **BMI Calculator** — Instant BMI with category and advice
- 🔥 **Calorie Calculator** — Daily calorie needs using Mifflin-St Jeor formula
- 💪 **Workout Plans** — Based on BMI category (Underweight / Normal / Overweight)
- 🥗 **Diet Plans** — Vegetarian and Non-Vegetarian meal plans
- 📝 **Registration** — Stores user data in MySQL
- 🔐 **Login** — Secure with bcrypt password hashing
- 📋 **Dashboard** — Personalized overview after login

---

## 🔧 Troubleshooting
- **"Could not connect"** → Make sure XAMPP Apache + MySQL are running
- **"Database connection failed"** → Check `db.php` credentials
- **White page on PHP files** → File must be in `htdocs`, not Desktop
- **Port conflict** → Change Apache port in XAMPP Config if 80 is busy

---

Built with ❤️ — FitForge Gym 2025
