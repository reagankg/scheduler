<template>
  <q-dialog
    v-model="modelValue"
    persistent
    @hide="close"
  >
    <q-card class="srf-preview-modal">

      <!-- HEADER -->
      <div class="modal-header">
        <div>
          <div class="modal-title">
            Service Request Form - {{ srf?.srf_id || 'SRF' }}
          </div>

        </div>

        <q-btn
          icon="close"
          flat
          round
          dense
          color="white"
          @click="close"
        />
      </div>

      <!-- BODY -->
      <q-card-section
        v-if="srf"
        class="srf-preview-body"
      >

        <div class="details-grid">

            <!-- TASK DETAILS -->
            <div class="details-column">

                <div class="section-title">
                    Task Details
                </div>

                <div class="info-row">
                    <strong>Date/Time</strong>
                    <span>{{ formatDate(srf.date) }}</span>
                </div>

                <div class="info-row">
                    <div class="label">Client</div>
                    <div>{{ srf.client || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Location</div>
                    <div>{{ srf.location || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Assigned Tech</div>
                    <div>{{ srf.technician || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Task/s</div>
                    <div>{{ srf.task || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Contact Person</div>
                    <div>{{ srf.contactPerson || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Contact Number</div>
                    <div>{{ srf.contactNumber || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Client's Concern</div>
                    <div>{{ srf.concern || 'N/A' }}</div>
                </div>

            </div>


            <!-- DEVICE DETAILS -->
            <div class="details-column">

                <div class="section-title">
                    Device Details
                </div>

                <div class="info-row">
                    <div class="label">TID</div>
                    <div>{{ srf.tid || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Plate Number</div>
                    <div>{{ srf.plateNumber || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Vehicle Type</div>
                    <div>{{ srf.vehicleType || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Odometer</div>
                    <div>{{ srf.odometer || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Device Type</div>
                    <div>{{ srf.deviceType || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">SCN</div>
                    <div>{{ srf.scn || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">MIN</div>
                    <div>{{ srf.min || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">IMEI</div>
                    <div>{{ srf.imei || 'N/A' }}</div>
                </div>

                <div class="info-row">
                    <div class="label">Device Status</div>
                    <div>{{ srf.deviceStatus || 'N/A' }}</div>
                </div>

            </div>

        </div>


        <!-- PERSONS IN CHARGE -->
        <div class="persons-section">

            <div class="section-title">
                Persons-in-Charge
            </div>

            <div class="person-row">
                <strong>Service Coordinator</strong>
                <span>{{ srf.coordinator || 'N/A' }}</span>
            </div>

            <div class="person-row">
                <strong>Technician</strong>
                <span>{{ srf.technician || 'N/A' }}</span>
            </div>

            <div class="person-row">
                <strong>Technical Advisor</strong>
                <span>{{ srf.advisor || 'N/A' }}</span>
            </div>

            <div class="person-row">
                <strong>System Administrator</strong>
                <span>{{ srf.admin || 'N/A' }}</span>
            </div>

            <div class="person-row">
                <strong>Accounting Inventory</strong>
                <span>{{ srf.accountingInventory || 'N/A' }}</span>
            </div>

        </div>


        <!-- STATUS -->
        <div class="status-row">

            <div class="label">
                Status
            </div>

            <q-badge
                :color=statusColor(srf.status_id)
                rounded
            >
                {{ srf.status_id }}
            </q-badge>

        </div>

    </q-card-section>

      <q-card-section
        v-else
        class="loading-section"
      >
        <q-spinner
          color="green"
          size="40px"
        />
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { srfStore } from 'src/stores/srfStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },

  srfId: {
    type: [String, Object],
    default: null
  }
})

const emit = defineEmits([
  'update:modelValue'
])

const storeSrf = srfStore()

const loading = ref(false)

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const srf = computed(() => {
  if (!props.srfId) return null

  const id =
    typeof props.srfId === 'object'
      ? props.srfId?.$oid
      : props.srfId

  return storeSrf.allSRF?.find(
    item => String(item._id) === String(id)
  ) || null
})

watch(
  () => props.srfId,
  async id => {
    if (!id) return

    if (!Array.isArray(storeSrf.allSRF) || !storeSrf.allSRF.length) {
      loading.value = true

      try {
        await storeSrf.getAllSRF()
      } finally {
        loading.value = false
      }
    }
  },
  { immediate: true }
)

function formatDate(value) {
  if (!value) return 'N/A'

  const date = new Date(value)

  if (isNaN(date)) return 'N/A'

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  })
}

function statusColor(status) {
  switch (String(status || '').toLowerCase()) {
    case 'completed':
      return 'green'

    case 'on-going':
    case 'ongoing':
      return 'primary'

    case 'cancelled':
      return 'red'

    case 'draft':
      return 'grey'

    case 'for approval':
      return 'amber'

    case 'for revision':
      return 'deep-purple'

    default:
      return 'grey'
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.srf-preview-modal {
  width: 700px;
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #12a94f;
  color: white;
  padding: 16px 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.modal-subtitle {
  margin-top: 6px;
  font-size: 15px;
}

.srf-preview-body {
  max-height: calc(90vh - 80px);
  overflow-y: auto;
  padding: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 32px;
}

.info-item {
  display: flex;
  gap: 12px;
  line-height: 1.4;
}

.info-item strong {
  min-width: 130px;
}

.info-item span {
  color: #555;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
}

.loading-section {
  display: flex;
  justify-content: center;
  padding: 60px;
}

.srf-section {
  border: 1px solid #222;
  padding: 8px 10px;
}

.srf-section-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
}

.person-row {
  display: grid;
  grid-template-columns: 210px 1fr;
  line-height: 20px;
  font-size: 12px;
}

.person-row strong {
  font-weight: 700;
}

.person-row span {
  text-align: left;
}

.details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
}

.details-column {
    min-width: 0;
}

.section-title {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 8px;
}

.info-row {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 12px;
    padding: 7px 0;
    border-bottom: 0;
    line-height: 1.35;
}

.label {
    width: auto;
    font-weight: 700;
    color: #111827;
}

.persons-section {
    margin-top: 10px;
    border: 1px solid #222;
    padding: 8px 10px;
}

.person-row {
    display: grid;
    grid-template-columns: 210px 1fr;
    line-height: 20px;
    font-size: 12px;
}

.person-row strong {
    font-weight: 700;
}

.status-row {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #ddd;
}

@media (max-width: 700px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    gap: 2px;
  }
}
</style>