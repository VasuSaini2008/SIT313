import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { db } from './firebase.js';
import { requireAuth, signToken } from './auth.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false });
app.use('/api/auth', authLimiter);

const clean = value => typeof value === 'string' ? value.trim() : '';
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const publicUser = (id, data) => ({ id, name: data.name, email: data.email, plan: data.plan || 'Free' });

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const name = clean(req.body?.name);
    const email = clean(req.body?.email).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (name.length < 2 || name.length > 80) return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' });
    if (!validEmail(email) || email.length > 254) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ message: 'Password must be between 8 and 128 characters.' });

    const existing = await db.collection('users').where('email', '==', email).limit(1).get();
    if (!existing.empty) return res.status(409).json({ message: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const ref = db.collection('users').doc();
    const data = {
      name, email, passwordHash, plan: 'Free',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await ref.set(data);
    const user = publicUser(ref.id, data);
    return res.status(201).json({ message: 'Account created.', user, token: signToken(user) });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: 'Could not create the account. Check server configuration and try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = clean(req.body?.email).toLowerCase();
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!validEmail(email) || !password) return res.status(400).json({ message: 'Enter your email and password.' });

    const matches = await db.collection('users').where('email', '==', email).limit(1).get();
    if (matches.empty) return res.status(401).json({ message: 'Email or password is incorrect.' });
    const doc = matches.docs[0];
    const data = doc.data();
    const valid = await bcrypt.compare(password, data.passwordHash || '');
    if (!valid) return res.status(401).json({ message: 'Email or password is incorrect.' });

    const user = publicUser(doc.id, data);
    return res.json({ message: 'Logged in.', user, token: signToken(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Could not log in. Please try again.' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => res.json({ user: req.user }));

app.post('/api/subscription/upgrade', requireAuth, async (req, res) => {
  try {
    const fullName = clean(req.body?.fullName);
    const billingEmail = clean(req.body?.billingEmail).toLowerCase();
    const paymentReference = clean(req.body?.paymentReference);
    const cardLastFour = clean(req.body?.cardLastFour);

    if (req.user.plan === 'Paid') return res.status(409).json({ message: 'Your account is already on the Paid plan.' });
    if (fullName.length < 2 || fullName.length > 80) return res.status(400).json({ message: 'Enter a valid billing name.' });
    if (!validEmail(billingEmail)) return res.status(400).json({ message: 'Enter a valid billing email.' });
    if (!/^[A-Za-z0-9-]{6,40}$/.test(paymentReference)) return res.status(400).json({ message: 'Enter a valid demo payment reference.' });
    if (!/^\d{4}$/.test(cardLastFour)) return res.status(400).json({ message: 'Enter four digits for the demo field.' });

    const userRef = db.collection('users').doc(req.user.id);
    await userRef.update({
      plan: 'Paid',
      subscription: {
        status: 'active',
        billingName: fullName,
        billingEmail,
        paymentReference,
        demoCardLastFour: cardLastFour,
        updatedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    });
    const updated = await userRef.get();
    return res.json({ message: 'Demo subscription upgraded.', user: publicUser(updated.id, updated.data()) });
  } catch (error) {
    console.error('Upgrade error:', error.message);
    return res.status(500).json({ message: 'Could not update the subscription. Please try again.' });
  }
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled API error:', err.message);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => console.log(`D1 API listening on http://localhost:${PORT}`));
