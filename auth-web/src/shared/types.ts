export enum ClientStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

export interface Client {
  _id: string;
  adminId: string;
  clientId: string;
  logo: string;
  name: string;
  redirectURIs: string[];
  status: ClientStatus;
  createdOn: number;
}
