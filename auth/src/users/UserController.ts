import { InvalidCredentialsError } from '../shared/errors';
import { Hash } from '../utils/hash';
import { UsernameExistsError } from './errors';
import { BaseUser, UserModel } from './UserModel';
import { LoginBody } from './validators';

export interface AuthResponse {
  userId: string;
  accessToken: {
    value: string;
    expiresAt: number;
  };
}

export const UserController = Object.freeze({
  async signup(signupData: BaseUser): Promise<AuthResponse> {
    const existingUser = await UserModel.collection.findOne({
      username: signupData.username,
    });

    if (existingUser) throw new UsernameExistsError();

    const { _id } = await UserModel.create(signupData);
    const accessToken = await UserModel.createAccessToken(_id.toHexString());

    return { userId: _id.toHexString(), accessToken };
  },
  async login({ username, password }: LoginBody): Promise<AuthResponse> {
    const user = await UserModel.collection.findOne({ username });

    if (!user) throw new InvalidCredentialsError();

    const isMatch = await Hash.compare(password, user.password);

    if (!isMatch) throw new InvalidCredentialsError();

    const userId = user._id.toHexString();
    const accessToken = await UserModel.createAccessToken(userId);

    return { userId, accessToken };
  },
  async getAuthCode(userId: string, clientId: string) {
    return UserModel.createAuthCode(userId, clientId);
  },
});
