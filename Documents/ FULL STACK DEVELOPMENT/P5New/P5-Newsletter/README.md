# P5 Newsletter

## Run locally

Install dependencies and start the API and frontend in separate terminals:

```sh
npm --prefix backend install
npm --prefix backend run dev
```

```sh
npm --prefix frontend install
npm --prefix frontend run dev
```

Open `http://localhost:5173`. The frontend proxies newsletter requests to the
API on port 5001.

## Enable email delivery

The signup endpoint emails a notification to `NEWSLETTER_TO` and sets the
submitted address as the reply-to address. To enable it:

1. Copy `backend/.env.example` to `backend/.env`.
2. For Gmail, enable 2-Step Verification and create a Google App Password.
   Use that App Password for `SMTP_PASS` (not your normal Gmail password).
3. Set `SMTP_USER` to the Gmail account that created the App Password and set
   `NEWSLETTER_TO` to the inbox that should receive signup notifications.
4. Restart the backend after saving the settings.

Keep `backend/.env` private; it is ignored by git. Never commit or share your
SMTP password. A successful signup sends a notification email; this does not
send a welcome email to the person signing up.
