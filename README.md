# GakkCons

A full-stack application with a mobile app (React Native with Expo), web app (React JS), and backend (Node.js with Express).

## Overview

This project consists of three main components:
1. **Mobile App**: Built using React Native with Expo for Android mobile development.
2. **Web App**: Built using React JS for a responsive web interface.
3. **Backend**: Built using Node.js with Express to handle API requests and business logic.

The goal of GakkCons is to provide a seamless user experience across mobile and web platforms for managing consultation appointments for the CITC IT Department at the University of Science and Technology of Southern Philippines (USTP) in Cagayan de Oro (CDO).

## Tech Stack

- **Mobile**: React Native, Expo, JavaScript/TypeScript
- **Web**: React JS, JavaScript/TypeScript, CSS (or a CSS framework like Tailwind CSS)
- **Backend**: Node.js, Express, [add database if applicable, e.g., MongoDB, PostgreSQL]
- **Tools**: npm, Git

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (for Android emulator)

**Note**: iOS is not supported for the mobile app; only Android is available.

## Setup Instructions

### 1. Get the Project
The repository is already provided, so there’s no need to clone it. Simply navigate to the project directory:
```bash
cd GakkCons-SD-Card
```

---

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Set up environment variables:
   - Create a `.env` file in the `backend/` directory.
   - Add necessary variables (e.g., `PORT=5000`, `DATABASE_URL=your_db_url`).
4. Start the backend server:
   ```bash
   npm run start
   ```
   The backend will run on `http://localhost:5000` (or the port specified in `.env`).

---

### 3. Web App Setup
1. Navigate to the web folder:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start
   ```
   The web app will run on `http://localhost:3000`.

---

### 4. Mobile App Setup
1. Navigate to the mobile folder:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app with Expo:
   ```bash
   npx expo start
   ```
   - Scan the QR code with the Expo Go app on an Android device or use an Android emulator.
   - **Note**: iOS is not supported; this app is Android-only.

Ensure an Android emulator is running or a physical Android device is connected.

---

## Running the Full Application
1. Start the backend server first (`cd backend && npm run start`).
2. Start the web app (`cd web && npm run start`).
3. Start the mobile app (`cd mobile && npx expo start`).

Ensure the mobile and web apps are configured to point to the backend API (e.g., update API base URLs in the frontend code).

## API Endpoints
(Example, customize as needed)
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create a new user
- See `backend/routes/` for more details.

## Scripts
- **Backend**: `npm run start` (runs the server), `npm run dev` (with nodemon for development, if applicable)
- **Web**: `npm run start` (development), `npm build` (production build)
- **Mobile**: `npm start` (Expo start)

## Contributing
1. Create a new branch (`git checkout -b feature-name`).
2. Commit your changes (`git commit -m "Add feature"`).
3. Push to the branch (`git push origin feature-name`).
4. Open a pull request.


## Contact
For questions, reach out to [jiggerandreigobenza2@gmail.com](mailto:jiggerandreigobenza2@gmail.com).
