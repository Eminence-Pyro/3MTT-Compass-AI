const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://threemtt-compass-ai.onrender.com';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  }

  async register(email: string, password: string, name: string) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password, name })
    });
    return this.handleResponse(response);
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await this.handleResponse(response);
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateUser(updates: any) {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse(response);
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

export const apiService = new ApiService();
