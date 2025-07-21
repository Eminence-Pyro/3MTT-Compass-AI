import { useState, useEffect } from 'react';
import { User as AppUser, Achievement, LearningModule } from '../types/index';
import { localStorageService, StoredUser } from '../services/localStorageService';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = localStorageService.getCurrentUser();
    if (currentUser) {
      setUser(convertStoredUserToAppUser(currentUser));
    }
    setLoading(false);
  }, []);

  const convertStoredUserToAppUser = (storedUser: StoredUser): AppUser => {
    const learningPath = localStorageService.getLearningPathByUserId(storedUser.id);
    
    return {
      id: storedUser.id,
      email: storedUser.email,
      name: storedUser.name,
      track: storedUser.track,
      assessmentCompleted: storedUser.assessmentCompleted,
      skillLevel: storedUser.skillLevel,
      completedModules: storedUser.completedModules,
      achievements: storedUser.achievements,
      totalPoints: storedUser.totalPoints,
      currentPath: learningPath
    };
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const newUser = localStorageService.register(email, password, name);
      localStorageService.setCurrentUser(newUser);
      setUser(convertStoredUserToAppUser(newUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = localStorageService.login(email, password);
      localStorageService.setCurrentUser(user);
      setUser(convertStoredUserToAppUser(user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorageService.logout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<AppUser>) => {
    if (!user) return;

    try {
      // Handle learning path updates
      if (updates.currentPath) {
        localStorageService.saveLearningPath(user.id, updates.currentPath);
      }

      // Update user data
      const updatedStoredUser = localStorageService.updateUser(user.id, {
        track: updates.track,
        assessmentCompleted: updates.assessmentCompleted,
        skillLevel: updates.skillLevel,
        completedModules: updates.completedModules,
        achievements: updates.achievements,
        totalPoints: updates.totalPoints
      });

      setUser(convertStoredUserToAppUser(updatedStoredUser));
    } catch (error) {
      console.error('Error updating user:', error);
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