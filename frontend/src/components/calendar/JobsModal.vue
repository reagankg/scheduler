<template>

<q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
>

    <q-card class="jobs-modal">

        <!-- Header -->

        <div class="modal-header">

            <div>

                <div class="modal-title">

                    {{ technician }}

                </div>

                <div class="modal-subtitle">

                    {{ date?.month }} {{ date?.day }}, {{ date?.year }}

                </div>

            </div>

            <q-btn
                flat
                round
                dense
                icon="close"
                color="white"
                @click="$emit('update:modelValue', false)"
            />

        </div>

        <!-- Body -->

        <q-card-section class="q-pa-md">

            <q-card
                v-for="job in jobs"
                :key="job.id"
                flat
                bordered
                class="job-item q-mb-sm"
            >

                <q-card-section>

                    <div class="row items-center justify-between">

                        <div>

                            <div class="job-title">

                                {{ job.label }}

                            </div>

                            <div
                                class="status-chip"
                                :class="statusClass(job.status)"
                                >
                                {{ job.status }}
                            </div>

                            <div class="job-time">

                                {{ formatTime(job) }}

                            </div>

                            <div class="job-location">

                                <q-icon
                                    name="place"
                                    size="12px"
                                />

                                {{ job.location }}

                            </div>

                            <div class="job-time">

                                SERVICE VEHICLE : {{ job.service }}

                            </div>

                        </div>

                        <q-btn
                            color="green"
                            outline
                            label="View SRF"
                            size="sm"
                            @click="$emit('view-srf', job.id)"
                        />

                    </div>

                </q-card-section>

            </q-card>

        </q-card-section>

    </q-card>

</q-dialog>

</template>

<script setup>

const props = defineProps({
    technician: String,
    date: Object,
    time: String,
    jobs: {
        type: Array,
        default: () => []
    }
})

function statusClass(status) {
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

    case 'Cancelled':
      return 'status-cancelled'

    default:
      return 'status-default'
  }
}

defineEmits([
    'update:modelValue',
    'view-srf'
])

function formatTime(job) {

    if (!job.startTime)
        return 'No time'

    if (job.startTime && job.endTime)
        return `${job.startTime} - ${job.endTime}`

    return job.startTime || job.endTime
}

</script>

<style scoped>

.jobs-modal{

    width:700px;

    max-width:90vw;

    border-radius:12px;

}

.modal-header{

    background:#16a34a;

    color:white;

    padding:16px 20px;

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.modal-title{

    font-size:20px;

    font-weight:700;

}

.modal-subtitle{

    margin-top:2px;

    opacity:.85;

}

.job-item{

    border-radius:10px;

    transition:.2s;

    cursor:pointer;

}

.job-item:hover{

    transform:translateY(-1px);

    box-shadow:0 4px 12px rgba(0,0,0,.08);

}

.job-title{

    font-size:15px;

    font-weight:600;

}

.job-time{

    margin-top:4px;

    color:#6b7280;

    font-size:13px;

}

.job-location{

    margin-top:6px;

    display:flex;

    align-items:center;

    gap:4px;

    color:#6b7280;

    font-size:13px;

}

.status-chip {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 8px;
  margin-top: 4px;
}

.status-approved {
  background: #E8F8EC;
  color: #0A9B3E;
}

.status-for-approval {
  background: #FFF5D8;
  color: #D89B00;
}

.status-ongoing {
  background: #EAF2FF;
  color: #3B82F6;
}

.status-completed {
  background: #E7F8EC;
  color: #37A45A;
}

.status-revision {
  background: #F2E9FF;
  color: #7C4DFF;
}

.status-cancelled {
  background: #FDECEC;
  color: #E53935;
}

.status-default {
  background: #ECECEC;
  color: #666;
}

</style>