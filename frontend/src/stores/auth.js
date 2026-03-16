import { reactive } from 'vue'

const storedToken = localStorage.getItem('access_token')
const storedUser = localStorage.getItem('user_data')

export const authStore = reactive({
  token: storedToken || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  
  setAuth(token, user) {
    this.token = token
    this.user = user
    localStorage.setItem('access_token', token)
    localStorage.setItem('user_data', JSON.stringify(user))
  },
  
  logout() {
    this.token = null
    this.user = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_data')
  },

  get isAuthenticated() {
    return !!this.token
  },

  get role() {
    return this.user?.role || null
  },
  
  get isAdmin() {
    return this.role === 'ADMIN'
  },
  
  get isClient() {
    return this.role === 'CLIENT'
  }
})
