/**
 * Application environment configuration.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};
