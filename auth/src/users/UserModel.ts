import { ObjectId } from 'mongodb';
import MongoService from '../db';
import { Hash } from '../utils/hash';
import { BaseModel, WithOptionalId } from '../shared/BaseModel';
import { randomBytes } from 'crypto';
import { DateTime, DateTimeUnit } from '../utils/datetime';
import { JWT } from '../utils/jwt';

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface Token {
  clientId: string;
  expiresAt: UnixTime;
  issuedAt: UnixTime;
  value: string;
}

export interface BaseUser {
  name: string;
  username: string;
  password: string;
  avatar: string;
}

export interface User extends BaseModel, BaseUser {
  authCodes: Token[];
  refeshTokens: Token[];
  status: UserStatus;
}

const COLLECTION_NAME = 'users';

export const UserModel = Object.freeze({
  get collection() {
    return MongoService.client.db().collection<User>(COLLECTION_NAME);
  },

  async create({
    _id = new ObjectId(),
    password,
    ...params
  }: WithOptionalId<BaseUser>) {
    const user: User = {
      ...params,
      _id,
      authCodes: [],
      createdOn: Date.now(),
      password: await Hash.create(password),
      refeshTokens: [],
      status: UserStatus.ACTIVE,
    };
    await this.collection.insertOne(user);
    return user;
  },

  async createAuthCode(userId: string, clientId: string) {
    const now = Date.now();
    const authCode: Token = {
      clientId,
      expiresAt: DateTime.add(now, 15, DateTimeUnit.MINUTE),
      issuedAt: now,
      value: randomBytes(21).toString('base64url'),
    };
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { authCodes: authCode } }
    );
    return authCode.value;
  },

  async deleteAuthCode(code: string, userId: string) {
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { authCodes: { value: code } } }
    );
  },

  async createAccessToken(userId: string, clientId?: string) {
    const payload = clientId ? { clientId, userId } : { userId };
    return JWT.create(payload);
  },

  async createRefreshToken(userId: string, clientId: string) {
    const now = Date.now();
    const refreshToken: Token = {
      clientId,
      expiresAt: DateTime.add(now, 30, DateTimeUnit.DAY),
      issuedAt: now,
      value: randomBytes(128).toString('base64url'),
    };
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { refeshTokens: refreshToken } }
    );
    return refreshToken.value;
  },

  async deleteRefreshToken(token: string, userId: string) {
    await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { refeshTokens: { value: token } } }
    );
  },
});
