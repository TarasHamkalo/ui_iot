export const API_ROUTES = {

  baseUrl: import.meta.env.NG_APP_API_BASE_URL,

  rooms: {
    getAll: () => `${API_ROUTES.baseUrl}/rooms`,
    add: () => `${API_ROUTES.baseUrl}/rooms`,
  },

  mqttActions: {
    getAll: () => `${API_ROUTES.baseUrl}/actions`,
    add: () => `${API_ROUTES.baseUrl}/actions`,
  },

};
