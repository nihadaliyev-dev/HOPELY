export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// Helper for simulating network delay in mock mode
export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Core wrapper around native fetch
 */
export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('pulsecheck_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch (e) {
        // Response wasn't JSON
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error);
    throw error;
  }
}
