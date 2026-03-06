import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin/app';

if (!admin.apps.length) {
  const firebaseAdminSdkJson = process.env.FIREBASE_ADMIN_SDK_JSON;
  if (!firebaseAdminSdkJson) {
    throw new Error('Missing Firebase Admin SDK JSON credentials in environment variables.');
  }
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(firebaseAdminSdkJson)),
  });
}

interface AuthedRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const usersMap = new Map<string, number>(); // Simple in-memory rate limiting

export default async function register(req: AuthedRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // Check if user already exists
  try {
    const userRecord = await getAuth().getUserByEmail(email);
    return res.status(409).json({ message: 'User already exists.' });
  } catch (err) {
    if (err.code !== 'auth/user-not-found') {
      return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
    }
  }

  if (usersMap.has(email)) {
    const attemptCount = usersMap.get(email)!;
    if (attemptCount >= 5) {
      return res.status(429).json({ message: 'Too many attempts. Please try again later.' });
    }
    usersMap.set(email, attemptCount + 1);
  } else {
    usersMap.set(email, 1);
  }

  try {
    const userRecord = await getAuth().createUser({
      email,
      password,
    });
    return res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
  } catch (error) {
    return res.status(500).json({ message: 'User creation failed', error: error instanceof Error ? error.message : String(error) });
  }
};
