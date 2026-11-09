const express = require('express');
const router = express.Router();
const srfController = require('../controllers/srfController');
const { authenticate, authorize } = require('../middleware/auth');
const { createAuditLog } = require('../middleware/auditLog');

router.use(authenticate);

// Get all Audit Logs
router.get('/auditLogs', srfController.getAllAuditLogs);

// Get one SRF
router.get('/getOne/:id', srfController.getOne);

// Get one Job Order
router.get('/JobOne/:id', srfController.getOneJob);

// Update one Job Order
router.put('/JobOne/:id', srfController.updateJobOrder);

// Create SRF (public or protected depending on your use case)
router.post('/create', createAuditLog('Create Installation', 'CREATE', 'SRF Module'), srfController.create);

// Create Job Order (public or protected depending on your use case)
router.post('/jobOrder', createAuditLog('Create Job Order', 'CREATE', 'Job Order Module'), srfController.createJobOrder);

// Get all SRFs
router.get('/',  srfController.getAll);

// Get all job-order
router.get('/job-order',  srfController.getAllJobOrder);

// Search Mobile SRF
router.get('/mobile-srf/:technician', (req, res, next) => {
  if (req.user.role !== 'technician') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, srfController.mobileSRF);

// Get all Clients
router.get('/client', srfController.getAllClient);

// Create Client
router.post('/client', createAuditLog('Create Client', 'CREATE', 'Client Module'), srfController.createClient);

// Get all Devices
router.get('/device', srfController.getAllDevice);

// Get all Devices Types
router.get('/device-type', srfController.getAllDeviceType);

// Get all Vehicles
router.get('/vehicle', srfController.getAllVehicle);

// Get All Checklists
router.get('/checklist', srfController.getAllChecklist);

// Create Type
router.post('/create-types', createAuditLog('Create Types', 'CREATE', 'Types Module'), srfController.createTypes);

// Get all Types
router.get('/types', srfController.getAllTypes);

router.delete('/types/:id', createAuditLog('Delete Types', 'DELETE', 'Types Module'), srfController.removeTypes);

// Updating Types
router.put('/update-types/:id', createAuditLog('Update Types', 'UPDATE', 'Types Module'), srfController.updateTypes);

// Get all Tasks
router.get('/task', srfController.getAllTask);

// Create Tasks
router.post('/create-task', createAuditLog('Create Task', 'CREATE', 'Task Module'), srfController.createTask);

// Updating task
router.put('/task/:id', createAuditLog('Update Task', 'UPDATE', 'Task Module'), srfController.updateTask);

// Updating Checklist
router.put('/update-checklist/:id', createAuditLog('Update Checklist', 'UPDATE', 'Checklist Module'), srfController.updatingChecklist);

// Create Checklist
router.post('/create-checklist', createAuditLog('Create Checklist', 'CREATE', 'Checklist Module'), srfController.createChecklist);

// Get all Vehicles from Main
router.get('/vehicles-proxy', srfController.getAllVehicleMain);

// Get all Vehicles Type
router.get('/vehicle-type', srfController.getAllVehicleType);

// Get SRF by ID
router.get('/:id', srfController.getOne);

// Update SRF
router.put('/:id',
  authorize(['technician', 'service_coordinator', 'operations_manager', 'system_admin']),
  createAuditLog('Update SRF', 'UPDATE', 'SRF Module'),
  srfController.update
);

// Delete SRF
router.delete('/:id',
  authorize(['operations_manager', 'system_admin']),
  createAuditLog('Delete SRF', 'DELETE', 'SRF Module'),
  srfController.remove
);

// Delete Client
router.delete('/client/:id', createAuditLog('Delete Client', 'DELETE', 'Client Module'), srfController.removeClient);

// Delete checklist
router.delete('/check/:id', createAuditLog('Delete Checklist', 'DELETE', 'Checklist Module'), srfController.removeChecklist);

// Delete task
router.delete('/task/:id', createAuditLog('Delete Task', 'DELETE', 'Task Module'), srfController.removeTask);

// Update only status_id of SRF
router.patch('/:id/status',
  authorize(['service_coordinator', 'operations_manager', 'system_admin']),
  createAuditLog('Update Status', 'UPDATE', 'SRF Approval Module'),
  srfController.updateStatus
);

// Update checklist
router.patch('/checklist/:id', createAuditLog('Update Mobile', 'UPDATE', 'Mobile Module'), srfController.updateChecklist);

router.put('/clients/:id', createAuditLog('Update Client', 'UPDATE', 'Client Module'), srfController.updateClient)

// Update reschule day off
router.post('/special-day-off/:id', createAuditLog('Update Day Off', 'UPDATE', 'Rescheduled Day Off Module'), srfController.addSpecialDayOff)

// Update day off
router.put('/day-off/:id', createAuditLog('Update Day Off', 'UPDATE', 'Day Off Module'), srfController.updateDayOff)

// Update leaves
router.post('/leave/:id', createAuditLog('Create Leave', 'CREATE', 'Leave Module'), srfController.addLeave)

// Delete leaves
router.delete('/leave/:id/:leaveId', createAuditLog('Delete Leave', 'DELETE', 'Leave Module'), srfController.removeLeave)

// Delete rescheduled day off
router.delete('/special-day-off/:id/:dayoffId', createAuditLog('Delete Leave', 'DELETE', 'Rescheduled Day Off Module'), srfController.removeSpecialDayOff)

// Search SRF
router.get('/search/:id', srfController.searchSRF);

// Search User
router.get('/searchUser/:id', srfController.searchUser);

// Search Clients
router.get('/searchClient/:id', srfController.searchClient);

// Optional: Protected route test
router.get('/system_admin',
  authenticate, 
  authorize(['system_admin']),
  (req, res) => {
    res.json({ message: 'system_admin access granted' });
  }
);


// optionally: router.patch('/api/srfs/:id', srfController.patchSRF);
router.put('/update/:id',
  authorize(['service_coordinator', 'operations_manager', 'system_admin']),
  srfController.updateStatus
);



module.exports = router;
