<template>
  <div class="vehicle-page">

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <div class="page-title">Vehicle Type</div>
        <div class="page-subtitle">Manage and monitor all vehicle types</div>
      </div>

      <q-btn
        unelevated
        color="green-9"
        icon="add"
        size="sm"
        label="CREATE VEHICLE TYPE"
        @click="showDialog = true"
      />
    </div>

    <!-- Summary -->
    <div class="stats-row">
      <q-card flat bordered class="stat-card">
        <q-card-section class="stat-content">

          <q-avatar
            size="32px"
            color="green-7"
            text-color="white"
            icon="directions_car"
          />

          <div>
            <div class="stat-label">
              Total Vehicle Types
            </div>

            <div class="stat-value">
              {{ userArray.length }}
            </div>
          </div>

        </q-card-section>
      </q-card>
    </div>

    <!-- Filters -->
    <div class="filter-row">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Search vehicle types"
        class="search-input"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn
        outline
        color="grey-8"
        icon="restart_alt"
        label="RESET FILTERS"
        class="reset-btn"
        @click="resetFilters"
      />
    </div>

    <!-- Vehicle Type Table -->
     <q-card flat bordered class="table-card">
        <q-table
          flat
          :rows="filteredUserArray"
          :columns="columns"
          row-key="_id"
          class="modern-table"
          :rows-per-page-options="[5, 10, 20, 50]"
        >
          <template v-slot:body="props">
            <q-tr :props="props" @click="onRowClick(props.row)" class="cursor-pointer">
              <q-td key="value" :props="props">
                {{ props.row.value }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ formatDate(props.row.created_at) }}
              </q-td>
              <q-td key="created_by" :props="props">
                {{ props.row.created_by }}
              </q-td>
            </q-tr>
          </template>

        </q-table>
    </q-card>

    <!-- Dialog with Form -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="vehicle-dialog">

        <!-- Header -->
        <q-card-section class="vehicle-dialog-header">
          <div>
            <div class="vehicle-dialog-title">
              Create Vehicle Type
            </div>

            <div class="vehicle-dialog-subtitle">
              Vehicle Type Information
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            color="white"
            @click="cancelButton"
          />
        </q-card-section>

        <!-- Form -->
        <q-card-section class="vehicle-dialog-body">
          <q-form @submit.prevent="submitForm" ref="userFormRef">
            <q-input
              v-model="form.value"
              outlined
              label="Vehicle Type Name"
              :rules="[val => !!val || 'Vehicle Type name is required']"
            />
          </q-form>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions class="vehicle-dialog-actions" align="right">
          <q-btn
            outline
            color="red-6"
            label="CANCEL"
            @click="cancelButton"
          />

          <q-btn
            outline
            color="green-8"
            icon="check"
            label="SAVE"
            @click="submitForm"
          />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog" persistent>
      <q-card class="vehicle-dialog">

        <!-- Header -->
        <q-card-section class="vehicle-dialog-header">
          <div>
            <div class="vehicle-dialog-title">
              Edit Vehicle Type
            </div>

            <div class="vehicle-dialog-subtitle">
              Update vehicle type information
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            color="white"
            @click="editDialog = false"
          />
        </q-card-section>

        <!-- Form -->
        <q-card-section class="vehicle-dialog-body">

          <q-input
            v-model="editForm.value"
            outlined
            label="Vehicle Type Name"
          />

        </q-card-section>

        <!-- Actions -->
        <q-card-actions
          class="vehicle-dialog-actions"
          align="right"
        >

          <q-btn
            outline
            color="red-5"
            label="CANCEL"
            @click="editDialog = false"
          />

          <q-btn
            outline
            color="green-7"
            icon="check"
            label="SAVE"
            @click="updateTypes"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- Inception Dialogs -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="inception" persistent>
        <q-card class="vehicle-dialog">

          <!-- Header -->
          <q-card-section class="vehicle-dialog-header">
            <div>
              <div class="vehicle-dialog-title">
                {{ infoUser.value }}
              </div>

              <div class="vehicle-dialog-subtitle">
                Vehicle Type Information
              </div>
            </div>

            <q-btn
              flat
              round
              dense
              icon="close"
              color="white"
              @click="inception = false"
            />
          </q-card-section>

          <!-- Information -->
          <q-card-section class="vehicle-dialog-body vehicle-info-body">

            <div class="info-grid">

              <div>
                <div class="info-label">
                  Vehicle Type
                </div>

                <div class="info-value">
                  {{ infoUser.value }}
                </div>
              </div>

              <div>
                <div class="info-label">
                  Date Created
                </div>

                <div class="info-value">
                  {{ formatDate(infoUser.created_at) }}
                </div>
              </div>

              <div>
                <div class="info-label">
                  Created By
                </div>

                <div class="info-value">
                  {{ infoUser.created_by }}
                </div>
              </div>

            </div>

          </q-card-section>

          <!-- Actions -->
          <q-card-actions class="vehicle-dialog-actions" align="right">

            <q-btn
              outline
              color="grey-7"
              label="CLOSE"
              @click="inception = false"
            />

            <q-btn
              unelevated
              color="orange-7"
              icon="edit"
              label="EDIT"
              @click="openEditDialog"
            />

            <q-btn
              unelevated
              color="red-6"
              icon="delete"
              label="DELETE"
              @click="deleteTypes(infoUser._id)"
            />

          </q-card-actions>

        </q-card>
      </q-dialog>
    </div>

  </div>
</template>

<script setup>
import socket from '../plugins/socket';
import { onMounted, ref, computed, onBeforeUnmount } from 'vue';
import { srfStore } from '../stores/srfStore.js';
import { useQuasar } from 'quasar';

const userArray = ref([]);
const search = ref('');

const filteredUserArray = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) return userArray.value;

  return userArray.value.filter(item =>
    [item.value, item.created_at, item.created_by]
      .some(value => String(value || '').toLowerCase().includes(keyword))
  );
});

const resetFilters = () => {
  search.value = '';
};

const $q = useQuasar();
const storeTypes = srfStore();
const showDialog = ref(false);
const userFormRef = ref(null);
const inception = ref(false);
const secondDialog = ref(false);
const infoUser = ref({});
const getFirtsName = localStorage.getItem('firstName');
const getLastName = localStorage.getItem('lastName');
const editDialog = ref(false)
const editForm = ref({})
const editFormRef = ref(null)

const form = ref({
  value: '',
})

const formatDate = (date) => {
  if (!date) return 'N/A'

  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const columns = [
  {
    name: 'value',
    align: 'center',
    label: 'VEHICLE TYPE',
    field: 'value',
    sortable: false
  },
  {
    name: 'created_at',
    align: 'center',
    label: 'DATE CREATED',
    field: 'created_at',
    sortable: false
  },
  {
    name: 'created_by',
    align: 'center',
    label: 'CREATED BY',
    field: 'created_by',
    sortable: false
  },
]

const cancelButton = () => {
  showDialog.value = false;
  form.value.value = '';
}

const onRowClick = (row) => {
  infoUser.value = row;
  inception.value = true;
};

const openEditDialog = () => {
  editForm.value = { ...infoUser.value }
  inception.value = false

  setTimeout(() => {
    editDialog.value = true
  }, 150)
}

const editVehicleType = (vehicleType) => {
  editValue.value = vehicleType.vehicleType
  editDialog.value = true
}

const updateTypes = async () => {
  try {
    await storeTypes.updateTypes(editForm.value._id, {
      value: editForm.value.value
    })

    editDialog.value = false

    $q.notify({
      type: 'positive',
      message: 'Vehicle type updated successfully!'
    })

  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update vehicle type.'
    })
  }
}

// Watch value to auto-generate password

const submitForm = async () => {
  const valid = await userFormRef.value.validate()

  if (!valid) {
    $q.notify({
      type: 'negative',
      message: 'Please fill out all required fields properly.'
    })
    return null;
  }

  form.value.created_by = `${getFirtsName} ${getLastName}`
  try {
    await storeTypes.createTypes(form.value);
    form.value = {
      value: '',
    }

    showDialog.value = false
    
    $q.notify({
      type: 'positive',
      message: 'Task created successfully!'
    })
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create task. Please try again.'
    })
  }

}

const deleteTypes = async (id) => {
  if (!id) {
    $q.notify({
      type: 'negative',
      message: 'No vehicle types selected to delete.'
    });
    return;
  }

  try {
    $q.dialog({
      title: 'Delete vehicle types',
      message: 'Are you sure you want to delete it? If yes.. Provide a reason for deletion',
      prompt: { type: 'textarea' },
      cancel: true,
      persistent: true
    }).onOk(async reason => {
      await storeTypes.deleteTypes(id);
      infoUser.value = {};
      inception.value = false;

      $q.notify({
        type: 'positive',
        message: 'vehicle types deleted successfully!'
      });
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to delete task. Please try again.'
    });
  }
};

socket.on('vehicle-type-change', (change) => {
  const type = change.operationType;

  if (type === 'insert' && change.fullDocument) {
  const newUser = change.fullDocument;

  // Avoid duplicate inserts
  const exists = userArray.value.find(u => u._id === newUser._id);
  if (!exists) {
    userArray.value.unshift(newUser);
  }

  $q.notify({
    type: 'positive',
    message: `New user "${newUser.value}" created!`
  });

  } else if (type === 'update') {
    const updatedId = change.documentKey._id;
    const updatedFields = change.updateDescription?.updatedFields || {};

    const user = userArray.value.find(u => u._id === updatedId);
    if (user) {
      Object.assign(user, updatedFields);

      $q.notify({
        type: 'info',
        message: `User "${user.value}" updated!`
      });
    }

  } else if (type === 'delete') {
    const deletedId = change.documentKey._id;
    const index = userArray.value.findIndex(u => u._id === deletedId);
    if (index !== -1) {
      const deletedUser = userArray.value[index];
      userArray.value.splice(index, 1);

      $q.notify({
        type: 'warning',
        message: `User "${deletedUser.value}" deleted!`
      });
    }
  }
});


const fetchData = async () => {
  try {
    await storeTypes.getVehicleTypes();
    userArray.value = storeTypes.allVehicleTypes;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

onMounted(async () => {
  fetchData();
});

onBeforeUnmount(() => {
  socket.off('vehicle-type-change');
});

</script>

<style>
.vehicle-page {
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

.table-card :deep(.q-table tbody td) {
  border-bottom: none !important;
}

.create-btn {
  min-width: 160px;
  font-size: 11px;
  font-weight: 600;
}

.summary-card {
  width: 215px;
  min-height: 78px;
  border: 1px solid #d7dce1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
}

.summary-icon {
  color: #2f7d45;
  background: #e5f1e8;
  border-radius: 50%;
  padding: 10px;
  box-sizing: content-box;
}

.summary-label {
  color: #6c7885;
  font-size: 12px;
}

.summary-value {
  margin-top: 4px;
  font-size: 18px;
  font-weight: 600;
}

.search-input {
  width: 375px;
}

.reset-btn {
  min-width: 175px;
}

.modern-table {
  border-radius: 8px;
  overflow: hidden;
}

.modern-table :deep(thead tr),
.modern-table :deep(tbody tr),
.modern-table :deep(tbody td) {
  border-color: transparent !important;
}

.modern-table :deep(thead th) {
  font-size: 12px;
  font-weight: 500;
}

.textClass {
  font-size: 16px;
  font-weight: bold;
  color: #070000;
}

.textClasses {
  font-size: 15px;
  font-weight: bold;
  color: #01020e;
  margin-top: -18px;
}

.modern-table .q-table tbody td {
  border-bottom: none !important;
}

/* VEHICLE TYPE DIALOG */
.vehicle-dialog {
  width: 590px;
  max-width: 90vw;
  border-radius: 7px;
  overflow: hidden;
}

.vehicle-dialog-header {
  background: #287a43;
  color: white;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vehicle-dialog-title {
  font-size: 24px;
  font-weight: 600;
}

.vehicle-dialog-subtitle {
  margin-top: 4px;
  font-size: 14px;
}

.vehicle-dialog-body {
  padding: 22px 24px 55px;
}

.vehicle-dialog-actions {
  padding: 16px 24px;
  gap: 12px;
}

.vehicle-info-body {
  padding-bottom: 35px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 60px;
}

.info-grid > div:last-child {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 13px;
  color: #748091;
  margin-bottom: 6px;
}

.info-value {
  font-size: 15px;
  color: #333;
}
</style>
