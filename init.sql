-- This script initializes the pong_data database

-- Create the pong_data database
CREATE DATABASE pong_data;

-- Connect to the pong_data database
\c pong_data;

-- Create a table for users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create a table for posts
CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create other necessary tables...

-- Add any additional statements to initialize your database here
