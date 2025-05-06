
import { ApiResponse } from "../types";
import { fetchWithAuth } from "./fetchUtils";

export const authApi = {
  login: async (email: string, password: string) => {
    return fetchWithAuth<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (email: string, password: string, name: string) => {
    return fetchWithAuth<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },
  
  logout: () => {
    localStorage.removeItem("auth_token");
  },
  
  getCurrentUser: async () => {
    return fetchWithAuth<{ user: any }>("/auth/user");
  },
};
