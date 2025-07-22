import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, COOKIE_KEYS, IS_PRODUCTION } from './app';
import { getCookie } from '@/utils/cookies';

const configureHttpHeaders = (config: InternalAxiosRequestConfig) => {
  if (config.headers) {
    const [, userToken] = getCookie(COOKIE_KEYS.USER_TOKEN)?.split('=') || '';

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
      config.withCredentials = true;
    }
  }

  return config;
};

const applyRequestDelay = async (config: InternalAxiosRequestConfig) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });

  return config;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(configureHttpHeaders, (error) => {
  return Promise.reject(error);
});

if (!IS_PRODUCTION) {
  api.interceptors.request.use(applyRequestDelay, (error) => {
    return Promise.reject(error);
  });
}
