<template>
  <div
    class="day-cell"
    :class="type"
  >

    <!-- Empty -->
    <template v-if="type === 'empty'" />

    <!-- Job -->
    <template v-else-if="type === 'job'">



        <JobCard 
            v-if="jobs.length"
            :job="jobs[0]"
            @preview-job="$emit('open-jobs', jobs)"
        />

        <div
            class="more-jobs"
            @click="$emit('open-jobs')"
        >
            +{{ jobs.length - 1 }} more
        </div>


    </template>

        <!-- <div v-if="type === 'day-off'" class="day-label">
            <div>DAY OFF</div>
            <div>{{ dayName }}</div>
        </div>

        <div v-else-if="type === 'holiday'" class="day-label">
            <div>HOLIDAY</div>
            <div>{{ holidayName }}</div>
        </div>

        <div v-else-if="type === 'leave'" class="day-label">
            <div>LEAVE</div>
            <div>{{ leaveReason }}</div>
        </div> -->

        <div v-if="status" class="day-status">
            <div class="status-type">
                {{ status.label }}
            </div>

            <div class="status-value">
                {{ status.detail }}
            </div>
        </div>

  </div>
</template>

<script setup>

import JobCard from './JobCard.vue'

defineProps({

    type:{
        type:String,
        default:'empty'
    },

    jobs:{
        type:Array,
        default:() => []
    },

    dayName:{
        type:String,
        default:''
    },

    label:{
        type:String,
        default:''
    },

    status:{
        type:Object,
        default:null
    }

})

const emit = defineEmits(['open-jobs'])


</script>

<style scoped>

.day-cell{

    width:100%;

    height:100%;

    min-height:72px;   /* was 100px */

    padding:2px;       /* was 4px */

    border-left:1px solid #f3f4f6;

    transition:.2s;

    box-sizing:border-box;

}

.day-cell:hover{

    background:#f8fafc;

}

.dayoff{
    background:rgba(239,68,68,.08) !important;
    border-left:3px solid rgba(239,68,68,.18) !important;
}

.holiday{
    background:rgba(245,158,11,.08) !important;
    border-left:3px solid rgba(245,158,11,.18) !important;
}

.leave{
    background:rgba(139,92,246,.08) !important;
    border-left:3px solid rgba(139,92,246,.18) !important;
}

.day-label{

    padding-top:10px;

    text-align:center;

    font-size:12px;

    font-weight:600;

}

.day-off .day-label{
    color:#ef4444;
}

.holiday .day-label{
    color:#ca8a04;
}

.leave .day-label{
    color:#7c3aed;
}

.more-jobs{

    margin-top:6px;

    text-align:center;

    font-size:11px;

    font-weight:600;

    color:#16a34a;

    cursor:pointer;

}

.more-jobs:hover{

    text-decoration:underline;

}

.day-status {
  height: 100%;
  min-height: 100px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  gap: 4px;
}

.status-type {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
}

.status-value {
    font-size: 12px;
    font-weight: 500;
}

.dayoff .status-type,
.dayoff .status-value {
    color: #f51000;
}

.holiday .status-type,
.holiday .status-value {
    color: #f59e0b;
}

.leave .status-type,
.leave .status-value {
    color: #7c3aed;
}

</style>