<template>
  <div class="srf-page">

    <div style="margin-bottom: 18px;">

      <div class="dashboard-title">
        Approval Requests
      </div>

      <div class="dashboard-subtitle">
        Manage and monitor all approval requests
      </div>

    </div>

    <ApprovalSrfTable
      :dashboard-cards="dashboardCards"
      :loading="loading"
      :rows="approvalRows"
      v-model:search="search"
      v-model:filter-status="filterStatus"
      v-model:filter-coordinator="filterCoordinator"
      v-model:filter-technician="filterTechnician"
      v-model:filter-task="filterTask"
      v-model:date-range="dateRanges"

      :status-options="statusOptions"
      :coordinator-options="coordinatorOption"
      :technician-options="technicianOption"
      :task-options="taskOption"
      :date-range-options="dateRangeOptions"

      @search="runSearch"
      @reset-filters="resetFilters"
      @row-click="openApproval"
    />

    <!-- APPROVAL MODAL -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 1300px; max-height: 85vh;">

        <!-- LOADING OVERLAY -->
        <q-inner-loading :showing="modalLoading">
          <q-spinner-facebook size="50px" color="primary" />
        </q-inner-loading>

        <q-card-section class="bg-light-green-7">
          <div class="row items-center justify-between">
            <div class="text-h6 text-white">
              SRF Form for No. {{ formNo }}
            </div>

            <q-btn
              dense
              flat
              round
              icon="close"
              color="white"
              :disable="modalLoading"
              v-close-popup
            />
          </div>
        </q-card-section>

        <q-separator />

        <!-- FORM -->
        <q-card-section style="max-height: 65vh; overflow-y: auto;">
          <div class="row q-col-gutter-lg">

            <!-- LEFT -->
            <div class="col-6">
              <q-select
                dense outlined
                v-model="clientModel"
                :options="clientOptions"
                label="Client Name"
                use-input
                input-debounce="0"
                @filter="filterClientFn"
                class="q-mb-sm"
              />

              <q-input disable dense outlined v-model="location" label="Location" class="q-mb-sm" />
              <q-input disable dense outlined v-model="contact" label="Contact Person" class="q-mb-sm" />
              <q-input disable dense outlined v-model="number" label="Contact Number" class="q-mb-sm" />

              <q-select
                dense outlined
                v-model="technician"
                :options="technicianOptions"
                label="Technician"
                emit-value
                map-options
                class="q-mb-sm"
              />

              <q-input dense outlined v-model="new_scn" label="New SCN" class="q-mb-sm" />
              <q-input dense outlined v-model="new_min" label="New MIN" class="q-mb-sm" />
              <q-input dense outlined v-model="new_imei" label="New IMEI" class="q-mb-sm" />

              <q-select
                dense outlined
                v-model="gps_status"
                :options="gpsOptions"
                label="GPS Status"
                emit-value
                map-options
                class="q-mb-sm"
              />

              <q-select
                dense outlined
                v-model="plateNumber"
                use-input
                input-debounce="0"
                label="Plate Number"
                :options="vehicleOptions"
                @filter="filterVehicleFn"
                :disable="plateDisable"
                class="q-mb-sm"
              />

              <q-input dense outlined v-model="vehicleType" label="Vehicle Type" class="q-mb-sm" />
              <q-input dense outlined v-model="remarks" type="textarea" label="Remarks" class="q-mb-sm" />
              <q-input dense outlined v-model="date" label="Schedule Date" class="q-mb-sm" />
            </div>

            <!-- RIGHT -->
            <div class="col-6">
              <q-select
                dense outlined
                v-model="deviceModel"
                :options="devicesOptions"
                label="TID"
                use-input
                input-debounce="0"
                @filter="filterDeviceFn"
                :disable="deviceDisable"
                class="q-mb-sm"
              />

              <q-input dense outlined v-model="scn" label="SCN" class="q-mb-sm" />
              <q-input disable dense outlined v-model="min" label="MIN" class="q-mb-sm" />
              <q-input disable dense outlined v-model="imei" label="IMEI" class="q-mb-sm" />
              <q-input dense outlined v-model="deviceType" label="Device Type" class="q-mb-sm" />

              <q-input dense outlined v-model="technician_remarks" label="Technician Remarks" class="q-mb-sm" />

              <q-select
                dense outlined
                v-model="task"
                :options="taskOptions"
                label="Task"
                emit-value
                map-options
                class="q-mb-sm"
              />

              <q-input dense outlined v-model="concern" label="Client Concern" class="q-mb-sm" />
              <q-input dense outlined v-model="odometer" label="Odometer" class="q-mb-sm" />

              <q-select dense outlined v-model="advisor" :options="advisorOptions" label="Technical Advisor" emit-value map-options />
              <q-select dense outlined v-model="admin" :options="adminOptions" label="System Admin" emit-value map-options />
              <q-select dense outlined v-model="inventory" :options="inventoryOptions" label="Inventory" emit-value map-options />
              <q-select dense outlined v-model="serviceCoordinator" :options="coordinatorOptions" label="Service Coordinator" emit-value map-options />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- ACTIONS -->
        <q-card-actions align="right" class="q-gutter-sm q-px-md">
          <q-btn
            color="red"
            icon="delete"
            label="DELETE"
            :disable="modalLoading"
            @click="deleteRow(currentId.value)"
          />
          <q-btn
            color="primary"
            icon="check"
            label="APPROVED"
            :disable="modalLoading"
            @click="approve"
          />
          <q-btn
            color="amber"
            icon="close"
            label="FOR REVISION"
            :disable="modalLoading"
            @click="showRejectDialog = true"
          />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="showRejectDialog" persistent>
      <q-card style="width: 500px">

        <q-card-section class="bg-red text-white">
          <div class="text-h6">
            Revise SRF
          </div>
        </q-card-section>

        <q-card-section>

          <div class="text-subtitle2 q-mb-sm">
            Please provide the reason for cancelling this SRF.
          </div>

          <q-input
            v-model="cancelReason"
            type="textarea"
            outlined
            autogrow
            label="Revision notes:"
          />

        </q-card-section>

        <q-card-actions align="right">

          <q-btn
            flat
            label="Close"
            v-close-popup
          />

          <q-btn
            color="red"
            label="Proceed"
            @click="reject"
          />

        </q-card-actions>

      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { srfStore } from "../stores/srfStore";
import { Get } from "../utils/helper";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import ApprovalSrfTable from '../components/approval/ApprovalSrfTable.vue'

const $q = useQuasar();
const storeSrf = srfStore();
const loading = ref(false);
const search = ref("");
const router = useRouter();

const filterStatus = ref(null);
const filterCoordinator = ref(null);
const filterTechnician = ref(null);
const filterTask = ref(null);

const dateRanges = ref("All");

const dateRangeOptions = [
  "All",
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "This Year"
];

function openApproval(row) {
  if (!row?._id) {
    $q.notify({
      type: "negative",
      message: "SRF ID is missing"
    });

    return;
  }

  router.push({
    name: "approveSrf",
    params: {
      id: row._id
    }
  });
}

const statusOptions = [
  { label: 'On-going', value: 'On-going' },
  { label: 'Completed', value: 'Completed' },
  { label: 'For Approval', value: 'For Approval' },
  { label: 'For Revision', value: 'For Revision' },
  { label: 'Cancelled', value: 'Cancelled' }
];

const coordinatorOption = computed(() => {
  const values = userArray.value
    .map(row => row.serviceCoordinator)
    .filter(Boolean);

  return [...new Set(values)].map(value => ({
    label: value,
    value
  }));
});

const technicianOption = computed(() => {
  const values = userArray.value
    .map(row => row.technician)
    .filter(Boolean);

  return [...new Set(values)].map(value => ({
    label: value,
    value
  }));
});

const taskOption = computed(() => {
  const values = userArray.value
    .map(row => row.task)
    .filter(Boolean);

  return [...new Set(values)].map(value => ({
    label: value,
    value
  }));
});

/* ================= STATE ================= */
const showDialog = ref(false);
const modalLoading = ref(false);
const userArray = ref([]);
const formNo = ref("");
const currentId = ref("");

const showRejectDialog = ref(false);
const cancelReason = ref("");

const clientModel = ref(null);
const deviceModel = ref(null);
const plateNumber = ref(null);

const plateDisable = ref(false);
const deviceDisable = ref(true);

const scn = ref("");
const min = ref("");
const imei = ref("");
const deviceType = ref("");
const new_scn = ref("");
const new_min = ref("");
const new_imei = ref("");
const gps_status = ref("");
const vehicleType = ref("");
const remarks = ref("");
const date = ref("");
const location = ref("");
const contact = ref("");
const number = ref("");
const technician = ref("");
const technician_remarks = ref("");
const task = ref("");
const concern = ref("");
const odometer = ref("");
const advisor = ref("");
const admin = ref("");
const inventory = ref("");
const serviceCoordinator = ref("");

const clientOptions = ref([]);
const devicesOptions = ref([]);
const vehicleOptions = ref([]);

const userSummary = ref({});

const visibleColumns = ref([
  "clientTitle",
  'jobOrder_id',
  'device_id',
  "location",
  "technician",
  "date",
  "status_id"
])

const dashboardCards = computed(() => {
  const s = userSummary.value || {};

  return [
    {
      title: 'Total SRFs',
      value: (s.total ?? 0).toLocaleString(),
      icon: 'description',
      color: 'green'
    },
    {
      title: 'For Approval',
      value: (s.approval ?? 0).toLocaleString(),
      icon: 'hourglass_empty',
      color: 'amber'
    },
    {
      title: 'For Revision',
      value: (s.revision ?? 0).toLocaleString(),
      icon: 'refresh',
      color: 'deep-purple'
    },
    {
      title: 'Ongoing',
      value: (s.ongoing ?? 0).toLocaleString(),
      icon: 'monitor_heart',
      color: 'primary'
    },
    {
      title: 'Completed',
      value: (s.completed ?? 0).toLocaleString(),
      icon: 'check',
      color: 'green'
    },
    {
      title: 'Cancelled',
      value: (s.cancelled ?? 0).toLocaleString(),
      icon: 'close',
      color: 'red'
    }
  ];
});

/* ================= TABLE ================= */
const columns = [
  { name: "clientTitle", label: "CLIENT NAME", field: "clientTitle", align: "left" },
  { name: "jobOrder_id", label: "SRF No", field: "jobOrder_id", align: "left" },
  { name: "device_id", label: "TID", field: "device_id", align: "left" },
  { name: "location", label: "LOCATION", field: "location", align: "left" },
  { name: "technician", label: "TECHNICIAN", field: "technician", align: "left" },
  { name: "date", label: "DATE", field: "date", align: "left" },
  { name: "status_id", label: "STATUS", field: "status_id", align: "left" }
];


/* ================= NORMALIZER ================= */
const normalizeClientId = (client_id) => {
  if (!client_id) return null;
  if (typeof client_id === "object" && client_id.value) return client_id;
  if (typeof client_id === "string") {
    const found = storeSrf.allClients.find(c => c.name === client_id);
    return found ? { label: found.name, value: found._id } : { label: client_id, value: null };
  }
  return null;
};

const resetSearch = async () => {
  try {
    search.value = "";            // clear input

    // reload original data
    await storeSrf.getAllJobOrders();

    // rebuild table like initial load
    userArray.value = storeSrf.allJobOrders
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  } catch (err) {
    console.error("Reset search failed:", err);
  }
};

const runSearch = async () => {
  loading.value = true
  try {
    // Search is handled locally by approvalRows, against the loaded Job Orders.
    // Do not call the SRF-specific search endpoint here.
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

/* ================= MODAL ================= */
async function openModal(row) {
  modalLoading.value = true;
  showDialog.value = true;

  try {
    currentId.value = row._id;
    formNo.value = row.srf_id;

    if (!storeSrf.allClients.length) {
      await storeSrf.getClients();
    }

    clientOptions.value = storeSrf.allClients.map(c => ({
      label: c.name,
      value: c._id
    }));

    clientModel.value = normalizeClientId(row.client_id);

    const client = storeSrf.allClients.find(
      c => c._id === clientModel.value?.value
    );

    if (client) {
      location.value = client.location || "";
      contact.value = client.contact_person || "";
      number.value = client.contact_no || "";

      await storeSrf.getSRFVehiclesFromBackend(client.client_Id);

      devicesOptions.value = storeSrf.backendVehicles.map(v => ({
        label: v.username,
        value: v.username
      }));
      vehicleOptions.value = storeSrf.backendVehicles.map(v => ({
        label: v.name,
        value: v.name
      }));

      deviceDisable.value = false;
      plateDisable.value = false;
    }

    deviceModel.value = row.device_id ? { label: row.device_id, value: row.device_id } : null;
    plateNumber.value = row.plateNumber ? { label: row.plateNumber, value: row.plateNumber } : null;

    scn.value = row.scn || "";
    min.value = row.min || "";
    imei.value = row.imei || "";
    deviceType.value = row.deviceType || "";
    new_scn.value = row.new_scn || "";
    new_min.value = row.new_min || "";
    new_imei.value = row.new_imei || "";
    gps_status.value = row.gps_status || "";
    vehicleType.value = row.vehicleType || "";
    remarks.value = row.remarks || "";
    date.value = row.date || "";
    technician.value = row.technician || "";
    technician_remarks.value = row.technician_remarks || "";
    task.value = row.task || "";
    concern.value = row.concern || "";
    odometer.value = row.odometer || "";
    advisor.value = row.advisor || "";
    admin.value = row.admin || "";
    inventory.value = row.inventory || "";
    serviceCoordinator.value = row.serviceCoordinator || "";

  } finally {
    modalLoading.value = false;
  }
}

/* ================= ACTIONS ================= */
async function approve() {
  if (!clientModel.value?.value) {
    $q.notify({ type: "negative", message: "Client is required" });
    return;
  }

  await storeSrf.updateSRFStatus(currentId.value, {
    status_id: "Approved",
    client_id: clientModel.value,
    device_id: deviceModel.value?.value || "",
    plateNumber: plateNumber.value?.value || "",
    scn: scn.value,
    min: min.value,
    imei: imei.value,
    deviceType: deviceType.value,
    new_scn: new_scn.value,
    new_min: new_min.value,
    new_imei: new_imei.value,
    gps_status: gps_status.value,
    vehicleType: vehicleType.value,
    remarks: remarks.value,
    date: date.value ? new Date(date.value).toISOString() : "",
    location: location.value,
    contact: contact.value,
    number: number.value,
    technician: technician.value,
    technician_remarks: technician_remarks.value,
    task: task.value,
    concern: concern.value,
    odometer: odometer.value,
    advisor: advisor.value,
    admin: admin.value,
    inventory: inventory.value,
    serviceCoordinator: serviceCoordinator.value
  });

  showDialog.value = false;
  await loadData();
  $q.notify({ type: "positive", message: "SRF Approved" });
}

async function deleteRow(id) {
  if (!id) return;

  $q.dialog({
    title: "Delete SRF",
    message: "Are you sure you want to delete this SRF?",
    cancel: true,
    persistent: true
  }).onOk(async reason => {
    await storeSrf.deleteSRF(id, reason);
    showDialog.value = false;
    await loadData();
    $q.notify({ type: "positive", message: "SRF deleted" });
  });
}

// async function reject() {
//   await storeSrf.updateSRFStatus(currentId.value, { status_id: "Cancelled" });
//   showDialog.value = false;
//   await loadData();
// }

async function reject() {

  if (!cancelReason.value.trim()) {
    $q.notify({
      type: "negative",
      message: "Cancellation reason is required."
    });
    return;
  }

  await storeSrf.updateSRFStatus(currentId.value, {
    status_id: "For Revision",
    notes: cancelReason.value,
    withNotes: true
  });

  cancelReason.value = "";
  showRejectDialog.value = false;
  showDialog.value = false;

  await loadData();

  $q.notify({
    type: "positive",
    message: "SRF For Revision."
  });
}


/* ================= LOAD ================= */
async function loadData() {
  loading.value = true;

  try {
    await storeSrf.getAllJobOrders();
    await storeSrf.getClients();
    userSummary.value = storeSrf.allJobOrderSummary;
    userArray.value = storeSrf.allJobOrders
      .filter(srf => srf.status_id?.toLowerCase() !== 'draft')
      .sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
  } finally {
    loading.value = false;
  }
}

const matchesDateRange = (date) => {
  if (!date) return false;

  const rowDate = new Date(date);
  const today = new Date();

  switch (dateRanges.value) {
    case "Today":
      return (
        rowDate.getFullYear() === today.getFullYear() &&
        rowDate.getMonth() === today.getMonth() &&
        rowDate.getDate() === today.getDate()
      );

    case "Yesterday": {
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date(yesterday);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return rowDate >= yesterday && rowDate < tomorrow;
    }

    case "This Week": {
      const start = new Date(today);
      start.setHours(0, 0, 0, 0);
      start.setDate(today.getDate() - today.getDay());

      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      return rowDate >= start && rowDate < end;
    }

    case "This Month":
      return (
        rowDate.getFullYear() === today.getFullYear() &&
        rowDate.getMonth() === today.getMonth()
      );

    case "This Year":
      return rowDate.getFullYear() === today.getFullYear();

    default:
      return true;
  }
};


const approvalRows = computed(() => {
  return userArray.value.filter(row => {

    // Pending never appears in Approval
    if (row.status_id?.toLowerCase() === 'pending') {
      return false;
    }

    // Status
    if (
      filterStatus.value &&
      row.status_id !== filterStatus.value.value
    ) {
      return false;
    }

    // Coordinator
    if (
      filterCoordinator.value &&
      row.serviceCoordinator !== filterCoordinator.value.value
    ) {
      return false;
    }

    // Technician
    if (
      filterTechnician.value &&
      row.technician !== filterTechnician.value.value
    ) {
      return false;
    }

    // Task
    if (
      filterTask.value &&
      row.task !== filterTask.value.value
    ) {
      return false;
    }

    // Date
    if (
      dateRanges.value &&
      dateRanges.value !== 'All' &&
      !matchesDateRange(row.date)
    ) {
      return false;
    }

    // Search
    if (search.value) {
      const keyword = search.value.toLowerCase();

      const searchable = [
        row.jobOrder_id,
        row.clientTitle,
        row.device_id,
        row.location,
        row.technician,
        row.serviceCoordinator,
        row.task,
        row.created_by,
        row.status_id
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(keyword)) {
        return false;
      }
    }

    return true;
  });
});

const resetFilters = () => {
  search.value = "";
  filterStatus.value = null;
  filterCoordinator.value = null;
  filterTechnician.value = null;
  filterTask.value = null;
  dateRanges.value = "All";
};

onMounted(loadData);

/* ================= WATCH ================= */
watch(deviceModel, val => {
  if (!val?.value) return;

  const device = storeSrf.backendVehicles.find(
    v => String(v.username) === String(val.value)
  );
  if (!device) return;

  scn.value = device.scn || "";
  min.value = device.devices?.[0]?.msisdn?.raw || "";
  imei.value = device.devices?.[0]?.imei || "";
  deviceType.value = device.devices?.[0]?.name || "";

  plateNumber.value = device.name
    ? { label: device.name, value: device.name }
    : null;
});
</script>

<style scoped>
.q-table th,
.q-table td {
  white-space: nowrap;
}

.dashboard-title{
    font-size:18px;
    font-weight:600;
    color:#2f2f2f;
    line-height:1.1;
}

.dashboard-subtitle{
    margin-top:4px;
    font-size:13px;
    color:#8b8b8b;
}

.srf-page{
  padding:2px;
  margin-top: -40px;
  margin-left: -14px;
}
</style>
