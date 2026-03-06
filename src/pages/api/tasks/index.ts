import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { firestore } from '../../../lib/firebase';
import { Task } from '../../../models/Task';

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string }; // Extend request to include user info
}

const tasks: Map<string, number> = new Map();

const rateLimit = (key: string) => {
  const currentTime = Date.now();
  const limit = 100; // Number of allowed requests
  const resetTime = 60 * 1000; // Time window in milliseconds

  if (tasks.has(key)) {
    const [requestCount, startTime] = tasks.get(key)!;

    if (currentTime - startTime < resetTime) {
      if (requestCount >= limit) {
        return false; // Rate limit exceeded
      }
      tasks.set(key, [requestCount + 1, startTime]);
      return true;
    } else {
      tasks.set(key, [1, currentTime]);
      return true;
    }
  } else {
    tasks.set(key, [1, currentTime]);
    return true;
  }
};

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  const userId = req.user?.uid;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET': {
      if (!rateLimit(userId)) {
        return res.status(429).json({ message: 'Too many requests' });
      }

      try {
        const tasksSnapshot = await firestore.collection('tasks').where('userId', '==', userId).get();
        const tasksData = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return res.status(200).json(tasksData);
      } catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
      }
    }
    case 'POST': {
      if (!rateLimit(userId)) {
        return res.status(429).json({ message: 'Too many requests' });
      }

      try {
        const { title, description } = req.body;
        // Sanitize input
        if (!title || typeof title !== 'string' || !description || typeof description !== 'string') {
          return res.status(400).json({ message: 'Invalid input' });
        }
        const newTask: Task = {
          id: generateUniqueId(),
          title,
          completed: false,
        };
        await firestore.collection('tasks').add({ ...newTask, userId });
        return res.status(201).json(newTask);
      } catch (err) {
        return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}