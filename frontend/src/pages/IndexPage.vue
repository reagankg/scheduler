<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-light-green-7">
        <q-inner-loading
          :showing="storeAuth.loading"
          label="Signing in..."
          label-class="text-white"
          label-style="font-size: 1.2em"
          color="primary"
        >
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div style="display: flex; flex-direction: row; justify-content: center; margin-bottom: 10px;">
              <img src="/wru.jpg" alt="Image" width="150" />
            </div>
            <div class="text-grey-8">
              Sign in to access your account
            </div>
          </q-card-section>

          <q-card-section>
            <!-- Name field (only for signup) -->
            <q-input 
              v-if="!isLogin"
              dense outlined
              v-model="name"
              label="Full Name"
              class="q-mb-md"
              color="light-green"
              :rules="[val => !!val || 'Name is required']"
            />

            <!-- Email field -->
            <q-input 
              dense outlined
              v-model="email"
              label="Email Address"
              type="email"
              color="light-green"
              :rules="[validateEmail]"
            />

            <!-- Password field -->
            <q-input 
              dense outlined
              class="q-mt-md"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              color="light-green"
              :rules="[val => val.length >= 6 || 'Minimum 6 characters']"
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <!-- Confirm Password (only for signup) -->
            <q-input 
              v-if="!isLogin"
              dense outlined
              class="q-mt-md"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              label="Confirm Password"
              :rules="[val => val === password || 'Passwords do not match']"
            />
          </q-card-section>

          <!-- <q-card-section class="text-center q-pt-none">
            <div class="text-red-14 text-weight-bold">
              {{ (!storeAuth.loading && !isError) ? "Email or Password is incorrect try again!" : "" }}
            </div>
          </q-card-section> -->

          <q-card-section>
            <q-btn 
              @click="submit"
              :loading="storeAuth.loading"
              :disable="storeAuth.loading"
              style="border-radius: 8px;" 
              color="dark" 
              rounded 
              size="md" 
              :label="isLogin ? 'Sign in' : ''"
              no-caps 
              class="full-width"
            />
          </q-card-section>

        </q-card>
      </q-page>
    </q-page-container>

    <!-- Custom Alert -->
    <div v-if="showAlert" class="custom-alert" :class="alertType">
      <div class="alert-content">
        <div class="alert-icon">
          <q-icon :name="alertIcon" size="24px" />
        </div>
        <div class="alert-message">
          {{ alertMessage }}
        </div>
        <div class="alert-close" @click="showAlert = false">
          <q-icon name="close" size="16px" />
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from "vue-router";
import { authStore } from '../stores/authStore.js';

const storeAuth = authStore();

const isLogin = ref(true);
const isError = ref(true);
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('info'); // 'success', 'error', 'info'
const router = useRouter();

const alertIcon = computed(() => {
  switch (alertType.value) {
    case 'success': return 'check_circle';
    case 'error': return 'error';
    default: return 'info';
  }
});

const validateEmail = (val) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(val) || 'Invalid email format';
};

const showCustomAlert = (message, type = 'info') => {
  alertMessage.value = message;
  alertType.value = type;
  showAlert.value = true;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

const submit = async () => {
  showAlert.value = false;
  isError.value = true; // reset error state

  // Email validation
  if (!email.value || !validateEmail(email.value)) {
    showCustomAlert('Please enter a valid email address', 'error');
    return;
  }

  if (!password.value) {
    showCustomAlert('Password is required', 'error');
    return;
  }

  // ======================
  // REGISTER FLOW
  // ======================
  if (!isLogin.value) {
    if (!name.value.trim()) {
      showCustomAlert('Name is required', 'error');
      return;
    }

    if (password.value.length < 6) {
      showCustomAlert('Password must be at least 6 characters', 'error');
      return;
    }

    if (password.value !== confirmPassword.value) {
      showCustomAlert('Passwords do not match', 'error');
      return;
    }

    showCustomAlert(`Registration successful! Welcome ${name.value}`, 'success');

    setTimeout(() => {
      isLogin.value = true;
      name.value = '';
      confirmPassword.value = '';
    }, 2000);

    return;
  }

  // ======================
  // LOGIN FLOW
  // ======================
  const result = await storeAuth.logInUser(email.value, password.value);
    if (!result?.success) {
    isError.value = false;
    showCustomAlert(
      typeof result === 'string'
        ? result
        : 'Email or Password is incorrect try again!',
      'error'
    );
    return;
  }

  if (result?.success) {

    const roles = storeAuth.roles;

    if (roles.includes('operations_manager')) {
      router.push('/approval');
    } else {
      router.push('/jobOrderTable');
    }

    // optional: show alert AFTER navigation
    setTimeout(() => {
      showCustomAlert('Login successful! Welcome back', 'success');
    }, 300);
  }

  // Clear credentials after attempt
  setTimeout(() => {
    email.value = '';
    password.value = '';
  }, 9000);
};

</script>

<style scoped>
.my_card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.my_card:hover {
  transform: translateY(-5px);
}

/* Custom Alert Styles */
.custom-alert {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 10000;
  animation: slideIn 0.5s ease forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.alert-content {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  color: white;
}

.alert-icon {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.alert-message {
  flex-grow: 1;
  font-size: 14px;
  line-height: 1.4;
}

.alert-close {
  margin-left: 15px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

/* Alert type colors */
.custom-alert.success {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border-left: 5px solid #2E7D32;
}

.custom-alert.error {
  background: linear-gradient(135deg, #F44336, #C62828);
  border-left: 5px solid #C62828;
}

.custom-alert.info {
  background: linear-gradient(135deg, #2196F3, #1565C0);
  border-left: 5px solid #1565C0;
}

/* Responsive adjustments */
@media (max-width: 500px) {
  .custom-alert {
    width: calc(100% - 40px);
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
  
  .my_card {
    max-width: 90%;
  }
}

/* Form transitions */
.q-input {
  transition: all 0.3s ease;
}

.q-input:hover {
  transform: translateY(-2px);
}
</style>