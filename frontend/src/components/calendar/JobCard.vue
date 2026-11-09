<template>
  <div class="job-card" @click="$emit('preview-job', job)">

    <div class="job-title">
      {{ job.label }}
    </div>

    <div class="job-time">
      {{ job.startTime }} - {{ job.endTime }}
    </div>

    <div class="job-location">
      <q-icon
        name="place"
        size="11px"
      />
      <span>{{ job.location || job.service }}</span>
    </div>
  </div>
</template>

<script setup>

defineProps({
  job: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
    'preview-job'
])

</script>

<style scoped>

.job-card{

    background:#edf9f0;

    border:1px solid #b7e4c7;

    border-radius:8px;

    cursor:pointer;

    transition:.2s;

    padding:6px;      /* was 8px */

    margin-bottom:2px; /* was 6px */
}

.job-card:hover{

    box-shadow:0 3px 8px rgba(0,0,0,.08);

    transform:translateY(-1px);

}

.job-title{

    font-size:10px;
    line-height:1.2;
    margin-bottom:2px;   /* was 4px */

    color:#166534;
}

.job-time{

    font-size:10px;

    color:#4b5563;

    margin-bottom:4px;

}

.job-location{

    display:flex;

    align-items:center;

    gap:3px;

    font-size:10px;

    color:#6b7280;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}

</style>