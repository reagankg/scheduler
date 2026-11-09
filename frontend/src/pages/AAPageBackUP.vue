<template>
  <div class="srf-page">
    <q-card class="q-pa-sm">
      <CalendarHeader />
      <CalendarStats class="q-mb-lg" />
      <CalendarToolbar class="q-mb-lg" />

      <div class="row q-col-gutter-md">

        <div class="col">

            <CalendarGrid
              @preview-job="showPreviewDialog = true"
              @open-jobs="showJobsDialog = true"
              @manage-technician="showDayOffDialog = true"
              :users="users"
              :week-days="weekDays"
            />

            <JobsModal
                v-model="showJobsDialog"

                technician="Joselito Hugo"

                date="Monday, July 13, 2026"

                @view-srf="openSRF"

                :jobs="[
                    {
                        id:1,
                        task:'Preventive Maintenance',
                        time:'08:00 AM - 12:00 PM',
                        location:'CityCare Hospital'
                    },
                    {
                        id:2,
                        task:'Repair',
                        time:'01:00 PM - 04:00 PM',
                        location:'Metro Diagnostic'
                    }
                ]"
            />
        </div>

      </div>
      <JobPreviewModal

          v-model="showPreviewDialog"

          :job="previewJob"

      />

      <!-- Header -->
      <!-- <div class="row items-center q-gutter-sm q-mb-sm">
        <div class="col row items-center q-gutter-sm">
          <q-btn color="green" label="Prev" @click="prevMonth" />
          <div class="text-subtitle1 q-ml-sm">{{ displayMonthYear }}</div>
          <q-btn color="green" label="Next" @click="nextMonth" />

           
              <q-select
                v-model="selectedTechnician"
                :options="technicianOptions"
                label="Technician"
                dense
                outlined
                emit-value
                map-options
                color="green"
                style="min-width: 220px"
              />
        </div>
      </div> -->

      <!-- Calendar -->
      <!-- <div class="calendar-wrap">
        <table class="calendar">
          <thead>
            <tr>
              <th class="month-col sticky-left sticky-top">Technician</th>
              <th
                v-for="d in days"
                :key="d"
                class="day-head sticky-top"
              >
                {{ d }}<br />
                <span class="day-name">{{ dayName(d) }}</span>
              </th>
            </tr>
          </thead>

          <tbody>


            <tr v-for="user in users" :key="user.id">

              <td
                class="user-col sticky-left technician-name"
                @click="openDayOffDialog(user)"
              >
                {{ user.name }}
              </td>


              <td
                v-for="d in days"
                :key="user.id + '-' + d"
                class="day-cell"
                :class="{ 'day-off': isDayOff(user, d) }"
              >

                <div
                  v-if="isDayOff(user, d) && !hasEvent(user, d)"
                  class="day-off-overlay"
                  title="Day Off"
                >
                  Day Off
                </div>


                <div
                  v-if="isLeave(user, d)"
                  class="leave-overlay"
                >
                  Leave
                </div>


                <div
                  v-if="getHoliday(d)"
                  class="holiday-overlay"
                >
                  {{ getHoliday(d) }}
                </div>


                <div
                  v-if="getEventsForDay(user, d).length"
                  class="event-pill task clickable"
                  @click.stop="openJobsDialog(user, d)"
                >
                  {{ getEventsForDay(user, d).length }}
                  {{ getEventsForDay(user, d).length === 1 ? 'Job' : 'Jobs' }}
                </div>
              </td>
            </tr>


            <tr v-if="users && users.length === 0">
              <td :colspan="days.length + 1" class="text-center q-pa-md">
                No technicians available
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->

      <q-dialog v-model="showEventDialog" persistent>
        <q-card class="event-dialog">


          <div class="event-dialog-header">
            <div class="text-subtitle1 text-white">
              Task Details
            </div>

            <q-btn
              icon="close"
              flat
              round
              dense
              color="white"
              v-close-popup
            />
          </div>


          <q-card-section class="event-dialog-body" v-if="selectedEvent">
            <div class="q-mb-sm">
              <strong>Technician:</strong> {{ selectedEvent.technician }}
            </div>

            <div class="q-mb-sm">
              <strong>Date:</strong>
              {{ selectedEvent.month }} {{ selectedEvent.day }},
              {{ selectedEvent.year }}
            </div>

            <div class="q-mb-sm">
              <strong>Time:</strong>
              {{ selectedEvent.time || 'Not specified' }}
            </div>

            <div class="q-mb-sm">
              <strong>Location:</strong>
              {{ selectedEvent.location || 'Not specified' }}
            </div>

            <div class="q-mb-sm">
              <strong>Task:</strong>
              {{ selectedEvent.label }}
            </div>
          </q-card-section>

        </q-card>
      </q-dialog>

      <q-dialog
        v-model="showDayOffDialog"
        persistent
        no-esc-dismiss
        no-backdrop-dismiss
      >
        <q-card class="calendar-modal">

          <div class="modal-header">

            <div>

                <div class="modal-title">
                    {{ selectedTechnicianName }}
                </div>

                <div class="modal-subtitle">
                    Field Technician
                </div>

            </div>

            <q-btn
                icon="close"
                flat
                round
                dense
                color="white"
                @click="showDayOffDialog = false"
            />

        </div>

          <q-card-section class="modal-body">

            <q-tabs
              v-model="activeTab"
              dense
              class="text-green"
              active-color="green"
              indicator-color="green"
            >
              <q-tab name="dayoff" label="Day Off" />
              <q-tab name="leave" label="Leaves" />
            </q-tabs>

            <q-separator />


            <q-tab-panels v-model="activeTab" animated>


              <q-tab-panel name="dayoff" class="dayoff-panel">

                <!-- <div class="row q-col-gutter-md">

                  <div class="col-5">
                    <q-option-group
                      v-model="selectedDayOff"
                      type="checkbox"
                      :options="weekdayOptions"
                      @update:model-value="onDayOffChange"
                    />
                  </div>

  
                  <div class="col-7">
                    <q-table
                      dense
                      flat
                      bordered
                      :rows="currentDayOffHistory"
                      :columns="historyColumns"
                      row-key="_id"
                      class="history-table"
                    />
                  </div>

                </div> -->

                <div class="row q-col-gutter-lg">

                  <!-- Day Off Card -->

                  <div class="col-12 col-md-5">

                      <q-card flat bordered class="settings-card">

                          <q-card-section>

                              <div class="card-title">
                                  Weekly Day Off
                              </div>

                          </q-card-section>

                          <q-separator />

                          <q-card-section>

                              <q-option-group
                                  v-model="selectedDayOff"
                                  type="checkbox"
                                  :options="weekdayOptions"
                                  @update:model-value="onDayOffChange"
                                  class="weekday-group"
                              />

                          </q-card-section>

                      </q-card>

                  </div>

                  <!-- History Card -->

                  <div class="col-12 col-md-7">

                      <q-card flat bordered class="settings-card">

                          <q-card-section>

                              <div class="card-title">
                                  History
                              </div>

                          </q-card-section>

                          <q-separator />

                          <q-card-section class="q-pa-none">

                              <q-table
                                  dense
                                  flat
                                  :rows="currentDayOffHistory"
                                  :columns="historyColumns"
                                  row-key="_id"
                                  class="history-table"
                                  hide-bottom
                              />

                          </q-card-section>

                      </q-card>

                  </div>

              </div>


                <q-card-actions class="dayoff-actions">
                  <q-btn
                    color="primary"
                    label="Save"
                    @click="saveDayOff"
                  />
                </q-card-actions>

              </q-tab-panel>


              <q-tab-panel name="leave">

                <q-btn
                  color="green"
                  label="Add Leave"
                  icon="event"
                  dense
                  @click="showLeaveDialog = true"
                />


                <q-table
                  dense
                  flat
                  bordered
                  :rows="currentLeaves"
                  :columns="leaveColumns"
                  row-key="_id"
                  class="q-mt-sm"
                >
                  <!-- ACTION COLUMN -->
                  <template #body-cell-action="props">
                    <q-td align="center">
                      <q-btn
                        icon="delete"
                        dense
                        flat
                        round
                        color="red"
                        @click="deleteLeave(props.row)"
                      />
                    </q-td>
                  </template>
                </q-table>


              </q-tab-panel>

            </q-tab-panels>

          </q-card-section>
        </q-card>
        <q-dialog
          v-model="showLeaveDialog"
          persistent
          no-esc-dismiss
          no-backdrop-dismiss
        >
          <q-card style="min-width: 300px">

            <!-- GREEN HEADER -->
            <div class="modal-header">
              <div class="text-h6 text-white">
                Leaves
              </div>

              <q-btn
                icon="close"
                flat
                round
                dense
                color="white"
                @click="showLeaveDialog = false"
              />
            </div>

            <!-- BODY -->
            <q-card-section class="q-pa-md">

              <q-date
                v-model="leaveRange"
                range
                color="green"
                minimal
                emit-immediately
                mask="YYYY-MM-DD"
              />

            </q-card-section>

            <!-- FOOTER -->
            <q-card-actions align="right">
              <q-btn
                color="green"
                label="Save"
                @click="saveLeave"
              />
            </q-card-actions>

          </q-card>
        </q-dialog>

      </q-dialog>

      <q-dialog v-model="showJobsDialog">
        <q-card style="min-width:700px">

          <div class="event-dialog-header">
            <div class="text-subtitle1 text-white">
              {{ selectedJobTechnician }}
            </div>

            <q-btn
              icon="close"
              flat
              round
              dense
              color="white"
              v-close-popup
            />
          </div>

          <q-card-section>

            <div class="text-subtitle2 q-mb-md">
              {{ selectedJobDate.month }}
              {{ selectedJobDate.day }},
              {{ selectedJobDate.year }}
            </div>

            <q-list bordered separator>

              <q-item
                v-for="job in selectedJobs"
                :key="job.id"
                clickable
                @click="openEvent(job, selectedJobDate.day, { name: selectedJobTechnician })"
              >
                <q-item-section>

                  <q-item-label>
                    {{ job.label }}
                  </q-item-label>

                  <q-item-label caption>
                    {{ job.time || 'No time' }}
                  </q-item-label>

                </q-item-section>

              </q-item>

            </q-list>

          </q-card-section>

        </q-card>
      </q-dialog>


    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { userStore } from '../stores/userStore'
import { useCalendarStore } from '../stores/calendarStore'
import socket from '../plugins/socket'
import {
  PH_NON_WORKING_HOLIDAYS
} from '../utils/phHolidays'

import CalendarHeader from 'src/components/calendar/CalendarHeader.vue'
import CalendarToolbar from 'src/components/calendar/CalendarToolbar.vue'
import CalendarStats from 'src/components/calendar/CalendarStats.vue'
import CalendarGrid from 'src/components/calendar/CalendarGrid.vue'
import JobsModal from 'src/components/calendar/JobsModal.vue'
import JobPreviewModal from 'src/components/calendar/JobPreviewModal.vue'

/* ---------------- DATE LOGIC ---------------- */
const activeTab = ref('dayoff')
const today = new Date()
const monthIndex = ref(today.getMonth())
const year = ref(today.getFullYear())
const selectedTechnician = ref('all')
const showEventDialog = ref(false)
const selectedEvent = ref(null)


const selectedTechnicianId = ref(null)
const selectedTechnicianName = ref('')

const showDayOffDialog = ref(false)
const selectedDayOff = ref([]) // array of weekday numbers

const showLeaveDialog = ref(false)

const showJobsDialog = ref(false)
const selectedJobs = ref([])
const selectedJobDate = ref(null)
const selectedJobTechnician = ref('')

const calendarStore = useCalendarStore()
const userStores = userStore()

defineProps({
    technician:Object,
    date:Object,
    jobs:Array
})

const weekdayOptions = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 }
]

const leaveColumns = [
  { name: 'from', label: 'From', field: 'startDate', align: 'center' },
  { name: 'to', label: 'To', field: 'endDate', align: 'center' },
  { name: 'reason', label: 'Reason', field: 'reason', align: 'left' },
  { name: 'action', label: 'Action', field: 'action', align: 'center' }
]

const historyColumns = [
  {
    name: 'changedAt',
    label: 'Changed At',
    field: row =>
      new Date(row.changedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
    align: 'center',
  },
  {
    name: 'from',
    label: 'From',
    field: row => formatDays(row.from),
    align: 'center',
  },
  {
    name: 'to',
    label: 'To',
    field: row => formatDays(row.to),
    align: 'center',
  }
]

const showPreviewDialog = ref(false)

const previewJob = ref({

    task:'Preventive Maintenance',

    status:'Approved',

    client:'CityCare Hospital',

    technician:'Joselito Hugo',

    coordinator:'Reagan',

    date:'July 13, 2026',

    time:'08:00 AM - 12:00 PM',

    priority:'High',

    remarks:'Annual preventive maintenance.'

})

const weekDays = computed(() => {

    const days = []

    const totalDays = new Date(
        year.value,
        monthIndex.value + 1,
        0
    ).getDate()

    for (let day = 1; day <= totalDays; day++) {

        const date = new Date(
            year.value,
            monthIndex.value,
            day
        )

        days.push({

            date,

            dayNumber: day,

            dayName: date.toLocaleDateString('en-US', {
                weekday: 'short'
            })

        })

    }

    return days

})

function openSRF(job) {
    showPreviewDialog.value = true
}

const monthHolidayMap = computed(() => {
  const y = year.value
  const holidays = PH_NON_WORKING_HOLIDAYS?.[y] || {}

  const map = {}

  for (const dateKey in holidays) {
    const [, m, d] = dateKey.split('-').map(Number)

    if (m - 1 === monthIndex.value) {
      map[d] = holidays[dateKey]
    }
  }

  return map
})

function openJobsDialog(user, day) {
  selectedJobs.value = getEventsForDay(user, day)

  selectedJobDate.value = {
    day,
    month: displayMonthLabel.value,
    year: year.value
  }

  selectedJobTechnician.value = user.name

  showJobsDialog.value = true
}

function hasEvent(user, day) {
  return getEventsForDay(user, day)?.length > 0
}

const leaveRange = ref({
  from: null,
  to: null
})

async function deleteLeave(row) {
  try {
    await calendarStore.deleteLeave(
      selectedTechnicianId.value,
      row._id
    )
  } catch (err) {
    console.error(err)
  }
}

function isLeave(user, day) {
  if (!Array.isArray(user.leaves)) return false

  const y = year.value
  const m = String(monthIndex.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')

  const dateKey = `${y}-${m}-${d}`

  return user.leaves.some(l => {
    return dateKey >= l.startDate && dateKey <= l.endDate
  })
}

function normalizeLeave(val) {
  if (!val) return null

  if (typeof val === 'string') {
    return { startDate: val, endDate: val }
  }

  if (val.from) {
    return {
      startDate: val.from,
      endDate: val.to || val.from
    }
  }

  return null
}

function getHoliday(day) {
  return monthHolidayMap.value?.[day] || null
}

function openDayOffDialog(user) {
  selectedTechnicianId.value = user.id
  selectedTechnicianName.value = user.name
  selectedDayOff.value = [...(user.dayOff || [])]
  showDayOffDialog.value = true
}


const displayMonthLabel = computed(() =>
  new Date(year.value, monthIndex.value)
    .toLocaleString('default', { month: 'long' })
)

const displayMonthYear = computed(
  () => `${displayMonthLabel.value} ${year.value}`
)

const currentLeaves = computed(() => {
  const user = userStores.users.find(
    u => u._id === selectedTechnicianId.value
  )
  return user?.leaves || []
})


function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate()
}

const days = computed(() =>
  Array.from({ length: daysInMonth(year.value, monthIndex.value) }, (_, i) => i + 1)
)

function prevMonth() {
  monthIndex.value === 0
    ? (monthIndex.value = 11, year.value--)
    : monthIndex.value--
}

function nextMonth() {
  monthIndex.value === 11
    ? (monthIndex.value = 0, year.value++)
    : monthIndex.value++
}

function dayName(day) {
  return new Date(year.value, monthIndex.value, day)
    .toLocaleDateString('default', { weekday: 'short' })
}


/* ---------------- USERS (SAFE COMPUTED) ---------------- */
const users = computed(() => {
  if (!Array.isArray(calendarStore.technicians)) return []

  return calendarStore.technicians.map(t => {
    const fullUser = userStores.users.find(u => u._id === t.id)

    return {
      id: t.id,
      name: t.name,
      dayOff: fullUser?.dayOff || [],
      leaves: fullUser?.leaves || [],   // ⭐ ADD THIS
      events: calendarStore.eventsByTechnician?.[t.name] || []
    }
  }).filter(u =>
    selectedTechnician.value === 'all'
      ? true
      : u.name === selectedTechnician.value
  )
})


/* ---------------- HELPERS ---------------- */
function getEventsForDay(user, day) {
  return user.events.filter(ev => ev.day === day)
}

function onDayOffChange(val) {
  // Enforce only ONE checked at a time
  if (val.length > 1) {
    selectedDayOff.value = [val[val.length - 1]]
  }
}


/* ---------------- LOAD ---------------- */
async function loadCalendar() {
  if (!calendarStore) return
  await calendarStore.loadMonth(year.value, monthIndex.value + 1)
}

const technicianOptions = computed(() => {
  const techs = calendarStore.technicians || []

  return [
    { label: 'All', value: 'all' },
    ...techs.map(t => ({
      label: t.name,
      value: t.name
    }))
  ]
})

function openEvent(ev, day, user) {
  selectedEvent.value = {
    ...ev,
    day,
    technician: user.name,
    month: displayMonthLabel.value,
    year: year.value
  }
  showEventDialog.value = true
}


onMounted(async () => {
  const userStores = userStore()
  const calendarStore = useCalendarStore()
  if (!userStores.users.length) {
    await userStores.getAllUser()
  }
  await loadCalendar()

  // Real-time listeners
  socket.on('calendar:update', calendarStore.applyChange)
  socket.on('user-change', handleUserChange)
  socket.on('calendar:remove', payload =>
    calendarStore.removeEvent(payload.srfId)
  )
})

async function saveDayOff() {
  if (!selectedTechnicianId.value) return

  try {
    await calendarStore.updateDayOff(
      selectedTechnicianId.value,
      { dayOff: selectedDayOff.value }
    )

    showDayOffDialog.value = false
  } catch (err) {
    console.error(err)
  }
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

function formatDays(arr) {
  if (!Array.isArray(arr)) return ''
  return arr.map(d => WEEKDAY_NAMES[d]).join(', ')
}

const currentDayOffHistory = computed(() => {
  const user = userStores.users.find(
    u => u._id === selectedTechnicianId.value
  )
  return user?.dayOffHistory || []
})

function isDayOff(user, day) {
  if (!Array.isArray(user.dayOff)) return false

  const y = year.value
  const m = monthIndex.value
  const d = day

  const weekday = new Date(y, m, d, 12).getDay() // force noon
  return user.dayOff.includes(weekday)
}

function handleUserChange(change) {
  if (change.operationType !== 'update') return

  const updatedUser = change.fullDocument
  if (!updatedUser) return

  const index = userStores.users.findIndex(
    u => u._id === updatedUser._id
  )

  if (index !== -1) {
    // 🔥 Update only what changed
    userStores.users[index].dayOff = updatedUser.dayOff || []
    userStores.users[index].leaves = updatedUser.leaves || []
  }
}

async function saveLeave() {
  const normalized = normalizeLeave(leaveRange.value)
  if (!normalized) return

  try {
    await calendarStore.addLeave(
      selectedTechnicianId.value,
      normalized
    )

    showLeaveDialog.value = false
    leaveRange.value = { from:null, to:null }

  } catch (err) {
    console.error(err)
  }
}

watch([year, monthIndex], loadCalendar)

watch(leaveRange, val => {
  console.log('UPDATED RANGE:', val)
}, { deep: true })

onBeforeUnmount(() => {
    socket.off("calendar:update", calendarStore.applyChange);
    socket.off("calendar:remove");
    socket.off("user-change", handleUserChange);
});

// onBeforeUnmount(() => {
//   socket.off('calendar:update', calendarStore.applyChange)
//   socket.off('calendar:remove')
//   socket.on('user-change', (change) => {
//     if (change.operationType !== 'update') return;

//     const updatedUser = change.fullDocument;
//     if (!updatedUser) return;

//     // update userStore.users
//     const idx = userStores.users.findIndex(
//       u => u._id === updatedUser._id
//     );

//     if (idx !== -1) {
//       userStores.users[idx] = updatedUser;
//     }
//   });
// })
</script>


<style scoped>
.calendar-wrap {
  overflow: auto;        /* enable vertical + horizontal scroll */
  max-height: 65vh;      /* controls how tall the table area is */
}
.calendar { border-collapse: collapse; width: 100%; table-layout: fixed }
.calendar th, .calendar td { border: 1px solid #cfcfcf }

.month-col { width: 220px }
.day-head { width: 90px; background: #8bc34a; color: #fff }
.day-name { font-size: 11px; opacity: 0.9 }

.user-col { padding: 8px; font-weight: 600; background: #fff }
.day-cell { height: 90px; vertical-align: top; padding: 4px }

.event-pill {
  border-radius: 6px;
  padding: 6px;
  margin-bottom: 4px;
  font-size: 12px;
  text-align: center;
  font-weight: 600;
}

.event-pill.task {
  background: #fff;
  border: 1px solid #8bc34a;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 3;
}

.sticky-left {
  position: sticky;
  left: 0;
  z-index: 10;
}

.calendar thead th.sticky-left {
  background: #8bc34a;
  color: #fff;
  z-index: 20;
}

.month-col,
.user-col {
  min-width: 220px;
  max-width: 220px;
  width: 220px;
}

.calendar { position: relative; }

.clickable {
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.clickable:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.event-dialog {
  min-width: 500px;
  max-width: 90vw;
  border-radius: 6px;
  overflow: hidden;
}

/* Green header like your SRF form */
.event-dialog-header {
  background: #8bc34a;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Body scroll if content is long */
.event-dialog-body {
  max-height: 60vh;
  overflow-y: auto;
}

.technician-name {
  cursor: pointer;
}

.technician-name:hover {
  text-decoration: underline;
}

/* .day-off {
  background: #eeeeee;
  opacity: 0.6;
} */

.day-cell {
  position: relative;
}

.day-cell.day-off {
  background: transparent; /* 🔥 remove gray */
}

.day-off-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ff6b6b;   /* solid red */
  color: #ffffff;        /* pure white text */
  font-size: 12px;
  font-weight: 600;

  pointer-events: none;  /* events still clickable */
}

.holiday-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  background: rgba(255, 193, 7, 0.25);
  color: #000;
  font-size: 11px;
  font-weight: 600;

  pointer-events: none;
}

.modal-header {
    background:#16a34a;

    padding:22px 24px;

    display:flex;

    justify-content:space-between;

    align-items:flex-start;
}

.modal-title{

    font-size:28px;

    font-weight:700;

    color:white;

    line-height:1;

}

.modal-subtitle{

    margin-top:8px;

    color:rgba(255,255,255,.9);

    font-size:14px;

}

.settings-card{

    border-radius:12px;

    border:1px solid #e5e7eb;

}

.card-title{

    font-size:15px;

    font-weight:700;

    color:#111827;

}

.weekday-group{

    padding-top:6px;

}

.weekday-group :deep(.q-checkbox){

    width:100%;

    padding:10px 12px;

    border-radius:8px;

    transition:.2s;

}

.weekday-group :deep(.q-checkbox:hover){

    background:#f8fafc;

}

.weekday-group :deep(.q-checkbox + .q-checkbox){

    margin-top:4px;

}

.history-table{

    border-radius:0 0 12px 12px;

}

.history-table :deep(thead){

    background:#f9fafb;

}

.history-table :deep(th){

    font-weight:600;

}

.leave-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #7e57c2;
  color: #fff;
  font-size: 12px;
  font-weight: 600;

  pointer-events: none;
}

.day-off-soft {
  background: rgba(255, 0, 0, 0.08);
}

/* .history-table {
  width: 100%;
} */

/* 🔥 force q-table to NEVER expand wider than container */
.history-table .q-table {
  width: 100%;
  table-layout: fixed;
}

/* 🔥 this is the actual horizontal scroll container */
.history-table .q-table__middle {
  overflow-x: hidden !important;
}

/* 🔥 allow text to wrap instead of pushing width */
.history-table td,
.history-table th {
  white-space: normal;
  word-break: break-word;
}

.dayoff-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dayoff-actions {
  margin-top: auto;        /* pushes button to bottom */
  display: flex;
  justify-content: flex-end;
}

.srf-page{
  padding:2px;
  margin-top: -40px;
  margin-left: -14px;
}

.calendar-modal{

    width:min(900px, 95vw);

    max-height:90vh;

    border-radius:14px;

    overflow:hidden;

    display:flex;

    flex-direction:column;

}

.modal-body{

    flex:1;

    overflow:auto;

    padding:24px;

}

</style>
