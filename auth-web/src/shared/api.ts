import request from './request';

interface SignupPayload {
  name: string;
  username: string;
  password: string;
  avatar: string;
}

export async function signup(data: SignupPayload) {
  return (await request.post('/users', data)).data;
}
