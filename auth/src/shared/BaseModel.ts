import { ObjectId } from 'mongodb';

export interface BaseModel {
  _id: ObjectId;
  /** Unix time in milliseconds */
  createdOn: number;
}

export type WithOptionalId<T> = T & { _id?: ObjectId };
