
import { ApiResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Create fetch utility with error handling and authentication
export const fetchWithAuth = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    // Get auth token from local storage
    const token = localStorage.getItem("auth_token");
    
    // Set default headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        error: data.error || "An error occurred", 
        status: "error" 
      };
    }

    return { data, status: "success" };
  } catch (error) {
    console.error("API request failed:", error);
    return { 
      error: error instanceof Error ? error.message : "Unknown error", 
      status: "error" 
    };
  }
};
