<template>
  <q-page class="create-user-page">

    <div class="page-container">

      <!-- Header -->
      <div class="row items-center justify-between q-mb-md">

        <div class="page-title">
          {{ isEditMode ? 'Edit User' : 'Create User' }}
        </div>

        <div class="page-subtitle">
          {{
            isEditMode
              ? 'Update the details below for this system user'
              : 'Fill in the details below to create a new system user'
          }}
        </div>

        <!-- Actions -->
        <div class="row justify-end q-gutter-sm">

          <q-btn
            unelevated
            class="action-btn btn-cancel"
            icon="close"
            label="Cancel"
            @click="cancelForm"
          />

          <q-btn
            unelevated
            class="action-btn btn-save"
            icon="check"
            :label="isEditMode ? 'Update' : 'Save'"
            :loading="loading"
            @click="submitUser"
          />

        </div>

      </div>

      <!-- User Information -->
      <q-card
        flat
        class="section-card q-mb-md"
      >

        <q-card-section class="section-header">

          <q-icon
            name="person"
            class="section-icon"
          />

          <div class="section-title">
            1. User Information
          </div>

        </q-card-section>

        <q-card-section class="section-body">

          <div class="row q-col-gutter-sm">

            <!-- First Name -->
            <div class="col-12 col-md-6">

              <q-input
                v-model="form.firstName"
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space
                label="First Name"
                :error="validationErrors.firstName"
                error-message="First Name is required"
              />

            </div>

            <!-- Last Name -->
            <div class="col-12 col-md-6">

              <q-input
                v-model="form.lastName"
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space
                label="Last Name"
                :error="validationErrors.lastName"
                error-message="Last Name is required"
              />

            </div>

            <!-- Email -->
            <div class="col-12 col-md-6">

              <q-input
                v-model="form.email"
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space
                type="email"
                label="Email"
                :error="validationErrors.email"
                error-message="Valid Email is required"
              />

            </div>

            <!-- Role -->
            <div class="col-12 col-md-6">

              <q-select
                v-model="form.role"
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space
                label="Role"
                :options="roleOptions"
                emit-value
                map-options
                :error="validationErrors.role"
                error-message="Role is required"
              />

            </div>

            <!-- Initial Password -->
            <div class="col-12">

              <q-input
                v-if="!isEditMode"
                v-model="form.initialPassword"
                class="compact-field"
                dense
                outlined
                stack-label
                hide-bottom-space
                label="Initial Password"
                error-message="Initial Password is required"
              >

                <template v-slot:append>

                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />

                </template>

              </q-input>

            </div>

          </div>

        </q-card-section>

      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userStore } from '../stores/userStore'

const router = useRouter()
const store = userStore()
const loading = ref(false)
const showPassword = ref(false)
const route = useRoute()

const isEditMode = computed(() => !!route.params.id)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  initialPassword: '',
  password: '',
  role: null
})

const validationErrors = reactive({
  firstName: false,
  lastName: false,
  email: false,
  role: false
})

const roleOptions = [
  {
    label: 'System Admin',
    value: 'system_admin'
  },
  {
    label: 'Operations Manager',
    value: 'operations_manager'
  },
  {
    label: 'Technician',
    value: 'technician'
  }
]

const validateForm = () => {
  validationErrors.firstName = !form.firstName.trim()
  validationErrors.lastName = !form.lastName.trim()

  validationErrors.email =
    !form.email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

  validationErrors.role = !form.role

  return !Object.values(validationErrors).some(Boolean)
}

const cancelForm = () => {
  router.back()
}

const submitUser = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    if (isEditMode.value) {
      await store.editUser(route.params.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role
      })
    } else {
      await store.createUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        initialPassword: form.initialPassword,
        password: form.password,
        role: form.role
      })
    }

    router.push('/newUser')

  } catch (error) {
    console.error(
      isEditMode.value
        ? 'Failed to update user:'
        : 'Failed to create user:',
      error
    )
  } finally {
    loading.value = false
  }
}

/* AUTO PASSWORD */
watch(
  () => form.firstName,
  v => {
    if (v && !isEditMode.value) {
      const rnd = Math.floor(100 + Math.random() * 900)
      form.initialPassword = `${v}@WRU${rnd}`
      form.password = form.initialPassword
    }
  }
)

onMounted(async () => {
  if (!isEditMode.value) return

  if (!store.users.length) {
    await store.getAllUser()
  }

  const user = store.users.find(
    user => user._id === route.params.id
  )

  if (!user) {
    console.error('User not found')
    router.push('/newUser')
    return
  }

  form.firstName = user.firstName || ''
  form.lastName = user.lastName || ''
  form.email = user.email || ''
  form.role = user.role || null
})
</script>

<style scoped>
.create-user-page {
  min-height: 100%;
  background: #f4f5f7;
}

.page-container {
  padding: 10px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.page-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.action-btn {
  min-width: 140px;
  height: 40px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 10px;
}

.btn-cancel {
  color: #d32f2f;
  background: #ffffff;
  border: 1px solid #ef5350;
}

.btn-save {
  color: #2e7d32;
  background: #ffffff;
  border: 1px solid #4caf50;
}

.section-card {
  border: 1px solid #d9dde3;
  border-radius: 14px;
  background: #ffffff;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
}

.section-icon {
  color: #2e9d59;
  font-size: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #273444;
}

.section-body {
  padding: 18px;
}

.compact-field :deep(.q-field__control) {
  min-height: 48px;
}

@media (max-width: 600px) {
  .page-container {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .action-btn {
    min-width: auto;
  }
}
</style>