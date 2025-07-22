import { User, LearningPath, Achievement } from '../types/index';

export interface StoredUser {
  id: string;
  email: string;
  password: string; // In production, this would be hashed
  name: string;
  track: string;
  assessmentCompleted: boolean;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  completedModules: string[];
  achievements: Achievement[];
  totalPoints: number;
  currentPath: LearningPath | null;
  createdAt: string;
  updatedAt: string;
}

class LocalStorageService {
  private readonly USERS_KEY = '3mtt_users';
  private readonly CURRENT_USER_KEY = '3mtt_current_user';
  private readonly LEARNING_PATHS_KEY = '3mtt_learning_paths';

  // User Management
  getAllUsers(): StoredUser[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUser(user: StoredUser): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getUserByEmail(email: string): StoredUser | null {
    const users = this.getAllUsers();
    return users.find(u => u.email === email) || null;
  }

  getUserById(id: string): StoredUser | null {
    const users = this.getAllUsers();
    return users.find(u => u.id === id) || null;
  }

  // Authentication
  register(email: string, password: string, name: string): StoredUser {
    const existingUser = this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password, // In production, hash this
      name,
      track: '',
      assessmentCompleted: false,
      skillLevel: 'beginner',
      completedModules: [],
      achievements: [],
      totalPoints: 0,
      currentPath: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveUser(newUser);
    return newUser;
  }

  login(email: string, password: string): StoredUser {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('No account found with this email');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    return user;
  }

  // Session Management
  setCurrentUser(user: StoredUser): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  getCurrentUser(): StoredUser | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // User Updates
  updateUser(userId: string, updates: Partial<StoredUser>): StoredUser {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveUser(updatedUser);
    this.setCurrentUser(updatedUser);
    return updatedUser;
  }

  // Learning Paths
  saveLearningPath(userId: string, learningPath: LearningPath): void {
    const paths = this.getLearningPaths();
    const existingIndex = paths.findIndex(p => p.userId === userId);
    
    if (existingIndex >= 0) {
      paths[existingIndex] = learningPath;
    } else {
      paths.push(learningPath);
    }
    
    localStorage.setItem(this.LEARNING_PATHS_KEY, JSON.stringify(paths));
  }

  getLearningPaths(): LearningPath[] {
    const paths = localStorage.getItem(this.LEARNING_PATHS_KEY);
    return paths ? JSON.parse(paths) : [];
  }

  getLearningPathByUserId(userId: string): LearningPath | null {
    const paths = this.getLearningPaths();
    return paths.find(p => p.userId === userId) || null;
  }

  // Demo Data Seeding
  seedDemoData(): void {
    const existingUsers = this.getAllUsers();
    if (existingUsers.length > 0) return; // Don't seed if data exists

    // Create demo user
    const demoUser: StoredUser = {
      id: 'demo_user_1',
      email: 'demo@3mtt.com',
      password: 'demo123',
      name: 'Demo User',
      track: '',
      assessmentCompleted: true,
      skillLevel: 'intermediate',
      completedModules: ['3mtt-html-basics', '3mtt-css-styling'],
      achievements: [
        {
          id: 'first_module',
          type: 'completion',
          title: 'Getting Started',
          description: 'Complete your first learning module',
          icon: 'play',
          points: 10,
          rarity: 'common',
          unlockedAt: new Date().toISOString()
        }
      ],
      totalPoints: 10,
      currentPath: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveUser(demoUser);
  }
}

export const localStorageService = new LocalStorageService();