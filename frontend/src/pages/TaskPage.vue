<template>
  <div class="task-page">

    <!-- PAGE HEADER -->
    <div class="page-header">
      <div>
        <div class="page-title">Tasks</div>

        <div class="page-subtitle">
          Manage and monitor all system tasks
        </div>
      </div>

      <q-btn
        unelevated
        color="green-9"
        icon="add"
        size="sm"
        label="CREATE TASK"
        @click="showDialog = true"
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
            icon="task"
          />

          <div>
            <div class="stat-label">Total Tasks</div>

            <div class="stat-value">
              {{ userArray.length }}
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
        placeholder="Search tasks"
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

    <!-- TASK TABLE -->
    <q-card flat bordered class="table-card">

      <q-table
        flat
        :rows="filteredTasks"
        :columns="columns"
        row-key="_id"
        :rows-per-page-options="[5, 10, 20, 50]"
      >
        <template v-slot:body="props">
          <q-tr :props="props" @click="onRowClick(props.row)" class="cursor-pointer">
            <q-td key="value" :props="props">
              {{ props.row.value }}
            </q-td>
            <q-td key="created_at" :props="props">
              {{ props.row.created_at }}
            </q-td>
            <q-td key="created_by" :props="props">
              {{ props.row.created_by }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
    </div>
    <!-- CREATE TASK DIALOG -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="task-dialog">

        <q-card-section class="dialog-header">
          <div>
            <div class="dialog-title">Create Task</div>
            <div class="dialog-subtitle">Task Information</div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            class="dialog-close"
            @click="cancelButton"
          />
        </q-card-section>

        <q-card-section class="dialog-body">
          <q-form
            @submit.prevent="submitForm"
            ref="userFormRef"
          >
            <q-input
              v-model="form.value"
              label="Task Name"
              outlined
              :rules="[val => !!val || 'Task name is required']"
              class="dialog-input"
            />
          </q-form>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn
            outline
            label="CANCEL"
            class="cancel-action"
            @click="cancelButton"
          />

          <q-btn
            unelevated
            icon="check"
            label="SAVE"
            class="save-action"
            @click="submitForm"
          />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- EDIT TASK DIALOG -->
    <q-dialog v-model="editDialog" persistent>
      <q-card class="task-dialog">

        <q-card-section class="dialog-header">
          <div>
            <div class="dialog-title">Edit Task</div>
            <div class="dialog-subtitle">Update task information</div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            class="dialog-close"
            v-close-popup
          />
        </q-card-section>

        <q-card-section class="dialog-body">

          <q-form ref="editFormRef">
            <q-input
              v-model="editForm.value"
              label="Task Name"
              outlined
              :rules="[val => !!val || 'Task name is required']"
              class="dialog-input"
            />
          </q-form>

        </q-card-section>

        <q-card-actions class="dialog-actions">

          <q-btn
            outline
            label="CANCEL"
            class="cancel-action"
            v-close-popup
          />

          <q-btn
            unelevated
            icon="check"
            label="SAVE"
            class="save-action"
            @click="updateTask"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="inception" persistent>
      <q-card class="task-dialog task-info-dialog">

        <q-card-section class="dialog-header">
          <div>
            <div class="dialog-title">
              {{ infoUser.value || 'Task Information' }}
            </div>

            <div class="dialog-subtitle">
              Task Information
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            class="dialog-close"
            v-close-popup
          />
        </q-card-section>

        <q-card-section class="dialog-body">

          <div class="info-grid">

            <div class="info-item">
              <div class="info-label">Task Name</div>
              <div class="info-value">
                {{ infoUser.value || 'N/A' }}
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">Date Created</div>
              <div class="info-value">
                {{ infoUser.created_at || 'N/A' }}
              </div>
            </div>

            <div class="info-item">
              <div class="info-label">Created By</div>
              <div class="info-value">
                {{ infoUser.created_by || 'N/A' }}
              </div>
            </div>

          </div>

        </q-card-section>

        <q-card-actions class="dialog-actions">

          <q-btn
            outline
            label="CLOSE"
            class="close-action"
            v-close-popup
          />

          <q-btn
            unelevated
            icon="edit"
            label="EDIT"
            class="edit-action"
            @click="openEditDialog"
          />

          <q-btn
            unelevated
            icon="delete"
            label="DELETE"
            class="delete-action"
            @click="deleteTask(infoUser._id)"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>

</template>

<script setup>
import socket from '../plugins/socket';
import { onMounted, ref, watch, onBeforeUnmount, computed } from 'vue';
import { srfStore } from '../stores/srfStore.js';
import { useQuasar } from 'quasar';

const userArray = ref([]);
const search = ref('');
const $q = useQuasar();
const storeTask = srfStore();
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


const columns = [
  {
    name: 'value',
    align: 'center',
    label: 'TASK NAME',
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

const filteredTasks = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  if (!keyword) {
    return userArray.value;
  }

  return userArray.value.filter(task =>
    task.value?.toLowerCase().includes(keyword) ||
    task.created_by?.toLowerCase().includes(keyword)
  );
});

const resetSearch = () => {
  search.value = '';
};

const onRowClick = (row) => {
  infoUser.value = row;
  inception.value = true;
};

const cancelButton = async () => {
  showDialog.value = false;
  form.value.value = '';
}

const openEditDialog = () => {
  editForm.value = { ...infoUser.value }
  inception.value = false

  setTimeout(() => {
    editDialog.value = true
  }, 150)
}

const updateTask = async () => {
  const valid = await editFormRef.value.validate()

  if (!valid) return

  try {
    await storeTask.updateTask(editForm.value._id, {
      value: editForm.value.value
    })

    editDialog.value = false

    $q.notify({
      type: 'positive',
      message: 'Task updated successfully!'
    })

  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update task.'
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
    await storeTask.createTask(form.value);
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

const deleteTask = async (id) => {
  if (!id) {
    $q.notify({
      type: 'negative',
      message: 'No task selected to delete.'
    });
    return;
  }

  try {
    $q.dialog({
      title: 'Delete Task',
      message: 'Are you sure you want to delete it? If yes.. Provide a reason for deletion',
      prompt: { type: 'textarea' },
      cancel: true,
      persistent: true
    }).onOk(async reason => {
      await storeTask.deleteTask(id, reason);
      infoUser.value = {};
      inception.value = false;

      $q.notify({
        type: 'positive',
        message: 'Task deleted successfully!'
      });
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to delete task. Please try again.'
    });
  }
};

socket.on('task-change', (change) => {
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
    await storeTask.getAllTask();
    userArray.value = storeTask.allTasks;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

onMounted(async () => {
  fetchData();
});

onBeforeUnmount(() => {
  socket.off('user-change');
});

</script>

<style scoped>
.table {
  max-width: 600px
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

.task-page {
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

/* =========================
   UNIFIED DIALOG DESIGN
========================= */

.task-dialog {
  width: 590px;
  max-width: 90vw;
  border-radius: 6px;
  overflow: hidden;
}

/* GREEN HEADER */
.dialog-header {
  background: #278443;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}

.dialog-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.dialog-subtitle {
  margin-top: 6px;
  font-size: 14px;
  opacity: 0.9;
}

.dialog-close {
  color: white;
}

/* BODY */
.dialog-body {
  padding: 24px;
  min-height: 140px;
}

.dialog-input {
  width: 100%;
}

/* INFORMATION */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 48px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 13px;
  color: #748091;
}

.info-value {
  font-size: 15px;
  color: #2f2f2f;
}

/* ACTIONS */
.dialog-actions {
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.dialog-actions .q-btn {
  min-height: 38px;
  padding: 0 18px;
  font-weight: 600;
}

/* CLOSE */
.close-action {
  color: #555;
  border-color: #999;
}

/* CANCEL */
.cancel-action {
  color: #e74c3c;
  border-color: #e74c3c;
}

/* SAVE */
.save-action {
  background: white;
  color: #2d7a3f;
  border: 1px solid #4b9a5d;
}

/* EDIT */
.edit-action {
  background: #f39c12;
  color: white;
}

/* DELETE */
.delete-action {
  background: #ef4438;
  color: white;
}

/* MOBILE */
@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .dialog-title {
    font-size: 20px;
  }
}
</style>
