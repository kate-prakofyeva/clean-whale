import bcrypt from 'bcrypt';
import { v1 as uuid } from 'uuid';
import UserModel from '../models/user.model.js';
import sendActivationEmail from './mail.services.js';
import TokenService from './token.services.js';
import UserDto from '../dtos/user.dto.js';
import ApiError from '../exceptions/api.error.js';

const registration = async (email, password) => {
  const candidate = await UserModel.findOne({ email });
  if (candidate) {
    throw ApiError.BadRequest(
      `User with email ${email} already exists, please login.`
    );
  }
  const hashPassword = await bcrypt.hash(password, 3);
  const activationLink = uuid();
  const user = await UserModel.create({
    email,
    password: hashPassword,
    activationLink,
  });

  try {
    await sendActivationEmail(
      user.email,
      `${process.env.API_URL}/api/activate/${user.activationLink}`
    );
  } catch (error) {
    throw ApiError.Internal('Email server sending error.');
  }

  const userDto = new UserDto(user);
  const tokens = TokenService.generateTokens({ ...userDto });
  await TokenService.saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

const activate = async (activationLink) => {
  const user = await UserModel.findOne({ activationLink });
  if (!user) {
    throw ApiError.BadRequest('Incorrect activation link.');
  }
  user.isActivated = true;
  await user.save();
};

const login = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw ApiError.BadRequest(
      `User with email ${email} not found, please register.`
    );
  }
  const isPasswordsEquals = await bcrypt.compare(password, user.password);
  if (!isPasswordsEquals) {
    throw ApiError.BadRequest('Incorrect password.');
  }
  const userDto = new UserDto(user);
  const tokens = TokenService.generateTokens({ ...userDto });
  await TokenService.saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

const logout = async (refreshToken) => {
  const token = await TokenService.removeToken(refreshToken);
  return token;
};

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }
  const userData = TokenService.validateRefreshToken(refreshToken);
  const tokenFromDb = await TokenService.findToken(refreshToken);
  if (!userData || !tokenFromDb) {
    throw ApiError.UnauthorizedError();
  }
  const user = await UserModel.findById(userData.id);
  const userDto = new UserDto(user);
  const tokens = TokenService.generateTokens({ ...userDto });
  await TokenService.saveToken(userDto.id, tokens.refreshToken);
  return {
    ...tokens,
    user: userDto,
  };
};

const getUsers = async () => {
  const users = await UserModel.find();
  return users;
};

const UserService = {
  registration,
  activate,
  login,
  logout,
  refreshToken,
  getUsers,
};

export default UserService;

// async function generateUser(user) {
//   const userDto = new UserDto(user);
//   const tokens = TokenService.generateTokens({ ...userDto });
//   await TokenService.saveToken(userDto.id, tokens.refreshToken);

//   return {
//     ...tokens,
//     user: userDto,
//   };
// }
