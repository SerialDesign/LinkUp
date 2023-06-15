# LinkUp App

- Frontend folder -> React Native with Expo
- Backend folder -> Express API for creating Link Libraries and adding Links

## Prerequisites

- XCode is needed for iOS Simulator
- You have to use NPM (pnpm does not work!)

## Quick Start

1. Be in the root of the project
2. Install all dependencies in both folders via `bash ./scripts/install-deps.sh`
3. Run both the backend and the frontend via:

   - 3.1. `bash ./scripts/start-app.sh -a` to start the Android app
   - 3.2. `bash ./scripts/start-app.sh -i` to start the iOS app

4. **Optional:** Reset all dependencies via `bash ./scripts/reset-deps.sh`

## API

- <https://hoppscotch.io> for API specs

## Preview the app on the smartphone

- Download the Expo app on your smartphone
- Be in the same network as the computer where you start your local server (the backend)
- Find out your local IP address (e.g. via `ifconfig | grep "inet " | grep -v 127.0.0.1` on macOS)
- Overwrite the [`app.json`](./frontend/app.json) file with your IP address from the previous step
- Start the app via `bash ./scripts/start-app.sh -i`
