<template>
  <div class="q-pa-md">

    <!-- CREATE CLIENT BUTTON -->
    <div class="q-px-xl q-mb-md" style="display: flex; flex-direction: row;">
      <q-btn color="dark" icon="add" label="Create Client" @click="showDialog = true" />
      <q-input
        dense
        outlined
        v-model="search"
        placeholder="Search..."
        style="width: 250px; margin-left: 20px;"
        @keyup.enter="runSearch"
      >
        <template v-slot:append>
          <q-icon
            name="search"
            class="cursor-pointer"
            @click="runSearch"
          />
          <q-btn
            dense
            size="sm"
            label="RESET"
            color="red"
            class="cursor-pointer"
            @click="resetSearch"
          />
        </template>
      </q-input>
    </div>

    <!-- CLIENT TABLE (READ-ONLY) -->
    <div class="q-px-xl">
      <q-table
        flat
        bordered
        title="CLIENTS"
        :rows="clientArray"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body="props">
          <q-tr class="cursor-pointer" @click="onRowClick(props.row)">
            <q-td>{{ props.row.name }}</q-td>
            <q-td>{{ props.row.client_Id }}</q-td>
            <q-td>{{ props.row.contact_person }}</q-td>
            <q-td>{{ props.row.contact_no }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- CREATE CLIENT DIALOG -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:450px">
        <q-card-section class="bg-light-green-7 text-white">
          <div class="text-h6">Create Client</div>
        </q-card-section>

        <q-card-section>
          <q-form ref="createFormRef" class="q-gutter-sm">
            <q-input v-model="form.name" label="Client Name" outlined dense :rules="[r.required]" />
            <q-input v-model="form.contact_person" label="Contact Person" outlined dense :rules="[r.required]" />
            <q-input v-model="form.client_Id" label="Client ID" outlined dense />
            <q-input v-model="form.contact_no" label="Contact No." outlined dense :rules="[r.required, r.phone]" />
            <q-input v-model="form.location" label="Location" outlined dense />
            <q-input v-model="form.tin" label="TIN" outlined dense :rules="[r.required]" />
            <q-input v-model="form.installation_address" label="Installation Address" type="textarea" outlined dense />
            <q-input v-model="form.billing_address" label="Billing Address" type="textarea" outlined dense />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" v-close-popup @click="cancelButton" />
          <q-btn color="light-green-7" label="Submit" @click="submitForm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- EDIT CLIENT DIALOG -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width:450px">
        <q-card-section class="bg-light-green-7 text-white">
          <div class="text-h6">Edit Client</div>
        </q-card-section>

        <q-card-section>
          <q-form ref="editFormRef" class="q-gutter-sm">
            <q-input v-model="editForm.name" label="Client Name" outlined dense :rules="[r.required]" />
            <q-input v-model="editForm.contact_person" label="Contact Person" outlined dense :rules="[r.required]" />
            <q-input v-model="editForm.contact_no" label="Contact No." outlined dense :rules="[r.required, r.phone]" />
            <q-input v-model="editForm.client_Id" label="Client ID" outlined dense />
            <q-input v-model="editForm.location" label="Location" outlined dense />
            <q-input v-model="editForm.tin" label="TIN" outlined dense :rules="[r.required]" />
            <q-input v-model="editForm.installation_address" label="Installation Address" type="textarea" outlined dense />
            <q-input v-model="editForm.billing_address" label="Billing Address" type="textarea" outlined dense />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="light-green-7" label="Update" @click="updateClientButton" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- INFO DIALOG (ACTION HUB) -->
    <q-dialog v-model="infoDialog" persistent>
      <q-card style="min-width:450px">

        <q-card-section>
          <div class="text-h6">Client Information</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <div><b>Name:</b> {{ infoClient.name }}</div>
          <div><b>Contact:</b> {{ infoClient.contact_person }}</div>
          <div><b>Phone:</b> {{ infoClient.contact_no }}</div>
          <div><b>Location:</b> {{ infoClient.location }}</div>
          <div><b>Installation:</b> {{ infoClient.installation_address }}</div>
          <div><b>Billing:</b> {{ infoClient.billing_address }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Close" v-close-popup />
          <q-btn color="amber" icon="edit" label="Edit" @click="editFromInfo" />
          <q-btn color="red" icon="delete" label="Delete" @click="deleteFromInfo" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import socket from '../plugins/socket'
import { srfStore } from '../stores/srfStore'

const $q = useQuasar()
const store = srfStore()

/* STATE */
const clientArray = ref([])
const showDialog = ref(false)
const editDialog = ref(false)
const infoDialog = ref(false)
const loading = ref(false);
const search = ref("");

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
  { name: 'name', label: 'Name', field: 'name', align: "left" },
  { name: 'client_Id', label: 'Client ID', field: 'client_Id', align: "left" },
  { name: 'contact_person', label: 'Contact Person', field: 'contact_person', align: "left" },
  { name: 'contact_no', label: 'Contact No', field: 'contact_no', align: "left" }
]

const resetSearch = async () => {
  try {
    search.value = ""
    await store.getClients()
    clientArray.value = store.allClients  
  } catch (err) {
    console.error("Reset search failed:", err)
  }
}

const cancelButton = async () => {
  form.value.name = '';
  form.value.contact_person = '';
  form.value.client_Id = '';
  form.value.contact_no = '';
  form.value.location = '';
  form.value.tin = '';
  form.value.installation_address = '';
  form.value.billing_address = '';
  form.value.created_by = 'admin';
}

const runSearch = async () => {
  loading.value = true
  try {
    if (!search.value.trim()) {
      await resetSearch()
      return
    }

    const result = await store.searchClient(search.value.trim())
    clientArray.value = result

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

/* METHODS */
const onRowClick = row => {
  infoClient.value = row
  infoDialog.value = true
}

const editFromInfo = () => {
  editForm.value = { ...infoClient.value }
  infoDialog.value = false
  setTimeout(() => (editDialog.value = true), 150)
}

const deleteFromInfo = () => {
  infoDialog.value = false
  setTimeout(() => confirmDelete(infoClient.value), 150)
}

const submitForm = async () => {
  if (!(await createFormRef.value.validate())) return
  await store.createClient(form.value)
  createFormRef.value.reset()
  showDialog.value = false
}

const updateClientButton = async () => {
  if (!(await editFormRef.value.validate())) return
  await store.updateClient(editForm.value)
  editDialog.value = false
  editForm.value = {}
  $q.notify({ type: 'positive', message: 'Client updated successfully' })
}

const confirmDelete = row => {
  $q.dialog({
    title: 'Delete Client',
    message: 'Are you sure you want to delete it? If yes.. Provide a reason for deletion',
    prompt: { type: 'textarea' },
    cancel: true,
    persistent: true
  }).onOk(async reason => {
    await store.deleteClient(row._id, reason)
    $q.notify({ type: 'positive', message: 'Client deleted successfully' })
  })
}

/* DATA */
const fetchClients = async () => {
  await store.getClients()
  clientArray.value = store.allClients
}

socket.on('client-change', fetchClients)

onMounted(fetchClients)
onBeforeUnmount(() => socket.off('client-change'))
</script>
