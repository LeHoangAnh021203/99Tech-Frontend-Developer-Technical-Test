import { dbRun, dbGet, dbAll } from '../database/database';
import { User, CreateUserRequest, UpdateUserRequest, UserFilters } from '../types/User';

export class UserService {
  // Create a new user
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const { name, email, age } = userData;
    
    const query = `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `;
    
    const result = await dbRun(query, [name, email, age]);
    const userId = (result as any).lastID;
    
    return this.getUserById(userId);
  }

  // Get user by ID
  static async getUserById(id: number): Promise<User> {
    const query = 'SELECT * FROM users WHERE id = ?';
    const user = await dbGet(query, [id]);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user as User;
  }

  // Get all users with filters
  static async getUsers(filters: UserFilters = {}): Promise<{ users: User[]; total: number }> {
    const { name, email, minAge, maxAge, page = 1, limit = 10 } = filters;
    
    // Build WHERE clause
    const whereConditions: string[] = [];
    const params: any[] = [];
    
    if (name) {
      whereConditions.push('name LIKE ?');
      params.push(`%${name}%`);
    }
    
    if (email) {
      whereConditions.push('email LIKE ?');
      params.push(`%${email}%`);
    }
    
    if (minAge !== undefined) {
      whereConditions.push('age >= ?');
      params.push(minAge);
    }
    
    if (maxAge !== undefined) {
      whereConditions.push('age <= ?');
      params.push(maxAge);
    }
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await dbGet(countQuery, params);
    const total = (countResult as any).total;
    
    // Get paginated results
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM users 
      ${whereClause}
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `;
    
    const users = await dbAll(query, [...params, limit, offset]);
    
    return {
      users: users as User[],
      total
    };
  }

  // Update user
  static async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (userData.name !== undefined) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    
    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    
    if (userData.age !== undefined) {
      fields.push('age = ?');
      values.push(userData.age);
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await dbRun(query, values);
    
    return this.getUserById(id);
  }

  // Delete user
  static async deleteUser(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = ?';
    const result = await dbRun(query, [id]);
    
    return (result as any).changes > 0;
  }

  // Check if email exists
  static async emailExists(email: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT id FROM users WHERE email = ?';
    const params: any[] = [email];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const user = await dbGet(query, params);
    return !!user;
  }
}
