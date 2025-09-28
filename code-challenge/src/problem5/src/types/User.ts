// User interface and types
export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
}

export interface UserFilters {
  name?: string;
  email?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  limit?: number;
}
