import ApiError from '../exceptions/api.error.js';
import UserService from '../services/user.services.js';
import { validationResult } from 'express-validator';

const registration = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Validation error', errors.array()));
    }
    const { email, password } = req.body;
    const userData = await UserService.registration(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await UserService.login(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await UserService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  } catch (error) {
    next(error);
  }
};

const activate = async (req, res, next) => {
  try {
    const activationLink = req.params.link;
    await UserService.activate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await UserService.refreshToken(refreshToken);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await UserService.getUsers();
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

const userController = {
  registration,
  login,
  logout,
  activate,
  refreshToken,
  getUsers,
};
export default userController;
