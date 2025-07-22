export const IS_PRODUCTION = import.meta.env.PROD;

export const COOKIE_KEYS = {
  USER_TOKEN: '@siscontrol/userToken',
};

export const API_BASE_URL = IS_PRODUCTION
  ? 'https://siscontrol-api-v0-0-1-724496740062.us-central1.run.app'
  : 'http://localhost:8080';
