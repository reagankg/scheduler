<template>
  <div
    class="technician-cell"
    @click="$emit('manage-technician')"
  >
    <q-avatar
      size="42px"
      color="green"
      text-color="white"
      class="tech-avatar"
    >
      JH
    </q-avatar>

    <div class="tech-info">

      <div class="tech-name">
        Joselito Hugo
      </div>

      <div class="tech-role">
        Field Technician
      </div>

      <div class="tech-jobs">
        8 Jobs This Month
      </div>

    </div>

  </div>
</template>

<script setup>
defineEmits([
    'manage-technician'
])
</script>

<style scoped>

.technician-cell{

    display:flex;

    align-items:flex-start;

    gap:14px;

    padding:18px;

    min-height:140px;

    border-bottom:1px solid #f3f4f6;

    cursor:pointer;

    transition:.2s;

    background:white;

}

.technician-cell:hover{

    background:#f8fafc;

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