<template>
    <div class="srf-page">

        <!-- Header -->
        <div class="dashboard-header">
            <div class="row items-start justify-between">

            <div>
                <div class="dashboard-title">
                Users
                </div>

                <div class="dashboard-subtitle">
                Manage and monitor all system users
                </div>
            </div>

            <div class="row items-center q-gutter-sm">
                <q-btn
                unelevated
                color="green-9"
                icon="add"
                label="Create User"
                size="sm"
                @click="openCreate"
                />

                <q-btn-dropdown
                unelevated
                outline
                color="grey-8"
                label="Export"
                icon="download"
                size="sm"
                >
                <q-list dense>
                    <q-item
                    clickable
                    v-close-popup
                    @click="exportUsers"
                    >
                    <q-item-section avatar>
                        <q-icon name="table_view" />
                    </q-item-section>

                    <q-item-section>
                        Excel Report
                    </q-item-section>
                    </q-item>
                </q-list>
                </q-btn-dropdown>
            </div>

            </div>
        </div>

        <!-- USER KPIs -->
        <div
            class="row q-col-gutter-md q-mb-lg"
            style="margin-bottom: 10px;"
        >
            <div
            v-for="card in dashboardCards"
            :key="card.title"
            class="col-12 col-sm-6 col-md"
            >
            <q-card flat bordered class="dashboard-card">

                <q-card-section horizontal class="q-pa-sm">

                <q-card-section class="flex flex-center">
                    <q-avatar
                    :color="card.color"
                    text-color="white"
                    size="30px"
                    >
                    <q-icon
                        :name="card.icon"
                        size="12px"
                    />
                    </q-avatar>
                </q-card-section>

                <q-card-section class="q-pl-xs q-pr-sm q-py-xs">
                    <div class="card-title">
                    {{ card.title }}
                    </div>

                    <div class="card-value">
                    {{ card.value }}
                    </div>
                </q-card-section>

                </q-card-section>

            </q-card>
            </div>
        </div>

        <!-- FILTERS -->
        <div class="row items-center q-col-gutter-sm q-mb-md">

            <div class="col-12 col-md-4">
            <q-input
                dense
                outlined
                v-model="search"
                placeholder="Search users"
                debounce="300"
            >
                <template #append>
                <q-icon name="search" />
                </template>
            </q-input>
            </div>

            <div class="col-6 col-md-2">
            <q-select
                dense
                outlined
                label="Role"
                v-model="filterRole"
                :options="roleFilterOptions"
                clearable
            />
            </div>

            <div class="col-auto">
            <q-btn
                outline
                color="grey-7"
                icon="restart_alt"
                label="Reset Filters"
                @click="resetFilters"
            />
            </div>

        </div>

        <!-- TABLE -->
        <div class="table-container">

            <q-table
            flat
            bordered
            :rows="visibleUsers"
            :columns="columns"
            :loading="loading"
            row-key="_id"
            class="srf-table"
            :rows-per-page-options="[5, 10, 20]"
            >

            <template v-slot:loading>
                <q-inner-loading showing>
                <q-spinner
                    size="50px"
                    color="light-green-7"
                />
                </q-inner-loading>
            </template>

            <template v-slot:no-data>
                <div class="full-width row flex-center q-pa-md text-grey">
                No users found
                </div>
            </template>

            <template v-slot:header="props">
                <q-tr :props="props">
                <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                >
                    {{ col.label }}
                </q-th>
                </q-tr>
            </template>

            <!-- CLICKABLE USER ROW -->
            <template v-slot:body="props">
                <q-tr
                :props="props"
                class="cursor-pointer"
                @click="onRowClick(props.row)"
                >

                <q-td>
                    <div class="text-weight-medium">
                    {{ props.row.firstName }}
                    </div>
                </q-td>

                <q-td>
                    <div class="text-weight-medium">
                    {{ props.row.lastName }}
                    </div>
                </q-td>

                <q-td>
                    <div>
                    {{ props.row.email }}
                    </div>
                </q-td>

                <q-td>
                    <q-chip
                    dense
                    class="role-chip"
                    :class="roleClass(props.row.role)"
                    >
                    {{ formatRole(props.row.role) }}
                    </q-chip>
                </q-td>

                </q-tr>
            </template>

            </q-table>

        </div>

        <!-- KEEP YOUR EXISTING CREATE / INFO / EDIT DIALOGS BELOW THIS POINT -->

    </div>
    <!-- USER INFORMATION MODAL -->
    <q-dialog v-model="infoDialog">
        <q-card class="user-info-modal">

            <!-- HEADER -->
            <div class="user-info-header">

            <div>
                <div class="user-info-name">
                {{ infoUser.firstName }} {{ infoUser.lastName }}
                </div>

                <div class="user-info-role">
                {{ formatRole(infoUser.role) }}
                </div>
            </div>

            <q-btn
                flat
                round
                dense
                icon="close"
                color="white"
                @click="infoDialog = false"
            />

            </div>

            <!-- BODY -->
            <q-card-section class="q-pa-lg">

            <div class="user-detail-list">

                <div class="user-detail">
                <div class="detail-label">
                    First Name
                </div>
                <div class="detail-value">
                    {{ infoUser.firstName }}
                </div>
                </div>

                <div class="user-detail">
                <div class="detail-label">
                    Last Name
                </div>
                <div class="detail-value">
                    {{ infoUser.lastName }}
                </div>
                </div>

                <div class="user-detail">
                <div class="detail-label">
                    Email
                </div>
                <div class="detail-value">
                    {{ infoUser.email }}
                </div>
                </div>

                <div class="user-detail">
                <div class="detail-label">
                    Role
                </div>
                <div class="detail-value">
                    {{ formatRole(infoUser.role) }}
                </div>
                </div>

                <div
                v-if="infoUser.initialPassword"
                class="user-detail"
                >
                <div class="detail-label">
                    Initial Password
                </div>
                <div class="detail-value">
                    {{ infoUser.initialPassword }}
                </div>
                </div>

            </div>

            </q-card-section>

            <!-- FOOTER -->
            <q-card-actions
            align="right"
            class="q-pa-md"
            >

            <q-btn
                flat
                label="Close"
                @click="infoDialog = false"
            />

            <q-btn
                color="amber"
                icon="edit"
                label="Edit"
                @click="editFromInfo"
            />

            <q-btn
                color="red"
                icon="delete"
                label="Delete"
                @click="deleteFromInfo"
            />

            </q-card-actions>

        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import socket from '../plugins/socket';
import { userStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const store = userStore()
const router = useRouter()
const $q = useQuasar()
const userArray = ref([])

const infoDialog = ref(false)

const dashboardCards = computed(() => {
  const users = userArray.value

  const countRole = role =>
    users.filter(user => user.role === role).length

  return [
    {
      title: 'Total Users',
      value: users.length,
      icon: 'people',
      color: 'green'
    },
    {
      title: 'Administrators',
      value: countRole('system_admin') + countRole('operations_manager'),
      icon: 'admin_panel_settings',
      color: 'deep-purple'
    },
    {
      title: 'Technicians',
      value: countRole('technician'),
      icon: 'engineering',
      color: 'blue'
    },
    {
      title: 'Operations Managers',
      value: countRole('operations_manager'),
      icon: 'manage_accounts',
      color: 'orange'
    },
    {
      title: 'System Admins',
      value: countRole('system_admin'),
      icon: 'security',
      color: 'red'
    }
  ]
})

const deleteFromInfo = () => {
  $q.dialog({
    title: 'Delete User',
    message: `Are you sure you want to delete ${infoUser.value.firstName} ${infoUser.value.lastName}?`,
    cancel: true,
    persistent: true,
    color: 'negative'
  }).onOk(async () => {
    try {
      await store.deleteUser(infoUser.value._id)

      infoDialog.value = false

      // Refresh immediately instead of waiting for socket timing
      await fetchUsers()

      $q.notify({
        type: 'positive',
        message: 'User deleted successfully',
        position: 'top'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message:
          error.response?.data?.error ||
          'Failed to delete user',
        position: 'top'
      })
    }
  })
}

const formatRole = role => {
  if (!role) return ''

  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const openCreate = () => {
  router.push('/createUser')
};

const editFromInfo = () => {
  infoDialog.value = false
  router.push(`/editUser/${infoUser.value._id}`)
};

const infoUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  initialPassword: ''
})

const onRowClick = row => {
  showCreateDialog.value = false
  infoUser.value = row
  infoDialog.value = true
}

const loading = ref(false)
const search = ref('')
const filterRole = ref(null)
const showCreateDialog = ref(false)

const roleFilterOptions = [
  'system_admin',
  'operations_manager',
  'service_coordinator',
  'technician'
]

const columns = [
  {
    name: 'firstName',
    label: 'First Name',
    field: 'firstName',
    align: 'left',
    style: 'width: 20%',
    headerStyle: 'width: 20%'
  },
  {
    name: 'lastName',
    label: 'Last Name',
    field: 'lastName',
    align: 'left',
    style: 'width: 20%',
    headerStyle: 'width: 20%'
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    style: 'width: 30%',
    headerStyle: 'width: 30%'
  },
  {
    name: 'role',
    label: 'Role',
    field: 'role',
    align: 'left',
    style: 'width: 30%',
    headerStyle: 'width: 30%'
  }
]

const roleClass = role => {
  return `role-${role}`
}

const resetFilters = () => {
  search.value = ''
  filterRole.value = null
}

const exportUsers = () => {
  $q.notify({
    type: 'positive',
    message: 'User export is currently a UI mock.',
    position: 'top'
  })
}

const visibleUsers = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return userArray.value.filter(user => {
    const matchesSearch =
      !keyword ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)

    const matchesRole =
      !filterRole.value ||
      user.role === filterRole.value

    return matchesSearch && matchesRole
  })
})

const fetchUsers = async () => {
  await store.getAllUser()
  userArray.value = store.users
  console.log("USER", userArray.value)
}

socket.on('user-change', fetchUsers)

onMounted(fetchUsers)
onBeforeUnmount(() => socket.off('user-change'))

</script>

<style>
.srf-page {
  padding: 2px;
  margin-top: -40px;
  margin-left: -14px;
}

.dashboard-header {
  margin-bottom: 18px;
}

.dashboard-title {
  font-size: 18px;
  font-weight: 600;
  color: #2f2f2f;
  line-height: 1.1;
}

.dashboard-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: #8b8b8b;
}

.dashboard-card {
  border-radius: 10px;
  min-height: 58px;
  transition: .2s;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, .08);
}

.card-title {
  font-size: 11px;
  color: #7d7d7d;
  margin-bottom: 2px;
}

.card-value {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.table-container {
  padding: 0;
}

.srf-table .q-table tbody tr td {
  border-bottom: none !important;
}

.srf-table .q-table tbody tr {
  transition: background-color .15s ease;
}

.srf-table .q-table tbody tr:hover {
  background: #f7faf8;
}

.role-chip {
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 8px;
  height: 22px;
}

.role-system_admin {
  background: #f2e9ff;
  color: #7c4dff;
}

.role-operations_manager {
  background: #fff5d8;
  color: #d89b00;
}

.role-service_coordinator {
  background: #eaf2ff;
  color: #3b82f6;
}

.role-technician {
  background: #e7f8ec;
  color: #37a45a;
}

.srf-table table {
  table-layout: fixed;
  width: 100%;
}

.user-info-modal {
  width: 560px;
  max-width: 90vw;
  border-radius: 14px;
  overflow: hidden;
}

.user-info-header {
  background: #1f9147;
  color: white;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info-name {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.user-info-role {
  margin-top: 4px;
  font-size: 14px;
  opacity: 0.9;
}

.user-detail-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.user-detail {
  padding-bottom: 12px;
  border-bottom: 1px solid #eeeeee;
}

.user-detail:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-label {
  font-size: 12px;
  color: #777;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 16px;
  font-weight: 500;
  color: #2d2d2d;
}
</style>