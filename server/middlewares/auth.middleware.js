import ApiError from '../exceptions/api.error.js';
import TokenService from '../services/token.services.js';

const AuthMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = header.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};

export default AuthMiddleware;
