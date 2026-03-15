import { fetchApi, USE_MOCK, delay } from './apiClient';

export const authService = {
  async login(email, password) {
    if (USE_MOCK) {
      await delay(1000);
      if (email === 'admin' && password === 'admin') {
         return { 
           token: 'mock-jwt-token-12345', 
           user: { id: '1', name: 'System Admin', email: 'admin@pulsecheck.ai', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff' } 
         };
      }
      throw new Error('Invalid mock credentials. Use admin/admin');
    }
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async loginWithDiscord(code) {
    if (USE_MOCK) {
      await delay(1200);
      return { 
        token: 'mock-jwt-discord-67890', 
        user: { id: 'discord-user-1', name: 'Discord Manager', email: 'manager@discord.com', avatar: 'https://ui-avatars.com/api/?name=Discord&background=5865F2&color=fff' } 
      };
    }
    return fetchApi('/auth/discord', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  async getCurrentUser() {
    if (USE_MOCK) {
      await delay(400);
      const token = localStorage.getItem('pulsecheck_token');
      if (token) {
        return { id: '1', name: 'System Admin', email: 'admin@pulsecheck.ai', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff' };
      }
      throw new Error('No active session');
    }
    return fetchApi('/auth/me');
  }
};
