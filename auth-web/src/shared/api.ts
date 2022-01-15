import { BaseUserWithoutId } from '@vspace/auth/types/users/UserModel';
import { LoginBody } from '@vspace/auth/types/users/validators';
import { AuthResponse } from '@vspace/auth/types/users/UserController';

import request from './request';

export async function signup(data: BaseUserWithoutId) {
  return (await request.post<AuthResponse>('/users/v1', data)).data;
}

export async function login(data: LoginBody) {
  return (await request.post<AuthResponse>('/users/v1/login', data)).data;
}
