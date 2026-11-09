import { defineStore, acceptHMRUpdate } from 'pinia';
import axios, { all } from 'axios';
import srfVehiclesMock from '../../data/vehicle'
import { api } from 'boot/axios';

const API_HOSTNAME = import.meta.env.VITE_API_HOSTNAME;
const API_KEYS = import.meta.env.VITE_MAIN_API_KEYS;

export const srfStore = defineStore('srfStore', {
  state: () => ({
    allAuditLogs: [],
    allSRF: [],
    allSummary: [],
    allClients: [],
    allDevices: [],
    allDevicesTypes: [],
    allVehicles: [],
    allVehicleTypes: [],
    allTasks: [],
    allCheck: [],
    allJobOrders: [],
    allJobOrderSummary: {},
    backendVehicles: [],
    srfVehicles: [],
    singleUser: {},
    loading: false,
    error: null
  }),

  getters: {},

  actions: {

    async getAllSRF() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/`);
        this.allSRF = response?.data?.rows;
        this.allSummary = response?.data?.summary
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch user';
        console.error("Fetch user error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // NEW: fetch vehicles via your backend proxy (safe, non-breaking)
    async getSRFVehiclesFromBackend(clientId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(
          `${API_HOSTNAME}/api/srfs/vehicles-proxy`,
          {
            params: { clientId }
          }
        );
        this.backendVehicles = response.data || [];
      } catch (error) {
        this.error = error || "Failed to fetch vehicles (backend proxy)";
        console.error("getSRFVehiclesFromBackend error:", error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },


    async getClients() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/client/`);
        this.allClients = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch clients';
        console.error("Fetch clients error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getDevices() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/device`);
        this.allDevices = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch devices';
        console.error("Fetch devices error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getVehicles() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/vehicle`);
        this.allVehicles = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch vehicles';
        console.error("Fetch vehicles error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getSRFVehicles() {
      this.loading = true;
      this.error = null;

      try {
        this.srfVehicles = srfVehiclesMock;   
      } catch (error) {
        this.error = error.response?.data?.error || "Failed to fetch vehicles";
        console.error("Fetch vehicles error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    // ------------------------------------------------------------------
    // Philippine Holidays (API-driven, non-breaking)
    // Returns: { 'YYYY-MM-DD': 'Holiday Name' }
    // ------------------------------------------------------------------
    async fetchPhilippineHolidays(year) {
      try {
        const response = await api.get(
          `https://date.nager.at/api/v3/PublicHolidays/${year}/PH`
        )

        return response.data.reduce((map, holiday) => {
          map[holiday.date] = holiday.localName || holiday.name
          return map
        }, {})
      } catch (error) {
        console.error('Failed to fetch Philippine holidays:', error)
        return {}
      }
    },

    async getAllTask() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/task`);
        this.allTasks = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch task';
        console.error("Fetch task error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getAllChecklist() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/checklist`);
        this.allCheck = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch checklist';
        console.error("Fetch checklist error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async createTask(payload) {
      this.loading = true; 
      this.error = null;

      try {
        const response = await api.post(`${API_HOSTNAME}/api/srfs/create-task`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create task';
        console.error("Create task error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async createTypes(payload) {
      this.loading = true; 
      this.error = null;

      try {
        const response = await api.post(`${API_HOSTNAME}/api/srfs/create-types`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create types';
        console.error("Create types error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTypes(id) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`${API_HOSTNAME}/api/srfs/types/${id}`);
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete SRF';
        console.error("Delete SRF error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getVehicleTypes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/types`);
        this.allVehicleTypes = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch vehicle types';
        console.error("Fetch vehicle types error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async updateTypes(id, payload) {
      this.loading = true; 
      this.error = null;

      try {
        const response = await api.put(`${API_HOSTNAME}/api/srfs/update-types/${id}`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update vehicle types';
        console.error("update vehicle types error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async createChecklist(payload) {
      this.loading = true; 
      this.error = null;

      try {
        const response = await api.post(`${API_HOSTNAME}/api/srfs/create-checklist`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create checklist';
        console.error("Create checklist error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async updateChecking(id, payload) {
      this.loading = true; 
      this.error = null;

      try {
        const response = await api.put(`${API_HOSTNAME}/api/srfs/update-checklist/${id}`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create checklist';
        console.error("Create checklist error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getDeviceTypes() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/device-type`);
        this.allDevicesTypes = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch device types';
        console.error("Fetch device types error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getAuditLogs() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/auditLogs`);
        this.allAuditLogs = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch Audit Logs';
        console.error("Fetch Audit Logs error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async updateSRFStatus(id, payload) {
      this.loading = true;
      this.error = null;

      try {
        const cleanPayload = JSON.parse(JSON.stringify(payload)); // Strip reactivity
        const response = await api.patch(`${API_HOSTNAME}/api/srfs/${id}/status`, cleanPayload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update SRF status';
        console.error("Update SRF status error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async updateChecklist(id, payload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.patch(`${API_HOSTNAME}/api/srfs/checklist/${id}`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update Checklist';
        console.error("Update Checklist error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSRF(id, reason) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`${API_HOSTNAME}/api/srfs/${id}`, {
          data: {
            description: reason
          }
        });
        this.allSRF = this.allSRF.filter(srf => srf._id !== id); // Optional: update local list
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete SRF';
        console.error("Delete SRF error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async deleteClient(id, reason) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`${API_HOSTNAME}/api/srfs/client/${id}`, {
          data: {
            description: reason
          }
        });
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete SRF';
        console.error("Delete SRF error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async deleteChecklist(id, reason) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`${API_HOSTNAME}/api/srfs/check/${id}`, {
          data: {
            description: reason
          }
        });
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete SRF';
        console.error("Delete SRF error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(id, reason) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`${API_HOSTNAME}/api/srfs/task/${id}`, {
          data: {
            description: reason
          }
        });
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete SRF';
        console.error("Delete SRF error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async createSRF(payload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post(`${API_HOSTNAME}/api/srfs/create`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create SRF';
        console.error("Create SRF error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async searchSRF(keyword) {
      const res = await api.get(
        `${API_HOSTNAME}/api/srfs/search/${encodeURIComponent(keyword)}`
      )
      return res.data
    },

    async searchUser(keyword) {
      const res = await api.get(`${API_HOSTNAME}/api/srfs/searchUser/${keyword}`)
      return res.data
    },

    async searchClient(keyword) {
      const res = await api.get(`${API_HOSTNAME}/api/srfs/searchClient/${keyword}`)
      return res.data
    },

    async createClient(payload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post(`${API_HOSTNAME}/api/srfs/client`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create Client';
        console.error("Create client error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async updateClient(payload) {
      this.loading = true
      this.error = null

      try {
        const { _id, ...data } = payload

        if (!_id) {
          throw new Error('Client ID is required for update')
        }

        const response = await api.put(
          `${API_HOSTNAME}/api/srfs/clients/${_id}`,
          data
        )

        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update client'
        console.error('Update client error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSRFChecklist(id, payload) {
      const res = await api.patch(
        `${API_HOSTNAME}/api/srfs/checklist/${id}`,
        payload
      )
      return res.data
    },

    async updateTask(id, payload) {
      this.loading = true
      this.error = null

      try {
        const res = await api.put(
          `${API_HOSTNAME}/api/srfs/task/${id}`,
          payload
        )

        return res.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update task'
        console.error("Update task error:", this.error)
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async getSRF(id) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(
          `${API_HOSTNAME}/api/srfs/getOne/${id}`
        )

        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch SRF'
        console.error('Fetch SRF error:', this.error)
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async getAllJobOrders() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(`${API_HOSTNAME}/api/srfs/job-order`);

        this.allJobOrders = response?.data?.rows || [];
        this.allJobOrderSummary = response?.data?.summary || {};
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch job orders';
        console.error('Fetch job orders error:', this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async getOneJobOrder(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get(
          `${API_HOSTNAME}/api/srfs/JobOne/${id}`
        );

        return response.data;
      } catch (error) {
        this.error =
          error.response?.data?.error || 'Failed to fetch Job Order';

        console.error('Fetch Job Order error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(srfStore, import.meta.hot));
}
