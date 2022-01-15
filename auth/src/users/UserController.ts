import { InvalidCredentialsError } from '../shared/errors';
import { Hash } from '../utils/hash';
import { UsernameExistsError } from './errors';
import { BaseUserWithoutId, UserModel } from './UserModel';
import { LoginBody } from './validators';

export interface AuthResponse {
  userId: string;
  accessToken: {
    value: string;
    expiresAt: number;
  };
}

export const UserController = Object.freeze({
  async signup(signupData: BaseUserWithoutId): Promise<AuthResponse> {
    const existingUser = await UserModel.collection.findOne({
      username: signupData.username,
    });

    if (existingUser) throw new UsernameExistsError();

    const { userId } = await UserModel.create(signupData);
    const accessToken = await UserModel.createAccessToken(userId);

    return { userId, accessToken };
  },
  async login({ username, password }: LoginBody): Promise<AuthResponse> {
    const user = await UserModel.collection.findOne({ username });

    if (!user) throw new InvalidCredentialsError();

    const isMatch = await Hash.compare(password, user.password);

    if (!isMatch) throw new InvalidCredentialsError();

    const { userId } = user;
    const accessToken = await UserModel.createAccessToken(userId);

    return { userId, accessToken };
  },
  async getAuthCode(userId: string, clientId: string) {
    return UserModel.createAuthCode(userId, clientId);
  },
});
