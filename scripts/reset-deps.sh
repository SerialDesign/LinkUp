#!/bin/bash

# Go to backend directory
cd backend

# Remove the node_modules directory
rm -rf node_modules && cd ..

# Go to frontend directory
cd frontend

# Remove the node_modules directory
rm -rf node_modules

# Remove the Expo folder
rm -rf .expo
