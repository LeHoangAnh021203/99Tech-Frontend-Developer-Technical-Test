import { Request, Response, NextFunction } from 'express';
import { CreateUserRequest, UpdateUserRequest, UserFilters } from '../types/User';

// Validation middleware for create user
export const validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, age } = req.body;
  
  const errors: string[] = [];
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }
  
  if (age === undefined || typeof age !== 'number' || age < 0 || age > 150) {
    errors.push('Age must be a number between 0 and 150');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
    return;
  }
  
  // Sanitize data
  req.body = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    age: Math.floor(age)
  };
  
  next();
};

// Validation middleware for update user
export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, age } = req.body;
  
  const errors: string[] = [];
  
  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push('Name must be a non-empty string');
  }
  
  if (email !== undefined && (typeof email !== 'string' || !isValidEmail(email))) {
    errors.push('Email must be valid');
  }
  
  if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 150)) {
    errors.push('Age must be a number between 0 and 150');
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
    return;
  }
  
  // Sanitize data
  const updateData: UpdateUserRequest = {};
  if (name !== undefined) updateData.name = name.trim();
  if (email !== undefined) updateData.email = email.trim().toLowerCase();
  if (age !== undefined) updateData.age = Math.floor(age);
  
  req.body = updateData;
  next();
};

// Validation middleware for user filters
export const validateUserFilters = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, minAge, maxAge, page, limit } = req.query;
  
  const errors: string[] = [];
  const filters: UserFilters = {};
  
  if (name && typeof name === 'string') {
    filters.name = name.trim();
  }
  
  if (email && typeof email === 'string') {
    filters.email = email.trim();
  }
  
  if (minAge !== undefined) {
    const minAgeNum = parseInt(minAge as string);
    if (isNaN(minAgeNum) || minAgeNum < 0) {
      errors.push('minAge must be a positive number');
    } else {
      filters.minAge = minAgeNum;
    }
  }
  
  if (maxAge !== undefined) {
    const maxAgeNum = parseInt(maxAge as string);
    if (isNaN(maxAgeNum) || maxAgeNum < 0) {
      errors.push('maxAge must be a positive number');
    } else {
      filters.maxAge = maxAgeNum;
    }
  }
  
  if (page !== undefined) {
    const pageNum = parseInt(page as string);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push('page must be a positive number');
    } else {
      filters.page = pageNum;
    }
  }
  
  if (limit !== undefined) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('limit must be a number between 1 and 100');
    } else {
      filters.limit = limitNum;
    }
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
    return;
  }
  
  (req as any).query = filters;
  next();
};

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
