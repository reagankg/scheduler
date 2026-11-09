<template>
  <div
    class="calendar-row"
    :style="{
      gridTemplateColumns: `220px repeat(${week.length}, 140px)`
    }"
  >
    <!-- Calendar -->
    <div
      v-for="cell in cells"
      :key="cell.day.iso"
      class="day-column"
    >
      <DayCell
        :type="cell.data.type"
        :jobs="cell.data.jobs"
        @open-jobs="emit('open-jobs', cell.data.jobs)"
      />
    </div>

  </div>
</template>

<script setup>
import DayCell from './DayCell.vue'
import { getCellData } from 'src/utils/calendarHelpers'
import { computed } from 'vue'

const cells = computed(() =>
    props.week.map(day => ({
        day,
        data: getCellData({
            technician: props.technician,
            day
        })
    }))
)

const props = defineProps({

    technician:{
        type:Object,
        required:true
    },

    week:{
        type:Array,
        required:true
    }

})

const emit = defineEmits([
    'open-jobs'
])

</script>

<style scoped>
.calendar-row{

    display:grid;

    width:max-content;

}

.technician-cell{

    position:sticky;

    left:0;

    z-index:5;

    background:white;

    display:flex;

    align-items:flex-start;

    gap:14px;

    padding:18px;

    border-right:1px solid #f3f4f6;

}

.tech-avatar{

    flex-shrink:0;

}

.tech-info{

    flex:1;

}

.tech-name{

    font-size:15px;

    font-weight:700;

    color:#111827;

}

.tech-role{

    margin-top:2px;

    font-size:12px;

    color:#6b7280;

}

.tech-jobs{

    margin-top:8px;

    font-size:12px;

    color:#9ca3af;

}

</style>