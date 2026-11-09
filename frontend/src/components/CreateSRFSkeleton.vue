<template>
  <q-page class="create-srf-page">
    <q-card flat class="section-card q-mb-md">
      <q-card-section>
        <q-skeleton type="text" width="220px" />

        <div class="row q-col-gutter-sm q-mt-md">
          <div class="col-2">
            <q-skeleton type="QInput" />
          </div>

          <div class="col-3">
            <q-skeleton type="QInput" />
          </div>

          <div class="col-2">
            <q-skeleton type="QInput" />
          </div>

          <div class="col-5">
            <q-skeleton type="QInput" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat class="section-card q-mb-md">
      <q-card-section>
        <q-skeleton type="text" width="180px" />
        <q-skeleton class="q-mt-md" type="rect" height="220px" />
      </q-card-section>
    </q-card>

    <q-card flat class="section-card q-mb-md">
      <q-card-section>
        <q-skeleton type="text" width="200px" />
        <q-skeleton class="q-mt-md" type="rect" height="180px" />
      </q-card-section>
    </q-card>
  </q-page>
</template>