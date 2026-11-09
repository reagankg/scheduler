<template>
  <div class="check-page">
    <!-- Page Header -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="page-title">Checklists</div>
        <div class="page-subtitle">
          Manage and monitor all system checklists
        </div>
      </div>

      <q-btn
        color="green-8"
        icon="add"
        label="CREATE CHECKLIST"
        @click="openCreateDialog"
      />
    </div>

    <!-- Summary Card -->
    <div class="q-mb-md">
      <q-card
        flat
        bordered
        style="width: 215px;"
      >
        <q-card-section class="row items-center">
          <q-avatar
            color="green-7"
            text-color="white"
            icon="checklist"
          />

          <div class="q-ml-md">
            <div class="text-caption text-grey-7">
              Total Checklists
            </div>

            <div class="text-h6 text-weight-bold">
              {{ userArray.length }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Search / Filters -->
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Search checklists"
        style="width: 375px;"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn
        outline
        icon="restart_alt"
        label="RESET FILTERS"
        @click="search = ''"
      />
    </div>

    <!-- Checklist Table -->
    <q-table
      flat
      class="checklist-table"
      :rows="userArray"
      :columns="columns"
      :filter="search"
      row-key="_id"
      :rows-per-page-options="[5, 10, 20, 50]"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          @click="onRowClick(props.row)"
          class="cursor-pointer"
        >
          <q-td
            key="title"
            :props="props"
          >
            {{ props.row.title }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Create Checklist Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="checklist-create-modal">

        <!-- HEADER -->
        <q-card-section class="checklist-create-header">
          <div class="checklist-create-header-content">

            <div>
              <div class="checklist-create-title">
                Create Checklist
              </div>

              <div class="checklist-create-subtitle">
                Checklist Information
              </div>
            </div>

            <q-btn
              dense
              flat
              round
              icon="close"
              color="white"
              v-close-popup
            />

          </div>
        </q-card-section>

        <q-separator />

        <!-- CONTENT -->
        <q-card-section class="checklist-create-content">
          <q-form
            @submit.prevent="submitForm"
            ref="userFormRef"
          >

            <!-- Checklist Title -->
            <q-input
              v-model="form.title"
              label="Checklist Title"
              outlined
              dense
              color="green-8"
              class="checklist-title-input"
              :rules="[val => !!val || 'Checklist title is required']"
            />

            <!-- Sections -->
            <div
              v-for="(section, sIndex) in form.sections"
              :key="sIndex"
              class="checklist-create-section"
            >

              <!-- Section Header -->
              <div class="checklist-section-header">

                <div class="checklist-section-label">
                  Section {{ sIndex + 1 }}
                </div>

                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  color="red"
                  @click="removeSection(sIndex)"
                />

              </div>

              <!-- Section Title -->
              <q-input
                v-model="section.sectionTitle"
                label="Section Title"
                outlined
                dense
                color="green-8"
                class="checklist-field"
              />

              <!-- Options -->
              <div
                v-for="(option, oIndex) in section.options"
                :key="oIndex"
                class="checklist-option-row"
              >

                <q-input
                  v-model="option.label"
                  label="Option Label"
                  outlined
                  dense
                  color="green-8"
                  class="checklist-option-input"
                />

                <q-btn
                  flat
                  dense
                  round
                  icon="close"
                  color="red"
                  @click="removeOption(sIndex, oIndex)"
                />

              </div>

              <!-- Add Option -->
              <q-btn
                flat
                dense
                no-caps
                color="green-8"
                icon="add"
                label="ADD OPTION"
                class="checklist-add-btn"
                @click="addOption(sIndex)"
              />

            </div>

            <!-- Add Section -->
            <q-btn
              flat
              dense
              no-caps
              color="green-8"
              icon="add"
              label="ADD SECTION"
              class="checklist-add-section-btn"
              @click="addSection"
            />

          </q-form>
        </q-card-section>

        <q-separator />

        <!-- FOOTER -->
        <q-card-actions
          align="right"
          class="checklist-create-actions"
        >
          <q-btn
            flat
            no-caps
            color="red"
            icon="close"
            label="CANCEL"
            @click="cancelButton"
          />

          <q-btn
            unelevated
            no-caps
            color="green-8"
            icon="check"
            label="SAVE"
            @click="submitForm"
          />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- Checklist View Dialog -->
    <q-dialog v-model="inception" persistent>
      <q-card class="checklist-view-modal">

        <!-- HEADER -->
        <q-card-section class="checklist-modal-header">
          <div class="checklist-modal-header-content">

            <div>
              <div class="checklist-modal-title">
                {{ infoUser.title }}
              </div>

              <div class="checklist-modal-subtitle">
                Checklist Information
              </div>
            </div>

            <q-btn
              dense
              flat
              round
              icon="close"
              color="white"
              v-close-popup
            />

          </div>
        </q-card-section>

        <q-separator />

        <!-- CONTENT -->
        <q-card-section class="checklist-modal-content">

          <div
            v-for="(section, index) in infoUser.sections"
            :key="section._id || index"
            class="checklist-section"
          >

            <!-- SECTION TITLE -->
            <div class="checklist-section-title">
              {{ index + 1 }}. {{ section.sectionTitle }}
            </div>

            <!-- OPTIONS -->
            <q-list dense class="checklist-options">

              <q-item
                v-for="option in section.options"
                :key="option._id || option.label"
                clickable
                tag="label"
                class="checklist-option"
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="option.isChecked"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    {{ option.label }}
                  </q-item-label>
                </q-item-section>

              </q-item>

            </q-list>

          </div>

        </q-card-section>

        <q-separator />

        <!-- FOOTER -->
        <q-card-actions
          align="right"
          class="checklist-modal-actions"
        >
          <q-btn
            outline
            label="CLOSE"
            color="grey-8"
            v-close-popup
          />

          <q-btn
            unelevated
            color="amber"
            icon="edit"
            label="EDIT"
            @click="openEditDialog"
          />

          <q-btn
            unelevated
            color="red"
            icon="delete"
            label="DELETE"
            @click="deleteList(infoUser._id)"
          />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <!-- Checklist Edit Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card class="checklist-create-modal">

        <!-- Header -->
        <q-card-section class="checklist-create-header">
          <div>
            <div class="checklist-create-title">Edit Checklist</div>
            <div class="checklist-create-subtitle">
              Checklist Information
            </div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            class="checklist-create-close"
            @click="showEditDialog = false"
          />
        </q-card-section>

        <!-- Content -->
        <q-card-section class="checklist-create-content">
          <q-form
            @submit.prevent="submitEditForm"
            ref="editFormRef"
          >

            <!-- Checklist Title -->
            <q-input
              v-model="editForm.title"
              label="Checklist Title"
              outlined
              dense
              class="q-mb-lg"
            />

            <!-- Sections -->
            <div
              v-for="(section, sIndex) in editForm.sections"
              :key="sIndex"
              class="checklist-section"
            >

              <!-- Section Header -->
              <div class="checklist-section-header">
                <div class="checklist-section-number">
                  {{ sIndex + 1 }}
                </div>

                <div class="checklist-section-label">
                  Section {{ sIndex + 1 }}
                </div>

                <q-btn
                  flat
                  round
                  dense
                  icon="delete_outline"
                  color="negative"
                  @click="removeSection(sIndex)"
                />
              </div>

              <!-- Section Title -->
              <q-input
                v-model="section.sectionTitle"
                label="Section Title"
                outlined
                dense
                class="q-mb-md"
              />

              <!-- Options -->
              <div
                v-for="(option, oIndex) in section.options"
                :key="oIndex"
                class="checklist-option-row"
              >
                <q-input
                  v-model="option.label"
                  :label="`Option ${oIndex + 1}`"
                  outlined
                  dense
                  class="col"
                />

                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  color="negative"
                  @click="removeOption(sIndex, oIndex)"
                />
              </div>

              <!-- Add Option -->
              <q-btn
                flat
                no-caps
                icon="add"
                label="Add Option"
                class="checklist-add-option"
                @click="addOption(sIndex)"
              />
            </div>

            <!-- Add Section -->
            <q-btn
              unelevated
              no-caps
              icon="add"
              label="Add Section"
              class="checklist-add-section"
              @click="addSection"
            />

          </q-form>
        </q-card-section>

        <!-- Footer -->
        <q-card-actions class="checklist-create-footer">
          <q-btn
            flat
            no-caps
            label="CANCEL"
            class="checklist-cancel-btn"
            @click="showEditDialog = false"
          />

          <q-btn
            unelevated
            no-caps
            icon="check"
            label="SAVE"
            class="checklist-save-btn"
            @click="submitEditForm"
          />
        </q-card-actions>

      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import socket from '../plugins/socket';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { srfStore } from '../stores/srfStore.js';
import { useQuasar } from 'quasar';

const userArray = ref([]);
const $q = useQuasar();
const storeCheck = srfStore();

const showEditDialog = ref(false)

const showDialog = ref(false);
const userFormRef = ref(null);
const inception = ref(false);
const infoUser = ref({});
const editForm  = ref({});

const getFirtsName = localStorage.getItem('firstName');
const getLastName = localStorage.getItem('lastName');

const openEditDialog = () => {
  showEditDialog.value = true
  inception.value = false
}

const editFormRef = ref(null)

const submitEditForm = async () => {
  const valid = await editFormRef.value.validate()
  if (!valid) {
    $q.notify({ type: 'negative', message: 'Please fill out all required fields.' })
    return
  }

  try {
    await storeCheck.updateChecking(editForm.value._id, editForm.value)
    showEditDialog.value = false
    $q.notify({ type: 'positive', message: 'Checklist updated successfully!' })
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to update checklist.' })
  }
}

const form = ref({
  title: '',
  sections: [],
  remarks: ''
});

const columns = [
  {
    name: 'title',
    align: 'center',
    label: 'CHECKLIST TITLE',
    field: 'title',
    sortable: false,
  },
];

const openCreateDialog = () => {
  form.value = { title: '', sections: [] };
  showDialog.value = true;
};

const cancelButton = async () => {
  showDialog.value = false;
}

// Add & Remove Section
const addSection = () => {
  form.value.sections.push({
    sectionTitle: '',
    options: [],
  });
};

const removeSection = (index) => {
  form.value.sections.splice(index, 1);
};

// Add & Remove Option
const addOption = (sectionIndex) => {
  form.value.sections[sectionIndex].options.push({
    label: '',
    isChecked: false,
  });
};

const removeOption = (sectionIndex, optionIndex) => {
  form.value.sections[sectionIndex].options.splice(optionIndex, 1);
};

const onRowClick = (row) => {
  infoUser.value = row;
  editForm.value = row;
  inception.value = true;
};

const submitForm = async () => {
  const valid = await userFormRef.value.validate();
  if (!valid) {
    $q.notify({
      type: 'negative',
      message: 'Please fill out all required fields.',
    });
    return;
  }
  form.value.remarks = ''
  form.value.created_by = `${getFirtsName} ${getLastName}`;
  try {
    await storeCheck.createChecklist(form.value);
    showDialog.value = false;
    $q.notify({
      type: 'positive',
      message: 'Checklist created successfully!',
    });
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create checklist. Please try again.',
    });
  }
};

const deleteList = async (id) => {
  if (!id) return;
  try {
    $q.dialog({
      title: 'Delete Checklist',
      message: 'Are you sure you want to delete it? If yes.. Provide a reason for deletion',
      prompt: { type: 'textarea' },
      cancel: true,
      persistent: true
    }).onOk(async reason => {
      await storeCheck.deleteChecklist(id, reason);
      inception.value = false;
      $q.notify({ type: 'positive', message: 'Checklist deleted!' });
    })

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to delete checklist.',
    });
  }
};

socket.on('check-change', (change) => {
  const type = change.operationType;
  if (type === 'insert' && change.fullDocument) {
    const newUser = change.fullDocument;
    if (!userArray.value.find((u) => u._id === newUser._id)) {
      userArray.value.unshift(newUser);
    }
  } else if (type === 'update') {
    const updatedId = change.documentKey._id;
    const updatedFields = change.updateDescription?.updatedFields || {};
    const user = userArray.value.find((u) => u._id === updatedId);
    if (user) Object.assign(user, updatedFields);
  } else if (type === 'delete') {
    const deletedId = change.documentKey._id;
    const index = userArray.value.findIndex((u) => u._id === deletedId);
    if (index !== -1) userArray.value.splice(index, 1);
  }
});

const fetchData = async () => {
  try {
    await storeCheck.getAllChecklist();
    userArray.value = storeCheck.allCheck;
  } catch (error) {
    console.error('Error fetching checklists:', error);
  }
};

onMounted(fetchData);
onBeforeUnmount(() => socket.off('check-change'));
</script>

<style scoped>
.check-page {
  margin-top: -36px;
  margin-left: -12px;
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

.checklist-view-modal {
  width: 620px;
  max-width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.checklist-modal-header {
  background: #1f9d45;
  color: white;
  padding: 20px 22px 18px;
}

.checklist-modal-header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.checklist-modal-title {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.15;
  color: white;
}

.checklist-modal-subtitle {
  margin-top: 7px;
  font-size: 14px;
  color: white;
}

.checklist-modal-content {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 24px 22px;
}

.checklist-section {
  margin-bottom: 24px;
}

.checklist-section:last-child {
  margin-bottom: 0;
}

.checklist-section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #222;
}

.checklist-options {
  padding-left: 18px;
}

.checklist-option {
  min-height: 42px;
  padding: 4px 0;
}

.checklist-option .q-item__section--avatar {
  min-width: 40px;
  padding-right: 4px;
}

.checklist-option .q-item__label {
  font-size: 15px;
  color: #222;
}

.checklist-modal-actions {
  padding: 12px 22px;
}

.checklist-create-modal {
  width: 620px;
  max-width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
}

.checklist-create-header {
  background: #1f9d45;
  color: white;
  padding: 20px 22px 18px;
}

.checklist-create-header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.checklist-create-title {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.15;
}

.checklist-create-subtitle {
  margin-top: 7px;
  font-size: 14px;
}

.checklist-create-content {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 22px;
}

.checklist-title-input {
  margin-bottom: 22px;
}

.checklist-create-section {
  padding: 16px;
  margin-bottom: 18px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.checklist-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.checklist-section-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.checklist-field {
  margin-bottom: 12px;
}

.checklist-option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.checklist-option-input {
  flex: 1;
}

.checklist-add-btn {
  margin-top: 2px;
}

.checklist-add-section-btn {
  margin-top: 2px;
}

.checklist-create-actions {
  padding: 12px 22px;
}

.checklist-create-modal {
  width: 700px;
  max-width: 95vw;
  max-height: 90vh;
  border-radius: 14px;
  overflow: hidden;
}

.checklist-create-header {
  background: #2e7d32;
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.checklist-create-title {
  font-size: 20px;
  font-weight: 600;
}

.checklist-create-subtitle {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 3px;
}

.checklist-create-close {
  color: white;
}

.checklist-create-content {
  padding: 24px;
  max-height: 65vh;
  overflow-y: auto;
}

.checklist-section {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fafafa;
}

.checklist-section-header {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}

.checklist-section-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  margin-right: 10px;
}

.checklist-section-label {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #424242;
}

.checklist-option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.checklist-add-option {
  color: #2e7d32;
  font-size: 13px;
}

.checklist-add-section {
  width: 100%;
  border: 1px dashed #bdbdbd;
  border-radius: 8px;
  color: #2e7d32;
  padding: 10px;
}

.checklist-create-footer {
  padding: 14px 24px;
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
  gap: 8px;
}

.checklist-cancel-btn {
  color: #c62828;
  font-weight: 600;
}

.checklist-save-btn {
  background: #2e7d32;
  color: white;
  font-weight: 600;
  padding: 8px 18px;
}

.checklist-table .q-table tbody td {
  border-bottom: none !important;
}
</style>
