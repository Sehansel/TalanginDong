import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AXIOS_ERROR } from 'src/constants';

type errorCode = 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'CONNECTION_ERROR' | 'REQUEST_ERROR';

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

export const request = async function request(config: AxiosRequestConfig) {
  try {
    const response = await axios(config);
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
