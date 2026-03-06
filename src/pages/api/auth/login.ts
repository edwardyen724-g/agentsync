import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseAuth = getAuth(initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}));

interface AuthedRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const rateLimit = new Map<string, number>();

const loginHandler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (ip && rateLimit.has(ip) && rateLimit.get(ip)! >= 5) {
    return res.status(429).json({ message: 'Too many requests' });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    if (ip) {
      rateLimit.set(ip, (rateLimit.get(ip) || 0) + 1);
      setTimeout(() => rateLimit.delete(ip), 60000); // Reset rate limit after 1 minute
    }
    return res.status(200).json({ uid: user.uid, email: user.email });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default loginHandler;
