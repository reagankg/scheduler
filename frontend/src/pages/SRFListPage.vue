<template>
  <div class="q-pa-md">
    <div class="q-px-xl">
      <q-table
        flat bordered
        title="SRF List"
        :rows="userArray"
        :columns="columns"
        row-key="_id"
      >
        <template v-slot:body="props">
          <q-tr :props="props" @click="onRowClick(props.row)" class="cursor-pointer">
            <q-td key="status_id" :props="props">
              {{ props.row.status_id }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { srfStore } from '../stores/srfStore.js';

const storeSrf = srfStore();
const userArray = ref([]);

const columns = [
  {
    name: 'status_id',
    align: 'center',
    label: 'Status',
    field: 'status_id',
    sortable: false
  }
]

onMounted(async () => {
  await storeSrf.getAllSRF();
  if (storeSrf.allSRF.length === 0) {
  } else {
    userArray.value = storeSrf.allSRF;
  }


});
</script>
