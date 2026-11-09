<template>
  <div class="q-pa-md">

    <!-- CREATE USER BUTTON -->
    <div class="q-px-xl q-mb-md" style="display: flex; flex-direction: row;">
      <q-btn
        color="dark"
        icon="add"
        label="Create User"
        @click="showCreateDialog = true"
      />
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

    <!-- USERS TABLE -->
    <div class="q-px-xl">
      <q-table
        flat
        bordered
        title="USERS"
        :rows="userArray"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body="props">
          <q-tr class="cursor-pointer" @click="onRowClick(props.row)">
            <q-td>{{ props.row.firstName }}</q-td>
            <q-td>{{ props.row.lastName }}</q-td>
            <q-td>{{ props.row.email }}</q-td>
            <q-td>{{ props.row.role }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- CREATE USER DIALOG -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width:450px">
        <q-card-section class="bg-light-green-7 text-white">
          <div class="text-h6">Create User</div>
        </q-card-section>

        <q-card-section>
          <q-form ref="createFormRef" class="q-gutter-sm">
            <q-input v-model="form.firstName" label="First Name" outlined dense :rules="[r.required]" />
            <q-input v-model="form.lastName" label="Last Name" outlined dense :rules="[r.required]" />
            <q-input v-model="form.email" label="Email" outlined dense :rules="[r.required]" />
            <q-input v-model="form.initialPassword" label="Initial Password" outlined dense readonly />
            <q-select
              v-model="form.role"
              :options="roleOptions"
              label="Role"
              outlined
              dense
              :rules="[r.required]"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" v-close-popup @click="cancelButton" />
          <q-btn color="dark" label="Submit" @click="submitForm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- INFO DIALOG (ACTION HUB) -->
    <q-dialog v-model="infoDialog" persistent>
      <q-card style="min-width:450px">
        <q-card-section>
          <div class="text-h6">User Information</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <div><b>First Name:</b> {{ infoUser.firstName }}</div>
          <div><b>Last Name:</b> {{ infoUser.lastName }}</div>
          <div><b>Email:</b> {{ infoUser.email }}</div>
          <div><b>Role:</b> {{ infoUser.role }}</div>
          <div><b>Initial Password:</b> {{ infoUser.initialPassword }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Close" v-close-popup />
          <q-btn color="amber" icon="edit" label="Edit" @click="editFromInfo" />
          <q-btn color="red" icon="delete" label="Delete" @click="deleteFromInfo" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- EDIT USER DIALOG -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width:450px">
        <q-card-section class="bg-light-green-7 text-white">
          <div class="text-h6">Edit User</div>
        </q-card-section>

        <q-card-section>
          <q-form ref="editFormRef" class="q-gutter-sm">
            <q-input v-model="editForm.firstName" label="First Name" outlined dense />
            <q-input v-model="editForm.lastName" label="Last Name" outlined dense />
            <q-input v-model="editForm.email" label="Email" outlined dense />
            <q-select
              v-model="editForm.role"
              :options="roleOptions"
              label="Role"
              outlined
              dense
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" v-close-popup />
          <q-btn color="light-green-7" label="Update" @click="updateUserButton" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import socket from '../plugins/socket'
import { userStore } from '../stores/userStore'
import { srfStore } from 'src/stores/srfStore'

const $q = useQuasar()
const store = userStore()
const storeSrf = srfStore()

/* STATE */
const userArray = ref([])
const showCreateDialog = ref(false)
const infoDialog = ref(false)
const editDialog = ref(false)

const createFormRef = ref(null)
const editFormRef = ref(null)

const infoUser = ref({})
const editForm = ref({})
const loading = ref(false);
const search = ref("");

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  initialPassword: '',
  role: null,
  password: ''
})



/* OPTIONS */
const roleOptions = [
  'system_admin',
  'operations_manager',
  'service_coordinator',
  'technician'
]

/* VALIDATION */
const r = {
  required: v => !!v || 'Required'
}

/* TABLE */
const columns = [
  { name: 'firstName', label: 'First Name', field: 'firstName', align: "left" },
  { name: 'lastName', label: 'Last Name', field: 'lastName', align: "left" },
  { name: 'email', label: 'Email', field: 'email', align: "left" },
  { name: 'role', label: 'Role', field: 'role', align: "left" }
]

const resetSearch = async () => {
  try {
    search.value = ""
    await store.getAllUser()
    userArray.value = store.users
  } catch (err) {
    console.error("Reset search failed:", err)
  }
}

const runSearch = async () => {
  loading.value = true
  try {
    if (!search.value.trim()) {
      await resetSearch()
      return
    }

    const result = await storeSrf.searchUser(search.value.trim())
    userArray.value = result

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

/* AUTO PASSWORD */
watch(
  () => form.value.firstName,
  v => {
    if (v) {
      const rnd = Math.floor(100 + Math.random() * 900)
      form.value.initialPassword = `${v}@WRU${rnd}`
      form.value.password = form.value.initialPassword
    }
  }
)

/* METHODS */
const onRowClick = row => {
  showCreateDialog.value = false
  infoUser.value = row
  infoDialog.value = true
}

const editFromInfo = () => {
  editForm.value = { ...infoUser.value }
  infoDialog.value = false
  setTimeout(() => (editDialog.value = true), 150)
}

const deleteFromInfo = () => {
  infoDialog.value = false
  setTimeout(() => confirmDelete(infoUser.value), 150)
}

const submitForm = async () => {
  if (!(await createFormRef.value.validate())) return
  await store.createUser(form.value)
  createFormRef.value.reset()
  showCreateDialog.value = false
}

const cancelButton = async () => {
  form.value.firstName = '';
  form.value.lastName = '';
  form.value.email = '';
  form.value.initialPassword = '';
  form.value.role = null;
  form.value.password = '';
}

const updateUserButton = async () => {
  await store.editUser(editForm.value._id, editForm.value)
  editDialog.value = false
  editForm.value = {}
  $q.notify({ type: 'positive', message: 'User updated successfully' })
}

const confirmDelete = user => {
  $q.dialog({
    title: 'Delete User',
    message: 'Are you sure you want to delete it? If yes.. Provide a reason for deletion',
    prompt: { type: 'textarea' },
    cancel: true,
    persistent: true
  }).onOk(async reason => {
    await store.deleteUser(user._id, reason)
    $q.notify({ type: 'positive', message: 'User deleted successfully' })
  })
}

/* DATA */
const fetchUsers = async () => {
  await store.getAllUser()
  userArray.value = store.users
}

socket.on('user-change', fetchUsers)

onMounted(fetchUsers)
onBeforeUnmount(() => socket.off('user-change'))
</script>
