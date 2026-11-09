// stores/authStore.js
import { defineStore, acceptHMRUpdate } from 'pinia';
import axios from 'axios';
import { api } from 'boot/axios'

const API_HOSTNAME = import.meta.env.VITE_API_HOSTNAME;

export const authStore = defineStore('authStore', {
  state: () => ({
    users: [],
    singleUser: {},
    loading: false,
    error: null
  }),

  getters: {
    // safe, non-breaking getters you can use anywhere
    currentUserId: (state) => state.singleUser?.id || localStorage.getItem('id') || null,
    roles: (state) => {
      // keep compatibility with your original `role` localStorage key
      const roleRaw = state.singleUser?.roles || localStorage.getItem('role');
      if (!roleRaw) return [];
      // if roles already an array on singleUser, return it
      if (Array.isArray(state.singleUser?.roles)) return state.singleUser.roles;
      try {
        return JSON.parse(roleRaw);
      } catch {
        // fallback: roleRaw is a string, return as single-element array
        return [roleRaw];
      }
    },
    isAdminOrOps: (state) => {
      const r = (() => {
        const roles = state.singleUser?.roles || [];
        if (Array.isArray(roles) && roles.length) return roles;
        const raw = localStorage.getItem('role');
        if (!raw) return [];
        try { return JSON.parse(raw); } catch { return [raw]; }
      })();
      return r.includes('system_admin') || r.includes('operations_manager');
    },
    hasRole: (state) => (role) => {
      const r = state.singleUser?.roles || [];
      if (Array.isArray(r) && r.length) return r.includes(role);
      const raw = localStorage.getItem('role');
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.includes(role) : parsed === role;
      } catch {
        return raw === role;
      }
    }
  },

  actions: {
    // helper — does not replace your existing functions
    setAuthHeader(token) {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    },

    // helper to hydrate store from localStorage at app startup
    initFromLocal() {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined') {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      if (token) this.setAuthHeader(token);

      const id = localStorage.getItem('id');
      const firstName = localStorage.getItem('firstName');
      const lastName = localStorage.getItem('lastName');
      const roleRaw = localStorage.getItem('role');
      const special = localStorage.getItem('special');

      if (id) {
        let roles = [];
        if (roleRaw) {
          try {
            roles = JSON.parse(roleRaw);
          } catch {
            roles = [roleRaw];
          }
        }
        this.singleUser = {
          id,
          firstName,
          lastName,
          roles,
          special
        };
      }
    },

    // --- keep these exact function names and signatures ---
    async logInUser(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_HOSTNAME}/api/auth/login`, {
          email,
          password
        });

        const user = response.data.user;
        const token = user.token;

        // Use the exact same localStorage keys you used before
        localStorage.setItem('token', token);
        localStorage.setItem('id', user.id || user._id);
        localStorage.setItem('firstName', user.firstName || '');
        localStorage.setItem('lastName', user.lastName || '');
        // store role consistently as JSON (so it can be string or array)
        localStorage.setItem('role', JSON.stringify(user.roles || user.role || []));
        // preserve 'special' if provided (you had it originally)
        if (user.special) localStorage.setItem('special', user.special);

        // populate singleUser in the same shape other modules might expect
        this.singleUser = {
          id: user.id || user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles || (user.role ? [user.role] : []),
          special: user.special
        };

        // set axios header for subsequent requests
        this.setAuthHeader(token);

        return {
          success: true,
          role: user.role
        }

      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed';
        console.error("Login error:", this.error);
        return this.error;

      } finally {
        this.loading = false;
      }
    },

    logOutUser() {
      // preserve the same removals as in your original function, plus the extras we set
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      localStorage.removeItem('role');
      localStorage.removeItem('special');
      this.singleUser = {};
      this.setAuthHeader(null);
    },

    async resetPassword(id, newPassword) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_HOSTNAME}/api/auth/reset-password/${id}`, { newPassword });
        return response.data.message;
      } catch (error) {
        this.error = error.response?.data?.error || 'Password reset failed';
        console.error("Reset password error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getUserById(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_HOSTNAME}/api/auth/user/${id}`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch user';
        console.error("Fetch user error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    }
    // --- end of preserved function names ---
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(authStore, import.meta.hot));
}
