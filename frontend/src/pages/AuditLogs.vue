<template>
  <div class="audit-page">

    <!-- PAGE HEADER -->
    <div class="page-header">
      <div>
        <div class="page-title">Audit Logs</div>

        <div class="page-subtitle">
          Monitor and track all system activities
        </div>
      </div>
    </div>

    <!-- STATISTICS -->
    <div class="stats-row">
      <q-card flat bordered class="stat-card">
        <q-card-section class="stat-content">

          <q-avatar
            size="32px"
            color="green-7"
            text-color="white"
            icon="history"
          />

          <div>
            <div class="stat-label">Total Audit Logs</div>

            <div class="stat-value">
              {{ auditLogs.length }}
            </div>
          </div>

        </q-card-section>
      </q-card>
    </div>

    <!-- FILTERS -->
    <div class="filter-row">

      <q-input
        v-model="search"
        dense
        outlined
        placeholder="Search audit logs"
        class="search-input"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn
        outline
        color="grey-8"
        icon="restart_alt"
        label="RESET FILTERS"
        class="reset-btn"
        @click="resetSearch"
      />

    </div>

    <!-- AUDIT LOG TABLE -->
    <q-card flat bordered class="table-card">

      <q-table
        flat
        :rows="filteredAuditLogs"
        :columns="columns"
        row-key="_id"
        :rows-per-page-options="[5, 10, 20, 50]"
      >

        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="openLog(props.row)"
            class="cursor-pointer"
          >
            <q-td key="user" :props="props">
              {{ props.row.user }}
            </q-td>

            <q-td key="action" :props="props">
              {{ props.row.action }}
            </q-td>

            <q-td key="module" :props="props">
              {{ props.row.module }}
            </q-td>

            <q-td key="created_at" :props="props">
              {{ formatDate(props.row.created_at) }}
            </q-td>
          </q-tr>
        </template>

      </q-table>

    </q-card>

    <!-- Audit Details Dialog -->
    </div>

    <!-- Audit Details Dialog -->
    <!-- Audit Details Dialog -->
    <q-dialog v-model="showLogDialog">
      <q-card class="audit-dialog">

        <!-- HEADER -->
        <q-card-section class="audit-dialog-header">

          <div>
            <div class="audit-dialog-title">
              Audit Log Details
            </div>

            <div class="audit-dialog-subtitle">
              Activity Information
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            color="white"
            v-close-popup
          />

        </q-card-section>

        <!-- CONTENT -->
        <q-card-section class="audit-dialog-content">

          <div class="audit-info-grid">

            <div class="audit-info-item">
              <div class="audit-info-label">User</div>
              <div class="audit-info-value">
                {{ selectedLog.user }}
              </div>
            </div>

            <div class="audit-info-item">
              <div class="audit-info-label">Action</div>
              <div class="audit-info-value">
                {{ selectedLog.action }}
              </div>
            </div>

            <div class="audit-info-item">
              <div class="audit-info-label">Module</div>
              <div class="audit-info-value">
                {{ selectedLog.module }}
              </div>
            </div>

            <div class="audit-info-item">
              <div class="audit-info-label">Date & Time</div>
              <div class="audit-info-value">
                {{ formatDate(selectedLog.created_at) }}
              </div>
            </div>

          </div>

          <div class="audit-description-section">

            <div class="audit-info-label">
              Description
            </div>

            <div class="audit-description">
              {{ selectedLog.description || 'N/A' }}
            </div>

          </div>

        </q-card-section>

        <!-- ACTIONS -->
        <q-card-actions class="audit-dialog-actions">

          <q-btn
            outline
            color="grey-8"
            label="CLOSE"
            class="close-btn"
            v-close-popup
          />

        </q-card-actions>

      </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

// Replace with your actual store
import { srfStore } from '../stores/srfStore.js'

const $q = useQuasar()
const store = srfStore()

const auditLogs = ref([])
const search = ref('')
const showLogDialog = ref(false)

const selectedLog = ref({})

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

const columns = [
  {
    name: 'user',
    label: 'USER',
    field: 'user',
    align: 'center'
  },
  {
    name: 'action',
    label: 'ACTION',
    field: 'action',
    align: 'center'
  },
  {
    name: 'module',
    label: 'MODULE',
    field: 'module',
    align: 'center'
  },
  {
    name: 'created_at',
    label: 'DATE/TIME',
    field: 'created_at',
    align: 'center',
    format: val =>
      new Date(val).toLocaleString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
  }
]

const filteredAuditLogs = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  if (!keyword) {
    return auditLogs.value
  }

  return auditLogs.value.filter(log =>
    log.user?.toLowerCase().includes(keyword) ||
    log.action?.toLowerCase().includes(keyword) ||
    log.module?.toLowerCase().includes(keyword) ||
    formatDate(log.created_at).toLowerCase().includes(keyword)
  )
})

const resetSearch = () => {
  search.value = ''
}

const openLog = (row) => {
  selectedLog.value = row
  showLogDialog.value = true
}

const fetchAuditLogs = async () => {
  try {

    await store.getAuditLogs()
    auditLogs.value = store.allAuditLogs

  } catch (error) {

    $q.notify({
      type: 'negative',
      message: 'Failed to fetch audit logs.'
    })

    console.error(error)
  }
}

onMounted(() => {
  fetchAuditLogs()
})
</script>

<style scoped>
.info-row {
  margin-bottom: 15px;
  font-size: 15px;
}

.info-row {
  margin-bottom: 15px;
  font-size: 15px;
}

.audit-page {
  margin-top: -36px;
  margin-left: -12px;
}

/* HEADER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #2f2f2f;
  line-height: 1.1;
}

.page-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #8b8b8b;
}

/* STAT */
.stats-row {
  display: flex;
  margin-bottom: 10px;
}

.stat-card {
  width: 215px;
  border-radius: 10px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 22px;
}

.stat-label {
  font-size: 12px;
  color: #748091;
}

.stat-value {
  margin-top: 3px;
  font-size: 18px;
  font-weight: 700;
}

/* FILTERS */
.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.search-input {
  width: 375px;
}

.reset-btn {
  height: 40px;
  min-width: 145px;
}

/* TABLE */
.table-card {
  border-radius: 6px;
  overflow: hidden;
}

/* Remove horizontal lines between table rows */
.table-card :deep(.q-table tbody td) {
  border-bottom: none !important;
}

/* AUDIT LOG DIALOG */

.audit-dialog {
  width: 590px;
  max-width: 90vw;
  border-radius: 8px;
  overflow: hidden;
}

.audit-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2f7d46;
  color: white;
  padding: 20px 24px;
}

.audit-dialog-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.audit-dialog-subtitle {
  margin-top: 6px;
  font-size: 14px;
  opacity: 0.9;
}

.audit-dialog-content {
  padding: 26px 24px;
}

.audit-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 40px;
}

.audit-info-item {
  min-width: 0;
}

.audit-info-label {
  margin-bottom: 7px;
  font-size: 13px;
  color: #748091;
}

.audit-info-value {
  font-size: 15px;
  color: #2f2f2f;
}

.audit-description-section {
  margin-top: 24px;
}

.audit-description {
  min-height: 58px;
  padding: 14px 16px;
  border: 1px solid #d7dce2;
  border-radius: 4px;
  font-size: 15px;
  color: #2f2f2f;
  background: #fff;
}

.audit-dialog-actions {
  display: flex;
  justify-content: flex-end;
  padding: 14px 24px 18px;
}

.close-btn {
  height: 38px;
  min-width: 84px;
}

</style>