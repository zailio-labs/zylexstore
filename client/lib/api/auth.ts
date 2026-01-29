// API URL - Set this in your .env file as NEXT_PUBLIC_API_URL
// For production, update this to your deployed backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface OTPData {
  email: string;
  otp: string;
  type?: 'signup' | 'login' | 'password-reset';
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: any;
    token?: string;
    refreshToken?: string;
  };
  errors?: any;
}

class AuthAPI {
  // Signup
  static async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to connect to server');
    }
  }

  // Send OTP
  static async sendOTP(email: string, type: 'signup' | 'login' | 'password-reset' = 'signup'): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to send OTP');
    }
  }

  // Verify OTP
  static async verifyOTP(data: OTPData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (result.success && result.data?.token) {
        this.setAuthData(result.data.token, result.data.refreshToken, result.data.user);
      }
      return result;
    } catch (error) {
      throw new Error('Failed to verify OTP');
    }
  }

  // Login
  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (result.success && result.data?.token) {
        this.setAuthData(result.data.token, result.data.refreshToken, result.data.user);
      }
      return result;
    } catch (error) {
      throw new Error('Failed to connect to server');
    }
  }

  // Get current user
  static async getMe(): Promise<AuthResponse> {
    try {
      const token = this.getStoredToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      const token = this.getStoredToken();
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } finally {
      this.clearAuthData();
    }
  }

  // Refresh token
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const result = await response.json();
      
      if (result.success && result.data?.token) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('refreshToken', result.data.refreshToken);
      }
      return result;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to process password reset');
    }
  }

  // Reset password
  static async resetPassword(email: string, otp: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  }

  // Storage helpers
  private static setAuthData(token: string, refreshToken: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private static clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static getStoredUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getStoredToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  static getStoredRefreshToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  static isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }
}

export default AuthAPI;
