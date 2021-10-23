import { ObjectId } from 'mongodb';

export interface IBaseModel {
  _id: ObjectId;
  /** Unix time in milliseconds */
  createdOn: number;
}
