<template>
  <div class="srf-page">

    <!-- Header -->

    <div class="dashboard-header">

      <div class="row items-start justify-between">

        <!-- Left -->
        <div>

          <div class="dashboard-title">
            Service Requests
          </div>

          <div class="dashboard-subtitle">
            Manage and monitor all client service requests
          </div>

        </div>

        <!-- Right -->
        <div class="row items-center q-gutter-sm">

          <q-btn
            unelevated
            color="green-9"
            icon="add"
            label="New Job Order"
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
                @click="downloadReport"
              >
                <q-item-section avatar>
                  <q-icon name="table_view"/>
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

    <!-- COLORED KPIS -->

    <div class="row q-col-gutter-md q-mb-lg" style="margin-bottom: 10px;">

      <div
        v-for="card in dashboardCards"
        :key="card.title"
        class="col-12 col-sm-6 col-md-2"
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

              <!-- <div class="card-subtitle">
                {{ card.subtitle }}
              </div> -->

            </q-card-section>

          </q-card-section>

        </q-card>

      </div>

    </div>
    <!-- Create SRF Button -->
    <div class="toolbar-container row items-center q-gutter-sm">
      <!-- <q-btn
        color="dark"
        icon="add"
        label="CREATE SRF"
        unelevated
        @click="openCreate"
      />

      <q-btn
        color="green"
        icon="download"
        label="DOWNLOAD REPORT"
        unelevated
        @click="downloadReport"
      /> -->

      <!-- <q-input
        dense
        outlined
        v-model="search"
        placeholder="Search..."
        style="width: 250px;"
        @keyup.enter="runSearch"
      >
        <template v-slot:append>
          <q-icon
            name="search"
            class="cursor-pointer"
            @click="runSearch"
          />
          <q-btn
            dense
            flat
            size="sm"
            label="RESET"
            color="red"
            class="cursor-pointer"
            @click="resetSearch"
          />
        </template>
      </q-input> -->
    </div>

    <!-- FILTER -->

    <div class="row items-center q-col-gutter-sm q-mb-md">

      <!-- Search -->
      <div class="col-12 col-md-3">

        <q-input
          dense
          outlined
          v-model="search"
          placeholder="Search"
          debounce="400"
          @update:model-value="runSearch"
        >

          <template #append>

            <q-icon
              name="search"
              class="cursor-pointer"
              @click="runSearch"
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
          v-model="filterStatus"
          :options="statusOptions"
        />

      </div>

      <!-- Coordinator -->
      <div class="col-6 col-md-2">

        <q-select
          dense
          outlined
          label="Coordinator"
          v-model="filterCoordinator"
          :options="coordinatorOption"
        />

      </div>

      <!-- Technician -->
      <div class="col-6 col-md-2">

        <q-select
          dense
          outlined
          label="Technician"
          v-model="filterTechnician"
          :options="technicianOption"
        />

      </div>

      <!-- Task -->
      <!-- <div class="col-6 col-md-1">

        <q-select
          dense
          outlined
          label="Task Type"
          v-model="filterTask"
          :options="taskOption"
        />

      </div> -->

      <!-- Date -->
      <div class="col-6 col-md-2">

      <q-select
        dense
        outlined
        label="Date Range"
        v-model="dateRanges"
        :options="dateRangeOptions"
      />

      </div>

      <!-- Filter Button -->
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

    <div class="table-container">
      <q-table
        flat
        bordered
        :rows="visibleRows"
        :columns="columns"
        :loading="loading"
        :visible-columns="visibleColumns"
        @row-click="onRowClickHandler"
        row-key="_id"
        class="srf-table"
      >
      <!-- ADD THIS BLOCK -->
      <!-- <template v-slot:top="props">
        <div class="col-3 q-table__title">SRF PAGE</div>

        <q-space />


        <div v-if="$q.screen.gt.xs" class="row items-center q-gutter-sm">
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="client_id" label="Client" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="created_by" label="Created By" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="device_id" label="TID" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="task" label="Task" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="srf_id" label="SRF No" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="location" label="Location" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="serviceCoordinator" label="Coordinator" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="technician" label="Technician" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="date" label="Date" />
          <q-checkbox v-model="visibleColumns" color="light-green-7" val="status_id" label="Status" />
        </div>


        <q-select
          v-else
          v-model="visibleColumns"
          multiple
          dense
          borderless
          emit-value
          map-options
          :options="columns"
          option-value="name"
          option-label="label"
          style="min-height: 300px"
        />
      </template> -->
      
      <!-- LOADING ANIMATION -->
      <template v-slot:loading>
        <q-inner-loading showing>
          <q-spinner
            size="50px"
            color="light-green-7"
          />
        </q-inner-loading>
      </template>

      <!-- No Records -->
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey">
          <q-spinner
            v-if="loading"
            size="40px"
            color="light-green-7"
          />
          <span v-else>No records found</span>
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

      <!-- TABLE COLUMNS -->
      <template template v-slot:body="props">
        <q-tr
          :props="props"
          class="cursor-pointer"
          @click="onRowClickHandler(null, props.row)"
        >

          <q-td key="srf">

            <div class="text-weight-bold text-subtitle2">
              {{ props.row.jobOrder_id }}
            </div>

          </q-td>

          <q-td>

            <div class="text-weight-medium">
              {{ props.row.clientTitle }}
            </div>

            <div class="text-caption">
              {{ props.row.task }}
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

          <q-td>

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

          <q-td>

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


          <q-td>

            <div>

            <q-icon
            name="person"
            size="14px"
            color="deep-purple"
            />

            {{ props.row.created_by }}

            </div>

            <div class="text-caption text-grey-6">
            Author
            </div>

          </q-td>

          <q-td class="text-center">
            <q-chip
              dense
              class="status-chip"
              :class="statusClass(props.row.status_id)"
            >
              {{ props.row.status_id }}
            </q-chip>
          </q-td>

          <q-td>

          <div>
          <q-icon
            name="event"
            size="13px"
            class="q-mr-xs"
          />

          {{ Get.date(props.row.date) }}

          </div>

          </q-td>



        </q-tr>
      </template>

      </q-table>
    </div>

    <!-- SRF Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card 
        style="
          width: 700px;
          max-width: 95vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        "
      >
        <q-inner-loading :showing="editLoading">
          <q-spinner size="50px" color="light-green-7" />
        </q-inner-loading>

        <q-card-section class="bg-light-green-7">
          <div class="row items-center justify-between">
            <div class="text-h6 text-grey-1">
              {{ isEdit ? `Edit     ${SRFNo}` : 'SRF Form' }}
            </div>

            <!-- CLOSE (top-right) -->
            <q-btn
              dense
              flat
              round
              icon="close"
              color="grey-1"
              v-close-popup
            />
          </div>
        </q-card-section>


        <q-separator />

        <q-card-section class="q-pa-md scroll" style="flex: 1 1 auto;">

          <div class="row justify-around items-center">

            <div>
              <!-- client select: emit-value + explicit option keys -->
              <q-select
                dense
                outlined
                v-model="client_id"
                use-input
                input-debounce="0"
                label="Client Name"
                :options="clientOptions"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                @filter="filterFn"
                style="width: 300px;"
                behavior="menu"
                color="light-green"
                :error="validationErrors.client_id"
                :error-message="'Client Name is required'"
                data-field="client_id"
                :disable="editDisable"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input disable v-model="location" label="Location" dense class="q-pb-md" />
              <q-input disable v-model="contact" label="Contact Person" dense class="q-pb-md" />
              <q-input disable v-model="number" label="Contact Number" dense class="q-pb-md" />

              <q-select
                dense
                outlined
                v-model="plateNumber"
                use-input
                input-debounce="0"
                label="Plate Number"
                :options="vehicleOptions"
                @filter="filterVehicleFn"
                style="width: 300px"
                behavior="menu"
                class="q-pb-md"
                color="light-green"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>                   

              <q-item-section class="text-grey-10">
                Schedule Date
              </q-item-section>
              <div class="q-pa-sm" style="max-width: 300px">
                <q-input :disable="editDisable" filled v-model="date" outlined dense>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="dark" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="dark" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <q-select :disable="editDisable" outlined v-model="technician" :options="technicianOption" label="Technician" dense class="q-pb-md" color="light-green"/>
              <q-input :disable="editDisable" outlined v-model="devicesTypes" label="GPS Type" dense class="q-pb-md" color="light-green"/>
              <q-input :disable="editDisable" outlined v-model="new_scn" label="New SCN" dense class="q-pb-md" color="light-green"/>
              <q-input :disable="editDisable" outlined v-model="new_min" label="New MIN" dense class="q-pb-md" color="light-green"/>
              <q-input :disable="editDisable" outlined v-model="new_imei" label="New IMEI" dense class="q-pb-md" color="light-green"/>
              <q-input :disable="editDisable" outlined v-model="odometer" label="Odometer" dense class="q-pb-md" color="light-green"/>



              <q-select
                dense
                outlined
                v-model="vehicleType"
                use-input
                input-debounce="0"
                label="Vehicle Type"
                :options="vehicleTypesOptions"
                style="width: 300px"
                behavior="menu"
                class="q-pb-md"
                color="light-green"
                :disable="editDisable"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input :disable="editDisable" outlined v-model="remarks" label="Remarks" dense class="q-pb-md" color="light-green"/>

            </div>

            <div style="margin-top: -23px;">
              <q-select
                dense
                outlined
                v-model="device_id"
                use-input
                input-debounce="0"
                label="TID"
                :options="devicesOptions"
                @filter="filterDeviceFn"
                style="width: 300px;"
                behavior="menu"
                class="q-pb-md"
                color="light-green"
                data-field="device_id"
                :disable="deviceDisable || editDisable"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input :disable="editDisable" outlined v-model="scn" label="SCN" dense class="q-pb-md" color="light-green" />
              <q-input disable v-model="min" label="MIN" dense class="q-pb-md" color="light-green" />
              <q-input disable v-model="imei" label="IMEI" dense class="q-pb-md" color="light-green" />
              <q-input disable v-model="deviceType" label="Device Type" dense class="q-pb-md" color="light-green" />
              <q-select
                outlined
                v-model="task"
                :options="taskOption"
                label="Task"
                dense
                options-dense
                style="width: 300px"
                popup-content-class="wrap-options"
                class="q-pb-md wrap-select"
                color="light-green"
                :error="validationErrors.task"
                :error-message="'Task is required'"
                data-field="task"
                :disable="editDisable"
              />
              <q-select
                outlined
                v-model="admin"
                :options="adminOption"
                label="System Admin"
                dense
                class="q-pb-md"
                color="light-green"
                :error="validationErrors.admin"
                :error-message="'Admin is required'"
                data-field="admin"
                :disable="editDisable"
              />
              <q-select
                outlined
                v-model="serviceCoordinator"
                :options="coordinatorOption"
                label="Service Coordinator"
                dense
                class="q-pb-md"
                color="light-green"
                :error="validationErrors.serviceCoordinator"
                :error-message="'Coordinator is required'"
                data-field="serviceCoordinator"
                :disable="editDisable"
              />

              <q-input v-model="technician_remarks" label="Technician Remarks" outlined dense color="light-green" class="q-pb-md" />
              <!-- <q-select :disable="editDisable" outlined v-model="gps_status" :options="gpsOption" label="GPS Status" dense class="q-pb-md" color="light-green"/> -->
              <q-input :disable="editDisable" outlined v-model="concern" label="Client Concern" dense class="q-pb-md" color="light-green"/>
              <q-select :disable="editDisable" outlined v-model="advisor" :options="advisorOption" label="Technical Advisor" dense class="q-pb-md" color="light-green"/>
              <q-select :disable="editDisable" outlined v-model="inventory" :options="inventoryOption" label="Accounting/Inventory" dense class="q-pb-md" color="light-green"/>

              <!-- STATUS SELECT: placed below Service Coordinator -->
              <q-select
                outlined
                disable
                v-model="status_id"
                :options="statusOptions"
                label="Status"
                dense
                class="q-pb-md"
                color="light-green"
                :error="validationErrors.status_id"
                :error-message="'Status is required'"
                data-field="status_id"
              />
              <q-select :disable="editDisable" outlined v-model="serviceVehicle" :options="serviceVehicleOption" label="Service Vehicle" dense class="q-pb-md" color="light-green"/>
            </div>
          </div>

          <div v-show="withCancel">

            <q-item-section class="text-grey-10" style="margin-left: 5px;">
              Reason to Cancel:
            </q-item-section>
            <q-input outlined v-model="cancelNotes" type="textarea" label="Reason" dense class="q-pb-md" color="light-green"/>

          </div>

          <div v-show="withNotes">

            <q-item-section class="text-grey-10" style="margin-left: 5px;">
              Revision Notes
            </q-item-section>
            <q-input outlined v-model="notes" type="textarea" label="Notes" dense class="q-pb-md" color="light-green"/>

          </div>

          <q-item-section class="text-grey-10" style="margin-left: 5px;">
            Checklist Option
          </q-item-section>
          <q-select :disable="editDisable" outlined v-model="checklist" :options="checkOption" label="Checklist" dense class="q-pb-md" color="light-green"/>

          <div
            v-for="(section, index) in infoList.sections"
            :key="section._id || index"
            class="q-mb-md"
          >
            <div class="text-subtitle1 q-mb-sm">
              {{ index + 1 }}. {{ section.sectionTitle }}
            </div>

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

          <q-dialog v-model="alertMessage" persistent>
            <q-card>
              <q-card-section>
                <div class="text-h6">Alert</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Selected TID has no existing CLIENT. Please choose a client.
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-px-md q-py-sm">
          <div class="row items-center q-gutter-sm">

            <!-- DELETE -->
            <q-btn
              v-show="isEdit && canModify(printObject)"
              unelevated
              color="red"
              icon="delete"
              label="DELETE"
              @click="confirmDelete(editingId)"
            />

            <!-- PRINT -->
            <q-btn
              unelevated
              color="grey-8"
              text-color="white"
              icon="print"
              label="PRINT"
              @click="printPaper(editingId)"
            />

            <!-- SAVE AS DRAFT -->
            <q-btn
              v-if="status_id === 'For Approval' && (!isEdit || canModify(printObject))"
              unelevated
              color="green"
              text-color="white"
              icon="save"
              label="SAVE AS DRAFT"
              @click="submitSRF('Pending')"
            />

            <!-- For Approval -->
            <q-btn
              v-if="status_id === 'For Revision' && (!isEdit || canModify(printObject))"
              unelevated
              color="primary"
              icon="edit"
              label="FOR APPROVAL"
              @click="submitSRF('For Approval')"
            />


            <!-- UPDATE / SAVE -->
            <q-btn
              v-if="(status_id === 'Completed' || status_id === 'Approved' || status_id === 'For Approval') && (!isEdit || canModify(printObject))"
              unelevated
              color="primary"
              icon="edit"
              :label="isEdit ? 'UPDATE' : 'SAVE'"
              @click="isEdit ? submitSRF('Update') : submitSRF('For Approval')"
            />

          </div>
        </q-card-actions>


      </q-card>
    </q-dialog>

    <!-- Print component -->
    <PrintSRF
      :printPage="printPage"
      :printObject="printObject"
      :clientText="clientText"
      :deviceText="deviceText"
      :Get="Get"
      @update:printPage="val => printPage = val"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import { srfStore } from '../stores/srfStore.js';
import { userStore } from '../stores/userStore';
import { authStore } from '../stores/authStore.js'
import { Get } from '../utils/helper.js';
import socket from '../plugins/socket';
import PrintSRF from '../components/PrintSRF.vue';
import { useQuasar } from 'quasar';
import { defaultChecklistTemplate } from '../utils/defaultChecklist'
import * as XLSX from "xlsx";
import { useRouter } from 'vue-router'
import {
  toPHDateOnly,
  isNonWorkingHolidayPH,
  getHolidayNamePH
} from '../utils/phHolidays';

const filterStatus = ref("");
const filterCoordinator = ref("");
const filterTechnician = ref("");
const filterTask = ref("");
const dateRange = ref("");
const router = useRouter()
const search = ref("");
const SRFNo = ref("");
const editDisable = ref(false);
const editLoading = ref(false);
const vehiclesLoading = ref(false);
const $q = useQuasar();
const loading = ref(false);
const storeSrf = srfStore();
const storeUser = userStore();
const storeAuth = authStore()
const showDialog = ref(false);
const alertMessage = ref(false);
const client_id = ref(null); // QSelect model: client id string (because emit-value)
const device_id = ref(null);
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
const statusOther = ref([

]);

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

// const dashboardCards = [
//   {
//     title: 'Total SRFs',
//     value: '1,248',
//     subtitle: 'All time',
//     icon: 'description',
//     color: 'green'
//   },
//   {
//     title: 'For Approval',
//     value: '23',
//     subtitle: 'Needs your action',
//     icon: 'hourglass_empty',
//     color: 'amber'
//   },
//   {
//     title: 'For Revision',
//     value: '12',
//     subtitle: 'Returned by approver',
//     icon: 'refresh',
//     color: 'deep-purple'
//   },
//   {
//     title: 'Ongoing',
//     value: '78',
//     subtitle: 'In progress',
//     icon: 'monitor_heart',
//     color: 'primary'
//   },
//   {
//     title: 'Completed',
//     value: '1,054',
//     subtitle: 'This year',
//     icon: 'check',
//     color: 'green'
//   },
//   {
//     title: 'Cancelled',
//     value: '19',
//     subtitle: 'This year',
//     icon: 'close',
//     color: 'red'
//   }
// ]

const notes = ref('');
const withNotes = ref(false);

const cancelNotes = ref('');
const withCancel = ref(false);

const visibleColumns = ref([
  'client_id',
  'created_by',
  'device_id',
  'task',
  'jobOrder_id',
  'location',
  'serviceCoordinator',
  'technician',
  'date',
  'created',
  'status_id'
])

const originalDate = ref(null);
const getFirtsName = localStorage.getItem('firstName');
const getLastName = localStorage.getItem('lastName');

const dateRangeOptions = [
  "All",
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "This Year"
]

const dateRanges = ref("All")

const resetFilters = async () => {
  search.value = ""

  filterStatus.value = null
  filterCoordinator.value = null
  filterTechnician.value = null
  filterTask.value = null
  dateRanges.value = null

  await resetSearch()
}

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
  plateNumber.value = '';
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

const openCreate = () => {
  router.push('/jobOrderCreate')
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
  plateNumber: false,
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
    field: Get.date('date'),
    field: row => Get.date(row.date),
    sortable: false
  }
];

// const columns = [
//   {
//     name: 'srf',
//     label: 'SRF',
//     field: 'srf_id',
//     align: 'left'
//   },
//   {
//     name: 'clientTask',
//     label: 'Client & Task',
//     align: 'left'
//   },
//   {
//     name: 'coordinator',
//     label: 'Coordinator',
//     align: 'left'
//   },
//   {
//     name: 'technician',
//     label: 'Technician',
//     align: 'left'
//   },
//   {
//     name: 'schedule',
//     label: 'Schedule',
//     align: 'left'
//   },
//   {
//     name: 'status',
//     label: 'Status',
//     align: 'center'
//   },
//   {
//     name: 'createdBy',
//     label: 'Created By',
//     align: 'left'
//   },
//   {
//     name: 'created',
//     label: 'Created',
//     align: 'center'
//   }
// ]

const userArray = ref([]);

const userSummary = ref([]);

const onRowClick = (row) => {
  openEdit(row);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'For Approval':
      return 'purple';

    case 'On-going':
      return 'blue';

    case 'Cancelled':
      return 'orange';

    case 'Approved':
      return 'teal';

    case 'Completed':
      return 'green';

    case 'For Revision':
      return 'brown';

    default:
      return 'grey';
  }
};

// visibleRows: role-based visibility (admins/ops see all; others see only their created ones)
// const visibleRows = computed(() => {
//   // If auth store says admin or operations, show everything
//   if (storeAuth.isAdminOrOps) {
//     return userArray.value;
//   }

//   // build possible creator identifiers to match against SRF.created_by (robust)
//   const fullName = `${getFirtsName || ''} ${getLastName || ''}`.trim();
//   const userId = localStorage.getItem('id') || storeAuth.currentUserId || null;

//   // possible created_by values on SRF may be:
//   // - full name string ("First Last")
//   // - user id string (ObjectId)
//   // - "Firstname Lastname" or other variants — we use lowercase compare for safety
//   const candidates = new Set();
//   if (fullName) candidates.add(fullName.toLowerCase());
//   if (userId) candidates.add(String(userId).toLowerCase());

//   return (userArray.value || []).filter(row => {
//     if (!row) return false;

//     // prefer created_by field (string)
//     const cb = (row.created_by ?? row.createdBy ?? row.created_by_user ?? '').toString().toLowerCase();

//     if (cb && candidates.has(cb)) return true;

//     // some SRF documents store creator in other fields (created_at object, created_by_id, etc.)
//     const cbId = (row.created_by_id ?? row.createdById ?? row.createdBy?._id ?? row.created_by_user_id ?? '').toString().toLowerCase();
//     if (cbId && candidates.has(cbId)) return true;

//     // last resort: if there is an `created_by` object
//     if (typeof row.created_by === 'object' && row.created_by !== null) {
//       // try matching common shapes
//       const maybeId = String(row.created_by._id || row.created_by.id || '').toLowerCase();
//       const maybeName = String(row.created_by.name || row.created_by.fullName || '').toLowerCase();
//       if (maybeId && candidates.has(maybeId)) return true;
//       if (maybeName && candidates.has(maybeName)) return true;
//     }

//     // not created by current user
//     return false;
//   });
// });

const downloadReport = () => {
  const report = visibleRows.value.map(row => ({
    "SRF No": row.srf_id,
    "Client": row.clientTitle,
    "Created By": row.created_by,
    "TID": row.device_id,
    "Task": row.task,
    "Location": row.location,
    "Coordinator": row.serviceCoordinator,
    "Technician": row.technician,
    "Scheduled Date": Get.date(row.date),
    "Status": row.status_id
  }));

  const worksheet = XLSX.utils.json_to_sheet(report);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "SRF Report");

  XLSX.writeFile(
    workbook,
    `SRF_Report_${new Date().toISOString().slice(0,10)}.xlsx`
  );
};

// const runSearch = async () => {
//   loading.value = true
//   try {
//     // empty search = reload normal table
//     if (!search.value) {
//       await storeSrf.getAllSRF()
//       userArray.value = storeSrf.allSRF
//       return
//     }

//     const result = await storeSrf.searchSRF(search.value)
//     userArray.value = result
//     search.value = ""
//   } catch (err) {
//     console.error(err)
//   } finally {
//     loading.value = false
//   }
// }

const runSearch = async () => {
  const keyword = search.value.trim();

  loading.value = true;

  try {
    if (!keyword) {
      await resetSearch();
      return;
    }

    userArray.value = await storeSrf.searchSRF(keyword);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const visibleRows = computed(() => {
  return userArray.value.filter(row => {

    if (
      filterStatus.value &&
      row.status_id !== filterStatus.value.value
    ) {
      return false
    }

    if (
      filterCoordinator.value &&
      row.serviceCoordinator !== filterCoordinator.value.value
    ) {
      return false
    }

    if (
      filterTechnician.value &&
      row.technician !== filterTechnician.value.value
    ) {
      return false
    }

    if (
      filterTask.value &&
      row.task !== filterTask.value.value
    ) {
      return false
    }

    if (
      dateRanges.value &&
      !matchesDateRange(row.date)
    ) {
      return false
    }

    return true
  })
})

const matchesDateRange = (date) => {
  const rowDate = new Date(date)
  const today = new Date()

  switch (dateRanges.value) {
    case "Today":
      return (
        rowDate.getFullYear() === today.getFullYear() &&
        rowDate.getMonth() === today.getMonth() &&
        rowDate.getDate() === today.getDate()
      )

    case "Yesterday": {
      const yesterday = new Date()
      yesterday.setHours(0, 0, 0, 0)
      yesterday.setDate(yesterday.getDate() - 1)

      const tomorrowOfYesterday = new Date(yesterday)
      tomorrowOfYesterday.setDate(tomorrowOfYesterday.getDate() + 1)

      return rowDate >= yesterday && rowDate < tomorrowOfYesterday
    }
    
    case "This Week": {
      const start = new Date(today)
      start.setHours(0, 0, 0, 0)
      start.setDate(today.getDate() - today.getDay())

      const end = new Date(start)
      end.setDate(start.getDate() + 7)

      return rowDate >= start && rowDate < end
    }

    case "This Month":
      return (
        rowDate.getFullYear() === today.getFullYear() &&
        rowDate.getMonth() === today.getMonth()
      )

    case "This Year":
      return rowDate.getFullYear() === today.getFullYear()

    default:
      return true
  }
}

const dashboardCards = computed(() => {
  const s = userSummary.value || {}

  return [
    {
      title: 'Total SRFs',
      value: (s.total ?? 0).toLocaleString(),
      subtitle: 'All time',
      icon: 'description',
      color: 'green'
    },
    {
      title: 'For Approval',
      value: (s.approval ?? 0).toLocaleString(),
      subtitle: 'Needs your action',
      icon: 'hourglass_empty',
      color: 'amber'
    },
    {
      title: 'For Revision',
      value: (s.revision ?? 0).toLocaleString(),
      subtitle: 'Returned by approver',
      icon: 'refresh',
      color: 'deep-purple'
    },
    {
      title: 'Ongoing',
      value: (s.ongoing ?? 0).toLocaleString(),
      subtitle: 'In progress',
      icon: 'monitor_heart',
      color: 'primary'
    },
    {
      title: 'Completed',
      value: (s.completed ?? 0).toLocaleString(),
      subtitle: 'Completed',
      icon: 'check',
      color: 'green'
    },
    {
      title: 'Cancelled',
      value: (s.cancelled ?? 0).toLocaleString(),
      subtitle: 'Cancelled',
      icon: 'close',
      color: 'red'
    }
  ]
})

// const onRowClickHandler = (evt, row) => {
//   const rawRole = localStorage.getItem('role') || '';
//   const currentRole = rawRole
//     .replace(/^"+|"+$/g, '') // 🔥 strip quotes
//     .trim()
//     .toLowerCase();
//   if (row.status_id === "Pending" || row.status_id === "For Approval" || currentRole === "system_admin" || currentRole === "operations_manager") {
//     editDisable.value = false
//   } else {
//     editDisable.value = true
//   }
//   if (!row) return;   // safety
//   openEdit(row);      // 
// };

const onRowClickHandler = (evt, row) => {
  if (!row?._id) return;

  const rawRole = localStorage.getItem('role') || '';
  const currentRole = rawRole
    .replace(/^"+|"+$/g, '')
    .trim()
    .toLowerCase();

  const canEdit =
    row.status_id === 'Pending' ||
    row.status_id === 'For Approval' ||
    currentRole === 'system_admin' ||
    currentRole === 'operations_manager';

  if (!canEdit) {
    $q.notify({
      type: 'warning',
      message: 'You do not have permission to edit this Job Order.',
      position: 'top'
    });
    return;
  }

  // Use the same full-page form as creation, passing the selected Job Order.
  // JobOrderCreate.vue fetches the complete document by _id before populating.
  router.push({
    path: '/jobOrderCreate',
    state: {
      row: { _id: normalizeId(row._id) }
    }
  });
};



// ----- add/replace these in your <script setup> -----
const printPaper = (id = null) => {
  // prefer explicit id param, otherwise fallback to printId ref
  const idToUse = normalizeId(id || printId.value);

  if (!idToUse) {
    console.warn('printPaper: no id provided');
    return;
  }

  // find the SRF row in the current userArray
  const row = userArray.value.find(r => normalizeId(r._id) === idToUse);
  if (!row) {
    console.warn('printPaper: SRF row not found for id', idToUse);
    return;
  }

  // set printObject so PrintSRF receives full row
  printObject.value = row;

  // clientText: try to find matching client by normalized _id
  const clientId = normalizeId(row.client_id?.value || row.client_id);
  clientText.value = (clients.value || []).find(c => normalizeId(c._id) === clientId) || {};

  // deviceText: try to find vehicle by username (tid) or _id, fallback to devices array
  const vehicles = Array.isArray(storeSrf.srfVehicles) ? storeSrf.srfVehicles : [];
  const deviceByUsername = vehicles.find(d => String(d.username) === String(row.device_id));
  const deviceById = vehicles.find(d => normalizeId(d._id) === normalizeId(row.device_id));
  deviceText.value = deviceByUsername || deviceById || (devices.value || []).find(d => normalizeId(d._id) === normalizeId(row.device_id)) || {};

  // ensure PrintSRF shows
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



// === populateFormFromSRF ===
const populateFormFromSRF = async (srf) => {
  SRFNo.value = srf.srf_id
  printId.value = srf._id
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

const openEdit = async (row) => {
  printObject.value = row
  isEdit.value = true

  editingId.value =
    normalizeId(row._id) ||
    normalizeId(row._id?.$oid) ||
    row.srf_id ||
    null

  editLoading.value = true
  showDialog.value = true

  await nextTick()

  // ensure clients loaded
  if ((!clients.value || clients.value.length === 0) && storeSrf?.getClients) {
    await storeSrf.getClients()
    clients.value = storeSrf.allClients || []
  }

  clientOptions.value = (clients.value || []).map(c => ({
    label: c.name || 'Unknown Client',
    value: normalizeId(c._id)
  }))

  // 🔥 determine client BEFORE populate
  const clientId =
    row.client_id?.value ||
    (typeof row.client_id === 'string' ? row.client_id : null)

  if (clientId) {
    const selectedClient = clients.value.find(
      c => normalizeId(c._id) === normalizeId(clientId)
    )

    if (selectedClient) {
      vehiclesLoading.value = true

      await storeSrf.getSRFVehiclesFromBackend(selectedClient.client_Id)

      vehiclesLoading.value = false

      const srfVehicles = (storeSrf.backendVehicles || []).filter(v => {
        const uname = String(v.username ?? '').trim()
        return uname !== '' && /^[0-9]+$/.test(uname)
      })

      vehicleOptions.value = srfVehicles.map(v => ({
        label: v.name || 'Unknown Plate',
        value: v.name || ''
      }))

      devicesOptions.value = srfVehicles.map(v => ({
        label: v.username || 'Unknown TID',
        value: String(v.username || '')
      }))
    }
  }

  // 🔥 now populate form AFTER options exist
  initializingForm.value = true
  await populateFormFromSRF(row)
  initializingForm.value = false

  originalDate.value = toPHDateOnly(date.value)

  await nextTick()

  editLoading.value = false
}


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
    device_id: !device_id.value,
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
    } catch (err) {
      console.error('Failed to delete SRF', err);
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

const resetSearch = async () => {
  search.value = "";

  await storeSrf.getAllSRF();

  userArray.value = [...storeSrf.allSRF].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
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
      plateNumber.value = ""
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
  await storeSrf.getAllJobOrders();
  await storeUser.getAllUser();
  await storeSrf.getAllSRF();
  alertMessage.value = false;

  try {
    if (storeSrf.allJobOrders.length === 0) {
      userArray.value = [];
    } else {
      userArray.value = storeSrf.allJobOrders
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      userSummary.value = storeSrf.allJobOrderSummary;
    }
  } catch (error) {
    console.error('Error fetching SRF data:', error);
  } finally {
    loading.value = false;
  }

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

  const srfVehicles = Array.isArray(storeSrf.srfVehicles)
    ? storeSrf.srfVehicles.filter(item => {
        const uname = String(item.username ?? item.UserName ?? item.login ?? '').trim();
        return uname !== '' && /^[0-9]+$/.test(uname);
      })
    : [];

  clients.value = storeSrf.allClients.length === 0 ? [{ _id: 'No Clients Found' }] : storeSrf.allClients;

  // build clientOptions once as canonical option objects (value normalized)
  clientOptions.value = (clients.value || []).map(client => ({
    label: client.name || 'Unknown Client',
    value: normalizeId(client._id)
  }));

  // vehicleOptions.value = srfVehicles.map(truck => ({
  //   label: `${truck.name || 'Unknown Plate'}`,
  //   value: `${truck.name || ''}`
  // }));

  // ensure devicesOptions always contain string values
  // devicesOptions.value = srfVehicles.map(truck => ({
  //   label: `${truck.username || 'Unknown TID'}`,
  //   value: String(truck.username || '')
  // }));

  checkOption.value = storeSrf.allCheck.map(check => ({
    label: check.title || 'No Checklist Found',
    value: check._id,
    sections: check.sections
  }));

  socket.on('srf-change', (change) => {
    const updated = change.fullDocument;
    if (change.operationType === 'insert') {
      userArray.value.unshift(updated);
    } else if (change.operationType === 'update') {
      const index = userArray.value.findIndex(item => normalizeId(item._id) === normalizeId(updated._id));
      if (index !== -1) userArray.value[index] = updated;
    } else if (change.operationType === 'delete') {
      userArray.value = userArray.value.filter(item => normalizeId(item._id) !== normalizeId(change.documentKey._id));
    }
  });
});
</script>

<style>
  .wrap-select .q-field__native,
  .wrap-select .q-field__control,
  .wrap-select .q-field__inner {
    white-space: normal !important;
  }

  .wrap-select .q-field__native span {
    white-space: normal !important;
    word-break: break-word;
  }

  .wrap-options .q-item__label {
    white-space: normal;
  }

.srf-page{
  padding:2px;
  margin-top: -40px;
  margin-left: -14px;
}

.toolbar-container{
    padding:0;
    margin-bottom:16px;
}

.table-container{
    padding:0;
}

.dashboard-header {
    margin-bottom: 8px;
}

.dashboard-card{
  border-radius: 10px;
  min-height: 58px;
  transition: .2s;
  cursor: pointer;
}

.dashboard-card:hover{
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,.08);
}

.card-title{
  font-size:11px;
  color:#7d7d7d;
  margin-bottom:2px;
}

.card-value{
  font-size:18px;
  font-weight:700;
  line-height:1;
}

.card-subtitle{
  font-size:10px;
  color:#9c9c9c;
  margin-top:4px;
}

.filter-bar .q-field{
    font-size:12px;
}

.filter-bar .q-btn{
    height:40px;
}

.dashboard-header{
    margin-bottom:18px;
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

.status-chip{
  font-size:11px;
  font-weight:600;
  border-radius:8px;
  padding:2px 8px;
  height:22px;
}

/* Approved */
.status-approved{
  background:#E8F8EC;
  color:#0df1f1;
}

/* For Approval */
.status-for-approval{
  background:#FFF5D8;
  color:#D89B00;
}

/* On Going */
.status-ongoing{
  background:#EAF2FF;
  color:#3B82F6;
}

/* Completed */
.status-completed{
  background:#E7F8EC;
  color:#37A45A;
}

/* Revision */
.status-revision{
  background:#F2E9FF;
  color:#7C4DFF;
}

/* Pending */
.status-pending{
  background:#EFEFEF;
  color:#6D6D6D;
}

/* Cancelled */
.status-cancelled{
  background:#FDECEC;
  color:#E53935;
}

.status-default{
  background:#ECECEC;
  color:#666;
}

.srf-table .q-table tbody tr td {
  border-bottom: none !important;
}
</style>
