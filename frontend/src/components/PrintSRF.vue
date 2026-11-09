<template>
  <div>
  <q-dialog v-model="props.printPage" @hide="emit('update:printPage', false)" persistent>
    <q-card style="width: 900px; max-width: 90vw;">
      <q-card-section class="q-pt-none">
        <!-- <div class="text-h6">SERVICE REQUEST FORM</div> -->
        <div class="q-pa-md">
          <div ref="printableRef" class="excel-form printable-area">

            <div class="align-row">
              <!-- 1ST Row -->
              <div class="red">
                <div style="display: flex; flex-direction: row; justify-content: start; margin-bottom: 10px;">
                  <img src="/wruform.png" alt="Image" width="130" />
                </div>
                <div class="text-title">Task Details</div>



                <div class="sub-align">
                  <div class="sub-text">Client</div>
                  <div class="value-text">{{ props.clientText?.name }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Location</div>
                  <div class="value-text">{{ props.clientText?.location }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Assigned Tech</div>
                  <div class="value-text">{{ props.printObject?.technician }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Contact Person</div>
                  <div class="value-text">{{ props.printObject?.contact }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Contact Number</div>
                  <div class="value-text">{{ props.printObject?.number }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Client's Concern</div>
                  <div class="value-text">{{ props.printObject?.concern }}</div>
                </div>                
              </div>

              <!-- 2ND Row -->
              <div class="blue">
                <div style="margin-top: 10px;" class="main-title">SRF No. {{ props.printObject?.jobOrder_id || props.printObject?.srf_id || 'N/A' }}</div>
                

                <div style="margin-top: 42px;" class="text-title">Service Information</div>
                <div class="sub-align">
                  <div class="sub-text">Date/Time</div>
                  <div class="value-text">{{ Get.date(props.printObject?.date) }}</div>
                </div>
                <div class="sub-align">
                  <div class="sub-text">Status</div>
                  <div class="value-text">{{ props.printObject?.status_id || 'N/A' }}</div>
                </div>
                <div class="sub-align">
                  <div class="sub-text">Schedule Date</div>
                  <div class="value-text">{{ props.Get?.date ? props.Get.date(props.printObject?.date) : (props.printObject?.date || 'N/A') }}</div>
                </div>
                <div class="sub-align">
                  <div class="sub-text">Technician Start Time</div>
                  <div class="value-text">{{ props.printObject?.start_time || props.printObject?.jobOrders?.[0]?.start_time || 'N/A' }}</div>
                </div>
                <div class="sub-align">
                  <div class="sub-text">Technician End Time</div>
                  <div class="value-text">{{ props.printObject?.end_time || props.printObject?.jobOrders?.[0]?.end_time || 'N/A' }}</div>
                </div>


              </div>
            </div>

            <section class="entries-section">
              <div class="text-title section-heading">SRF / Device Entries <span class="entry-count">({{ printEntries.length }})</span></div>
              <div v-for="(entry, entryIndex) in printEntries" :key="entry._id || entry.srf_id || entryIndex" class="print-srf-entry">
                <div class="entry-heading">
                  <span v-if="entry.device_id">TID: {{ displayValue(entry.device_id) }}</span>
                </div>
                <div class="handwritten-details">
                  <div class="handwritten-row">
                    <div class="handwritten-field task-field"><span class="field-label">Task / Service</span><span class="field-value">{{ displayValue(entry.task) }}</span></div>
                    <div class="handwritten-field"><span class="field-label">Vehicle Type</span><span class="field-value">{{ displayValue(entry.vehicleType) }}</span></div>
                    <div class="handwritten-field"><span class="field-label">SCN</span><span class="field-value">{{ displayValue(entry.scn || props.deviceText?.scn) }}</span></div>
                  </div>
                  <div class="handwritten-row">
                    <div class="handwritten-field"><span class="field-label">Plate Number</span><span class="field-value">{{ displayValue(entry.plateNumber) }}</span></div>
                    <div class="handwritten-field"><span class="field-label">MIN</span><span class="field-value">{{ displayValue(entry.min || props.deviceText?.min) }}</span></div>
                    <div class="handwritten-field"><span class="field-label">Odometer</span><span class="field-value">{{ displayValue(entry.odometer) }}</span></div>
                  </div>
                  <div class="handwritten-row">
                    <div class="handwritten-field"><span class="field-label">IMEI</span><span class="field-value">{{ displayValue(entry.imei || props.deviceText?.imei) }}</span></div>
                    <div class="handwritten-field device-type-field"><span class="field-label">Device Type</span><span class="field-value">{{ displayValue(entry.deviceType || entry.devicesTypes) }}</span></div>
                  </div>
                  <div class="new-values-row">
                    <div class="new-values-fields">
                      <div class="new-value-field"><span class="field-label">NEW SCN</span><span class="write-line"></span></div>
                      <div class="new-value-field"><span class="field-label">NEW MIN</span><span class="write-line"></span></div>
                      <div class="new-value-field"><span class="field-label">NEW IMEI</span><span class="write-line"></span></div>
                    </div>
                    <div class="technician-remarks-box">
                      <div class="field-label">Technician Remarks</div>
                    </div>
                  </div>
                </div>

                <div class="tid-checklist">
                  <div class="text-title checklist-heading">Checklist — TID {{ displayValue(entry.device_id) }}</div>
                  <table v-if="entry.checklist?.length" class="task-table">
                    <thead><tr><th>Task</th><th>Done</th><th>Remarks</th></tr></thead>
                    <tbody>
                      <tr v-for="(item, checkIndex) in entry.checklist" :key="item._id || checkIndex">
                        <td>{{ item.text || item.label || 'N/A' }}</td>
                        <td class="check-status">{{ item.done ? '✓' : '☐' }}</td>
                        <td>{{ item.remark || '' }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <table v-else-if="(entry.checklistSections || entry.sections)?.length" class="task-table">
                    <thead><tr><th>Checklist Section / Task</th><th>Done</th><th>Remarks</th></tr></thead>
                    <tbody>
                      <template v-for="(section, sectionIndex) in (entry.checklistSections || entry.sections)" :key="section._id || sectionIndex">
                        <tr class="checklist-section-row"><th colspan="3">{{ section.sectionTitle || `Section ${sectionIndex + 1}` }}</th></tr>
                        <tr v-for="(option, optionIndex) in (section.options || [])" :key="option._id || optionIndex">
                          <td>{{ option.label || option.text || 'N/A' }}</td>
                          <td class="check-status">{{ option.isChecked ? '✓' : '☐' }}</td>
                          <td>{{ section.remarks || '' }}</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                  <div v-else class="checklist-empty">No checklist saved for this TID.</div>
                </div>
              </div>
              <div v-if="!printEntries.length" class="print-srf-entry">
                <div class="entry-grid">
                  <div class="entry-field"><span class="field-label">TID</span><span class="field-value">{{ displayValue(props.deviceText?.tid) }}</span></div>
                  <div class="entry-field"><span class="field-label">Device Type</span><span class="field-value">{{ displayValue(props.printObject?.devicesTypes) }}</span></div>
                  <div class="entry-field"><span class="field-label">Device Status</span><span class="field-value">{{ displayValue(props.printObject?.gps_status || 'offline') }}</span></div>
                </div>
              </div>
            </section>

            <!-- Legacy records stored the checklist at the parent Job Order level. -->
            <section v-if="!printEntries.some(entry => entry.checklist?.length || entry.checklistSections?.length || entry.sections?.length)" class="legacy-checklist">
              <div class="text-title" style="margin-left: 12px; margin-top: 10px;">Checklist</div>
              <table v-if="editableChecklist.length" class="task-table">
                <thead><tr><th>Task</th><th>Done</th><th>Remarks</th></tr></thead>
                <tbody>
                  <tr v-for="(item, index) in editableChecklist" :key="item._id || index">
                    <td>{{ item.text }}</td><td class="check-status">{{ item.done ? '✓' : '☐' }}</td><td>{{ item.remark || '' }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-else>
                <table class="task-table">
                  <thead><tr><th>Checklist Section / Task</th><th>Done</th><th>Remarks</th></tr></thead>
                  <tbody>
                    <template v-for="(section, sectionIndex) in editableSections" :key="section._id || sectionIndex">
                      <tr class="checklist-section-row"><th colspan="3">{{ section.sectionTitle || `Section ${sectionIndex + 1}` }}</th></tr>
                      <tr v-for="(option, optionIndex) in (section.options || [])" :key="option._id || optionIndex">
                        <td>{{ option.label || option.text || 'N/A' }}</td><td class="check-status">{{ option.isChecked ? '✓' : '☐' }}</td><td>{{ section.remarks || '' }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </section>

            <div class="text-title" style="margin-left: 5px; margin-top: 10px;">Persons-in-Charge</div>
            <div class="align-row">
              <div class="red">
                <div class="sub-align">
                  <div class="sub-text">Service Coordinator</div>
                  <div class="value-text">{{ props.printObject?.serviceCoordinator }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Technician</div>
                  <div class="value-text">{{ props.printObject?.technician }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Technical Advisor</div>
                  <div class="value-text">{{ props.printObject?.advisor }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">System Administrator</div>
                  <div class="value-text">{{ props.printObject?.admin }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Accounting Inventory</div>
                  <div class="value-text">{{ props.printObject?.inventory }}</div>
                </div>

                <div class="sub-align">
                  <div class="sub-text">Service Vehicle</div>
                  <div class="value-text">{{ props.printObject?.serviceVehicle || 'N/A' }}</div>
                </div>

              </div>
              <div class="blue">

                <div class="sub-align">
                  <div class="sub-text">Service Accepted By:</div>
                  <div class="value-text"></div>
                </div>

                <div class="text-title" style="margin-top: 40px;"></div>
                <div class="sub-center">
                  <div class="sub-text">______________________________</div>
                  <div class="value-text"></div>
                </div>
                <div class="sub-center">
                  <div class="sub-text">Signature over printed name</div>
                  <div class="value-text"></div>
                </div>

              </div>

            </div>


          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-show="specialRole" label="UPDATE CHECKLIST" color="dark" class="q-mt-md" @click="updatePrint" />
        <!-- <q-btn v-show="specialRole" label="UPDATE" color="dark" class="q-mt-md" @click="toolbar = true" /> -->
        <!-- <q-btn label="Print" color="primary" class="q-mt-md" @click="handlePrint" /> -->
        <!-- <q-btn v-show="props.printObject?.status_id === 'Approved' || props.printObject?.status_id === 'On-going' || props.printObject?.status_id === 'Completed'" label="Print" color="primary" class="q-mt-md" @click="handlePrint" /> -->
        <q-btn label="Print" color="primary" class="q-mt-md" @click="handlePrint" />
        <q-btn label="Close" color="red" class="q-mt-md" @click="emit('update:printPage', false)" />
      </q-card-actions>
    </q-card>
     <PrintUpdate v-model:toolbar="toolbar" :updateObject="printObject" />
  </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { srfStore } from '../stores/srfStore.js';
import PrintUpdate from './PrintUpdate.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const store = srfStore();

const testArray = ref([]);
const editableChecklist = ref([])
const editableSections = ref([])

const specialRole = ref(localStorage.getItem('special') === 'true')

const props = defineProps({
  printPage: Boolean,
  printObject: Object,
  clientText: Object,
  deviceText: Object,
  updateObject: Object,
  Get: Object
})

const emit = defineEmits(['update:printPage'])

// A Job Order can contain multiple SRF/device entries. Print each child entry
// while retaining compatibility with older single-SRF records.
const printEntries = computed(() => {
  const entries = props.printObject?.jobOrders
  if (Array.isArray(entries) && entries.length) return entries
  if (props.printObject && (props.printObject.srf_id || props.printObject.device_id || props.deviceText?.tid)) {
    return [{
      srf_id: props.printObject.srf_id,
      device_id: props.deviceText?.tid || props.printObject.device_id,
      task: props.printObject.task,
      plateNumber: props.printObject.plateNumber,
      vehicleType: props.printObject.vehicleType,
      odometer: props.printObject.odometer,
      devicesTypes: props.printObject.devicesTypes,
      deviceType: props.printObject.deviceType,
      scn: props.deviceText?.scn || props.printObject.scn,
      min: props.deviceText?.min || props.printObject.min,
      imei: props.deviceText?.imei || props.printObject.imei,
      new_scn: props.deviceText?.new_scn || props.printObject.new_scn,
      new_min: props.deviceText?.new_min || props.printObject.new_min,
      new_imei: props.printObject.new_imei,
      technician_remarks: props.printObject.technician_remarks
    }]
  }
  return []
})

const displayValue = (value) => {
  if (value && typeof value === 'object') return value.label || value.value || value.name || value._id || 'N/A'
  return value === undefined || value === null || value === '' ? 'N/A' : value
}

const printableRef = ref(null)
const toolbar = ref(false)
const updateObject = ref({})

const right = ref(false)

const handlePrint = () => {
  const checkboxes = printableRef.value.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach(cb => {
    if (cb.checked) cb.setAttribute('checked', 'checked')
    else cb.removeAttribute('checked')
  })

  // 🔥 Sync textarea values (remarks)
  const textareas = printableRef.value.querySelectorAll('textarea')
  textareas.forEach(ta => {
    ta.innerHTML = ta.value
  })
  const printContent = printableRef.value?.innerHTML || ''
  const printWindow = window.open('', '', 'width=900,height=1000')

  printWindow.document.write(`
    <html>
      <head>
        <title>Service Request Form</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            margin: 0;
            padding: 0;
          }

          table {
            table-layout: fixed;
          }

          .align-row {
            display: flex;
            flex-direction: row;
          }

          .excel-form {
            display: flex;
            flex-direction: column;
            border: 1px solid #070000;
            font-size: 14px;
            width: 100%;
            max-width: 760px;
            margin: auto;
            background-color: white;
          }

          .align-row {
            display: flex;
            flex-direction: row;
          }

          .red {
            display: flex;
            flex-direction: column;
            width: 400px;
          }

          .blue {
            display: flex;
            flex-direction: column;
            width: 400px;
          }

          .main-title {
            margin-left: 4px;
            margin-top: 10px;
            font-size: 17px;
            color: black;
            font-weight: bold;
          }

          .print-srf-entry {
            border: 1px solid #999;
            padding: 6px 4px;
            margin: 0 6px 8px;
            break-inside: avoid;
          }

          .entry-heading {
            font-weight: bold;
            margin: 2px 6px 6px;
            border-bottom: 1px solid #bbb;
            padding-bottom: 3px;
          }

          .version-title {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            font-size: 15px;
            color: black;
            margin-right: 20px;
          }

          .text-title {
            margin-left: 12px;
            margin-bottom: 10px;
            font-size: 16px;
            color: black;
            font-weight: bold;
          }

          .sub-align {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-left: 14px;
            margin-right: 14px;
            margin-bottom: 2px;
          }

          .sub-center {
            display: flex;
            flex-direction: row;
            justify-content: center;
          }

          .double-align {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }

          .sub-text {
            font-size: 14px;
            color: black;
            font-weight: bold;
            margin-right: 20px;
          }

          .value-text {
            font-size: 14px;
            color: black;
            font-weight: lighter;
          }

          .row {
            display: flex;
            width: 800px;
            flex-wrap: wrap;
          }

          .cell {
            border: 1px solid #080000;
            padding: 8px 10px;
            box-sizing: border-box;
          }

          .bold {
            font-weight: bold;
            background-color: #f1f1f1;
          }

          .task-table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
          }

          .task-table, .task-table td {
            border: 1px solid #ccc;
            padding: 8px 12px;
            text-align: left;
          }

          .task-table thead {
            border: none;
          }

          .task-table tbody tr {
            background-color: #fafafa;
          }

          .task-width {
            width: 30%;
          }

          .remark-width {
            width: 20%;
          }
          
          .remark-fit {
            width: 100%;
          }

          .remark-fit .q-field__control {
            padding: 0 !important;
            min-height: unset !important;
          }

          .remark-fit textarea {
            width: 100%;
            border: none;
            outline: none;
            resize: none;
            background: transparent;
            padding: 4px 6px;
            font-size: 14px;
            box-sizing: border-box;
          }

          .remark-fit textarea:not(:focus) {
            background: transparent;
          }

          .task-table td {
            padding: 0;
          }

          .excel-form {
            width: 100%;
            max-width: none;
            border: 0;
            color: #000;
            font-size: 11px;
            font-weight: 500;
          }

          .align-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 18px;
            align-items: start;
          }

          .red, .blue {
            width: auto;
            min-width: 0;
          }

          .main-title {
            margin: 0 0 4px;
            font-size: 16px;
            line-height: 1.25;
          }

          .version-title {
            margin: 0 0 12px;
            font-size: 9px;
          }

          .text-title {
            margin: 10px 0 6px;
            font-size: 12px;
            line-height: 1.3;
            padding-bottom: 4px;
            border-bottom: 1px solid #444;
          }

          .sub-align {
            display: grid;
            grid-template-columns: minmax(92px, 42%) minmax(0, 1fr);
            gap: 8px;
            margin: 0 0 5px;
            align-items: start;
          }

          .sub-text, .value-text {
            font-size: 10px;
            font-weight: 500;
            line-height: 1.35;
            margin: 0;
            color: #000;
            overflow-wrap: anywhere;
          }

          .value-text { text-align: left; }

          .entries-section { margin-top: 14px; }

          .section-heading {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }

          .entry-count {
            font-size: 10px;
            font-weight: 500;
            color: #000;
          }

          .print-srf-entry {
            border: 1px solid #333;
            border-radius: 2px;
            padding: 7px 8px;
            margin: 0 0 8px;
            break-inside: avoid;
          }

          .entry-heading {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin: 0 0 6px;
            padding: 0 0 5px;
            border-bottom: 1px solid #444;
            font-size: 11px;
          }

          .entry-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 6px 12px;
          }

          .handwritten-details { display: flex; flex-direction: column; gap: 7px; }
          .handwritten-row { display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 14px; align-items: end; }
          .handwritten-field { display: flex; align-items: baseline; gap: 5px; min-width: 0; }
          .handwritten-field .field-label { flex: 0 0 auto; }
          .handwritten-field .field-value { font-size: 10px; }
          .task-field { grid-column: span 1; }
          .write-line { display: inline-block; flex: 1 1 auto; min-width: 28px; height: 13px; border-bottom: 1px solid #555; }
          .device-type-field { grid-column: span 2; }
          .new-values-row { display: grid; grid-template-columns: 1fr 1.15fr; gap: 14px; margin-top: 3px; align-items: stretch; }
          .new-values-fields { display: flex; flex-direction: column; gap: 10px; padding: 4px 0; }
          .new-value-field { display: flex; align-items: baseline; gap: 5px; min-width: 0; }
          .new-value-field .field-label { flex: 0 0 auto; }
          .technician-remarks-box { border: 1px solid #555; min-height: 55px; padding: 5px; }
          .technician-remarks-box .field-label { display: block; }

          .entry-field {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
          }

          .wide-field { grid-column: span 2; }

          .field-label {
            font-size: 9px;
            font-weight: 700;
            color: #000;
            text-transform: uppercase;
            letter-spacing: .2px;
          }

          .field-value {
            font-size: 10px;
            font-weight: 500;
            line-height: 1.3;
            color: #000;
            overflow-wrap: anywhere;
          }

          .task-table {
            margin-top: 4px;
            font-size: 10px;
            color: #000;
          }

          .task-table th {
            background: #e5e5e5;
            font-weight: bold;
          }

          .task-table th, .task-table td {
            padding: 5px 6px;
            border: 1px solid #444;
            vertical-align: top;
            color: #000;
          }

          .task-width { width: 30%; }
          .remark-width { width: 20%; }

          @page { size: A4; margin: 12mm; }

          body { font-size: 11px; color: #000; font-weight: 500; }

          .excel-form, .entries-section, .task-table, .print-srf-entry {
            break-inside: auto;
          }

          .print-srf-entry { break-inside: avoid; }

          .align-row { break-inside: avoid; }
        
.tid-checklist { margin-top: 7px; break-inside: avoid; }
.checklist-heading { margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #000; }
.check-status { text-align: center; width: 52px; font-weight: 700; }
.checklist-section-row th { text-align: left; background: #ededed; }
.checklist-empty { font-size: 10px; color: #222; padding: 4px 0; }
.legacy-checklist { margin-top: 8px; }
@media print {
  .tid-checklist, .task-table, .print-srf-entry { break-inside: avoid; }
}
</style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.focus()

  printWindow.onload = () => {
    printWindow.print()
  }

  printWindow.onafterprint = () => {
    printWindow.close()
  }
}

const tasks = computed(() => {
  const list = editableChecklist.value || []

  // detect old format (array of strings)
  if (list.length && typeof list[0] === 'string') {
    return [] // prevent rendering broken data
  }

  return list
})

// Group into pairs for side-by-side tasks
const chunkedTasks = computed(() => {
  const chunks = []
  const list = tasks.value || []

  for (let i = 0; i < list.length; i += 2) {
    chunks.push([list[i], list[i + 1] || null])
  }

  testArray.value = chunks
  return chunks
})


const newTasks = computed(() => {
  editableSections.value = Array.isArray(props.printObject?.sections)
    ? props.printObject.sections
    : []

  const chunks = []
  for (let i = 0; i < editableSections.value.length; i += 2) {
    chunks.push([editableSections.value[i], editableSections.value[i + 1] || null])
  }
  return chunks
})


const updatePrint = async () => {

  try {
    const payload = {}
    if (editableChecklist.value.length > 0) {
      payload.checklist = editableChecklist.value
    } else {
      payload.sections = editableSections.value
    }
    await store.updateSRFChecklist(props.printObject._id, payload)
    emit('update:printPage', false)
    editableChecklist.value = []
    editableSections.value = []
    $q.notify({
      type: 'positive',
      message: 'Checklist updated'
    })
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: 'Update failed'
    })
  }
}

const submitDelete = async () => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this SRF?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await store.deleteSRF(props.printObject?._id);
      await store.getAllSRF();
      $q.notify({ type: 'positive', message: 'SRF deleted successfully!' });
      emit('update:printPage', false)
    } catch (err) {
      console.error('Delete error:', err);
      $q.notify({ type: 'negative', message: 'Failed to delete SRF.' });
    }
  });
};

watch(
  () => props.printObject?.checklist,
  (val) => {
    editableChecklist.value = val
      ? JSON.parse(JSON.stringify(val)) // deep clone
      : []
  },
  { immediate: true }
)

watch(
  () => props.printObject?.sections,
  (val) => {
    editableSections.value = val
      ? JSON.parse(JSON.stringify(val)) // deep clone
      : []
  },
  { immediate: true }
)

</script>

<style scoped>
.excel-form {
  display: flex;
  flex-direction: column;
  border: 1px solid #070000;
  font-size: 14px;
  width: 800px;
  margin: auto;
  background-color: white;
}

.align-row {
  display: flex;
  flex-direction: row;
}

.red {
  display: flex;
  flex-direction: column;
  width: 400px;
}

.blue {
  display: flex;
  flex-direction: column;
  width: 400px;
}

.main-title {
  margin-left: 4px;
  margin-top: 10px;
  font-size: 17px;
  color: black;
  font-weight: bold;
}

.print-srf-entry {
  border: 1px solid #999;
  padding: 6px 4px;
  margin: 0 6px 8px;
  break-inside: avoid;
}

.entry-heading {
  font-weight: bold;
  margin: 2px 6px 6px;
  border-bottom: 1px solid #bbb;
  padding-bottom: 3px;
}

.handwritten-details { display: flex; flex-direction: column; gap: 7px; }
.handwritten-row { display: grid; grid-template-columns: 1.15fr 1fr 1fr; gap: 14px; align-items: end; }
.handwritten-field { display: flex; align-items: baseline; gap: 5px; min-width: 0; }
.handwritten-field .field-label { flex: 0 0 auto; }
.write-line { display: inline-block; flex: 1 1 auto; min-width: 28px; height: 13px; border-bottom: 1px solid #555; }
.device-type-field { grid-column: span 2; }
.new-values-row { display: grid; grid-template-columns: 1fr 1.15fr; gap: 14px; margin-top: 3px; align-items: stretch; }
.new-values-fields { display: flex; flex-direction: column; gap: 10px; padding: 4px 0; }
.new-value-field { display: flex; align-items: baseline; gap: 5px; min-width: 0; }
.new-value-field .field-label { flex: 0 0 auto; }
.technician-remarks-box { border: 1px solid #555; min-height: 55px; padding: 5px; }
.technician-remarks-box .field-label { display: block; }

.version-title {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: 15px;
  color: black;
  margin-right: 20px;
}

.text-title {
  margin-left: 12px;
  margin-bottom: 10px;
  font-size: 16px;
  color: black;
  font-weight: bold;
}

.sub-align {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 14px;
  margin-right: 14px;
  margin-bottom: 2px;
}

.sub-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.double-align {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.sub-text {
  font-size: 14px;
  color: black;
  font-weight: bold;
  margin-right: 20px;
}

.value-text {
  font-size: 14px;
  color: black;
  font-weight: lighter;
}

.row {
  display: flex;
  width: 800px;
  flex-wrap: wrap;
}

.cell {
  border: 1px solid #080000;
  padding: 8px 10px;
  box-sizing: border-box;
}

.bold {
  font-weight: bold;
  background-color: #f1f1f1;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}

.task-table, .task-table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: left;
}

.task-table thead {
  border: none;
}

.task-table tbody tr {
  background-color: #fafafa;
}

.task-width {
  width: 30%;
}

.remark-width {
  width: 20%;
}

.remark-fit {
  width: 100%;
}

.remark-fit .q-field__control {
  padding: 0 !important;
  min-height: unset !important;
}

.remark-fit textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  padding: 4px 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.remark-fit textarea:not(:focus) {
  background: transparent;
}

.task-table td {
  padding: 0;   /* lets textarea align exactly to borders */
}

/* Clean, full-width print layout */
.excel-form {
  width: 100%;
  max-width: 100%;
  border: 0;
  color: #000;
  font-size: 11px;
  font-weight: 500;
}
.align-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}
.red, .blue { width: auto; min-width: 0; }
.main-title { margin: 0 0 4px; font-size: 16px; line-height: 1.25; }
.version-title { margin: 0 0 12px; font-size: 9px; }
.text-title {
  margin: 10px 0 6px;
  font-size: 12px;
  line-height: 1.3;
  padding-bottom: 4px;
  border-bottom: 1px solid #444;
}
.sub-align {
  display: grid;
  grid-template-columns: minmax(92px, 42%) minmax(0, 1fr);
  gap: 8px;
  margin: 0 0 5px;
  align-items: start;
}
.sub-text, .value-text { font-size: 10px; font-weight: 500; line-height: 1.35; margin: 0; color: #000; overflow-wrap: anywhere; }
.value-text { text-align: left; }
.entries-section { margin-top: 14px; }
.section-heading { display: flex; justify-content: space-between; align-items: baseline; }
.entry-count { font-size: 10px; font-weight: 500; color: #000; }
.print-srf-entry {
  border: 1px solid #333;
  border-radius: 2px;
  padding: 5px 7px;
  margin: 0 0 7px;
  break-inside: avoid;
}
.entry-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 0 0 4px;
  padding: 0 0 3px;
  border-bottom: 1px solid #444;
  font-size: 11px;
}
.entry-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px 10px; }
.entry-field { display: flex; flex-direction: row; align-items: baseline; gap: 5px; min-width: 0; }
.wide-field { grid-column: span 2; }
.field-label { flex: 0 0 38%; font-size: 9px; line-height: 1.15; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: .15px; }
.field-value { flex: 1 1 auto; min-width: 0; font-size: 10px; font-weight: 500; color: #000; line-height: 1.2; overflow-wrap: anywhere; }
.task-table { margin-top: 4px; font-size: 10px; color: #000; }
.task-table th { background: #e5e5e5; font-weight: 700; color: #000; }
.task-table th, .task-table td { padding: 5px 6px; border: 1px solid #444; vertical-align: top; color: #000; }
@media (max-width: 700px) {
  .align-row { grid-template-columns: minmax(0, 1fr); }
  .entry-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.tid-checklist { margin-top: 7px; break-inside: avoid; }
.checklist-heading { margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #000; }
.check-status { text-align: center; width: 52px; font-weight: 700; }
.checklist-section-row th { text-align: left; background: #ededed; }
.checklist-empty { font-size: 10px; color: #222; padding: 4px 0; }
.legacy-checklist { margin-top: 8px; }
@media print {
  .tid-checklist, .task-table, .print-srf-entry { break-inside: avoid; }
}
</style>
