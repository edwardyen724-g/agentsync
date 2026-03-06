import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { initializeApp } from 'firebase/app';

const firebaseAuth = getAuth(initializeApp(firebaseApp));

interface AuthedRequest extends NextApiRequest {
  // Add any custom properties here
}

const rateLimit = new Map<string, number>();

const loginHandler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

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
    return res.status(400).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default loginHandler;