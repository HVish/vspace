import { ObjectId } from 'mongodb';
import MongoService from '../db';
import { Hash } from '../utils/hash';
import { BaseModel } from '../shared/BaseModel';
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
  userId: string;
  name: string;
  username: string;
  password: string;
  avatar?: string;
}

export type BaseUserWithoutId = Omit<BaseUser, 'userId'>;

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

  generateId() {
    return `user_id.${randomBytes(64).toString('base64url')}`;
  },

  async create({ userId, password, ...params }: Optional<BaseUser, 'userId'>) {
    const user: User = {
      ...params,
      _id: new ObjectId(),
      userId: userId || this.generateId(),
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
      { userId },
      { $push: { authCodes: authCode } }
    );
    return authCode.value;
  },

  async deleteAuthCode(code: string, userId: string) {
    await this.collection.updateOne(
      { userId },
      { $pull: { authCodes: { value: code } } }
    );
  },

  async createAccessToken(userId: string, clientId?: string) {
    const payload = clientId ? { clientId, userId } : { userId };
    const { token: value, expiresAt } = await JWT.create(payload);
    return { value, expiresAt };
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
      { userId },
      { $push: { refeshTokens: refreshToken } }
    );
    return {
      value: refreshToken.value,
      expiresAt: refreshToken.expiresAt,
    };
  },

  async deleteRefreshToken(token: string, userId: string) {
    await this.collection.updateOne(
      { userId },
      { $pull: { refeshTokens: { value: token } } }
    );
  },
});
