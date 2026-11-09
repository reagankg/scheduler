const routes = [
  {
    path: '/',
    children: [
      { path: '/', name: 'index', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/user', name: 'user', component: () => import('pages/UserPage.vue') }
    ]
  },
  {
    path: '/createSrf',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/createSrf', name: 'createSrf', component: () => import('pages/CreateSRF.vue') }
    ]
  },
  {
    path: '/newUser',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/newUser', name: 'newUser', component: () => import('pages/SRFUserPage.vue') }
    ]
  },
  {
    path: '/createUser',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/createUser', name: 'createUser', component: () => import('pages/CreateUser.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'editUser/:id?',
        name: 'editUser',
        component: () => import('pages/CreateUser.vue'),
        props: true
      }
    ]
  },
  {
    path: '/newClient',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/newClient', name: 'newClient', component: () => import('pages/SRFClientPage.vue') }
    ]
  },
  {
    path: '/createClient',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/createClient', name: 'createClient', component: () => import('pages/CreateClient.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'editClient/:id?',
        name: 'editClient',
        component: () => import('pages/CreateClient.vue'),
        props: true
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'createSrf/:id?',
        name: 'createSrf',
        component: () => import('pages/CreateSRF.vue'),
        props: true
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'approveSrf/:id',
        name: 'approveSrf',
        component: () => import('pages/ApproveSRF.vue'),
        props: true
      }
    ]
  },
  {
    path: '/srf',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/srf', name: 'srf', component: () => import('pages/SrfPage.vue') }
    ]
  },
  {
    path: '/approval',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/approval', name: 'approval', component: () => import('pages/SRFapproval.vue') }
    ]
  },
  {
    path: '/control',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/control', name: 'control', component: () => import('pages/ControlPage.vue') }
    ]
  },
  {
    path: '/client',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/client', name: 'client', component: () => import('pages/ClientPage.vue') }
    ]
  },
  {
    path: '/calendar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/calendar', name: 'calendar', component: () => import('pages/CalendarPage.vue') }
    ]
  },
    {
    path: '/oldcalendar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/oldcalendar', name: 'oldcalendar', component: () => import('pages/OLDBackup.vue') }
    ]
  },
  {
    path: '/task',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/task', name: 'task', component: () => import('pages/TaskPage.vue') }
    ]
  },
  {
    path: '/check',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/check', name: 'check', component: () => import('pages/CheckPage.vue') }
    ]
  },
  {
    path: '/srflist',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/srflist', name: 'srflist', component: () => import('pages/SRFListPage.vue') }
    ]
  },
    {
    path: '/technician',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/technician', name: 'technician', component: () => import('pages/TechnicianPage.vue') }
    ]
  },
  {
    path: '/vehicle',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/vehicle', name: 'vehicle', component: () => import('pages/VehiclePage.vue') }
    ]
  },
  {
    path: '/audit',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/audit', name: 'audit', component: () => import('pages/AuditLogs.vue') }
    ]
  },
  {
    path: '/jobOrderTable',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/jobOrderTable', name: 'jobOrderTable', component: () => import('pages/JobOrderTable.vue') }
    ]
  },
  {
    path: '/jobOrderCreate',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/jobOrderCreate', name: 'jobOrderCreate', component: () => import('pages/JobOrderCreate.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
