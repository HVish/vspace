import Joi from 'joi';

export const SignupValidator = (joi: Joi.Root) => ({
  body: joi.object({
    avatar: joi.string().uri({ scheme: 'https' }).required(),
    name: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().required(),
  }),
});
