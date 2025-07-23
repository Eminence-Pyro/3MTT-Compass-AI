import { useState, useEffect } from 'react';
import { User as AppUser } from '../types/index';
import { apiService } from '../services/apiService';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (!apiService.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      apiService.logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await apiService.register(email, password, name);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    apiService.logout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<AppUser>) => {
    if (!user) return;

    try {
      const response = await apiService.updateUser(updates);
      setUser(response.user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    register,
    login,
    logout,
    updateUser
  };
}