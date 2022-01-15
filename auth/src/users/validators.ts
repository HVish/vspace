import { joi } from '@vspace/core';
import { BaseUser } from './UserModel';

export const SignupValidator = (joi: joi.Root) => ({
  body: joi.object<Omit<BaseUser, 'userId'>, true>({
    avatar: joi.string().uri({ scheme: 'https' }).required(),
    name: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().required(),
  }),
});

export interface LoginBody {
  username: string;
  password: string;
}

export const LoginValidator = (joi: joi.Root) => ({
  body: joi.object<LoginBody, true>({
    username: joi.string().required(),
    password: joi.string().required(),
  }),
});

export interface GetAuthCodeQuery {
  clientId: string;
}

export const GetAuthCodeValidator = (joi: joi.Root) => ({
  query: joi.object<GetAuthCodeQuery, true>({
    clientId: joi.string().required(),
  }),
});
