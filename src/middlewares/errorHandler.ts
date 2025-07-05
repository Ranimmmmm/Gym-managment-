import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only log stack traces in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error stack:', err.stack);
  } else {
    // In production, only log the error message without stack trace
    console.error('Error:', err.message);
  }

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    message: "Internal Server Error",
    ...(isDevelopment && { error: err.message })
  });
};