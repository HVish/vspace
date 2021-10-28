import { UsernameExistsError } from './errors';
import { BaseUser, UserModel } from './UserModel';

export const UserController = Object.freeze({
  async signup(signupData: BaseUser) {
    const existingUser = await UserModel.collection.findOne({
      username: signupData.username,
    });

    if (existingUser) throw new UsernameExistsError();

    const { _id } = await UserModel.create(signupData);
    const accessToken = await UserModel.createAccessToken(_id.toHexString());

    return {
      userId: _id.toHexString(),
      accessToken,
    };
  },
});
