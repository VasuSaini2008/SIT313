# DEV@Deakin P4 — instructor reference implementation

This is a standalone React + Vite reference app for the SIT313 P4 login/registration requirements. It includes React Router pages, shared navigation/footer, client-side form validation, Firebase Authentication and a Firestore user profile document.

## 1. Requirements
- Node.js 20+ recommended
- A Firebase project with **Authentication → Email/Password** enabled
- Cloud Firestore database created

## 2. Run locally
```bash
npm install
cp .env.example .env
# Fill .env with your Firebase web-app configuration
npm run dev
```
Open the local URL printed by Vite.

## 3. Firebase setup
1. In Firebase Console, create/select a project and register a Web app.
2. Copy its web configuration values into `.env` (the variable names must start with `VITE_`).
3. In Authentication → Sign-in method, enable Email/Password.
4. Create a Cloud Firestore database.
5. Add Firestore rules such as the following, test them in the Rules Playground, and publish. These rules allow each signed-in user to read/write only their own profile document:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update: if request.auth != null
        && request.auth.uid == userId;
      allow delete: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

Do not commit `.env`. The Firebase web config is not a substitute for security rules; configure Authentication and Firestore rules before using real user data. Never store passwords in Firestore. Firebase Authentication manages password credentials; Firestore stores profile data only.

## 4. Features
- `/` home page, shared header and footer
- `/login` sign-in with error handling and redirect to home
- `/register` full name/email/password/confirm validation, account creation, Firestore profile creation, redirect to login
- Auth-state listener and display name on the home page
- Search is a visual placeholder and Post is a placeholder link, as the task says these features are for a future task
- `.gitignore` excludes `node_modules`, build output and `.env`

## 5. Suggested smoke tests
1. With Firebase configured, create an account using a first and last name and a valid email.
2. Confirm a Firebase Authentication user is created and `users/{uid}` contains `uid`, `fullName`, `email`, `createdAt`.
3. Confirm the app returns to Login after registration.
4. Sign in with the correct credentials and confirm redirect to Home.
5. Try an incorrect password and confirm an error is shown.
6. Test invalid email, one-word name, short password and mismatched confirmation.
7. Log out and confirm Login/Register are available again.
8. Check the same navigation and footer appear on every route.

## 6. GitLab checklist
Create project `Task P4` and set visibility to Internal. Before committing, verify `.env` and `node_modules/` are not tracked. Example:
```bash
git init
git add .
git commit -m "Add P4 login and registration reference app"
git branch -M main
git remote add origin YOUR_GITLAB_REPOSITORY_URL
git push -u origin main
```

## 7. Submission report outline
- Title and student/task details
- Screenshot: Home page and navigation
- Screenshot: Login page
- Screenshot: Registration page
- Screenshot: successful registration/profile record (do not expose passwords or secrets)
- GitLab repository URL
- 2–4 minute video URL

## Notes
This is an illustrative instructor reference, not a substitute for adapting and testing against an existing P1/P3 codebase or the course's current Firebase guidance. Firebase SDK and package versions may move; if dependency installation reports a version conflict, use compatible current versions.
