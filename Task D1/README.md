# SIT313 D1 Subscription — Starter Reference Project

A fresh React + Vite frontend and Express backend for a DEV@Deakin-style subscription demonstration.

## Requirements
- Node.js 20+
- A Firebase project with Cloud Firestore enabled
- Firebase Admin service-account credentials for the backend

## Project structure
- `client/` — React frontend
- `server/` — Express API, JWT authentication, password hashing, Firestore persistence

## 1. Configure Firebase
1. Create/select a Firebase project and enable Cloud Firestore.
2. In Firebase Console, create a service account and download its JSON key.
3. Save the key outside this repository, for example `~/secrets/d1-service-account.json`.
4. Copy `server/.env.example` to `server/.env`.
5. Set `FIREBASE_SERVICE_ACCOUNT_PATH` to the full path of that JSON file.
6. Set a long random `JWT_SECRET` and set `CLIENT_ORIGIN=http://localhost:5173`.

Do not commit `.env` or service-account keys.

## 2. Start the backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Edit `.env` before starting. The API runs on port 4000 by default.

## 3. Start the frontend
In a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173.

## Features
- Registration validates inputs, hashes passwords with bcrypt, and saves users in Firestore.
- Login verifies credentials and issues a signed JWT.
- The frontend stores the JWT in localStorage and clears it on logout.
- Pricing page compares Free and Paid demo plans.
- Upgrade button requires a logged-in Free-plan user.
- Upgrade modal validates demonstration fields and updates the user's plan in Firestore.
- Existing Paid users cannot upgrade again.

## Payment safety
This is a classroom demonstration only. It does not process payments, and it must not collect or store real card details. The modal uses a fictional payment reference and card-last-four demonstration field only.

## Important production notes
- For production, prefer Firebase Authentication or another established identity provider, secure HttpOnly cookies, rate limiting, CSRF protections where applicable, HTTPS, stronger monitoring, and payment-provider-hosted checkout.
- The JWT is kept in localStorage here to match the task sheet's stated requirement; localStorage can be exposed by XSS, so it is not the preferred choice for production.
- Firestore Admin SDK bypasses Firestore client security rules. Protect the API and service-account key carefully.
- Add tests, screenshots, this project in your GitHub repository, and a short Panopto walkthrough before submission.
