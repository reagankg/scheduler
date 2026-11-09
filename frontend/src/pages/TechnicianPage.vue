<template>
  <div class="q-pa-md">

    <q-select
      v-model="selectedTech"
      :options="techOptions"
      label="Filter by technician"
      outlined
      dense
      emit-value
      map-options
      clearable
      clear-icon="close"
      color="positive"
      bg-color="green-1"
      style="max-width: 300px; margin: 0 auto 12px;"
    />

    <div style="width: 930px; height: 500px; margin: auto;">
      <FullCalendar :options="calendarOptions" />
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width:500px">
        <q-card-section>
          <div class="text-h6">Information Technician</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="singleForm.title" label="Technician" outlined dense readonly />
          <q-input v-model="singleForm.task" label="Task/s" outlined dense readonly />
          <q-input v-model="singleForm.date" label="Date" outlined dense readonly />
          <q-input v-model="singleForm.status" label="Status" outlined dense readonly />
          <q-input v-model="singleForm.location" label="Location" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="black" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { srfStore } from '../stores/srfStore.js'

const storeSrf = srfStore()

const events = ref([])
const selectedTech = ref(null)
const dialog = ref(false)

/* 🔑 Holiday cache per year */
const holidayCache = ref({})
const holidays = ref({})

const singleForm = ref({
  id: null,
  title: '',
  task: '',
  status: '',
  date: '',
  location: ''
})

/* ----------------------------------------
   Helpers
---------------------------------------- */
function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

/* ----------------------------------------
   Fetch holidays safely (ONCE per year)
---------------------------------------- */
async function loadHolidaysForYear(year) {
  if (holidayCache.value[year]) {
    holidays.value = holidayCache.value[year]
    return
  }

  const data = await storeSrf.fetchPhilippineHolidays(year)
  holidayCache.value[year] = data
  holidays.value = data
}

/* ----------------------------------------
   Calendar Options (STABLE)
---------------------------------------- */
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  editable: false,
  events: mergedEvents.value,

  /* View change → fetch holidays for that year */
  datesSet(arg) {
    const year = arg.view.currentStart.getFullYear()
    loadHolidaysForYear(year)
  },

  /* Paint holiday cells */
  dayCellDidMount(arg) {
    const key = toISODate(arg.date)
    const name = holidays.value[key]
    if (!name) return

    arg.el.style.backgroundColor = '#ffebee'

    const number = arg.el.querySelector('.fc-daygrid-day-number')
    if (number) {
      number.style.color = '#c62828'
      number.style.fontWeight = '700'
    }

    const label = document.createElement('div')
    label.textContent = name
    label.style.fontSize = '11px'
    label.style.color = '#c62828'
    label.style.opacity = '0.7'
    label.style.marginTop = '2px'

    arg.el.querySelector('.fc-daygrid-day-top')?.appendChild(label)
  },

  eventClick(info) {
    openEditDialog(info.event)
  }
}))

/* ----------------------------------------
   Technician Filter
---------------------------------------- */
const techOptions = computed(() => {
  const names = Array.from(new Set(events.value.map(e => e.title).filter(Boolean))).sort()
  return [
    { label: 'All technicians', value: null },
    ...names.map(n => ({ label: n, value: n }))
  ]
})

const filteredEvents = computed(() => {
  if (!selectedTech.value) return events.value
  return events.value.filter(e => e.title === selectedTech.value)
})

const mergedEvents = computed(() => filteredEvents.value)

/* ----------------------------------------
   Dialog
---------------------------------------- */
function openEditDialog(event) {
  singleForm.value = {
    id: event.id,
    title: event.title,
    task: event.extendedProps.task,
    date: event.startStr,
    status: event.extendedProps.status,
    location: event.extendedProps.location
  }
  dialog.value = true
}

/* ----------------------------------------
   Init SRF events
---------------------------------------- */
onMounted(async () => {
  await storeSrf.getAllSRF()

  events.value = storeSrf.allSRF
    .filter(i => (i.status_id || '').toLowerCase() !== 'draft')
    .map(i => ({
      id: i._id,
      title: i.technician,
      date: i.date,
      location: i.location,
      task: i.task,
      status: i.status_id,
      color: '#d32f2f'
    }))
})
</script>


