import { randomBytes } from 'crypto';
import { ObjectId } from 'mongodb';
import MongoService from '../db';
import { Hash } from '../utils/hash';
import { BaseModel } from '../shared/BaseModel';

export enum GrantType {
  AUTH_CODE = 'auth_code',
  AUTH_TOKEN = 'auth_token',
  REFRESH_TOKEN = 'refresh_token',
}

export enum ClientStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface BaseClient {
  clientId: string;
  secret: string;
  name: string;
  logo: string;
  redirectURIs: string[];
  grantTypes: GrantType[];
}

export interface Client extends BaseModel, BaseClient {
  status: ClientStatus;
}

export interface ClientCredential {
  clientId: string;
  secret: string;
  redirectURI: string;
  grantType: GrantType;
}

export const ClientModel = Object.freeze({
  get COLLECTION_NAME() {
    return 'clients';
  },

  get collection() {
    return MongoService.client.db().collection<Client>(this.COLLECTION_NAME);
  },

  generateId() {
    return `client_id.${randomBytes(64).toString('base64')}`;
  },

  async create({
    secret,
    clientId,
    ...params
  }: Optional<BaseClient, 'clientId'>) {
    const client: Client = {
      ...params,
      _id: new ObjectId(),
      clientId: clientId || this.generateId(),
      secret: await Hash.create(secret),
      status: ClientStatus.ACTIVE,
      createdOn: Date.now(),
    };
    await this.collection.insertOne(client);
    return client;
  },

  async get(clientId: string): Promise<undefined | Omit<Client, 'secret'>> {
    return this.collection.findOne(
      { clientId },
      { projection: { secret: false } }
    );
  },

  async verifyCredentials({
    clientId,
    secret,
    redirectURI,
    grantType,
  }: ClientCredential) {
    const client = await this.collection.findOne({
      clientId,
      redirectURIs: redirectURI,
      grantTypes: grantType,
    });
    if (!client) return false;
    return Hash.compare(secret, client.secret);
  },
});
