<template>

<div class="toolbar">

    <div class="row q-col-gutter-md items-center">

        <div class="col-auto">
            <div class="month-navigation">

                <q-btn
                    class="nav-btn"
                    flat
                    dense
                    round
                    icon="chevron_left"
                    @click="prevMonth"
                />

                <div class="month-label">
                    {{ displayMonthYear }}
                </div>

                <q-btn
                    class="nav-btn"
                    flat
                    dense
                    round
                    icon="chevron_right"
                    @click="nextMonth"
                />

            </div>
        </div>

        <div class="col-3">

            <q-select
                outlined
                dense
                v-model="calendarStore.selectedTechnician"
                :options="technicianOptions"
                label="Technician"
                emit-value
                map-options
            />

        </div>

        <div class="col-3">

            <q-select
                v-model="calendarStore.selectedStatus"
                :options="statusOptions"
                label="Status"
                dense
                outlined
                emit-value
                map-options
            />

        </div>

        <div class="col-3">

            <q-select
                v-model="calendarStore.selectedTaskType"
                :options="taskTypeOptions"
                label="Task Type"
                dense
                outlined
                emit-value
                map-options
            />

        </div>

    </div>

</div>

</template>

<script setup>
import { useCalendarStore } from 'src/stores/calendarStore'

const calendarStore = useCalendarStore()
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'

const emit = defineEmits([
  'month-change'
])

const today = new Date()
const year = ref(today.getFullYear())
const monthIndex = ref(today.getMonth())

const displayMonthLabel = computed(() =>
  new Date(year.value, monthIndex.value)
    .toLocaleString('default', { month: 'long' })
)

const displayMonthYear = computed(
  () => `${displayMonthLabel.value} ${year.value}`
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

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'For Approval', value: 'For Approval' },
  { label: 'For Revision', value: 'For Revision' },
  { label: 'On-going', value: 'On-going' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' }
]

const technicianOptions = computed(() => [
  { label: 'All Technicians', value: 'all' },

  ...calendarStore.technicians.map(t => ({
    label: t.name,
    value: t.name
  }))
])

const taskTypeOptions = computed(() => {
  const tasks = new Set()

  Object.values(calendarStore.eventsByTechnician).forEach(events => {
    events.forEach(event => {
      if (event.label) {
        tasks.add(event.label)
      }
    })
  })

  return [
    { label: 'All Types', value: 'all' },
    ...[...tasks].sort().map(task => ({
      label: task,
      value: task
    }))
  ]
})

watch([year, monthIndex], () => {
  emit('month-change', {
    year: year.value,
    month: monthIndex.value
  })
}, { immediate: true })

</script>

<style scoped>

.toolbar{

    background:white;

}

.date-picker{

    display:flex;

    align-items:center;

    justify-content:center;

    gap:10px;

    border:1px solid #e5e7eb;

    border-radius:8px;

    height:40px;

}

.month-navigation{

    display:flex;

    align-items:center;

    gap:2px;

    flex-wrap:nowrap;
}

.month-label{

    min-width:120px;

    text-align:center;

    white-space:nowrap;

    font-size:16px;

    font-weight:500;
}

.nav-btn{
    min-width:60px;
    height:32px;
    font-size:12px;
    border-radius:6px;
}
</style>