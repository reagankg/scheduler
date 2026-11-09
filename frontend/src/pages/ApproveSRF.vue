<template>
  <q-page class="create-srf-page">

    <CreateSRFSkeleton v-if="loading" />

    <div v-else class="page-container">

        <!-- Header -->
        <div class="row items-center justify-between q-mb-md">

            <div>

                <div class="page-title">
                  Approve Service Request Form
                </div>

                <div class="page-subtitle">
                    Approve an existing SRF
                </div>

            </div>

                    <!-- Buttons -->
        <div class="row justify-end q-gutter-sm">

            
          <q-btn
              unelevated
              class="action-btn btn-cancel"
              icon="close"
              @click="cancelForm"
              label="Cancel"
            />

            <q-btn
              v-show="status_id === 'For Approval'"
              unelevated
              class="action-btn btn-save"
              icon="check"
              label="APPROVED"
              @click="approveSRF"
            />

            <q-btn
              v-show="status_id === 'For Approval'"
              unelevated
              class="action-btn btn-revision"
              icon="close"
              label="FOR REVISION"
              @click="showRevisionDialog = true"
            />

        </div>

        </div>

        <div v-if="withNotes" class="workflow-banner revision-banner">

            <div class="workflow-title">
                <q-icon name="edit_note"/>
                Revision Notes
            </div>

            <div class="workflow-content">
                {{ notes }}
            </div>

        </div>

            <div v-if="withCancel" class="workflow-banner revision-banner">

            <div class="workflow-title">
                <q-icon name="edit_note"/>
                Cancellation Notes
            </div>

            <div class="workflow-content">
                {{ cancelNotes }}
            </div>

        </div>

        <!-- Service Information -->
        <q-card flat class="section-card q-mb-md">

            <q-card-section class="section-header">
                <q-icon
                name="description"
                class="section-icon"
                />

                <div class="section-title">
                1. Service Information
                </div>
            </q-card-section>

            <q-card-section class="section-body">

                <div class="row q-col-gutter-sm">

                <!-- SRF Number -->
                <div class="col-4">

                    <q-input
                        disable
                        class="compact-field"
                        dense
                        outlined
                        stack-label
                        hide-bottom-space
                        label="SRF Number"
                        v-model="SRFNo"
                    />

                </div>

                <!-- Schedule -->
                <div class="col-4">

                    <q-input
                        :disable="editDisable"
                        class="compact-field"
                        dense
                        outlined
                        stack-label
                        hide-bottom-space
                        label="Schedule Date"
                        v-model="date"
                    >

                    <template v-slot:prepend>

                        <q-icon name="event">

                        <q-popup-proxy cover>

                            <q-date
                            v-model="date"
                            mask="YYYY-MM-DD HH:mm"
                            />

                        </q-popup-proxy>

                        </q-icon>

                    </template>

                    <template v-slot:append>

                        <q-icon name="access_time">

                        <q-popup-proxy cover>

                            <q-time
                                v-model="date"
                                mask="YYYY-MM-DD HH:mm"
                                format24h
                            />

                        </q-popup-proxy>

                        </q-icon>

                    </template>

                    </q-input>

                </div>

                <!-- Status -->

                <div class="col-4">

                    <q-select
                        class="compact-field"
                        dense
                        outlined
                        stack-label
                        hide-bottom-space
                        label="Status"
                        v-model="status_id"
                        :options="statusOptions"
                    />

                </div>

                                <!-- Start Time-->
                <div class="col-4">

                    <q-input
                        disable
                        class="compact-field"
                        dense
                        outlined
                        stack-label
                        hide-bottom-space
                        label="Technician Start Time"
                        v-model="start_time"
                    />

                </div>

                <!-- End Time-->
                <div class="col-4">

                    <q-input
                        disable
                        class="compact-field"
                        dense
                        outlined
                        stack-label
                        hide-bottom-space
                        label="Technician End Time"
                        v-model="end_time"
                    />

                </div>

                </div>

                <div class="row q-col-gutter-sm q-mt-sm">



                </div>

            </q-card-section>

        </q-card>

        <!-- Client + Vehicle -->
        <div class="row q-col-gutter-md">

            <div class="col-12">

                <q-card class="section-card">

                <q-card-section class="section-header">
                    <q-icon
                    name="person"
                    class="section-icon"
                    />

                    <div class="section-title">
                    2. Client Information
                    </div>
                </q-card-section>

                <q-card-section class="section-body">

                    <div class="row q-col-gutter-sm">

                    <!-- Client -->
                    <div class="col-12">

                        <q-select
                        class="compact-field"
                        dense
                        outlined
                        stack-label
                        hide-bottom-space

                        v-model="client_id"

                        label="Client"

                        :options="clientOptions"

                        option-value="value"
                        option-label="label"

                        emit-value
                        map-options

                        use-input
                        input-debounce="0"

                        @filter="filterFn"

                        behavior="menu"

                        :disable="editDisable"

                        :error="validationErrors.client_id"
                        :error-message="'Client Name is required'"
                        >

                        <template #no-option>
                            <q-item>
                            <q-item-section class="text-grey">
                                No results
                            </q-item-section>
                            </q-item>
                        </template>

                        </q-select>

                    </div>

                    <!-- Location -->
                    <div class="col-12">

                        <q-input
                        class="compact-field"
                        outlined
                        dense
                        stack-label
                        hide-bottom-space

                        disable

                        v-model="location"

                        label="Location"
                        />

                    </div>

                    <!-- Contact -->
                    <div class="col-6">

                        <q-input
                        class="compact-field"
                        outlined
                        dense
                        stack-label
                        hide-bottom-space

                        disable

                        v-model="contact"

                        label="Contact Person"
                        />

                    </div>

                    <!-- Number -->
                    <div class="col-6">

                        <q-input
                        class="compact-field"
                        outlined
                        dense
                        stack-label
                        hide-bottom-space

                        disable

                        v-model="number"

                        label="Contact Number"
                        />

                    </div>


                    </div>

                </q-card-section>

                </q-card>

            </div>

            <div class="col-12">

                <q-card class="section-card">

                <q-card-section class="section-header">
                    <q-icon
                    name="directions_car"
                    class="section-icon"
                    />

                    <div class="section-title">
                    3. Vehicle / Device Information
                    </div>
                </q-card-section>

                <q-card-section class="section-body">

                  <div v-for="(srf, index) in srfItems" :key="`srf-${index}`" class="srf-item q-mb-md">
                    <div class="row items-center justify-between q-mb-sm">
                      <div class="srf-item-title">TID # {{ srf.device_id }}</div>
                      <!-- <q-btn
                        v-if="srfItems.length > 1 && !editDisable"
                        outline no-caps color="negative" class="srf-action-btn"
                        icon="delete" label="Remove SRF"
                        @click="srfItems.splice(index, 1)"
                      /> -->
                    </div>
                    <div class="row q-col-gutter-sm">
                      <div class="col-4">
                        <q-select class="compact-field" dense outlined stack-label hide-bottom-space
                          label="Task / Service" v-model="srf.task" :options="taskOption"
                          options-dense popup-content-class="wrap-options" :disable="editDisable" />
                      </div>
                      <div class="col-4">
                        <q-select class="compact-field" dense outlined stack-label hide-bottom-space
                          v-model="srf.device_id" label="TID" :options="devicesOptions"
                          use-input input-debounce="0" @filter="filterDeviceFn"
                          @update:model-value="onDeviceSelected(index, $event)" behavior="menu"
                          :disable="deviceDisable || editDisable" />
                      </div>
                      <div class="col-4">
                        <q-select class="compact-field" dense outlined stack-label hide-bottom-space
                          v-model="srf.plateNumber" label="Plate Number" :options="vehicleOptions"
                          use-input input-debounce="0" @filter="filterVehicleFn"
                          @update:model-value="onPlateSelected(index, $event)" behavior="menu"
                          :disable="editDisable" />
                      </div>
                      <div class="col-4">
                        <q-select class="compact-field" dense outlined stack-label hide-bottom-space
                          v-model="srf.vehicleType" label="Vehicle Type" :options="vehicleTypesOptions"
                          :disable="editDisable" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          disable v-model="srf.devicesTypes" label="GPS Type" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          disable v-model="srf.deviceType" label="Device Type" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          v-model="srf.odometer" label="Odometer" :disable="editDisable" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          v-model="srf.scn" label="SCN" :disable="editDisable" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          disable v-model="srf.min" label="MIN" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          disable v-model="srf.imei" label="IMEI" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          v-model="srf.new_scn" label="New SCN" :disable="editDisable" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          v-model="srf.new_min" label="New MIN" :disable="editDisable" />
                      </div>
                      <div class="col-4">
                        <q-input class="compact-field" dense outlined stack-label hide-bottom-space
                          v-model="srf.new_imei" label="New IMEI" :disable="editDisable" />
                      </div>
                      <div class="col-8">
                        <q-input class="compact-field" outlined dense stack-label hide-bottom-space
                          v-model="srf.technician_remarks" type="textarea" autogrow
                          label="Technician Remarks" :disable="editDisable" />
                      </div>
                    </div>

                    <!-- Checklist saved for this specific TID -->
                    <div class="tid-checklist-panel q-mt-md">
                      <div class="text-subtitle2 text-weight-bold q-mb-sm">
                        Checklist — TID # {{ srf.device_id || 'Not assigned' }}
                      </div>

                      <template v-if="Array.isArray(srf.checklist) && srf.checklist.length">
                        <q-markup-table dense flat bordered class="tid-checklist-table">
                          <thead>
                            <tr>
                              <th class="text-left">Task</th>
                              <th class="text-center">Done</th>
                              <th class="text-left">Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, checklistIndex) in srf.checklist" :key="`tid-${index}-check-${checklistIndex}`">
                              <td>{{ item.text || '—' }}</td>
                              <td class="text-center">{{ item.done ? 'Yes' : 'No' }}</td>
                              <td class="checklist-remark-cell">{{ item.remark || '—' }}</td>
                            </tr>
                          </tbody>
                        </q-markup-table>
                      </template>

                      <template v-else-if="Array.isArray(srf.checklistSections) && srf.checklistSections.length">
                        <div
                          v-for="(section, sectionIndex) in srf.checklistSections"
                          :key="section._id || `tid-${index}-section-${sectionIndex}`"
                          class="q-mb-md"
                        >
                          <div class="text-body2 text-weight-bold q-mb-xs">
                            {{ sectionIndex + 1 }}. {{ section.sectionTitle || section.title || 'Checklist Section' }}
                          </div>
                          <q-markup-table dense flat bordered class="tid-checklist-table">
                            <thead>
                              <tr>
                                <th class="text-left">Task</th>
                                <th class="text-center">Done</th>
                                <th class="text-left">Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(option, optionIndex) in (section.options || [])"
                                :key="option._id || `tid-${index}-section-${sectionIndex}-option-${optionIndex}`"
                              >
                                <td>{{ option.label || option.text || '—' }}</td>
                                <td class="text-center">{{ option.isChecked || option.done ? 'Yes' : 'No' }}</td>
                                <td class="checklist-remark-cell">{{ option.remark || section.remark || '—' }}</td>
                              </tr>
                            </tbody>
                          </q-markup-table>
                          <div v-if="section.remarks" class="text-caption q-mt-xs">
                            Remarks: {{ section.remarks }}
                          </div>
                        </div>
                      </template>

                      <div v-else class="text-caption text-grey-7">
                        No checklist saved for this TID.
                      </div>
                    </div>
                  </div>

                </q-card-section>

                </q-card>

            </div>

        </div>

        <q-card flat class="section-card q-mb-md">

        <q-card-section class="section-header">

            <q-icon
            name="groups"
            class="section-icon"
            />

            <div class="section-title">
            4. Personnel In Charge
            </div>

        </q-card-section>

        <q-card-section class="section-body">

            <div class="row q-col-gutter-sm">

            <!-- Technician -->
            <div class="col-12 col-md-4">

                <q-select
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space

                v-model="technician"

                label="Technician"

                :options="technicianOption"

                emit-value
                map-options

                :disable="editDisable"

                :error="validationErrors.technician"
                :error-message="'Technician is required'"
                />

            </div>

            <!-- Service Coordinator -->
            <div class="col-12 col-md-4">

                <q-select
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space

                v-model="serviceCoordinator"

                label="Service Coordinator"

                :options="coordinatorOption"
                :error="validationErrors.serviceCoordinator"
                :error-message="'Coordinator is required'"
                emit-value
                map-options

                :disable="editDisable"
                />

            </div>

            <!-- System Administrator -->
            <div class="col-12 col-md-4">

                <q-select
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space

                v-model="admin"

                label="System Administrator"

                :options="adminOption"

                emit-value
                map-options
                :error="validationErrors.admin"
                :error-message="'Admin is required'"
                :disable="editDisable"
                />

            </div>

            <!-- Technical Advisor -->
            <div class="col-12 col-md-4">

                <q-select
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space

                v-model="advisor"

                label="Technical Advisor"

                :options="advisorOption"

                emit-value
                map-options

                :disable="editDisable"
                />

            </div>



            <!-- Accounting / Inventory -->
            <div class="col-12 col-md-4">

                <q-select
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space

                v-model="inventory"

                label="Accounting / Inventory"

                :options="inventoryOption"

                emit-value
                map-options

                :disable="editDisable"
                />

            </div>

            <!-- Service Vehicle -->
            <div class="col-12 col-md-4">

                <q-select
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space

                v-model="serviceVehicle"

                label="Service Vehicle"

                :options="serviceVehicleOption"

                emit-value
                map-options

                :disable="editDisable"
                />

            </div>

            </div>

        </q-card-section>

        </q-card>

        <q-card flat class="section-card q-mb-md">

        <q-card-section class="section-header">

            <q-icon
            name="edit_note"
            class="section-icon"
            />

            <div class="section-title">
            5. Remarks
            </div>

        </q-card-section>

        <q-card-section class="section-body">

            <div class="row q-col-gutter-sm">

            <!-- Technician Remarks -->
            <div class="col-12 col-md-6">

                <q-input
                class="compact-field"
                outlined
                dense
                stack-label
                hide-bottom-space

                v-model="technician_remarks"

                type="textarea"
                autogrow

                label="Technician Remarks"

                :disable="editDisable"
                />

            </div>

            <!-- Client Concern -->
            <div class="col-12 col-md-6">

                <q-input
                class="compact-field"
                outlined
                dense
                stack-label
                hide-bottom-space

                v-model="concern"

                type="textarea"
                autogrow

                label="Client Concern"

                :disable="editDisable"
                />

            </div>

            </div>

        </q-card-section>

        </q-card>

        <q-card v-if="!hasPerTidChecklist" flat bordered class="q-mb-md">
            <q-card flat class="section-card">

              <q-card-section class="section-header">

                  <q-icon
                  name="checklist"
                  class="section-icon"
                  />

                  <div class="section-title">
                  6. Checklist
                  </div>

              </q-card-section>

                <q-card-section class="section-body">

                  <div class="row">
                    <div class="col-12 col-md-4">
                      <q-select
                        outlined
                        dense
                        v-model="checklist"
                        :options="checkOption"
                        label="Checklist"
                        :disable="editDisable"
                      />
                    </div>
                  </div>

                  <div
                    v-for="(section, index) in infoList.sections"
                    :key="section._id || index"
                    class="q-mt-lg"
                  >
                    <div class="text-subtitle2 text-weight-bold q-mb-sm">
                      {{ index + 1 }}. {{ section.sectionTitle }}
                    </div>

                    <q-list bordered separator dense>
                      <q-item
                        v-for="option in section.options"
                        :key="option._id || option.label"
                        dense
                        tag="label"
                        clickable
                        class="checklist-item"
                      >
                        <q-item-section avatar>
                          <q-checkbox
                            dense
                            size="sm"
                            v-model="option.isChecked"
                          />
                        </q-item-section>

                        <q-item-section class="text-body2">
                          {{ option.label }}
                        </q-item-section>
                      </q-item>
                    </q-list>

                  </div>

                </q-card-section>

            </q-card>
        </q-card>

    </div>
  </q-page>

  <!-- Print component -->
  <PrintSRF
    :printPage="printPage"
    :printObject="printObject"
    :clientText="clientText"
    :deviceText="deviceText"
    :Get="Get"
    @update:printPage="val => printPage = val"
  />
  <q-dialog v-model="showRevisionDialog" persistent>
    <q-card style="width: 500px">

      <q-card-section class="bg-red text-white">
        <div class="text-h6">
          Revise SRF
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">
          Please provide the reason for revision.
        </div>

        <q-input
          v-model="revisionReason"
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
          @click="reviseSRF"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Get } from '../utils/helper.js';
import PrintSRF from '../components/PrintSRF.vue';
import { authStore } from '../stores/authStore.js'
import { srfStore } from '../stores/srfStore'
import { userStore } from '../stores/userStore'
import { useQuasar } from 'quasar';
import { defaultChecklistTemplate } from '../utils/defaultChecklist'
import {
  toPHDateOnly,
  isNonWorkingHolidayPH,
  getHolidayNamePH
} from '../utils/phHolidays'
import CreateSRFSkeleton from 'components/CreateSRFSkeleton.vue'

const $q = useQuasar()
const SRFNo = ref('')
const start_time = ref('');
const end_time = ref('');
// hundreds of lines...
const route = useRoute();
const router = useRouter()
const editDisable = ref(false);
const editLoading = ref(false);
const vehiclesLoading = ref(false);
const loading = ref(false);
const storeSrf = srfStore();
const storeUser = userStore();
const storeAuth = authStore()
const showDialog = ref(false);
const alertMessage = ref(false);
const client_id = ref(null); // QSelect model: client id string (because emit-value)
const device_id = ref(null);
const srfItems = ref([{
  task: '', device_id: null, plateNumber: null, vehicleType: '',
  devicesTypes: '', deviceType: '', odometer: '', scn: '', min: '',
  imei: '', new_scn: '', new_min: '', new_imei: '', technician_remarks: '',
  checklistOption: 'default', checklist: [], checklistSections: []
}]);
const hasPerTidChecklist = computed(() => srfItems.value.some(item =>
  (Array.isArray(item.checklist) && item.checklist.length > 0) ||
  (Array.isArray(item.checklistSections) && item.checklistSections.length > 0)
));
const clients = ref([]);
const devices = ref([]);
const clientOptions = ref([]);
const devicesOptions = ref([]);
const vehicleOptions = ref([]);
const checkOption = ref(null);
const clientObject = ref({});
const devicesObject = ref({});
const location = ref('');
const contact = ref('');
const number = ref('');
const technician = ref('');
const task = ref('');
const concern = ref('');
const scn = ref('');
const min = ref('');
const imei = ref('');
const devicesTypes = ref('');
const new_scn = ref('');
const new_min = ref('');
const new_imei = ref('');
const clientClose = ref(true);
const advisor = ref('');
const admin = ref('');
const inventory = ref('');
const plateNumber = ref(null);
const vehicleType = ref('');
const date = ref(
  new Date()
    .toLocaleString('sv-SE', { timeZone: 'Asia/Manila' })
    .slice(0, 16)
);
const odometer = ref('');
const serviceCoordinator = ref('');
const gps_status = ref('');
const technician_remarks = ref('');
const remarks = ref('');
const serviceVehicle = ref('');
const printPage = ref(false);
const printObject = ref({});
const clientText = ref('');
const deviceText = ref('');
const checklist = ref({ label: 'Default', value: 'default' });
const infoList = ref({});
const NewClient = ref({});
const clientTitle = ref('');
const isEdit = ref(false);
const editingId = ref(null);
const printId = ref('');
const deviceType = ref('');
const deviceDisable = ref(true);
const plateDisable = ref(true);
const initializingForm = ref(false);
// --- Status refs ---
const status_id = ref('For Approval'); // default = Pending
const showRevisionDialog = ref(false);
const revisionReason = ref('');


const statusOptions = ref([
  { label: 'On-going', value: 'On-going' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'For Approval', value: 'For Approval' },
  { label: 'Cancelled', value: 'Cancelled' },
  { label: 'Approved', value: 'Approved' },
]);

const statusClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'status-approved'

    case 'For Approval':
      return 'status-for-approval'

    case 'On-going':
      return 'status-ongoing'

    case 'Completed':
      return 'status-completed'

    case 'For Revision':
      return 'status-revision'

    case 'Pending':
      return 'status-pending'

    case 'Cancelled':
      return 'status-cancelled'

    default:
      return 'status-default'
  }
}

const notes = ref('');
const withNotes = ref(false);

const cancelNotes = ref('');
const withCancel = ref(false);


const originalDate = ref(null);
const getFirtsName = localStorage.getItem('firstName');
const getLastName = localStorage.getItem('lastName');

// helper to normalize id shapes (string or { $oid })
const normalizeId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return id;
  if (typeof id === 'object' && id.$oid) return id.$oid;
  return String(id);
};

const resetForm = () => {
  client_id.value = null;
  device_id.value = null;
  clientObject.value = {};
  devicesObject.value = {};
  location.value = '';
  contact.value = '';
  number.value = '';
  technician.value = '';
  task.value = '';
  concern.value = '';
  scn.value = '';
  min.value = '';
  imei.value = '';
  deviceType.value = '';
  devicesTypes.value = '';
  new_scn.value = '';
  new_min.value = '';
  new_imei.value = '';
  plateNumber.value = null;
  vehicleType.value = '';
  odometer.value = '';
  date.value = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Manila' }).slice(0, 16);
  serviceCoordinator.value = '';
  // reset status to default
  status_id.value = 'For Approval';
  gps_status.value = '';
  technician_remarks.value = '';
  remarks.value = '';
  advisor.value = '';
  admin.value = '';
  inventory.value = '';
  clientClose.value = true;
  NewClient.value = {};
  clientTitle.value = '';

  isEdit.value = false;
  editingId.value = null;
};

// === populateFormFromSRF ===
const populateFormFromSRF = async (srf, preserveItems = false) => {
  if (!preserveItems) {
    srfItems.value = [{
      task: srf.task || '',
      device_id: srf.device_id ?? null,
      plateNumber: srf.plateNumber ? { label: srf.plateNumber, value: srf.plateNumber } : null,
      vehicleType: srf.vehicleType || '',
      devicesTypes: srf.devicesTypes || '',
      deviceType: srf.deviceType || '',
      odometer: srf.odometer || '',
      scn: srf.scn || '',
      min: srf.min || '',
      imei: srf.imei || '',
      new_scn: srf.new_scn || '',
      new_min: srf.new_min || '',
      new_imei: srf.new_imei || '',
      technician_remarks: srf.technician_remarks || ''
    }];
  }
  isEdit.value = true;

  editingId.value =
      normalizeId(srf._id) ||
      normalizeId(srf._id?.$oid) ||
      srf.srf_id ||
      null;

  printObject.value = srf;

  start_time.value = srf.start_time || '';
  end_time.value = srf.end_time || '';
  SRFNo.value = srf.srf_id;
  printId.value = srf._id;
  // client may be stored as { value, label } or plain id
  client_id.value = srf.client_id?.value || (srf.client_id && typeof srf.client_id === 'string' ? srf.client_id : null);
  clientTitle.value = srf.client_id?.label || srf.clientTitle || '';
  // device_id can be username string or object
  device_id.value = srf.device_id;
  notes.value = srf.notes || '';
  withNotes.value = srf.withNotes || false;
  cancelNotes.value = srf.cancelNotes || '';
  withCancel.value = srf.withCancel || false;
  scn.value = srf.scn || '';
  min.value = srf.min || '';
  imei.value = srf.imei || '';
  deviceType.value = srf.deviceType || '';
  devicesTypes.value = srf.devicesTypes || '';
  new_scn.value = srf.new_scn || '';
  new_min.value = srf.new_min || '';
  new_imei.value = srf.new_imei || '';
  plateNumber.value = srf.plateNumber ? { label: srf.plateNumber, value: srf.plateNumber } : null;
  vehicleType.value = srf.vehicleType || null;
  odometer.value = srf.odometer || '';
  serviceVehicle.value = srf.serviceVehicle || 'Personal';
  date.value = srf.date?.$date
    ? new Date(srf.date.$date)
        .toLocaleString('sv-SE', { timeZone: 'Asia/Manila' })
        .slice(0, 16)
    : (
        srf.date
          ? new Date(srf.date)
              .toLocaleString('sv-SE', { timeZone: 'Asia/Manila' })
              .slice(0, 16)
          : new Date()
              .toLocaleString('sv-SE', { timeZone: 'Asia/Manila' })
              .slice(0, 16)
      );
  serviceCoordinator.value = srf.serviceCoordinator || '';
  gps_status.value = srf.gps_status || '';
  technician_remarks.value = srf.technician_remarks || '';
  remarks.value = srf.remarks || '';
  advisor.value = srf.advisor || '';
  admin.value = srf.admin || '';
  inventory.value = srf.inventory || '';
  technician.value = srf.technician || '';
  task.value = srf.task || '';
  concern.value = srf.concern || '';
  location.value = srf?.location || '';
  contact.value = srf?.contact || '';
  number.value = srf?.number || '';

  checklist.value = srf.title
    ? { label: srf.title, value: srf.title, sections: srf.sections }
    : checklist.value;

  infoList.value = srf.sections
    ? { label: srf.title, sections: srf.sections }
    : infoList.value;

  // populate status if present (fallback to Pending)
  status_id.value = srf.status_id || 'For Approval';
};

const approveSRF = async () => {
  if (!editingId.value) return;

  try {
    await storeSrf.updateSRFStatus(editingId.value, {
      status_id: 'Approved'
    });

    status_id.value = 'Approved';

    $q.notify({
      type: 'positive',
      message: 'SRF Approved',
      position: 'top'
    });

    router.push('/approval');
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Failed to approve SRF',
      position: 'top'
    });
  }
};

const reviseSRF = async () => {
  if (!editingId.value) return;

  if (!revisionReason.value.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Revision reason is required.',
      position: 'top'
    });

    return;
  }

  try {
    await storeSrf.updateSRFStatus(editingId.value, {
      status_id: 'For Revision',
      notes: revisionReason.value,
      withNotes: true
    });

    showRevisionDialog.value = false;
    revisionReason.value = '';

    $q.notify({
      type: 'positive',
      message: 'SRF sent for revision.',
      position: 'top'
    });

    router.push('/approval');
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Failed to send SRF for revision.',
      position: 'top'
    });
  }
};

const isTechnicianDayOff = (technicianName, dateStr) => {
  if (!technicianName || !dateStr) return false
  const tech = storeUser.users.find(
    u => `${u.firstName} ${u.lastName}` === technicianName.value
  )

  if (!tech || !Array.isArray(tech.dayOff)) return false

  // 🔥 DATE-ONLY, PH TIMEZONE SAFE
  const dayOnly = toPHDateOnly(dateStr) // "YYYY-MM-DD"
  const [y, m, d] = dayOnly.split('-').map(Number)

  const weekday = new Date(y, m - 1, d, 12).getDay()
  return tech.dayOff.includes(weekday)
}

const confirmScheduleOverride = ({ title, message }) => {
  return new Promise(resolve => {
    $q.dialog({
      title,
      message,
      html: true,  
      cancel: true,
      persistent: true,
      ok: {
        label: 'Proceed Anyway',
        color: 'primary'
      },
      cancel: {
        label: 'Cancel',
        flat: true
      }
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false));
  });
};

const isTechnicianOnLeave = (technicianName, dateStr) => {
  if (!technicianName || !dateStr) return false

  const tech = storeUser.users.find(
    u => `${u.firstName} ${u.lastName}` === technicianName.value
  )

  if (!tech || !Array.isArray(tech.leaves)) return false

  const selectedDate = toPHDateOnly(dateStr) // YYYY-MM-DD

  return tech.leaves.some(leave => {
    if (!leave.startDate || !leave.endDate) return false
    return selectedDate >= leave.startDate && selectedDate <= leave.endDate
  })
}


const submitSRF = async (status) => {

  const safeVal = (v) => {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && 'value' in v) return v.value ?? '';
    return String(v);
  };

  const getPlateValue = (v) => {
    if (!v) return 'N/A';
    if (typeof v === 'string') return v;
    if (typeof v === 'object') return v.value || v.label || 'N/A';
    return String(v);
  };

  const errors = {
    client_id: !client_id.value,
    task: !task.value,
    date: !date.value,
    admin: !admin.value,
    serviceCoordinator: !serviceCoordinator.value,
    status_id: !status_id.value
  };

  validationErrors.value = errors;

  const hasError = Object.values(errors).some(Boolean);
  if (hasError) {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all required fields.',
      position: 'top'
    });

    setTimeout(() => {
      const firstErrorKey = Object.keys(errors).find(key => errors[key]);
      const el = document.querySelector(`[data-field="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    return;
  }

  const payload = {
    device_id: safeVal(device_id.value),
    scn: scn.value ?? '',
    min: min.value ?? '',
    imei: imei.value ?? '',
    deviceType: deviceType.value ?? '',
    clientTitle: NewClient.value.label || '',
    devicesTypes: devicesTypes.value ?? '',
    new_scn: new_scn.value ?? '',
    new_min: new_min.value ?? '',
    new_imei: new_imei.value ?? '',
    gps_status: safeVal(gps_status.value ?? gps_status),
    plateNumber: getPlateValue(plateNumber.value),
    vehicleType: safeVal(vehicleType.value ?? vehicleType),
    remarks: remarks.value ?? '',
    date: new Date(date.value.replace(' ', 'T') + ':00+08:00'),
    technician_remarks: technician_remarks.value ?? '',
    client_id: NewClient.value,
    location: location.value ?? '',
    contact: contact.value ?? '',
    number: number.value ?? '',
    technician: safeVal(technician.value ?? technician),
    task: safeVal(task.value ?? task),
    concern: concern.value ?? '',
    odometer: odometer.value ?? '',
    serviceVehicle: safeVal(serviceVehicle.value || 'Personal'),
    advisor: safeVal(advisor.value ?? advisor),
    admin: safeVal(admin.value ?? admin),
    inventory: safeVal(inventory.value ?? inventory),
    serviceCoordinator: safeVal(serviceCoordinator.value ?? serviceCoordinator),
    status_id: safeVal(status_id.value ?? status_id),
    title: infoList.value?.label,
  };
  if (infoList.value?.label === "Default") {

    payload.checklist = defaultChecklistTemplate.map(item => ({
      text: item.text,
      done: false,
      remark: ""
    }))

    payload.sections = []

  } else {

    payload.checklist = []
    payload.sections = infoList.value.sections || []

  }

  // CREATE ONLY
  if (!isEdit.value) {
    payload.created_by = `${getFirtsName} ${getLastName}`;
    payload.created_at = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Manila' });
  }

  // UPDATE ONLY
  if (isEdit.value) {
    payload.updated_by = `${getFirtsName} ${getLastName}`;
    payload.updated_at = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Manila' });
    payload.plateNumber = plateNumber.value.value
    delete payload.created_by;
    delete payload.created_at;
  }

  if (status === 'Pending') {
    payload.status_id = 'Pending';
  }

  if (status === 'For Approval') {
    payload.status_id = 'For Approval';
  }

  if (status === 'Update') {
    payload.status_id = status_id?.value?.value || status_id.value || 'For Approval';
  }

  // TECHNICIAN DAY OFF CHECK (only if technician exists)
  if (
    technician.value &&
    isTechnicianDayOff(technician.value, date.value)
  ) {
    const proceed = await confirmScheduleOverride({
      title: 'Technician Day Off',
      message: `
        <b>${technician.value.value}</b> is scheduled for a day off on this date.<br><br>
        You may still proceed if this work is urgent or pre-approved.
      `
    });

    if (!proceed) return;
  }

  // TECHNICIAN LEAVE CHECK
  if (
    technician.value &&
    isTechnicianOnLeave(technician.value, date.value)
  ) {
    const proceed = await confirmScheduleOverride({
      title: 'Technician Leave',
      message: `
        <b>${technician.value.value}</b> is currently on leave during this date.<br><br>
        Please confirm if scheduling should proceed.
      `
    })

    if (!proceed) return
  }

  // SAVE LOGIC EXTRACTED
  const proceedSave = async () => {
    try {
      if (isEdit.value && editingId.value) {
        await storeSrf.updateSRFStatus(editingId.value, payload);

        const idx = userArray.value.findIndex(
          x => normalizeId(x._id) === normalizeId(editingId.value)
        );
        if (idx !== -1) {
          userArray.value[idx] = { ...userArray.value[idx], ...payload };
        }

        $q.notify({
          type: 'positive',
          message: 'SRF successfully updated.',
          position: 'top'
        });
      } else {
        await storeSrf.createSRF(payload);
        $q.notify({
          type: 'positive',
          message: 'SRF successfully created.',
          position: 'top'
        });
      }

      // PATCH: sync baseline date after save
      originalDate.value = toPHDateOnly(date.value);

      showDialog.value = false;
      resetForm();
      router.push('/srf');
    } catch (err) {
      console.error(err);
      $q.notify({
        type: 'negative',
        message: isEdit.value
          ? 'Failed to update SRF.'
          : 'Failed to create SRF.',
        position: 'top'
      });
    }
  };


  // NON-WORKING HOLIDAY CHECK (DATE ONLY)
  const currentDateOnly = toPHDateOnly(date.value);
  const hasDateChanged =
    !isEdit.value || currentDateOnly !== originalDate.value;

  const isHoliday = await isNonWorkingHolidayPH(date.value);
  const holidayName = getHolidayNamePH(date.value);

  if (hasDateChanged && isHoliday) {
    $q.dialog({
      title: 'Non-Working Holiday',
      message: `
        <div>
          The selected date falls on a 
            <span style="color:#d32f2f; font-weight:700;">
              ${holidayName}
            </span>.
          <br><br>
          Please confirm if this work should still be scheduled.
        </div>
      `,
      html: true,
      cancel: true,
      persistent: true
    }).onOk(() => {
      proceedSave()
    })

    return
  }
  await proceedSave();
};



const confirmDelete = (id) => {
  if (!id) return;
  $q.dialog({
    title: 'Delete SRF',
    message: 'Are you sure you want to delete this SRF? This action cannot be undone.',
    cancel: true,
    persistent: true
  }).onOk(async reason => {
    try {
      await storeSrf.deleteSRF(id, reason);
      userArray.value = userArray.value.filter(item => normalizeId(item._id) !== normalizeId(id));
      $q.notify({ type: 'positive', message: 'SRF deleted', position: 'top' });
      showDialog.value = false;
      router.push('/srf');
    } catch (err) {
      $q.notify({ type: 'negative', message: 'Failed to delete SRF', position: 'top' });
    }
  });
};

const canModify = (row) => {
  if (!row) return false;

  // SINGLE SOURCE OF TRUTH (matches MainLayout)
  const rawRole = localStorage.getItem('role') || '';

  const currentRole = rawRole
    .replace(/^"+|"+$/g, '') // 🔥 strip quotes
    .trim()
    .toLowerCase();
  const currentUserFullName =
    `${localStorage.getItem('firstName') || ''} ${localStorage.getItem('lastName') || ''}`
      .trim()
      .toLowerCase();
  const createdBy =
    (row.created_by || '').toString().trim().toLowerCase();
  const assignedCoordinator =
    (row.serviceCoordinator || '').toString().trim().toLowerCase();

  // SYSTEM ADMIN & OPERATIONS MANAGER → full access
  if (currentRole === 'system_admin' || currentRole === 'operations_manager') {
    return true;
  }

  // SERVICE COORDINATOR → own SRF only
  if (currentRole === 'service_coordinator') {
    return (
      createdBy === currentUserFullName
    );
  }

  return false;
};


const openCreate = () => {
  router.push('/createSRF')
};

const gpsOption = ref([      
  { label: 'Permanently Disconnected', value: 'Permanently Disconnected' },
  { label: 'Temporary Disconnected', value: 'Temporary Disconnected' }
]);

const validationErrors = ref({
  client_id: false,
  task: false,
  date: false,
  admin: false,
  serviceCoordinator: false,
  status_id: false
});

const advisorOption = ref([
  {
    label: 'Edgardo O. Pulido',
    value: 'Edgardo O. Pulido'
  }
]);

const adminOption = ref([
  { label: 'Kayezelle Ann C. Ducot', value: 'Kayezelle Ann C. Ducot' },
  { label: 'Reichelle Gonzales', value: 'Reichelle Gonzales' }
]);

const technicianOption = ref([]);

const vehicleTypesOptions = ref([]);

const inventoryOption = ref([
  { label: 'Pat Suu', value: 'Pat Suu' },
  { label: 'Dawn Zulueta', value: 'Dawn Zulueta' }
]);

const serviceVehicleOption = ref([
    { label: 'L200', value: 'L200' },
    { label: 'XRM', value: 'XRM' },
    { label: 'Personal', value: 'Personal' },
]);

const coordinatorOption = ref([]);

const taskOption = ref([]);

const userArray = ref([]);

const userSummary = ref([]);

const cancelForm = () => {
  $q.dialog({
    title: 'Cancel',
    message: 'Discard all changes?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    resetForm();

    router.push('/approval');
  });
};

const printPaper = () => {
  if (!printObject.value || !printObject.value._id) {
    console.warn("Nothing to print");
    return;
  }

  const row = printObject.value;

  const clientId = normalizeId(
    row.client_id?.value || row.client_id
  );

  clientText.value =
    clients.value.find(
      c => normalizeId(c._id) === clientId
    ) || {};

  const vehicles = storeSrf.backendVehicles || [];

  deviceText.value =
    vehicles.find(v => String(v.username) === String(row.device_id)) ||
    {};

  printPage.value = true;
};

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {    
      device_id.value = '';
      plateNumber.value = '';
      clientOptions.value = (clients.value || []).map(client => ({
        label: client.name || 'Unknown Client',
        value: normalizeId(client._id)
      }));
    });
    return;
  }

  const needle = val.toLowerCase();
  update(() => {
    clientOptions.value = (clients.value || [])
      .filter(client => (client.name || '').toLowerCase().includes(needle))
      .map(client => ({
        label: client.name || 'Unknown Client',
        value: normalizeId(client._id)
      }));
  });
};

const onDeviceSelected = (index, newValue) => {
  if (initializingForm.value) return

  const item = srfItems.value[index]
  if (!item) return

  const toStr = v => (v == null ? '' : String(v))
  const selectedUsername = typeof newValue === 'object' && newValue !== null && 'value' in newValue
    ? toStr(newValue.value)
    : toStr(newValue)

  const vehicles = Array.isArray(storeSrf.backendVehicles)
    ? storeSrf.backendVehicles
    : []

  const selectedDevice =
    vehicles.find(device => toStr(device.username) === selectedUsername) ||
    vehicles.find(device => normalizeId(device._id) === normalizeId(selectedUsername))

  if (!selectedDevice) {
    item.scn = ''
    item.min = ''
    item.imei = ''
    item.deviceType = ''
    item.devicesTypes = ''
    item.plateNumber = null
    return
  }

  item.scn = selectedDevice.scn || ''
  item.min = selectedDevice?.devices?.[0]?.msisdn?.raw || ''
  item.imei = selectedDevice?.devices?.[0]?.imei || selectedDevice?.imei || ''
  item.deviceType = selectedDevice?.devices?.[0]?.name || selectedDevice?.device_name || ''
  item.plateNumber = selectedDevice?.name
    ? { label: selectedDevice.name, value: selectedDevice.name }
    : 'N/A'

  const deviceTypeId = normalizeId(selectedDevice.device_type_id) || ''
  const arrayDeviceType = Array.isArray(storeSrf.allDevicesTypes)
    ? storeSrf.allDevicesTypes.find(dt => normalizeId(dt._id) === deviceTypeId)
    : null

  item.devicesTypes = arrayDeviceType ? arrayDeviceType.value : ''
}

const onPlateSelected = (index, newValue) => {
  const item = srfItems.value[index]
  if (!item) return

  if (newValue === 'Admin Teng' || newValue === 'Admin') {
    item.plateNumber = null
    return
  }

  const toStr = v => (v == null ? '' : String(v))
  const selectedPlate = typeof newValue === 'object' && newValue !== null && 'value' in newValue
    ? toStr(newValue.value)
    : toStr(newValue)

  const vehicles = Array.isArray(storeSrf.backendVehicles)
    ? storeSrf.backendVehicles
    : []

  const selectedDevice = vehicles.find(device => toStr(device.name) === selectedPlate)
  if (selectedDevice && !isEdit.value) {
    item.device_id = selectedDevice.username
    onDeviceSelected(index, selectedDevice.username)
  }
}

const filterDeviceFn = (val, update) => {
  plateDisable.value = false;
  const srfVehicles = Array.isArray(storeSrf.backendVehicles)
    ? storeSrf.backendVehicles.filter(item => {
        const uname = String(item.username ?? item.UserName ?? item.login ?? '').trim();
        return uname !== '' && /^[0-9]+$/.test(uname);
      })
    : [];

  if (val === '') {
    update(() => {
      devicesOptions.value = (srfVehicles || []).map(device => ({
        label: device.username || device.raw?.username || 'Unknown TID',
        // always provide string value (never null) so QSelect behaves consistently
        value: String(device.username || device.raw?.username || '')
      }));
    });
    return;
  }

  const needle = val.toLowerCase();
  update(() => {

    devicesOptions.value = (srfVehicles || [])
      .filter(d => (d.username || d.raw?.username || '').toLowerCase().includes(needle))
      .map(device => ({
        label: device.username || device.raw?.username || 'Unknown TID',
        value: String(device.username || device.raw?.username || '')
      }));
  });
};

const filterVehicleFn = (val, update) => {
  const vehicles = Array.isArray(storeSrf.backendVehicles)
    ? storeSrf.backendVehicles.filter(v => {
        const uname = String(v.username ?? '').trim();
        return uname !== '' && /^[0-9]+$/.test(uname);
      })
    : [];
  const needle = (val || '').toLowerCase();
  update(() => {
    vehicleOptions.value = vehicles
      .filter(v =>
        (v.name || '').toLowerCase().includes(needle)
      )
      .map(v => ({
        label: v.name || 'Unknown Plate',
        value: v.name || ''
      }));

  });
};


watch(
  () => checklist.value,
  (newValue) => {
    infoList.value = newValue || {};
  },
  { immediate: true }
);

// 🔁 client_id watcher: build NewClient + fields, keep v-model as id string
watch(
  () => client_id.value,
  async (newValue) => {
    deviceDisable.value = true
    plateDisable.value = true;
    let idValue = null;
    if (newValue == null) {
      idValue = null;
    } else if (typeof newValue === 'string') {
      idValue = normalizeId(newValue);
    } else if (typeof newValue === 'object' && 'value' in newValue) {
      idValue = normalizeId(newValue.value);
    } else {
      idValue = normalizeId(newValue);
    }

    // keep v-model as plain string id (emit-value)
    if (idValue !== null && typeof client_id.value !== 'string') {
      client_id.value = idValue;
    }

    if (!idValue) {
      NewClient.value = {};
      clientTitle.value = '';
      clientObject.value = {};
      location.value = '';
      contact.value = '';
      number.value = '';
      return;
    }

    const selectedClient = clients.value.find(
      client => normalizeId(client._id) === idValue
    );

    if (!selectedClient) {
      NewClient.value = {};
      clientTitle.value = '';
      clientObject.value = {};
      location.value = '';
      contact.value = '';
      number.value = '';
      if (!isEdit.value) {
        device_id.value = "";
      }
      return;
    }

    NewClient.value = {
      label: selectedClient.name,
      value: normalizeId(selectedClient._id)
    };

    clientTitle.value = NewClient.value.label || '';
    clientObject.value = selectedClient;
    location.value = selectedClient.location || '';
    contact.value = selectedClient.contact_person || '';
    number.value = selectedClient.contact_no || '';
    vehiclesLoading.value = true
    await storeSrf.getSRFVehiclesFromBackend(selectedClient?.client_Id);
    vehiclesLoading.value = false
    const srfVehicles = Array.isArray(storeSrf.backendVehicles)
    ? storeSrf.backendVehicles.filter(item => {
        const uname = String(item.username ?? item.UserName ?? item.login ?? '').trim();
        return uname !== '' && /^[0-9]+$/.test(uname);
      })
    : [];

    devicesOptions.value = srfVehicles.map(truck => ({
      label: `${truck.username || 'Unknown TID'}`,
      value: String(truck.username || '')
    }));

    if (plateNumber.value) {
      const val = typeof plateNumber.value === "object"
        ? plateNumber.value.value
        : plateNumber.value;

      plateNumber.value = { label: val, value: val };
    }

    deviceDisable.value = false
    plateDisable.value = false;
  },
  { immediate: true }
);

watch(
  () => device_id.value,
  (newValue) => {
    if (initializingForm.value) return
    if (!isEdit.value && newValue === 'Admin') {
      device_id.value = ""
    }
    const toStr = v => (v == null ? '' : String(v));
    const selectedUsername = (newValue == null)
      ? ''
      : (typeof newValue === 'object' && 'value' in newValue)
        ? toStr(newValue.value)
        : toStr(newValue);

    const vehicles = Array.isArray(storeSrf.backendVehicles) ? storeSrf.backendVehicles : [];
    // find by username first, then by normalized _id
    const selectedDevice =
      vehicles.find(device => toStr(device.username) === selectedUsername) ||
      vehicles.find(device => normalizeId(device._id) === normalizeId(selectedUsername));

    devicesObject.value = selectedDevice || {};

    if (selectedDevice) {
      scn.value = selectedDevice.scn || '';

      // msisdn shapes
      min.value = selectedDevice?.devices?.[0]?.msisdn?.raw || '';
      imei.value = selectedDevice?.devices?.[0]?.imei || selectedDevice?.imei || '';
      deviceType.value = selectedDevice?.devices?.[0]?.name || selectedDevice?.device_name || '';
      plateNumber.value = selectedDevice?.name || 'N/A';
      // devicesTypes lookup (safe)
      const deviceTypeId = normalizeId(selectedDevice.device_type_id) || '';
      const arrayDeviceType = Array.isArray(storeSrf.allDevicesTypes)
        ? storeSrf.allDevicesTypes.find(dt => normalizeId(dt._id) === deviceTypeId)
        : null;
      devicesTypes.value = arrayDeviceType ? arrayDeviceType.value : '';
      // try to resolve a client from originalApplicationID (normalized)
    } else {
      // device not found: reset device-derived fields
      scn.value = '';
      min.value = '';
      imei.value = '';
      plateNumber.value = plateNumber?.value ? plateNumber?.value : null;
      devicesTypes.value = '';
      devicesObject.value = {};
    }
  },
  { immediate: true }
);

watch(
  () => plateNumber.value,
  (newValue) => {
    if (newValue === 'Admin Teng') {
      plateNumber.value = null
    }
    if (newValue === 'Admin') {
      plateNumber.value = null
    }
    const toStr = v => (v == null ? '' : String(v));
    const selectedUsername = (newValue == null)
      ? ''
      : (typeof newValue === 'object' && 'value' in newValue)
        ? toStr(newValue.value)
        : toStr(newValue);

    const vehicles = Array.isArray(storeSrf.backendVehicles) ? storeSrf.backendVehicles : [];
    const selectedDevice = vehicles.find(device => toStr(device.name) === selectedUsername)
    if (!isEdit.value) {
      device_id.value = selectedDevice?.username
    }
  },
  { immediate: true }
);

watch(showDialog, (val) => {
  // when dialog closes
  if (!val) {
    editDisable.value = false
  }
})


onMounted(async () => {
  loading.value = true;
  await nextTick();


  await storeSrf.getClients();
  await storeSrf.getVehicles();
  await storeSrf.getVehicleTypes();
  await storeSrf.getDeviceTypes();
  await storeSrf.getAllChecklist();
  await storeSrf.getSRFVehicles();
  await storeSrf.getAllTask();
  await storeUser.getAllUser();

  if (storeSrf.allVehicleTypes.length === 0) {
    console.log('No types found.');
  } else {
    const types = storeSrf.allVehicleTypes;
    vehicleTypesOptions.value = types.map(type => ({
      label: `${type.value}`,
      value: `${type.value}`
    }));
  }


  if (storeUser.users.length === 0) {
    console.log('No users found.');
  } else {
    const technicianUsers = storeUser.users.filter(user => user.role === 'technician');
    technicianOption.value = technicianUsers.map(user => ({
      label: `${user.firstName} ${user.lastName}`,
      value: `${user.firstName} ${user.lastName}`
    }));
  }

  if (storeUser.users.length === 0) {
    console.log('No users found.');
  } else {
  const coordinator = storeUser.users.filter(
    user => user.role !== 'technician'
  );

    coordinatorOption.value = coordinator.map(user => ({
      label: `${user.firstName} ${user.lastName}`,
      value: `${user.firstName} ${user.lastName}`
    }));
  }

  if (storeSrf.allTasks.length === 0) {
    console.log('No Task found.');
  } else {
    const Tasks = storeSrf.allTasks;
    taskOption.value = Tasks.map(user => ({
      label: `${user.value}`,
      value: `${user.value}`
    }));
  }

  clients.value = storeSrf.allClients.length === 0 ? [{ _id: 'No Clients Found' }] : storeSrf.allClients;

  // build clientOptions once as canonical option objects (value normalized)
  clientOptions.value = (clients.value || []).map(client => ({
    label: client.name || 'Unknown Client',
    value: normalizeId(client._id)
  }));

    checkOption.value = storeSrf.allCheck.map(check => ({
    label: check.title || 'No Checklist Found',
    value: check._id,
    sections: check.sections
  }));

  const passedRow = history.state?.row

  if (passedRow) {
      isEdit.value = true
      await populateFormFromSRF(passedRow)
      return
  }

  if (route.params.id) {
    isEdit.value = true;

    try {
      // Load the parent Job Order rather than an individual SRF.
      const response = await storeSrf.getOneJobOrder(route.params.id);
      const jobOrder = response?.data?.data || response?.data?.row || response?.data || response;
      console.log("RESPONSE----", response)
      if (jobOrder && typeof jobOrder === 'object') {
        // The current form has one set of SRF fields, so populate those fields
        // from the first child entry while retaining parent-level values.
        const jobOrderItems = Array.isArray(jobOrder.jobOrders) ? jobOrder.jobOrders : [];
        const firstEntry = jobOrderItems[0] || null;
        if (jobOrderItems.length) {
          srfItems.value = jobOrderItems.map(item => ({
            task: item.task || '',
            device_id: item.device_id ?? null,
            plateNumber: item.plateNumber ? { label: item.plateNumber, value: item.plateNumber } : null,
            vehicleType: item.vehicleType || '',
            devicesTypes: item.devicesTypes || '',
            deviceType: item.deviceType || '',
            odometer: item.odometer || '',
            scn: item.scn || '',
            min: item.min || '',
            imei: item.imei || '',
            new_scn: item.new_scn || '',
            new_min: item.new_min || '',
            new_imei: item.new_imei || '',
            technician_remarks: item.technician_remarks || '',
            checklistOption: item.checklistOption?.value ?? item.checklistOption ?? 'default',
            checklist: Array.isArray(item.checklist) ? item.checklist.map(check => ({
              text: check.text || '',
              done: !!check.done,
              remark: check.remark || ''
            })) : [],
            checklistSections: Array.isArray(item.checklistSections)
              ? item.checklistSections
              : (Array.isArray(item.sections) ? item.sections : [])
          }));
        }
        const formRecord = {
          ...jobOrder,
          ...(firstEntry || {}),
          _id: jobOrder._id,
          jobOrder_id: jobOrder.jobOrder_id || jobOrder.job_order_id || jobOrder.jobOrderNumber,
          client_id: firstEntry?.client_id ?? jobOrder.client_id,
          clientTitle: firstEntry?.clientTitle || jobOrder.clientTitle || jobOrder.client?.name || '',
          status_id: jobOrder.status_id || firstEntry?.status_id || 'For Approval',
          date: firstEntry?.date || jobOrder.date || jobOrder.scheduleDate || jobOrder.created_at,
          srf_id: firstEntry?.srf_id || jobOrder.jobOrder_id || jobOrder.job_order_id || jobOrder.jobOrderNumber || '',
        };

        await populateFormFromSRF(formRecord, true);
        // Keep the parent Job Order ID for approval/revision operations.
        editingId.value = normalizeId(jobOrder._id);
        printObject.value = jobOrder;
        status_id.value = jobOrder.status_id || firstEntry?.status_id || 'For Approval';
      }
    } catch (err) {
      console.error('Failed to load Job Order:', err);
      $q.notify({
        type: 'negative',
        message: 'Failed to load Job Order details',
        position: 'top'
      });
    }
  }

  loading.value = false;
})
</script>

<style scoped>
.create-srf-page {
  margin-top: -56px;
  margin-left: -32px;
}

.page-container {
    max-width: 1500px;
    margin: auto;
    padding: 16px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
}

.page-subtitle {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
}

.section-card {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
}

.section-icon {
  color: #22c55e;
  font-size: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.srf-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
}

.srf-item-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.section-body {
  padding:8px 12px;
}

.section-card{
    transition:.2s ease;
    margin-bottom: 12px;
}

.full-height{
    height:100%;
}

.action-btn {
    height: 38px;
    min-width: 140px;

    border-radius: 10px;

    background: rgba(255,255,255,.04);
    backdrop-filter: blur(10px);

    border: 1px solid transparent;

    font-size: 12px;
    font-weight: 600;
    letter-spacing: .8px;

    transition: all .25s ease;

    overflow: hidden;
}

.btn-cancel{
    color:#fc002e;
    border-color:#ff4d6d;
    background:rgba(252, 249, 250, 0.08);
    box-shadow:
        0 0 8px rgba(255,77,109,.20);
}

.btn-cancel:hover{

    transform:translateY(-2px);

    box-shadow:
        0 0 12px rgba(255,77,109,.55),
        0 0 25px rgba(255,77,109,.35);

    background:rgba(255,77,109,.08);
}

.btn-draft {
    color:#ffb020;
    border-color:#ffb020;

    box-shadow:
        0 0 8px rgba(255,176,32,.2);
}

.btn-draft:hover{

    transform:translateY(-2px);

    box-shadow:
        0 0 12px rgba(255,176,32,.55),
        0 0 25px rgba(255,176,32,.35);

    background:rgba(255,176,32,.08);
}

.btn-draft{
    color:#ffb020;
    border-color:#ffb020;

    box-shadow:
        0 0 8px rgba(255,176,32,.2);
}

.btn-draft:hover{

    transform:translateY(-2px);

    box-shadow:
        0 0 12px rgba(255,176,32,.55),
        0 0 25px rgba(255,176,32,.35);

    background:rgba(255,176,32,.08);
}

.btn-revision{
    color:#000703;
    border-color:#000703;

    box-shadow:
        0 0 8px rgba(45,252,124,.2);
}

.btn-revision:hover{
    transform:translateY(-2px);

    box-shadow:
        0 0 12px rgba(22, 15, 0, 0.55),
        0 0 25px rgba(24, 16, 1, 0.35);

    background:rgba(243, 242, 241, 0.74);
}


.btn-save{
    color:#2dfc7c;
    border-color:#2dfc7c;

    box-shadow:
        0 0 8px rgba(45,252,124,.2);
}

.btn-save:hover{

    transform:translateY(-2px);

    box-shadow:
        0 0 12px rgba(45,252,124,.55),
        0 0 25px rgba(45,252,124,.35);

    background:rgba(45,252,124,.08);
}

.action-btn::after{
    content:'';
    position:absolute;
    inset:-2px;
    border-radius:inherit;
    opacity:0;
    transition:.3s;
}

.btn-save::after{
    box-shadow:0 0 25px #2dfc7c;
}

.btn-draft::after{
    box-shadow:0 0 25px #ffb020;
}

.btn-cancel::after{
    box-shadow:0 0 25px #ff4d6d;
}

.action-btn:hover::after{
    opacity:1;
}

.btn-print{
    color:#3ea6ff;
    border:1px solid #3ea6ff;
    background:rgba(62,166,255,.04);

    box-shadow:
        0 0 8px rgba(62,166,255,.20);

    transition:all .25s ease;
}

.btn-print:hover{

  background:rgba(62,166,255,.08);

  transform:translateY(-2px);

  box-shadow:
      0 0 12px rgba(62,166,255,.55),
      0 0 25px rgba(62,166,255,.30);
}

.checklist-item {
    min-height: 34px !important;
}

.checklist-item .q-item__label {
    font-size: 13px;
}

.checklist-item .q-checkbox {
    transform: scale(0.85);
}

.checklist-container {
    max-width: 700px;
}

.tid-checklist-panel {
    border: 1px solid #d7dce2;
    border-radius: 8px;
    padding: 12px;
    background: #fafbfc;
}

.tid-checklist-table {
    width: 100%;
}

.tid-checklist-table th,
.tid-checklist-table td {
    white-space: normal;
    vertical-align: top;
}

.tid-checklist-table th:nth-child(2),
.tid-checklist-table td:nth-child(2) {
    width: 80px;
}

.checklist-remark-cell {
    min-width: 180px;
    white-space: pre-wrap !important;
}

:deep(.q-field--dense .q-field__control) {
    min-height: 36px;
    height: 36px;
}

:deep(.q-field__label) {
    font-size: 11px;
    font-weight: 500;
}

.compact-field {
    margin-bottom: 0;
}

:deep(.compact-field .q-field__control) {
    min-height: 34px;
    height: 34px;
}

:deep(.compact-field .q-field__native) {
    font-size: 12px;
}

:deep(.compact-field .q-field__label) {
    font-size: 11px;
}

.workflow-banner{

    border-radius:12px;

    padding:12px 18px;

    margin-bottom:16px;

    border-left:4px solid;

}

.revision-banner{

    background:#fffaf0;

    border-left-color:#ff9800;

}

.cancel-banner{

    background:#fff5f5;

    border-left-color:#ef5350;

}

.workflow-title{

    display:flex;
    align-items:center;
    gap:8px;

    font-size:15px;
    font-weight:600;

    margin-bottom:8px;
}

.workflow-content{

    font-size:14px;
    line-height:1.6;

    white-space:pre-wrap;
}
</style>