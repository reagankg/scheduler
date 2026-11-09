<template>
  <div class="row q-col-gutter-md q-mb-lg">

    <div
      v-for="card in cards"
      :key="card.title"
      class="col-12 col-sm-6 col-md-3"
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

          </q-card-section>

        </q-card-section>

      </q-card>

    </div>

  </div>
</template>

<script setup>

import { computed } from 'vue'
import { useCalendarStore } from 'src/stores/calendarStore'

const calendarStore = useCalendarStore()

const cards = computed(() => [
  {
    title: 'Technicians',
    value: calendarStore.stats.technicians,
    icon: 'engineering',
    color: 'green'
  },
  {
    title: 'Jobs This Month',
    value: calendarStore.stats.jobs,
    icon: 'assignment',
    color: 'primary'
  },
  {
    title: 'Holiday',
    value: calendarStore.stats.holidays,
    icon: 'event_busy',
    color: 'red'
  },
  {
    title: 'On Leave',
    value: calendarStore.stats.onLeave,
    icon: 'beach_access',
    color: 'orange'
  }
])

</script>

<style scoped>

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

</style>