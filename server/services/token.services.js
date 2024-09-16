import jwt from 'jsonwebtoken';
import TokenModel from '../models/token.model.js';

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15s',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};

const validateAccessToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};

const validateRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await TokenModel.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await TokenModel.create({ user: userId, refreshToken });
  return token;
};

const findToken = async (refreshToken) => {
  const tokenData = await TokenModel.findOne({ refreshToken });
  return tokenData;
};

const removeToken = async (refreshToken) => {
  const tokenData = await TokenModel.deleteOne({ refreshToken });
  return tokenData;
};

const TokenService = {
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  saveToken,
  findToken,
  removeToken,
};

export default TokenService;
