import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL

class ApiClient {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No authentication token available')
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = await this.getAuthHeaders()
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Kid Context Management
  async updateKidName(name: string) {
    return this.request('/kid-name', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    })
  }

  async updateKidAge(age: string) {
    return this.request('/kid-age', {
      method: 'PUT',
      body: JSON.stringify({ age }),
    })
  }

  async updateUserPrompt(prompt: string) {
    return this.request('/user-prompt', {
      method: 'PUT',
      body: JSON.stringify({ prompt }),
    })
  }

  async getUserData(userId: string) {
    return this.request(`/users/${userId}/userdata`)
  }

  // Stories Management
  async createStory(title: string, content: string) {
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    })
  }

  async getStories() {
    return this.request('/stories')
  }

  async getStory(storyId: string) {
    return this.request(`/stories/${storyId}`)
  }

  async deleteStory(storyId: string) {
    return this.request(`/stories/${storyId}`, {
      method: 'DELETE',
    })
  }

  // Courses Management
  async createCourse(title: string, content: string) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    })
  }

  async getCourses() {
    return this.request('/courses')
  }

  async getCourse(courseId: string) {
    return this.request(`/courses/${courseId}`)
  }

  async deleteCourse(courseId: string) {
    return this.request(`/courses/${courseId}`, {
      method: 'DELETE',
    })
  }

  // Games Management
  async createGame(title: string, description: string) {
    return this.request('/games', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    })
  }

  async getGames() {
    return this.request('/games')
  }

  async getGame(gameId: string) {
    return this.request(`/games/${gameId}`)
  }

  async deleteGame(gameId: string) {
    return this.request(`/games/${gameId}`, {
      method: 'DELETE',
    })
  }

  async search(query: string) {
    return this.request(`/search`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  }
}

export const api = new ApiClient()