import { ObjectId } from 'mongodb';
import MongoService from '../db';
import { Hash } from '../utils/hash';
import { IBaseModel } from './BaseModel';

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface IBaseUser {
  name: string;
  username: string;
  password: string;
  avatar: string;
}

export interface IUser extends IBaseModel, IBaseUser {
  status: UserStatus;
}

const COLLECTION_NAME = 'users';

export const User = Object.freeze({
  get collection() {
    return MongoService.client.db().collection<IUser>(COLLECTION_NAME);
  },

  async create({ password, ...params }: IBaseUser) {
    const user: IUser = {
      ...params,
      password: await Hash.create(password),
      _id: new ObjectId(),
      status: UserStatus.ACTIVE,
      createdOn: Date.now(),
    };
    await this.collection.insertOne(user);
    return user;
  },

  async get(userId: string): Promise<undefined | Omit<IUser, 'password'>> {
    return this.collection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: false } }
    );
  },

  async verifyCredentials(username: string, password: string) {
    const user = await this.collection.findOne({ username });
    if (!user) return false;
    return Hash.compare(password, user.password);
  },
});
