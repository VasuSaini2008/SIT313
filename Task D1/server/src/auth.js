import jwt from 'jsonwebtoken';
import { db } from './firebase.js';

export function signToken(user) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a random string of at least 32 characters.');
  }
  return jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    issuer: 'sit313-d1-api'
  });
}

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Please log in to continue.' });
    }
    const claims = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'sit313-d1-api' });
    const doc = await db.collection('users').doc(claims.sub).get();
    if (!doc.exists) return res.status(401).json({ message: 'Account not found.' });
    const data = doc.data();
    req.user = { id: doc.id, name: data.name, email: data.email, plan: data.plan || 'Free' };
    next();
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}
