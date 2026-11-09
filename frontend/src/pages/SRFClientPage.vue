<template>
  <div class="client-page">

    <!-- PAGE HEADER -->
    <div class="page-header">
      <div>
        <div class="page-title">Clients</div>
        <div class="page-subtitle">
          Manage and monitor all client information
        </div>
      </div>

      <q-btn
        unelevated
        color="green-9"
        icon="add"
        size="sm"
        label="CREATE CLIENT"
        @click="createNewClient"
      />
    </div>

    <!-- STATISTICS -->
    <div class="stats-row">
      <q-card flat bordered class="stat-card">
        <q-card-section class="stat-content">

          <q-avatar
            size="32px"
            color="green-7"
            text-color="white"
            icon="business"
          />

          <div>
            <div class="stat-label">Total Clients</div>
            <div class="stat-value">
              {{ clientArray.length }}
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
        placeholder="Search clients"
        class="search-input"
        @keyup.enter="runSearch"
      >
        <template #append>
          <q-icon
            name="search"
            class="cursor-pointer"
            @click="runSearch"
          />
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

    <!-- CLIENT TABLE -->
    <q-card flat bordered class="table-card">

      <q-table
        flat
        :rows="clientArray"
        :columns="columns"
        row-key="_id"
        :loading="loading"
        :rows-per-page-options="[5, 10, 20, 50]"
      >

        <template #body="props">
          <q-tr
            :props="props"
            class="client-row cursor-pointer"
            @click="onRowClick(props.row)"
          >

            <q-td
              key="name"
              :props="props"
            >
              {{ props.row.name || 'N/A' }}
            </q-td>

            <q-td
              key="client_Id"
              :props="props"
            >
              {{ props.row.client_Id || 'N/A' }}
            </q-td>

            <q-td
              key="contact_person"
              :props="props"
            >
              {{ props.row.contact_person || 'N/A' }}
            </q-td>

            <q-td
              key="contact_no"
              :props="props"
            >
              {{ props.row.contact_no || 'N/A' }}
            </q-td>

          </q-tr>
        </template>

      </q-table>

    </q-card>


    <!-- CREATE CLIENT DIALOG -->
    <q-dialog
      v-model="showDialog"
      persistent
    >
      <q-card class="client-dialog">

        <q-card-section class="dialog-header">
          <div class="text-h6">
            Create Client
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            text-color="white"
            @click="showDialog = false"
          />
        </q-card-section>

        <q-card-section>
          <q-form
            ref="createFormRef"
            class="q-gutter-md"
          >

            <q-input
              v-model="form.name"
              label="Client Name"
              outlined
              dense
              :rules="[r.required]"
            />

            <q-input
              v-model="form.contact_person"
              label="Contact Person"
              outlined
              dense
              :rules="[r.required]"
            />

            <q-input
              v-model="form.client_Id"
              label="Client ID"
              outlined
              dense
            />

            <q-input
              v-model="form.contact_no"
              label="Contact No."
              outlined
              dense
              :rules="[r.required, r.phone]"
            />

            <q-input
              v-model="form.location"
              label="Location"
              outlined
              dense
            />

            <q-input
              v-model="form.tin"
              label="TIN"
              outlined
              dense
              :rules="[r.required]"
            />

            <q-input
              v-model="form.installation_address"
              label="Installation Address"
              type="textarea"
              outlined
              dense
            />

            <q-input
              v-model="form.billing_address"
              label="Billing Address"
              type="textarea"
              outlined
              dense
            />

          </q-form>
        </q-card-section>

        <q-card-actions
          align="right"
          class="dialog-actions"
        >

          <q-btn
            outline
            color="grey-8"
            label="CANCEL"
            @click="cancelCreate"
          />

          <q-btn
            color="green-9"
            icon="check"
            label="SAVE"
            @click="submitForm"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>


    <!-- CLIENT INFORMATION MODAL -->
    <q-dialog
      v-model="infoDialog"
      persistent
    >
      <q-card class="client-dialog info-dialog">

        <q-card-section class="dialog-header">

          <div>
            <div class="info-name">
              {{ infoClient.name }}
            </div>

            <div class="info-subtitle">
              Client Information
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            text-color="white"
            @click="infoDialog = false"
          />

        </q-card-section>

        <q-card-section class="info-content">

          <div class="info-grid">

            <div class="info-item">
              <span>Client ID</span>
              <strong>{{ infoClient.client_Id || 'N/A' }}</strong>
            </div>

            <div class="info-item">
              <span>Contact Person</span>
              <strong>{{ infoClient.contact_person || 'N/A' }}</strong>
            </div>

            <div class="info-item">
              <span>Contact Number</span>
              <strong>{{ infoClient.contact_no || 'N/A' }}</strong>
            </div>

            <div class="info-item">
              <span>Location</span>
              <strong>{{ infoClient.location || 'N/A' }}</strong>
            </div>

            <div class="info-item full-width">
              <span>TIN</span>
              <strong>{{ infoClient.tin || 'N/A' }}</strong>
            </div>

            <div class="info-item full-width">
              <span>Installation Address</span>
              <strong>
                {{ infoClient.installation_address || 'N/A' }}
              </strong>
            </div>

            <div class="info-item full-width">
              <span>Billing Address</span>
              <strong>
                {{ infoClient.billing_address || 'N/A' }}
              </strong>
            </div>

          </div>

        </q-card-section>

        <q-card-actions
          align="right"
          class="dialog-actions"
        >

          <q-btn
            outline
            color="grey-8"
            label="CLOSE"
            @click="infoDialog = false"
          />

          <q-btn
            color="amber-8"
            icon="edit"
            label="EDIT"
            @click="editFromInfo"
          />

          <q-btn
            color="red-6"
            icon="delete"
            label="DELETE"
            @click="deleteFromInfo"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>


    <!-- EDIT CLIENT DIALOG -->
    <q-dialog
      v-model="editDialog"
      persistent
    >
      <q-card class="client-dialog">

        <q-card-section class="dialog-header">

          <div class="text-h6">
            Edit Client
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            text-color="white"
            @click="editDialog = false"
          />

        </q-card-section>

        <q-card-section>

          <q-form
            ref="editFormRef"
            class="q-gutter-md"
          >

            <q-input
              v-model="editForm.name"
              label="Client Name"
              outlined
              dense
              :rules="[r.required]"
            />

            <q-input
              v-model="editForm.contact_person"
              label="Contact Person"
              outlined
              dense
              :rules="[r.required]"
            />

            <q-input
              v-model="editForm.client_Id"
              label="Client ID"
              outlined
              dense
            />

            <q-input
              v-model="editForm.contact_no"
              label="Contact No."
              outlined
              dense
              :rules="[r.required, r.phone]"
            />

            <q-input
              v-model="editForm.location"
              label="Location"
              outlined
              dense
            />

            <q-input
              v-model="editForm.tin"
              label="TIN"
              outlined
              dense
              :rules="[r.required]"
            />

            <q-input
              v-model="editForm.installation_address"
              label="Installation Address"
              type="textarea"
              outlined
              dense
            />

            <q-input
              v-model="editForm.billing_address"
              label="Billing Address"
              type="textarea"
              outlined
              dense
            />

          </q-form>

        </q-card-section>

        <q-card-actions
          align="right"
          class="dialog-actions"
        >

          <q-btn
            outline
            color="grey-8"
            label="CANCEL"
            @click="editDialog = false"
          />

          <q-btn
            color="green-9"
            icon="check"
            label="UPDATE"
            @click="updateClientButton"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>

  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import socket from '../plugins/socket'
import { useRouter } from 'vue-router'
import { srfStore } from '../stores/srfStore'

const $q = useQuasar()
const store = srfStore()
const router = useRouter()

/* STATE */
const clientArray = ref([])
const showDialog = ref(false)
const editDialog = ref(false)
const infoDialog = ref(false)
const loading = ref(false)
const search = ref('')

const createFormRef = ref(null)
const editFormRef = ref(null)

const form = ref({
  name: '',
  contact_person: '',
  client_Id: '',
  contact_no: '',
  location: '',
  tin: '',
  installation_address: '',
  billing_address: '',
  created_by: 'admin'
})

const editForm = ref({})
const infoClient = ref({})

/* VALIDATION */
const r = {
  required: v => !!v || 'Required',
  phone: v => v?.length >= 10 || 'Invalid number'
}

/* TABLE */
const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true
  },
  {
    name: 'client_Id',
    label: 'Client ID',
    field: 'client_Id',
    align: 'left',
    sortable: true
  },
  {
    name: 'contact_person',
    label: 'Contact Person',
    field: 'contact_person',
    align: 'left',
    sortable: true
  },
  {
    name: 'contact_no',
    label: 'Contact No',
    field: 'contact_no',
    align: 'left'
  }
]

/* SEARCH */
const resetSearch = async () => {
  try {
    search.value = ''
    await fetchClients()
  } catch (err) {
    console.error('Reset search failed:', err)
  }
}

const runSearch = async () => {
  loading.value = true

  try {
    if (!search.value.trim()) {
      await resetSearch()
      return
    }

    const result = await store.searchClient(
      search.value.trim()
    )

    clientArray.value = result

  } catch (err) {
    console.error('Search failed:', err)

  } finally {
    loading.value = false
  }
}

const editFromInfo = () => {
  infoDialog.value = false
  router.push(`/editClient/${infoClient.value._id}`)
}

/* CREATE */
const cancelCreate = () => {
  cancelButton()
  showDialog.value = false
}

const cancelButton = () => {
  form.value = {
    name: '',
    contact_person: '',
    client_Id: '',
    contact_no: '',
    location: '',
    tin: '',
    installation_address: '',
    billing_address: '',
    created_by: 'admin'
  }
}

const submitForm = async () => {
  if (!(await createFormRef.value.validate())) return

  try {
    await store.createClient(form.value)

    cancelButton()
    showDialog.value = false

    $q.notify({
      type: 'positive',
      message: 'Client created successfully'
    })

  } catch (err) {
    console.error('Create client failed:', err)
  }
}

/* ROW CLICK */
const onRowClick = row => {
  infoClient.value = row
  infoDialog.value = true
}

const updateClientButton = async () => {
  if (!(await editFormRef.value.validate())) return

  try {
    await store.updateClient(editForm.value)

    editDialog.value = false
    editForm.value = {}

    $q.notify({
      type: 'positive',
      message: 'Client updated successfully'
    })

  } catch (err) {
    console.error('Update client failed:', err)
  }
}

/* DELETE */
const deleteFromInfo = () => {
  infoDialog.value = false

  setTimeout(() => {
    confirmDelete(infoClient.value)
  }, 150)
}

const createNewClient = () => {
  router.push('/createClient')
}

const confirmDelete = row => {
  $q.dialog({
    title: 'Delete Client',
    message:
      'Are you sure you want to delete this client? Please provide a reason.',
    prompt: {
      type: 'textarea'
    },
    cancel: true,
    persistent: true
  }).onOk(async reason => {
    try {
      await store.deleteClient(row._id, reason)

      $q.notify({
        type: 'positive',
        message: 'Client deleted successfully'
      })

    } catch (err) {
      console.error('Delete client failed:', err)
    }
  })
}

/* DATA */
const fetchClients = async () => {
  loading.value = true

  try {
    await store.getClients()
    clientArray.value = store.allClients

  } catch (err) {
    console.error('Fetch clients failed:', err)

  } finally {
    loading.value = false
  }
}

/* SOCKET */
socket.on('client-change', fetchClients)

onMounted(fetchClients)

onBeforeUnmount(() => {
  socket.off('client-change')
})
</script>


<style scoped>
.client-page {
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

.create-btn {
  min-width: 160px;
  height: 40px;
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

.client-row {
  transition: background-color 0.15s ease;
}

.client-row:hover {
  background: #f4f7f5;
}

/* DIALOG */
.client-dialog {
  width: 560px;
  max-width: 95vw;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1f9147;
  color: white;
  padding: 18px 22px;
}

.dialog-actions {
  padding: 16px 22px;
}

/* CLIENT INFO */
.info-dialog {
  width: 620px;
}

.info-name {
  font-size: 26px;
  font-weight: 700;
}

.info-subtitle {
  margin-top: 2px;
  font-size: 14px;
  opacity: 0.9;
}

.info-content {
  padding: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item span {
  font-size: 12px;
  color: #748091;
}

.info-item strong {
  font-size: 14px;
  font-weight: 500;
  word-break: break-word;
}

.full-width {
  grid-column: span 2;
}

/* Remove horizontal lines between table rows */
.table-card :deep(.q-table tbody td) {
  border-bottom: none !important;
}

/* MOBILE */
@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .stats-row {
    width: 100%;
  }

  .stat-card {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }
}
</style>