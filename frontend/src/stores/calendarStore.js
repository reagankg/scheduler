import { defineStore } from 'pinia'
import { userStore } from './userStore'
import { srfStore } from './srfStore'
import axios, { all } from 'axios';
import { api } from 'boot/axios';
import { PH_NON_WORKING_HOLIDAYS } from 'src/utils/phHolidays'

const API_HOSTNAME = import.meta.env.VITE_API_HOSTNAME;

export const useCalendarStore = defineStore('calendarStore', {
state: () => ({
    technicians: [],
    eventsByTechnician: {},
    stats: {
      technicians: 0,
      jobs: 0,
      holidays: 0,
      onLeave: 0
    },
    selectedTechnician: 'all',
    selectedStatus: 'all',
    selectedTaskType: 'all',
    loading: false,
    error: null
  }),

  getters: {
    filteredTechnicians: (state) => {
      return state.technicians.filter(technician =>
        state.selectedTechnician === 'all' ||
        technician.name === state.selectedTechnician
      )
    },

    filteredEventsByTechnician: (state) => {
      const result = {}

      Object.entries(state.eventsByTechnician).forEach(([technician, events]) => {
        result[technician] = events.filter(event => {
          const statusMatch =
            state.selectedStatus === 'all' ||
            event.status === state.selectedStatus

          const taskMatch =
            state.selectedTaskType === 'all' ||
            event.label === state.selectedTaskType

          return statusMatch && taskMatch
        })
      })

      return result
    }
  },

  actions: {
    async loadMonth(year, month) {
      this.loading = true

      const userStores = userStore()
      const srfStores = srfStore()

      // Ensure base data is loaded
      if (!Array.isArray(userStores.users) || !userStores.users.length) {
        await userStores.getAllUser()
      }

      if (!Array.isArray(srfStores.allSRF) || !srfStores.allSRF.length) {
        await srfStores.getAllSRF()
      }

      /* ---------------- TECHNICIANS ---------------- */
      this.technicians = userStores.users
        .filter(u => String(u.role).toLowerCase() === 'technician')
        .map(u => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`
        }))

      const monthStart = new Date(year, month - 1, 1)
      const monthEnd = new Date(year, month, 0, 23, 59, 59, 999)

      const holidays = PH_NON_WORKING_HOLIDAYS?.[year] || {}

      this.stats.technicians = this.technicians.length

      this.stats.holidays = Object.keys(holidays)
        .filter(dateKey => {
          const [, m] = dateKey.split('-').map(Number)
          return m === month
        })
        .length

      this.stats.onLeave = this.technicians.filter(tech => {
        const user = userStores.users.find(u => u._id === tech.id)

        return user?.leaves?.some(leave => {
          const start = new Date(leave.startDate)
          const end = new Date(leave.endDate)

          return start <= monthEnd && end >= monthStart
        })
      }).length

      this.stats.jobs = srfStores.allSRF.filter(srf => {
        const rawDate = srf?.date?.$date || srf?.date
        if (!rawDate) return false

        const date = new Date(rawDate)
        if (isNaN(date)) return false

        return (
          date.getFullYear() === year &&
          date.getMonth() + 1 === month
        )
      }).length

      /* ---------------- INIT BUCKETS ---------------- */
      this.eventsByTechnician = {}
      this.technicians.forEach(t => {
        this.eventsByTechnician[t.name] = []
      })

      /* ---------------- PROJECT SRFs ---------------- */
      srfStores.allSRF.forEach(srf => {
        // must have technician assigned
        if (!srf?.technician) return

        // must match technician row
        if (!this.eventsByTechnician[srf.technician]) return

        // must have valid date
        const rawDate = srf.date?.$date || srf.date
        if (!rawDate) return

        const d = new Date(rawDate)
        if (isNaN(d)) return

        // must match current month/year
        if (d.getFullYear() !== year) return
        if (d.getMonth() + 1 !== month) return

        this.eventsByTechnician[srf.technician].push({
        id: srf._id,

        day: d.getDate(),

        label: srf.task,

        service: srf.serviceVehicle,

        location: srf.client,

         startTime: d.toLocaleTimeString('en-US', {
           hour: '2-digit',
           minute: '2-digit',
           hour12: true,
           timeZone: 'Asia/Manila'
         }),
      
         endTime: null,

        status: srf.status_id,

        type: 'task'
        })
      })
      this.loading = false
    },

    /* -------- REAL-TIME SUPPORT (OPTIONAL, READY) -------- */
    applyChange(srf) {
      if (!srf?.technician) return

      const rawDate = srf.date?.$date || srf.date
      if (!rawDate) return

      const d = new Date(rawDate)
      if (isNaN(d)) return

      // remove old
      Object.keys(this.eventsByTechnician).forEach(t => {
        this.eventsByTechnician[t] =
          this.eventsByTechnician[t].filter(ev => ev.id !== srf._id)
      })

      if (!this.eventsByTechnician[srf.technician]) return

      this.eventsByTechnician[srf.technician].push({
        id: srf._id,
        day: d.getDate(),
        label: srf.task,
        type: 'task'
      })
    },

    async addSpecialDayOff(id, payload) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post(
          `${API_HOSTNAME}/api/srfs/special-day-off/${id}`,
          payload
        )

        return response.data
      } catch (error) {
        this.error =
          error.response?.data?.error || 'Failed to add rescheduled day off'

        throw this.error
      } finally {
        this.loading = false
      }
    },

    async deleteSpecialDayOff(id, dayoffId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.delete(
          `${API_HOSTNAME}/api/srfs/special-day-off/${id}/${dayoffId}`
        )

        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete rescheduled day off'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    removeEvent(srfId) {
      Object.keys(this.eventsByTechnician).forEach(t => {
        this.eventsByTechnician[t] =
          this.eventsByTechnician[t].filter(ev => ev.id !== srfId)
      })
    },

    async updateDayOff(id, payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`${API_HOSTNAME}/api/srfs/day-off/${id}`, payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update Day Off';
        console.error("Update Day Off error:", this.error);
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async addLeave(id, payload) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post(
          `${API_HOSTNAME}/api/srfs/leave/${id}`,
          payload
        )
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to add leave'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async deleteLeave(id, leaveId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.delete(
          `${API_HOSTNAME}/api/srfs/leave/${id}/${leaveId}`
        )

        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete leave'
        throw this.error
      } finally {
        this.loading = false
      }
    }
  }
})
