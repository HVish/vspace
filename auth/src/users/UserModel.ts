import { ObjectId } from 'mongodb';
import MongoService from '../db';
import { Hash } from '../utils/hash';
import { BaseModel } from '../shared/BaseModel';

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface BaseUser {
  name: string;
  username: string;
  password: string;
  avatar: string;
}

export interface User extends BaseModel, BaseUser {
  status: UserStatus;
}

const COLLECTION_NAME = 'users';

export const UserModel = Object.freeze({
  get collection() {
    return MongoService.client.db().collection<User>(COLLECTION_NAME);
  },

  async create({ password, ...params }: BaseUser) {
    const user: User = {
      ...params,
      password: await Hash.create(password),
      _id: new ObjectId(),
      status: UserStatus.ACTIVE,
      createdOn: Date.now(),
    };
    await this.collection.insertOne(user);
    return user;
  },

  async get(userId: string): Promise<undefined | Omit<User, 'password'>> {
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
