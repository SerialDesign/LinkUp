#!/bin/bash

# Go to backend directory
cd backend

# Start backend server via npm in the background
npm run dev &

# Go to frontend directory
cd ../frontend

# Start frontend server via npm
npm start
