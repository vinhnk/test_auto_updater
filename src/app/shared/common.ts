import { environment } from '../../environments/environment';

export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/authenticate2',
      LOGOUT: '/api/logout',
      GOOGLE_LOGIN: '/google-login',
      REFRESH_TOKEN: '/api/refresh-token',
    },
    TOURS: {
      BASE: '/api/tours',
    },
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    PUSH: '/push',
  },

};
