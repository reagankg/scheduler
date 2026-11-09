<template>
  <div class="q-pa-md" style="margin-top: -20px;">
    <q-layout view="hHh Lpr lff" container style="height: 80vh" class="shadow-2 rounded-borders">
      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="500"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-scroll-area class="fit">
          <q-list>
            <div v-for="(menuItem, index) in menuList" :key="`menu-${index}`">
              <q-item
                clickable
                v-ripple
                :active="selectedMenu === menuItem.label"
                active-class="bg-green-1"
                @click="selectedMenu = menuItem.label"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="menuItem.icon"
                    :color="selectedMenu === menuItem.label ? 'green' : 'grey-7'"
                  />
                </q-item-section>
                <q-item-section>
                  <span :class="selectedMenu === menuItem.label ? 'text-green' : 'text-black'">
                    {{ menuItem.label }}
                  </span>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding style="margin-top: -10px;">
          <component :is="menuList.find(m => m.label === selectedMenu)?.component" />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

// Import pages directly
import UsersPage from '../pages/UserPage.vue'
import ClientsPage from '../pages/ClientPage.vue'
import TaskPage from '../pages/TaskPage.vue'
import CheckPage from '../pages/CheckPage.vue'
import VehiclePage from '../pages/VehiclePage.vue'
import AuditPage from '../pages/AuditLogs.vue'

const $q = useQuasar()
const drawer = ref(false)
const selectedMenu = ref('Users')

const menuList = [
  { icon: 'face', label: 'Users', component: UsersPage },
  { icon: 'groups', label: 'Clients', component: ClientsPage },
  { icon: 'article', label: 'Checklists', component: CheckPage },
  { icon: 'task_alt', label: 'Tasks', component: TaskPage },
  { icon: 'directions_car', label: 'Vehicle Type', component: VehiclePage },
  { icon: 'desktop_mac', label: 'Audit Logs', component: AuditPage },
]
</script>
