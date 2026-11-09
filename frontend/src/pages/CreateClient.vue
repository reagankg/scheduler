<template>
  <div class="create-client-page">

    <!-- PAGE HEADER -->
    <div class="page-header">

      <div>
        <div class="page-title">
           {{ isEdit ? 'Edit Client' : 'Create Client' }}
        </div>

        <div class="page-subtitle">
            {{
              isEdit
                ? 'Update the client information below'
                : 'Fill in the details below to create a new client'
            }}
        </div>
      </div>

      <div class="header-actions">

        <q-btn
          outline
          color="red-6"
          icon="close"
          label="CANCEL"
          class="cancel-btn"
          @click="cancelClient"
        />

        <q-btn
          outline
          color="green-7"
          icon="check"
          label="SAVE"
          class="save-btn"
          :loading="saving"
          @click="submitForm"
        />

      </div>

    </div>


    <!-- CLIENT INFORMATION -->
    <q-card
      flat
      bordered
      class="form-card"
    >

      <div class="section-header">

        <q-icon
          name="business"
          color="green-7"
          size="20px"
        />

        <span>
          1. Client Information
        </span>

      </div>


      <q-separator />


      <q-form
        ref="createFormRef"
        class="form-content"
      >

        <!-- ROW 1 -->
        <div class="form-grid">

          <q-input
            v-model="form.name"
            label="Client Name"
            outlined
            dense
            hide-bottom-space
            :rules="[r.required]"
          />

          <q-input
            v-model="form.contact_person"
            label="Contact Person"
            outlined
            dense
            hide-bottom-space
            :rules="[r.required]"
          />

        </div>


        <!-- ROW 2 -->
        <div class="form-grid">

          <q-input
            v-model="form.client_Id"
            label="Client ID"
            outlined
            hide-bottom-space
            dense
          />

          <q-input
            v-model="form.contact_no"
            label="Contact No."
            outlined
            hide-bottom-space
            dense
            :rules="[r.required, r.phone]"
          />

        </div>


        <!-- ROW 3 -->
        <div class="form-grid">

          <q-input
            v-model="form.location"
            label="Location"
            outlined
            hide-bottom-space
            dense
          />

          <q-input
            v-model="form.tin"
            label="TIN"
            outlined
            dense
            hide-bottom-space
            :rules="[r.required]"
          />

        </div>


        <!-- INSTALLATION ADDRESS -->
        <q-input
          v-model="form.installation_address"
          label="Installation Address"
          type="textarea"
          outlined
          dense
          autogrow
        />


        <!-- BILLING ADDRESS -->
        <q-input
          v-model="form.billing_address"
          label="Billing Address"
          type="textarea"
          outlined
          dense
          autogrow          
        />

      </q-form>

    </q-card>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { srfStore } from '../stores/srfStore'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const store = srfStore()

const createFormRef = ref(null)
const saving = ref(false)
const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  contact_person: '',
  client_Id: '',
  contact_no: '',
  location: '',
  tin: '',
  installation_address: '',
  billing_address: '',
  created_by: 'admin'
})


/* VALIDATION */
const r = {
  required: v => !!v || 'Required',
  phone: v => v?.length >= 10 || 'Invalid number'
}


/* SAVE */
const submitForm = async () => {

  try {
    if (isEdit.value) {
      const { _id, ...updateData } = form.value

      await store.updateClient({
        _id,
        ...updateData
      })

      $q.notify({
        type: 'positive',
        message: 'Client updated successfully'
      })

    } else {
      const valid = await createFormRef.value.validate()

      if (!valid) return

      saving.value = true
      
      await store.createClient(form.value)

      $q.notify({
        type: 'positive',
        message: 'Client created successfully'
      })
    }

    router.push('/newClient')

  } catch (err) {
    console.error(
      isEdit.value ? 'Update client failed:' : 'Create client failed:',
      err
    )
  }
}

/* CANCEL */
const cancelClient = () => {
  router.push('/newClient')
}

const loadClient = async () => {
  if (!isEdit.value) return

  try {
    await store.getClients()

    const client = store.allClients.find(
      item => item._id === route.params.id
    )

    if (!client) {
      throw new Error('Client not found')
    }

    form.value = {
      ...form.value,
      ...client
    }

  } catch (err) {
    console.error('Load client failed:', err)

    $q.notify({
      type: 'negative',
      message: 'Failed to load client'
    })
  }
}

onMounted(() => {
  loadClient()
})
</script>


<style scoped>
.create-client-page {
  padding: 28px 32px;
}


/* PAGE HEADER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #2f3a4a;
}

.page-subtitle {
  margin-top: 3px;
  font-size: 14px;
  color: #6b7785;
}


/* HEADER BUTTONS */
.header-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  width: 140px;
  height: 42px;
  font-weight: 600;
  letter-spacing: 1px;
}


/* FORM CARD */
.form-card {
  border-radius: 14px;
  overflow: hidden;
}


/* SECTION HEADER */
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;

  font-size: 16px;
  font-weight: 700;
  color: #2f3a4a;
}


/* FORM */
.form-content {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}


/* MOBILE */
@media (max-width: 768px) {
  .create-client-page {
    padding: 20px 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
  }

  .cancel-btn,
  .save-btn {
    flex: 1;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>