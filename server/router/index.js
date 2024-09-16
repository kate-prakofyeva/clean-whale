import { Router } from 'express';
const router = new Router();
import UserController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import AuthMiddleware from '../middlewares/auth.middleware.js';

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 32 }),
  UserController.registration
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refreshToken);
router.get('/users', AuthMiddleware, UserController.getUsers);

export default router;
