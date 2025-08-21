import api from './api';
import { User } from '../store/slices/authSlice';

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login/', {
      username,
      password,
    });
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const response = await api.post('/auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  }

  async getUserProfile(): Promise<User> {
    const response = await api.get('/accounts/profile/');
    return response.data;
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await api.put('/accounts/profile/update/', profileData);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/accounts/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async getDashboardData(userType: string): Promise<any> {
    const response = await api.get('/accounts/dashboard/');
    return response.data;
  }
}

export const authService = new AuthService();