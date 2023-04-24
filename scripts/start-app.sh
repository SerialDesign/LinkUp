#!/bin/bash

# Parse command-line options
while getopts "ai" opt; do
  case ${opt} in
  a)
    PLATFORM="android"
    ;;
  i)
    PLATFORM="ios"
    ;;
  \?)
    echo "Invalid option: -$OPTARG" >&2
    exit 1
    ;;
  esac
done

# Go to backend directory
cd backend

# Start backend server via npm in the background and get the PID
npm run dev &
BACKEND_PID=$!

# Go to frontend directory
cd ../frontend

# Start frontend server via npm with the selected platform (if any)
if [ "$PLATFORM" = "android" ]; then
  npm run android
elif [ "$PLATFORM" = "ios" ]; then
  npm run ios
else
  npm start
fi

# Wait for user input to stop the servers
read -p "Press any key to stop the servers..."

# Kill the backend and frontend processes
kill $BACKEND_PID
kill $FRONTEND_PID
