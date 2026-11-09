<template>
  <div class="dashboard-header">

    <div class="row items-start justify-between">

      <!-- Left -->
      <div>

        <div class="dashboard-title">
          Calendar
        </div>

        <div class="dashboard-subtitle">
          Manage technician schedules, service requests, leaves and holidays.
        </div>

      </div>

      <!-- Right -->
      <div class="row items-center q-gutter-sm">

        <q-btn
          unelevated
          color="green-9"
          icon="add"
          label="New SRF"
          size="sm"
          style="margin-right: 30px"
          @click="createSRF()"
        />

        <!-- <q-btn-dropdown
          unelevated
          outline
          color="grey-8"
          label="Export"
          icon="download"
          size="sm"
        >
          <q-list dense>

            <q-item clickable>

              <q-item-section avatar>
                <q-icon name="table_view" />
              </q-item-section>

              <q-item-section>
                Excel Report
              </q-item-section>

            </q-item>

            <q-item clickable>

              <q-item-section avatar>
                <q-icon name="picture_as_pdf" />
              </q-item-section>

              <q-item-section>
                PDF Report
              </q-item-section>

            </q-item>

          </q-list>
        </q-btn-dropdown> -->

      </div>

    </div>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const createSRF = () => {
  router.push('/createSrf');
}
</script>

<style scoped>

.dashboard-header{
    margin-bottom:24px;
}

.dashboard-title{
    font-size:18px;
    font-weight:600;
    color:#2f2f2f;
    line-height:1.1;
}

.dashboard-subtitle{
    margin-top:4px;
    font-size:13px;
    color:#8b8b8b;
}

</style>