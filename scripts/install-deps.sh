#!/bin/bash

# Go to backend directory
cd backend

# Install dependencies in backend repo
npm install && cd ..

# Go to frontend directory
cd frontend

# Install dependencies in frontend repo
npm install
