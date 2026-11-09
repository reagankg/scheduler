<template>
  <div class="q-pa-md">
    <!-- Create Checklist Button -->
    <div class="q-px-xl q-mb-md">
      <q-btn
        color="dark"
        label="Create Checklist"
        icon="add"
        @click="openCreateDialog"
      />
    </div>

    <!-- Table of Checklists -->
    <div class="q-px-xl">
      <q-table
        flat
        bordered
        title="CHECKLISTS"
        :rows="userArray"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="onRowClick(props.row)"
            class="cursor-pointer"
          >
            <q-td key="title" :props="props">
              {{ props.row.title }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- Create Checklist Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 600px; max-height: 90vh;" class="scroll">
        <q-card-section class="bg-light-green-7 text-white">
          <div class="text-h6">Create New Checklist</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="submitForm" ref="userFormRef">
            <!-- Checklist title -->
            <q-input
              v-model="form.title"
              label="Checklist Title"
              outlined
              dense
              color="light-green"
              class="q-mb-md"
              :rules="[val => !!val || 'Checklist title is required']"
            />

            <!-- Sections -->
            <div
              v-for="(section, sIndex) in form.sections"
              :key="sIndex"
              class="q-mb-md q-pa-sm q-border rounded bg-grey-2"
            >
              <div class="row items-center q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="section.sectionTitle"
                    label="Section Title"
                    outlined
                    dense
                    color="primary"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    dense
                    round
                    color="red"
                    icon="delete"
                    @click="removeSection(sIndex)"
                  />
                </div>
              </div>

              <!-- Options -->
              <div
                v-for="(option, oIndex) in section.options"
                :key="oIndex"
                class="row items-center q-mb-xs"
              >
                <div class="col">
                  <q-input
                    v-model="option.label"
                    label="Option Label"
                    outlined
                    dense
                    color="secondary"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    dense
                    round
                    color="red"
                    icon="close"
                    @click="removeOption(sIndex, oIndex)"
                  />
                </div>
              </div>

              <!-- Add Option Button -->
              <q-btn
                flat
                dense
                color="secondary"
                icon="add"
                label="Add Option"
                @click="addOption(sIndex)"
              />
            </div>

            <!-- Add Section Button -->
            <q-btn
              flat
              dense
              color="primary"
              icon="add"
              label="Add Section"
              @click="addSection"
            />
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cancel" color="dark" @click="cancelButton" />
          <q-btn label="Submit" color="light-green-7" @click="submitForm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Checklist View Dialog -->
    <q-dialog v-model="inception" persistent>
      <q-card style="width: 400px; max-height: 90vh;" class="scroll">
        <q-card-section>
          <div class="text-h6">{{ infoUser.title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div
            v-for="(section, index) in infoUser.sections"
            :key="section._id || index"
            class="q-mb-md"
          >
            <!-- Numbered section title -->
            <div class="text-subtitle1 q-mb-sm">
              {{ index + 1 }}. {{ section.sectionTitle }}
            </div>

            <!-- Options list -->
            <q-list dense>
              <q-item
                v-for="option in section.options"
                :key="option._id || option.label"
                clickable
                tag="label"
              >
                <q-item-section avatar>
                  <q-checkbox v-model="option.isChecked" :label="option.label" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="amber" icon="edit" label="Edit" @click="openEditDialog"  />
          <q-btn color="red" icon="delete" label="Delete" @click="deleteList(infoUser._id)" />
          <q-btn label="Close" class="text-primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Checklist Edit Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 600px; max-height: 90vh;" class="scroll">
        <q-card-section class="bg-light-green-7 text-white">
          <div class="text-h6">Edit Checklist</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="submitEditForm" ref="editFormRef">
            <!-- Checklist Title -->
            <q-input
              v-model="editForm.title"
              label="Checklist Title"
              outlined
              dense
              color="primary"
              class="q-mb-md"
              :rules="[val => !!val || 'Checklist title is required']"
            />

            <!-- Sections -->
            <div
              v-for="(section, sIndex) in editForm.sections"
              :key="sIndex"
              class="q-mb-md q-pa-sm q-border rounded bg-grey-2"
            >
              <div class="row items-center q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="section.sectionTitle"
                    label="Section Title"
                    outlined
                    dense
                    color="secondary"
                  />
                </div>
                <div class="col-auto">
                  <q-btn dense round color="red" icon="delete" @click="editForm.sections.splice(sIndex,1)" />
                </div>
              </div>

              <!-- Options -->
              <div
                v-for="(option, oIndex) in section.options"
                :key="oIndex"
                class="row items-center q-mb-xs"
              >
                <div class="col">
                  <q-input
                    v-model="option.label"
                    label="Option Label"
                    outlined
                    dense
                    color="secondary"
                  />
                </div>
                <div class="col-auto">
                  <q-btn dense round color="red" icon="close" @click="section.options.splice(oIndex,1)" />
                </div>
              </div>

              <!-- Add Option -->
              <q-btn flat dense color="secondary" icon="add" label="Add Option" @click="section.options.push({label:'',isChecked:false})" />
            </div>

            <!-- Add Section -->
            <q-btn flat dense color="primary" icon="add" label="Add Section" @click="editForm.sections.push({sectionTitle:'',options:[]})" />
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Cancel" color="dark" @click="showEditDialog = false" />
          <q-btn label="Save" color="light-green-7" @click="submitEditForm" />
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
