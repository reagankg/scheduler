import { defineStore, acceptHMRUpdate } from 'pinia';
import axios from 'axios';
import { api } from 'boot/axios';

const API_HOSTNAME = import.meta.env.VITE_API_HOSTNAME;

export const userStore = defineStore('userStore', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    counter: 0
  }),

  getters: {
    doubleCount: (state) => state.counter * 2
  },

  actions: {
    async getAllUser() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`${API_HOSTNAME}/api/auth/users`);
        this.users = response.data;

        // Optionally compute stats or handle more data here
      } catch (error) {
        this.error = error.message || 'Failed to fetch users';
        console.error("Fetch error:", error);
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post(
          `${API_HOSTNAME}/api/auth/register`,
          userData
        );

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'User creation failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },


    async editUser(id, updatedData) {
      this.loading = true
      try {
        const response = await api.put(
          `${API_HOSTNAME}/api/auth/users/${id}`,
          updatedData
        )

        // ❌ DO NOT mutate users here
        // Socket will emit update

        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'User update failed'
        throw error
      } finally {
        this.loading = false
      }
    },


    async deleteUser(id, reason) {
      this.loading = true;
      try {
        await api.delete(`${API_HOSTNAME}/api/auth/users/${id}`, {
          data: {
            description: reason
          }
        });

        // ❌ DO NOT filter here
        // Socket handles removal
      } catch (error) {
        this.error = error.response?.data?.error || 'User deletion failed';
        throw error;
      } finally {
        this.loading = false;
      }
    }    
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(userStore, import.meta.hot));
}
