import { API } from '../constants';
import { request } from '../utils/apiUtils';

export const login = function login(email: string, password: string) {
  return request({
    method: 'POST',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/auth/login`,
    data: {
      email,
      password,
    },
  });
};

export const register = function register(username: string, email: string, password: string) {
  return request({
    method: 'POST',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/auth/register`,
    data: {
      username,
      email,
      password,
    },
  });
};
