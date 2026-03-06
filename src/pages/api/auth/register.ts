import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin/app';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON as string)),
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

  if (usersMap.has(email)) {
    const attemptCount = usersMap.get(email)!;
    if (attemptCount >= 5) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
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
    return res.status(201).json({ uid: userRecord.uid });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  } finally {
    // Optional: reset attempt count after registration
    usersMap.delete(email);
  }
}