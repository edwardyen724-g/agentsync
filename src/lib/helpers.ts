import { NextApiRequest } from 'next';
import { ObjectId } from 'mongoose';

// Define the custom request with additional properties if needed
export interface AuthedRequest extends NextApiRequest {
  user?: { id: string; email: string }; // Adjust based on your authentication structure
}

// Helper function to validate MongoDB ObjectId
export const isValidObjectId = (id: string): boolean => {
  return ObjectId.isValid(id);
};

// Helper function to create a response
export const createResponse = (
  res: any,
  status: number,
  data: any,
  message: string = ''
): void => {
  res.status(status).json({
    success: status < 400,
    message,
    data,
  });
};

// Helper function for error handling
export const handleError = (err: unknown): string => {
  return err instanceof Error ? err.message : String(err);
};

// Generate a unique ID for tasks
export const generateUniqueId = (): string => {
  return `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// Example of a logger function
export const logger = (message: string): void => {
  console.log(`[LOG]: ${message}`);
};