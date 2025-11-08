// src/features/auth/AuthService.ts
// A tiny mock auth "backend" and token helpers.

type User = {
  id: string;
  email: string;
  name: string;
};

const FAKE_DB: Record<string, { password: string; user: User }> = {
  'demo@starwars.dev': {
    password: 'password123',
    user: { id: '1', email: 'demo@starwars.dev', name: 'Demo User' },
  },
};

const TOKEN_KEY = 'mock_auth_token';
const USER_KEY = 'mock_auth_user';

function randomToken() {
  return `mock-jwt-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export const AuthService = {
  // simulate server delay
  delay(ms = 600) {
    return new Promise((res) => setTimeout(res, ms));
  },

  async login(email: string, password: string) {
    await this.delay();
    const record = FAKE_DB[email.toLowerCase()];
    if (!record || record.password !== password) {
      throw new Error('Invalid credentials');
    }
    const token = randomToken();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(record.user));
    return { user: record.user, token, expiresIn: 300 }; // seconds
  },

  async signup(email: string, password: string, name: string) {
    await this.delay();
    const key = email.toLowerCase();
    if (FAKE_DB[key]) throw new Error('User already exists');
    const user = { id: String(Object.keys(FAKE_DB).length + 1), email, name };
    FAKE_DB[key] = { password, user };
    const token = randomToken();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user, token, expiresIn: 300 };
  },

  getLocalAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (!token || !userJson) return null;
    try {
      const user = JSON.parse(userJson) as User;
      return { token, user };
    } catch {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Simulate a token refresh (would normally call /refresh)
  async refresh(token: string) {
    await this.delay(400);
    // If token is missing, error
    if (!token) throw new Error('No token to refresh');
    const newToken = randomToken();
    localStorage.setItem(TOKEN_KEY, newToken);
    return { token: newToken, expiresIn: 300 };
  },
};
