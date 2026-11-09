<template>
  <div class="approval-srf-table">

    <!-- KPI CARDS -->
    <div
      class="row q-col-gutter-md q-mb-lg"
      style="margin-bottom: 10px;"
    >
      <div
        v-for="card in dashboardCards"
        :key="card.title"
        class="col-12 col-sm-6 col-md-2"
      >
        <q-card
          flat
          bordered
          class="dashboard-card"
        >
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

      <!-- Search -->
      <div class="col-12 col-md-3">
        <q-input
          dense
          outlined
          :model-value="search"
          placeholder="Search"
          debounce="400"
          @update:model-value="value => emit('update:search', value)"
        >
          <template #append>
            <q-icon
              name="search"
              class="cursor-pointer"
              @click="emit('search')"
            />
          </template>
        </q-input>
      </div>

      <!-- Status -->
      <div class="col-6 col-md-1">
        <q-select
          dense
          outlined
          label="Status"
          :model-value="filterStatus"
          :options="statusOptions"
          @update:model-value="value => emit('update:filterStatus', value)"
        />
      </div>

      <!-- Coordinator -->
      <div class="col-6 col-md-1">
        <q-select
          dense
          outlined
          label="Coordinator"
          :model-value="filterCoordinator"
          :options="coordinatorOptions"
          @update:model-value="value => emit('update:filterCoordinator', value)"
        />
      </div>

      <!-- Technician -->
      <div class="col-6 col-md-2">
        <q-select
          dense
          outlined
          label="Technician"
          :model-value="filterTechnician"
          :options="technicianOptions"
          @update:model-value="value => emit('update:filterTechnician', value)"
        />
      </div>

      <!-- Task -->
      <div class="col-6 col-md-1">
        <q-select
          dense
          outlined
          label="Task Type"
          :model-value="filterTask"
          :options="taskOptions"
          @update:model-value="value => emit('update:filterTask', value)"
        />
      </div>

      <!-- Date -->
      <div class="col-6 col-md-2">
        <q-select
          dense
          outlined
          label="Date Range"
          :model-value="dateRange"
          :options="dateRangeOptions"
          @update:model-value="value => emit('update:dateRange', value)"
        />
      </div>

      <!-- Reset -->
      <div class="col-auto">
        <q-btn
          outline
          color="grey-7"
          icon="restart_alt"
          label="Reset Filters"
          @click="emit('reset-filters')"
        />
      </div>
    </div>

    <!-- APPROVAL TABLE -->
    <q-table
      flat
      bordered
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="_id"
      class="srf-table"
      @row-click="handleRowClick"
    >
      <template #loading>
        <q-inner-loading showing>
          <q-spinner
            size="50px"
            color="light-green-7"
          />
        </q-inner-loading>
      </template>

      <template #no-data>
        <div class="full-width row flex-center q-pa-md text-grey">
          <q-spinner
            v-if="loading"
            size="40px"
            color="light-green-7"
          />
          <span v-else>No records found</span>
        </div>
      </template>

      <template #header="props">
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

      <template #body="props">
        <q-tr
          :props="props"
          class="cursor-pointer"
          @click="handleRowClick(null, props.row)"
        >
          <q-td key="jobOrder_id" :props="props">
            <div class="text-weight-bold text-subtitle2">
              {{ props.row.jobOrder_id }}
            </div>
          </q-td>

          <q-td key="client_id" :props="props">
            <div class="text-weight-medium">
              {{ props.row.clientTitle }}
            </div>

            <div class="text-caption text-grey-6">
              <q-icon
                name="place"
                size="12px"
                class="q-mr-xs"
              />
              {{ props.row.location || 'N/A' }}
            </div>
          </q-td>

          <q-td key="serviceCoordinator" :props="props">
            <div>
              <q-icon
                name="person"
                color="green"
                size="14px"
              />
              {{ props.row.serviceCoordinator }}
            </div>

            <div class="text-caption text-grey-6">
              Operations
            </div>
          </q-td>

          <q-td key="technician" :props="props">
            <div>
              <q-icon
                name="engineering"
                color="blue"
                size="14px"
              />
              {{ props.row.technician }}
            </div>

            <div class="text-caption text-grey-6">
              Field Technician
            </div>
          </q-td>

          <q-td key="created_by" :props="props">
            <div>
              <q-icon
                name="person"
                color="deep-purple"
                size="14px"
              />
              {{ props.row.created_by }}
            </div>

            <div class="text-caption text-grey-6">
              Author
            </div>
          </q-td>

          <q-td
            key="status_id"
            :props="props"
            class="text-center"
          >
            <q-chip
              dense
              class="status-chip"
              :class="statusClass(props.row.status_id)"
            >
              {{ props.row.status_id }}
            </q-chip>
          </q-td>

          <q-td key="date" :props="props">
            <q-icon
              name="event"
              size="13px"
              class="q-mr-xs"
            />
            {{ Get.date(props.row.date) }}
          </q-td>

          <q-td key="created" :props="props">
            <q-icon
              name="event"
              size="13px"
              class="q-mr-xs"
            />
            {{ Get.date(props.row.created_at) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { Get } from '../../utils/helper';

defineProps({
  dashboardCards: {
    type: Array,
    default: () => []
  },

  rows: {
    type: Array,
    default: () => []
  },

  loading: {
    type: Boolean,
    default: false
  },

  search: {
    type: String,
    default: ''
  },

  filterStatus: {
    default: null
  },

  filterCoordinator: {
    default: null
  },

  filterTechnician: {
    default: null
  },

  filterTask: {
    default: null
  },

  dateRange: {
    default: 'All'
  },

  statusOptions: {
    type: Array,
    default: () => []
  },

  coordinatorOptions: {
    type: Array,
    default: () => []
  },

  technicianOptions: {
    type: Array,
    default: () => []
  },

  taskOptions: {
    type: Array,
    default: () => []
  },

  dateRangeOptions: {
    type: Array,
    default: () => [
      'All',
      'Today',
      'Yesterday',
      'This Week',
      'This Month',
      'This Year'
    ]
  }
});

const emit = defineEmits([
  'update:search',
  'update:filterStatus',
  'update:filterCoordinator',
  'update:filterTechnician',
  'update:filterTask',
  'update:dateRange',
  'search',
  'reset-filters',
  'row-click'
]);

const columns = [
  {
    name: 'jobOrder_id',
    align: 'center',
    label: 'SRF No',
    field: 'jobOrder_id',
    sortable: false
  },
  {
    name: 'client_id',
    align: 'center',
    label: 'CLIENT NAME',
    field: 'clientTitle',
    sortable: false
  },
  {
    name: 'serviceCoordinator',
    align: 'center',
    label: 'SERVICE COORDINATOR',
    field: 'serviceCoordinator',
    sortable: false
  },
  {
    name: 'technician',
    align: 'center',
    label: 'TECHNICIAN',
    field: 'technician',
    sortable: false
  },
  {
    name: 'created_by',
    align: 'center',
    label: 'CREATED BY',
    field: 'created_by',
    sortable: false
  },
  {
    name: 'status_id',
    align: 'center',
    label: 'STATUS',
    field: 'status_id',
    sortable: false
  },
  {
    name: 'date',
    align: 'center',
    label: 'SCHEDULED DATE',
    field: row => Get.date(row.date),
    sortable: false
  },
];

const statusClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'status-approved';
    case 'For Approval':
      return 'status-for-approval';
    case 'On-going':
      return 'status-ongoing';
    case 'Completed':
      return 'status-completed';
    case 'For Revision':
      return 'status-revision';
    case 'Pending':
      return 'status-pending';
    case 'Cancelled':
      return 'status-cancelled';
    default:
      return 'status-default';
  }
};

const handleRowClick = (event, row) => {
  if (row) {
    emit('row-click', row);
  }
};
</script>

<style scoped>
.approval-srf-table {
  width: 100%;
}

.dashboard-card {
  min-height: 80px;
}

.card-title {
  font-size: 12px;
  color: #777;
}

.card-value {
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
}

.srf-table .q-table tbody tr td {
  border-bottom: none !important;
}

.status-chip {
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 8px;
  height: 22px;
}

.status-approved {
  background: #E8F8EC;
  color: #0da85a;
}

.status-for-approval {
  background: #FFF5D8;
  color: #D89B00;
}

.status-ongoing {
  background: #EAF2FF;
  color: #3B82F6;
}

.status-completed {
  background: #E7F8EC;
  color: #37A45A;
}

.status-revision {
  background: #F2E9FF;
  color: #7C4DFF;
}

.status-pending {
  background: #EFEFEF;
  color: #6D6D6D;
}

.status-cancelled {
  background: #FDECEC;
  color: #E53935;
}

.status-default {
  background: #ECECEC;
  color: #666;
}
</style>
