import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Unhandled error:', err);
  
  const response: ApiResponse = {
    success: false,
    error: 'Internal server error'
  };
  
  res.status(500).json(response);
};

// 404 Not Found middleware
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: ApiResponse = {
    success: false,
    error: `Route ${req.originalUrl} not found`
  };
  
  res.status(404).json(response);
};