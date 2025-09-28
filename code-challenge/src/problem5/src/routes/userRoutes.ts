import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateCreateUser, validateUpdateUser, validateUserFilters } from '../middleware/validation';

const router = Router();

// GET /api/users - Get all users with filters
router.get('/', validateUserFilters, UserController.getUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

// POST /api/users - Create new user
router.post('/', validateCreateUser, UserController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validateUpdateUser, UserController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', UserController.deleteUser);

export default router;
