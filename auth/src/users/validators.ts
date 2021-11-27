import { joi } from '@vspace/core';

export const SignupValidator = (joi: joi.Root) => ({
  body: joi.object({
    avatar: joi.string().uri({ scheme: 'https' }).required(),
    name: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().required(),
  }),
});

export const LoginValidator = (joi: joi.Root) => ({
  body: joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
  }),
});
