-- FitForge Gym Database
-- Import this file in phpMyAdmin or run: mysql -u root -p < gym.sql

CREATE DATABASE IF NOT EXISTS gym_db;
USE gym_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    height DECIMAL(5,2) NOT NULL COMMENT 'Height in cm',
    weight DECIMAL(5,2) NOT NULL COMMENT 'Weight in kg',
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample user (password: Test@1234)
-- INSERT INTO users (name, email, phone, age, height, weight, password)
-- VALUES ('Test User', 'test@example.com', '9876543210', 25, 170.00, 70.00, '$2y$10$...');