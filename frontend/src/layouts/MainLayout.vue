<template>
  <q-layout view="hHh Lpr lFf" class="bg-grey-2">

    <!-- ================= HEADER ================= -->
    <q-header bordered class="bg-white text-dark">

      <div class="row no-wrap" style="height:40px">

        <!-- Green Brand -->
        <div
          class="brand-header row items-center"
          :class="drawer ? 'brand-open' : 'brand-closed'"
          style="width:255px;padding:0 18px;"
        >
          <div class="row items-center">

            <q-icon
              name="menu"
              size="20px"
              class="q-mr-md cursor-pointer"
              :color="drawer ? 'white' : 'dark'"
              @click="drawer = !drawer"
            />

            <div
              class="text-subtitle1 text-weight-bold"
              :class="drawer ? 'text-white' : 'text-black'"
            >
              WRU SRF
            </div>

          </div>
        </div>

        <!-- White Toolbar -->
        <q-toolbar class="bg-white" style="border-bottom:1px solid #e5e7eb;">

          <q-space />

          <div class="row items-center q-gutter-xs">

            <div style="font-size: 16px; font-weight: 100; color: gray;">
              Welcome Back,
            </div>

            <div class="text-weight-small">
              {{ getFirstName }} {{ getLastName }}
            </div>

          </div>

          <q-btn
            flat
            round
            dense
            icon="account_circle"
          >
            <q-menu auto-close>

              <q-list style="min-width:280px">

                <q-item clickable @click="goToProfile">
                  <q-item-section avatar>
                    <q-icon name="person"/>
                  </q-item-section>

                  <q-item-section>
                    My Profile
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable @click="logout">
                  <q-item-section avatar>
                    <q-icon name="logout"/>
                  </q-item-section>

                  <q-item-section>
                    Logout
                  </q-item-section>
                </q-item>

              </q-list>

            </q-menu>
          </q-btn>

        </q-toolbar>

      </div>

    </q-header>

    <!-- ================= SIDEBAR ================= -->

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :width="220"
      class="bg-white"
    >

      <!-- Brand -->

      <q-list class="q-py-md flex column items-center" >

        <!-- Dashboard -->

        <!-- <q-item 
          clickable
          to="/sample"
          active-class="menu-active"
          exact
          v-if="canSeeSRF"
        >
          <q-icon name="dashboard" size="18px" class="q-mr-sm"/>
          <span class="menu-text">Dashboard</span>
        </q-item> -->
  
        <!-- <q-item
          clickable
          to="/jobOrderTable"
          active-class="menu-active"
          class="menu-item"
          exact
          v-if="canSeeSRF"
        >
          <q-item-section class="menu-section">

            <q-icon
              name="description"
              size="18px"
              class="menu-icon"
            />

            <span class="menu-text">
              Job Order Request
            </span>

          </q-item-section>
        </q-item> -->

        <q-item
          clickable
          to="/jobOrderTable"
          active-class="menu-active"
          class="menu-item"
          exact
          v-if="canSeeSRF"
        >
          <q-item-section class="menu-section">

            <q-icon
              name="description"
              size="18px"
              class="menu-icon"
            />

            <span class="menu-text">
              Service Requests
            </span>

          </q-item-section>
        </q-item>

        <q-item
          clickable
          to="/approval"
          active-class="menu-active"
          class="menu-item"
          exact
          v-if="canSeeApproval"
        >
          <q-item-section class="menu-section">

            <q-icon
              name="fact_check"
              size="18px"
              class="menu-icon"
            />

            <span class="menu-text">
              Approval SRF
            </span>

          </q-item-section>
        </q-item>

        <q-item
          clickable
          to="/calendar"
          active-class="menu-active"
          class="menu-item"
          exact
        >
          <q-item-section class="menu-section">

            <q-icon
              name="calendar_month"
              size="18px"
              class="menu-icon"
            />

            <span class="menu-text">
              Calendar
            </span>

          </q-item-section>
        </q-item>

        <q-item
          clickable
          class="menu-item"
          v-if="canSeeControl"
          @click="administrationOpen = !administrationOpen"
        >
          <q-item-section class="menu-section">
            <q-icon
              name="admin_panel_settings"
              size="18px"
              class="menu-icon"
            />

            <span class="menu-text">
              Administration
            </span>
          </q-item-section>
        </q-item>

        <!-- Administration submenu -->
        <div
          v-if="administrationOpen"
          class="admin-submenu"
        >
          <q-item
            clickable
            to="/newUser"
            class="admin-submenu-item"
          >
            <q-item-section>
              <span>Users</span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            to="/newClient"
            class="admin-submenu-item"
          >
            <q-item-section>
              <span>Clients</span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            to="/check"
            class="admin-submenu-item"
          >
            <q-item-section>
              <span>Checklists</span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            to="/task"
            class="admin-submenu-item"
          >
            <q-item-section>
              <span>Tasks</span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            to="/vehicle"
            class="admin-submenu-item"
          >
            <q-item-section>
              <span>Vehicle Type</span>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            to="/audit"
            class="admin-submenu-item"
          >
            <q-item-section>
              <span>Audit Logs</span>
            </q-item-section>
          </q-item>

        </div>

      </q-list>

      <div
        class="q-pa-md"
      >

        <q-card-section class="help-card">

          <div class="help-title">
            Need Help?
          </div>

          <div class="help-subtitle">
            Contact your administrator.
          </div>

        </q-card-section>

      </div>

    </q-drawer>

    <!-- ================= CONTENT ================= -->

    <q-page-container>

      <!-- Profile Dialog -->
      <!-- ================= PROFILE DIALOG ================= -->

      <div class="q-pa-md">

        <q-dialog
          v-model="inception"
          persistent
        >

          <q-card style="min-width:450px">

            <q-card-section>

              <div class="text-h6">
                My Profile
              </div>

            </q-card-section>

            <q-card-section>

              <div class="q-mb-sm">
                <strong>First Name:</strong>
                {{ userInfo.firstName || '-' }}
              </div>

              <div class="q-mb-sm">
                <strong>Last Name:</strong>
                {{ userInfo.lastName || '-' }}
              </div>

              <div class="q-mb-sm">
                <strong>Email:</strong>
                {{ userInfo.email || '-' }}
              </div>

              <div>
                <strong>Role:</strong>
                {{ userInfo.role || '-' }}
              </div>

            </q-card-section>

            <q-separator />

            <q-card-section
              v-if="resetInputs"
            >

              <q-form
                ref="formRef"
                @submit.prevent="save"
              >

                <div class="text-subtitle1 q-mb-md">
                  Reset Password
                </div>

                <q-input
                  outlined
                  dense
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[
                    v => !!v || 'Password is required',
                    v => v.length >= 6 || 'Minimum 6 characters'
                  ]"
                >

                  <template #append>

                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword=!showPassword"
                    />

                  </template>

                </q-input>

                <q-input
                  outlined
                  dense
                  class="q-mt-md"
                  v-model="confirmPassword"
                  label="Confirm Password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[
                    v => !!v || 'Required',
                    v => v === password || 'Passwords do not match'
                  ]"
                >

                  <template #append>

                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword=!showPassword"
                    />

                  </template>

                </q-input>

              </q-form>

            </q-card-section>

            <q-card-actions align="right">

              <q-btn
                flat
                label="Reset Password"
                v-if="resetButton"
                @click="reset"
              />

              <q-btn
                flat
                color="green"
                label="Save"
                v-if="saveButton"
                @click="save"
              />

              <q-btn
                flat
                label="Close"
                @click="closer"
              />

            </q-card-actions>

          </q-card>

        </q-dialog>

      </div>

      <!-- ================= PAGE ================= -->

      <div class="q-pa-lg">

        <router-view />

      </div>

    </q-page-container>

  </q-layout>
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  computed
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import { authStore } from '../stores/authStore'

const drawer = ref(true)

const tab = ref('')

const route = useRoute()
const router = useRouter()

const storeAuth = authStore()

const getFirstName = localStorage.getItem('firstName')
const getLastName = localStorage.getItem('lastName')

const role = (localStorage.getItem('role') || '')
  .replace(/^['"]|['"]$/g, '')

const specialRole = ref(
  localStorage.getItem('special') === 'true'
)

const resetInputs = ref(false)
const saveButton = ref(false)
const resetButton = ref(true)

const getID = localStorage.getItem('id')

const inception = ref(false)
const administrationOpen = ref(false)

const userInfo = ref({})

const showPassword = ref(false)

const password = ref('')
const confirmPassword = ref('')

const formRef = ref(null)

const showAdministrationMenu = computed(() => {
  return [
    '/control',
    '/user',
    '/client',
    '/check',
    '/task',
    '/technician'
  ].includes(route.path)
})

const canSeeSRF = computed(() =>
  role !== 'technician'
)

const canSeeApproval = computed(() =>
  role === 'operations_manager' ||
  specialRole.value
)

const canSeeControl = computed(() =>
  role === 'operations_manager' ||
  role === 'system_admin' ||
  specialRole.value
)

watch(
  () => route.path,
  path => {
    tab.value = path
  },
  {
    immediate: true
  }
)
const goToProfile = async () => {

  try {

    const user =
      await storeAuth.getUserById(getID)

    userInfo.value = user

    inception.value = true

  } catch (error) {

    console.error(error)

  }

}

const reset = () => {

  resetInputs.value = true

  saveButton.value = true

  resetButton.value = false

}

const save = async () => {

  const valid =
    await formRef.value.validate()

  if (!valid) return

  try {

    await storeAuth.resetPassword(
      getID,
      password.value
    )

    password.value = ''
    confirmPassword.value = ''

    inception.value = false
    resetInputs.value = false

    saveButton.value = false
    resetButton.value = true

  } catch (error) {

    console.error(error)

  }

}

const closer = () => {

  inception.value = false

  resetInputs.value = false

  saveButton.value = false

  resetButton.value = true

}

const logout = () => {

  storeAuth.logOutUser()

  router.push('/')

}

onMounted(() => {

  console.log('Main Layout Loaded')

})
</script>

<style scoped>

.q-layout{
  background:#f5f6fa;
}

.menu-active{

  background:#e8f5e9;

  color:#2e7d32;

  border-radius:10px;

  font-weight:600;

}

.q-item{

  border-radius:10px;

  margin:4px 8px;

  font-size:13px;

}

.q-item:hover{

  background:#f5f5f5;

}

.q-toolbar{

  min-height:50px;
  padding:0 12px;

}

.q-header{

  box-shadow:0 2px 8px rgba(0,0,0,.08);

}

.q-drawer{

  border-right:1px solid #ececec;

}

.menu-section{
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:flex-start;
  width:100%;
}

.menu-item{
    width:180px;
    padding:0 12px;
}

.menu-icon{
    width:22px;          /* Every icon occupies the same width */
    text-align:center;
    margin-right:12px;
    flex-shrink:0;
}

.menu-text{
    font-size:13px;
    font-weight:500;
    white-space:nowrap;
}

.brand-header{
    width:190px;
    height:50px;
    padding:0 18px;
    transition:all .25s ease;
    border-bottom:1px solid #e5e7eb;
    box-sizing:border-box;
}

.brand-open{
    background:#168447;      /* light-green-7 */
    color:white;
}

.brand-closed{
    background:white;
    color:#212121;

}

.help-card{
  padding:12px;
}

.help-title{
  font-size:13px;
  font-weight:600;
  color:#333;
}

.help-subtitle{
  margin-top:4px;
  font-size:11px;
  color:#9e9e9e;
  line-height:1.3;
}

.absolute-bottom{
  padding:10px;
}

.absolute-bottom .q-card{
  border-radius:8px;
}

</style>