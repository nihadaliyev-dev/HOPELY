import { fetchApi, USE_MOCK, delay } from './apiClient';

// ─── Discord OAuth2 helpers ────────────────────────────────────────────────────

/**
 * Builds the Discord redirect URL by asking the backend for the canonical URL.
 * Falls back to building it client-side if the backend isn't available.
 */
export function buildDiscordAuthUrl() {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
  const scopes = encodeURIComponent('identify email guilds');
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Standard email/password login (kept for fallback/admin usage).
   */
  async login(email, password) {
    if (USE_MOCK) {
      await delay(1000);
      if (
        (email === 'admin' && password === 'admin') ||
        (email === 'admin@pulsecheck.ai' && password === 'password')
      ) {
        return {
          token: 'mock-jwt-token-12345',
          user: {
            id: '1',
            displayName: 'System Admin',
            email: 'admin@pulsecheck.ai',
            role: 'admin',
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff',
          },
        };
      }
      throw new Error('Invalid mock credentials. Use admin@pulsecheck.ai / password');
    }
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Redirect the browser to Discord OAuth2 authorization page.
   * This is a hard redirect — the browser will leave the app.
   */
  redirectToDiscord() {
    window.location.href = buildDiscordAuthUrl();
  },

  /**
   * Exchange the OAuth2 code (from Discord callback URL) for a JWT.
   * Called by the AuthCallback page after Discord redirects back.
   */
  async exchangeDiscordCode(code) {
    if (USE_MOCK) {
      await delay(1200);
      return {
        token: 'mock-jwt-discord-67890',
        user: {
          id: 'discord-user-1',
          displayName: 'Discord Manager',
          username: 'manager#1234',
          email: 'manager@discord.com',
          avatar: 'https://ui-avatars.com/api/?name=DM&background=5865F2&color=fff',
          discordAccessToken: 'mock_discord_access_token',
        },
      };
    }
    return fetchApi('/auth/discord/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  /**
   * Fetch authenticated user from JWT (called on page load).
   */
  async getCurrentUser() {
    if (USE_MOCK) {
      await delay(400);
      const token = localStorage.getItem('pulsecheck_token');
      if (token) {
        return {
          id: '1',
          displayName: 'System Admin',
          email: 'admin@pulsecheck.ai',
          role: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff',
        };
      }
      throw new Error('No active session');
    }
    return fetchApi('/auth/me');
  },
};
