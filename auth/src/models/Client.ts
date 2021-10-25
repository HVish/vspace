import { ObjectId } from 'mongodb';
import MongoService from '../db';
import { Hash } from '../utils/hash';
import { IBaseModel, WithOptionalId } from './BaseModel';

export enum TokenType {
  CODE = 'code',
  AUTH_TOKEN = 'auth_token',
}

export enum ClientStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface IBaseClient {
  name: string;
  secret: string;
  logo: string;
  redirectURIs: string[];
  tokenTypes: TokenType[];
}

export interface IClient extends IBaseModel, IBaseClient {
  status: ClientStatus;
}

export interface ClientCredential {
  clientId: string;
  secret: string;
  redirectURI: string;
  tokenType: TokenType;
}

const COLLECTION_NAME = 'clients';

export const Client = Object.freeze({
  get collection() {
    return MongoService.client.db().collection<IClient>(COLLECTION_NAME);
  },

  async create({ _id, secret, ...params }: WithOptionalId<IBaseClient>) {
    const client: IClient = {
      ...params,
      secret: await Hash.create(secret),
      _id: new ObjectId(_id),
      status: ClientStatus.ACTIVE,
      createdOn: Date.now(),
    };
    await this.collection.insertOne(client);
    return client;
  },

  async get(clientId: string): Promise<undefined | Omit<IClient, 'secret'>> {
    return this.collection.findOne(
      { _id: new ObjectId(clientId) },
      { projection: { secret: false } }
    );
  },

  async verifyCredentials({
    clientId,
    secret,
    redirectURI,
    tokenType,
  }: ClientCredential) {
    const client = await this.collection.findOne({
      _id: new ObjectId(clientId),
      redirectURIs: redirectURI,
      tokenTypes: tokenType,
    });

    if (!client) return false;

    return Hash.compare(secret, client.secret);
  },
});
