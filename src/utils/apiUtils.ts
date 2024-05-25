import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import * as SecureStore from 'expo-secure-store';
import { AXIOS_ERROR, API, STORAGE_KEY } from 'src/constants';
import { _rootStore } from 'src/models';

type errorCode = 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'CONNECTION_ERROR' | 'REQUEST_ERROR';
type ICustomAxiosRequestConfig = AxiosRequestConfig & { useAuth?: boolean };

const protectedAxiosClient = axios.create();

export const determineError = function determineError(error: AxiosError): errorCode {
  if (error.message === 'Network Error') return 'NETWORK_ERROR';
  if (error.code) {
    if (AXIOS_ERROR.TIMEOUT_ERROR_CODES.includes(error.code)) return 'TIMEOUT_ERROR';
    if (AXIOS_ERROR.NODEJS_CONNECTION_ERROR_CODES.includes(error.code)) return 'CONNECTION_ERROR';
  }
  return 'REQUEST_ERROR';
};

export const isNetworkError = function isNetworkError(problem: errorCode | undefined): boolean {
  return ['NETWORK_ERROR', 'TIMEOUT_ERROR', 'CONNECTION_ERROR'].includes(problem ?? '');
};

export const request = async function request(config: ICustomAxiosRequestConfig) {
  try {
    if (config.useAuth) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${_rootStore.authenticationStore.authToken}`,
      };
    }
    const response = await (config.useAuth ? protectedAxiosClient(config) : axios(config));
    return {
      ok: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return {
        ok: false,
        problem: determineError(error),
        data: error.response?.data ?? null,
      };
    } else {
      throw error;
    }
  }
};

// This interceptor still in testing (might not working)
createAuthRefreshInterceptor(protectedAxiosClient, async (failedRequest: any) => {
  const refreshToken = _rootStore.authenticationStore.refreshToken;
  return request({
    method: 'POST',
    url: `${API.TALANGIN_DONG_BASE_API}/v1/auth/refresh-token`,
    data: {
      refreshToken,
    },
  }).then(async (res) => {
    await SecureStore.setItemAsync(STORAGE_KEY.TOKEN, res.data.data.token);
    _rootStore.authenticationStore.setAuthToken(res.data.data.token);
    failedRequest.response.config.headers['Authorization'] = `Bearer ${res.data.data.token}`;
    return Promise.resolve();
  });
  // Might add catch when request is error to logout the user
});

protectedAxiosClient.interceptors.request.use((request) => {
  request.headers['Authorization'] = `Bearer ${_rootStore.authenticationStore.authToken}`;
  return request;
});
