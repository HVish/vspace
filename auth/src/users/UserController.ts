import { InvalidCredentialsError } from '../shared/errors';
import { Hash } from '../utils/hash';
import { UsernameExistsError } from './errors';
import { BaseUser, UserModel } from './UserModel';

export interface LoginRequest {
  username: string;
  password: string;
}

export const UserController = Object.freeze({
  async signup(signupData: BaseUser) {
    const existingUser = await UserModel.collection.findOne({
      username: signupData.username,
    });

    if (existingUser) throw new UsernameExistsError();

    const { _id } = await UserModel.create(signupData);
    const accessToken = await UserModel.createAccessToken(_id.toHexString());

    return { userId: _id.toHexString(), accessToken };
  },
  async login({ username, password }: LoginRequest) {
    const user = await UserModel.collection.findOne({ username });

    if (!user) throw new InvalidCredentialsError();

    const isMatch = await Hash.compare(password, user.password);

    if (!isMatch) throw new InvalidCredentialsError();

    const userId = user._id.toHexString();
    const accessToken = await UserModel.createAccessToken(userId);

    return { userId, accessToken };
  },
});
