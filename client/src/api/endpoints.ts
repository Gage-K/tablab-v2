export const API_ENDPOINTS = {
  tabs: {
    base: "/api/tabs",
    byId: (id: string) => `/api/tabs/${id}`,
  },
  user: {
    base: "/api/user",
    email: "/api/user/email",
    username: "/api/user/username",
    password: "/api/user/password",
  },
} as const;
