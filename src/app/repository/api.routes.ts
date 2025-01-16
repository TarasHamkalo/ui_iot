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

  actionGroups: {
    getAll: () => `${API_ROUTES.baseUrl}/groups`,
    get: (id: string) => `${API_ROUTES.baseUrl}/groups/${id}`,
    add: () => `${API_ROUTES.baseUrl}/groups`,
    update: () => `${API_ROUTES.baseUrl}/groups`,
    delete: (id: string) => `${API_ROUTES.baseUrl}/groups/${id}`,
  },

  schedules: {
    add: () => `${API_ROUTES.baseUrl}/schedules`,
    getAll: () => `${API_ROUTES.baseUrl}/schedules`,
    get: (id: string) => `${API_ROUTES.baseUrl}/schedules/${id}`,
    delete: (id: string) => `${API_ROUTES.baseUrl}/schedules/${id}`,
  }

};
