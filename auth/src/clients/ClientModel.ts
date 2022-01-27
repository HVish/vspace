import { promisify } from 'util';
import { generateKeyPair as _generateKeyPair, randomBytes } from 'crypto';
import { ObjectId } from 'mongodb';
import MongoService from '../db';
import { Hash } from '../utils/hash';
import { BaseModel } from '../shared/BaseModel';

const generateKeyPair = promisify(_generateKeyPair);

export enum GrantType {
  AUTH_CODE = 'auth_code',
  ACCESS_TOKEN = 'access_token',
}

export enum ClientStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface BaseClient {
  adminId: string;
  clientId: string;
  logo: string;
  name: string;
  redirectURIs: string[];
  secret: string;
}

export interface Client extends BaseModel, BaseClient {
  jwt: {
    privateKey: string;
    publicKey: string;
  };
  status: ClientStatus;
}

export const ClientModel = Object.freeze({
  get COLLECTION_NAME() {
    return 'clients';
  },

  get collection() {
    return MongoService.client.db().collection<Client>(this.COLLECTION_NAME);
  },

  generateId() {
    return `client_id.${randomBytes(64).toString('base64url')}`;
  },

  async create({
    secret,
    clientId,
    ...params
  }: Optional<BaseClient, 'clientId'>) {
    const { publicKey, privateKey } = await generateKeyPair('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: secret,
      },
    });
    const client: Client = {
      ...params,
      _id: new ObjectId(),
      clientId: clientId || this.generateId(),
      createdOn: Date.now(),
      secret: await Hash.create(secret),
      jwt: { privateKey, publicKey },
      status: ClientStatus.ACTIVE,
    };
    await this.collection.insertOne(client);
    return client;
  },
});
