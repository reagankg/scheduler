<template>
  <q-card flat bordered class="calendar-grid">

    <div class="calendar-scroll">

        <!-- HEADER -->
        <div
            class="calendar-header"
            :style="{
                gridTemplateColumns:`220px repeat(${weekDays.length},140px)`
            }"
        >

            <div class="technician-header">
                Technician
            </div>

            <div
                v-for="day in weekDays"
                :key="day.iso"
                class="day-header"
            >
                <div class="day-name">
                    {{ day.dayName }}
                </div>

                <div class="day-date">
                    {{ day.dayNumber }}
                </div>
            </div>

        </div>

        <!-- BODY -->
        <div
            v-for="tech in users"
            :key="tech.id"
            class="calendar-row"
            :style="{
                gridTemplateColumns:`220px repeat(${weekDays.length},140px)`
            }"
        >

            <!-- Technician -->

            <div
                class="technician-cell"
                @click="emit('manage-technician', tech)"
            >

                <q-avatar
                    size="36px"
                    color="green"
                    text-color="white"
                >
                    {{ tech.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .substring(0,2) }}
                </q-avatar>

                <div class="tech-info">

                    <div class="tech-name">
                        {{ tech.name }}
                    </div>

                    <div class="tech-role">
                        Field Technician
                    </div>

                    <div class="tech-jobs">
                        {{ tech.events.length }} Jobs This Month
                    </div>

                </div>

            </div>

            <!-- Days -->

            <div
                v-for="day in weekDays"
                :key="day.iso"
                class="day-column"
            >

                <DayCell
                    :type="getCellType(tech, day)"
                    :jobs="getEventsForDay(tech.events, day)"
                    :status="getDisplayStatus(tech, day)"
                    :day-name="day.date.toLocaleDateString('en-US', {
                        weekday: 'long'
                    })"
                    @open-jobs="emit('open-jobs', {
                        technician: tech,
                        day
                    })"
                />

            </div>

        </div>


    </div>

    <!-- FOOTER -->

    <div class="calendar-footer">

      <div class="text-caption text-grey-7">

      </div>

    </div>

  </q-card>
</template>

<script setup>

import DayCell from './DayCell.vue'
import { getStatusLabel, getEventsForDay, isDayOff, isSpecialDayOff, isLeave, getHoliday } from 'src/utils/calendarHelpers'
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'

const emit = defineEmits([
    'open-jobs',
    'manage-technician'
])

const props = defineProps({

    users:{
        type:Array,
        default:()=>[]
    },
    weekDays:{
        type:Array,
        default:()=>[]
    }

})

function getDisplayStatus(technician, day) {

    return getStatusLabel(technician, day)
}

function getCellType(technician, day) {
            console.log('========== DEBUGGGGG ==========')
        console.log('TECH:', technician)
        console.log('DAY:', day)
    if (isLeave(technician, day))
        return 'leave'

    if (getHoliday(day))
        return 'holiday'

    if (
        isSpecialDayOff(technician, day) ||
        isDayOff(technician, day)
        )
        return 'dayoff'

    const jobs = getEventsForDay(technician.events, day)

    if (jobs.length)
        return 'job'

    return 'empty'
}


</script>

<style scoped>

.calendar-grid{

    border-radius:10px;

    display:flex;
    flex-direction:column;

    height:560px; /* adjust as desired */

}

.calendar-container{

    display:flex;

}

.left-panel{

    width:220px;

    flex-shrink:0;

    background:white;

    border-right:1px solid #e5e7eb;

}

.right-panel{

    flex:1;

    overflow-x:auto;

}

.calendar-header{
    display:grid;
    grid-auto-flow:column;
    width:max-content;

    position:sticky;
    top:0;
    z-index:40;

    background:white;
    border-bottom:2px solid #d1d5db;
}

.day-name{

    font-weight:600;

    font-size:13px;

}

.day-date{

    margin-top:4px;

    font-size:12px;

    color:#6b7280;

}

.technician-header{

    position: sticky;

    left: 0;

    z-index: 20;

    background: white;

    height:56px;

    display: flex;
    justify-content: center;   /* horizontal */
    align-items: center;       /* vertical */

    padding:16px;

    font-weight:700;

    border-bottom:1px solid #f3f4f6;

    border-right:1px solid #f3f4f6;

}

.technician-row{

    display:flex;

    gap:14px;

    align-items:flex-start;

    padding:18px;

    min-height:100px;

    border-bottom:1px solid #f3f4f6;

    cursor:pointer;

    transition:.2s;

}

.technician-row:hover{

    background:#f8fafc;

}

.tech-info{

    flex:1;

}

.tech-name{

    font-size:12px;

    font-weight:700;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

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

.calendar-footer{

    padding:12px 16px;

    border-top:1px solid #e5e7eb;

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.calendar-scroll{

    flex:1;

    overflow:auto;

    min-height:0;

}

.calendar-row{

    display:grid;

    width:max-content;

    min-height:110px;

}

.technician-cell{

    position:sticky;

    left:0;

    z-index:20;

    background:white;

    display:flex;

    gap:10px;

    align-items:flex-start;

    padding:10px;

    border-right:1px solid #f3f4f6;

    border-bottom:1px solid #f3f4f6;

    cursor:pointer;

    align-items:center;

}

.day-column{
    display:flex;
    align-items:stretch;
    display:flex;
    border-left:1px solid #f3f4f6;
    border-bottom:1px solid #f3f4f6;
    background:white;
}

.day-header{
    height:68px;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    border-left:1px solid #f3f4f6;

    background:white;
}

</style>