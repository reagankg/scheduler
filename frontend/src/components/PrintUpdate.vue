<template>
  <q-dialog v-model="localModel" persistent @hide="emit('update:toolbar', false)">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Update Status</div>
      </q-card-section>

      <q-card-section>
        <q-select
          outlined
          v-model="status"
          :options="statusOptions"
          label="Status"
          class="q-pb-md"
          color="light-green"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" @click="closeDialog" />
        <q-btn flat label="Update" @click="submitUpdate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { srfStore } from '../stores/srfStore';

const props = defineProps({
  toolbar: Boolean,
  updateObject: Object
});

const emit = defineEmits(['update:toolbar']);
const store = srfStore();

const localModel = ref(false);

const statusOptions = ref([
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]);

const status = ref(statusOptions.value[0]);

// Sync external prop to internal model
watch(() => props.toolbar, (val) => {
  localModel.value = val;

  if (val && props.updateObject?.status_id) {
    const current = statusOptions.value.find(opt => opt.value === props.updateObject.status_id);
    if (current) status.value = current;
  }
});

// Sync dialog close with parent
watch(localModel, (val) => {
  if (!val) emit('update:toolbar', false);
});

const closeDialog = () => {
  localModel.value = false;
};

const submitUpdate = async () => {
  try {
    const id = props.updateObject?._id;
    const newStatus = status.value.value;

    await store.updateSRFStatus(id, newStatus);
    await store.getAllSRF(); // Optional: Refresh list
    localModel.value = false;
  } catch (err) {
    console.error('Failed to update status:', err);
  }
};
</script>
