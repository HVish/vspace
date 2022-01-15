const ACCESS_TOKEN = 'access_token';

export function getAccessToken(): string | null {
  return window.localStorage.getItem(ACCESS_TOKEN);
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(ACCESS_TOKEN, token);
}

export function clearSession() {
  window.localStorage.clear();
}
