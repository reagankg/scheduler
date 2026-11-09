const Installation = require('../models/SRF');
const Client = require('../models/Client');
const Device = require('../models/Device');
const Vehicle = require('../models/Vehicle');
const VehicleType = require('../models/VehicleType');
const DeviceType = require('../models/DeviceType');
const Task = require('../models/Task');
const Checklist = require('../models/Checklist');
const AuditLog = require('../models/Audit')
const User = require('../models/User')
const axios = require("axios");
const mergeLeaveRanges = require('../utils/mergeLeaves')
const JobOrder = require('../models/JobOrder');
const Counter = require('../models/Counter');


async function getNextSRFId() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'srf' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `SRF-${String(counter.seq).padStart(7, '0')}`;
}

async function getNextJobOrderId() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'jobOrder' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `SRF-${String(counter.seq).padStart(7, '0')}`;
}


// CREATE
exports.create = async (req, res) => {
  try {
    // Generate sequential SRF number
    const srf_id = await getNextSRFId();

    const newSrf = await Installation.create({
      ...req.body,
      srf_id
    });

    res.status(201).json(newSrf);
  } catch (err) {
    console.error('SRF creation error:', err);
    res.status(400).json({ error: err.message });
  }
};


// CREATE CLIENT
exports.createClient = async (req, res) => {
  try {
    if (!req.body.name || !req.body.contact_person || !req.body.created_by) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newClient = await Client.create(req.body);

    res.status(201).json({
      message: "Client created successfully",
      client: newClient
    });

  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};


exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createTypes = async (req, res) => {
  try {
    const type = await VehicleType.create(req.body);
    res.status(201).json(type);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createChecklist = async (req, res) => {
  try {
    const check = await Checklist.create(req.body);
    res.status(201).json(check);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE CLIENT
exports.updatingChecklist = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCheckList = await Checklist.findByIdAndUpdate(
      id,
      {
        ...req.body,
        reason_edit: req.body.reason_edit
      },
      { new: true, runValidators: true }
    );

    if (!updatedCheckList) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    res.status(200).json(updatedCheckList);
  } catch (err) {
    console.error('Update Checklist Error:', err);
    res.status(500).json({ message: 'Failed to update client' });
  }
};

// READ ALL SRF
exports.getAll = async (req, res) => {
  try {
    const rows = await Installation.find().lean();

    const summary = {
      total: rows.length,
      pending: 0,
      approval: 0,
      revision: 0,
      ongoing: 0,
      completed: 0,
      cancelled: 0
    };

    rows.forEach((row) => {
      switch (row.status_id) {
        case "Pending":
          summary.pending++;
          break;

        case "For Approval":
          summary.approval++;
          break;

        case "For Revision":
          summary.revision++;
          break;

        case "On-going":
          summary.ongoing++;
          break;

        case "Completed":
          summary.completed++;
          break;

        case "Cancelled":
          summary.cancelled++;
          break;
      }
    });

    res.json({
      summary,
      rows
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// READ ALL CLIENTS
exports.getAllClient = async (req, res) => {
  try {
    const srfs = await Client.find();
    res.json(srfs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL DEVICES
exports.getAllDevice = async (req, res) => {
  try {
    const srfs = await Device.find();
    res.json(srfs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDeviceType = async (req, res) => {
  try {
    const deviceTypes = await DeviceType.find();
    res.json(deviceTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTask = async (req, res) => {
  try {
    const task = await Task.find();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTypes = async (req, res) => {
  try {
    const type = await VehicleType.find();
    res.json(type);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllChecklist = async (req, res) => {
  try {
    const check = await Checklist.find();
    res.json(check);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllVehicle = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllVehicleType = async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find();
    res.json(vehicleTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getOne = async (req, res) => {
  try {
    const srf = await Installation.findById(req.params.id);
    if (!srf) return res.status(404).json({ error: 'SRF not found' });
    res.json(srf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const updated = await Installation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'SRF not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// SRF DELETE
exports.remove = async (req, res) => {
  try {
    const deleted = await JobOrder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'SRF not found' });
    res.json({ message: 'SRF deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Client DELETE
exports.removeClient = async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Checklist DELETE
exports.removeChecklist = async (req, res) => {
  try {
    const deleted = await Checklist.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Checklist not found' });
    res.json({ message: 'Checklist deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Task DELETE
exports.removeTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Types DELETE
exports.removeTypes = async (req, res) => {
  try {
    const deleted = await VehicleType.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Vehicle Type not found' });
    res.json({ message: 'Vehicle Type deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ONLY status_id
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!data) {
    console.log("Missing data!");
    return res.status(400).json({ error: 'data is required' });
  }

  try {
    const updated = await JobOrder.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    if (!updated) {
      console.log("SRF not found");
      return res.status(404).json({ error: 'SRF not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error in updateStatus:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllVehicleMain = async (req, res) => {
  const appId = req.query.clientId;

  const endpoints = [
    {
      name: "wru",
      url: `https://wru.server93.com/comGpsGate/api/v.1/applications/${appId}/users?FromIndex=0&PageSize=1000`,
      apiKey: process.env.VITE_GPSGATE_API_KEY_1
    },
    {
      name: "wru2",
      url: `https://wru2.server93.com/comGpsGate/api/v.1/applications/${appId}/users?FromIndex=0&PageSize=1000`,
      apiKey: process.env.VITE_GPSGATE_API_KEY_2
    }
  ];

  for (const ep of endpoints) {

    console.log(`Trying ${ep.name}`);
    console.log(ep.url);

    try {

      const response = await axios.get(ep.url, {
        headers: {
          Authorization: ep.apiKey
        },
        timeout: 15000
      });

      console.log(`${ep.name} SUCCESS`);
      console.log("Records:", response.data.length);

      return res.json(response.data);

    } catch (err) {

      console.error(`${ep.name} FAILED`);

      console.error({
        endpoint: ep.name,
        url: ep.url,
        status: err.response?.status,
        headers: err.response?.headers,
        data: err.response?.data,
        message: err.message,
      });

    }
  }

  for (const ep of endpoints) {
    try {
      const response = await axios.get(ep.url, {
        headers: { Authorization: ep.apiKey },
        timeout: 15000
      });

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        return res.json(data);
      }
    } catch (err) {
      const status = err.response?.status;
      console.log(`FAILED ${ep.name} (${status || err.message})`);
    }
  }

  console.log(`ALL endpoints failed for appId ${appId}`);
  return res.json([]);
};

// UPDATE Type
exports.updateTypes = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedType = await VehicleType.findByIdAndUpdate(
      id,
      {
        ...req.body,
        reason_edit: req.body.reason_edit
      },
      { new: true, runValidators: true }
    );

    if (!updatedType) {
      return res.status(404).json({ message: 'Vehicle Types not found' });
    }

    res.status(200).json(updatedType);
  } catch (err) {
    console.error('Update Vehicle Types Error:', err);
    res.status(500).json({ message: 'Failed to update Vehicle Types' });
  }
};

// UPDATE Type
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        ...req.body,
        reason_edit: req.body.reason_edit
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Update Task Error:', err);
    res.status(500).json({ message: 'Failed to update Task' });
  }
};

// UPDATE CLIENT
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      {
        ...req.body,
        reason_edit: req.body.reason_edit
      },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(updatedClient);
  } catch (err) {
    console.error('Update Client Error:', err);
    res.status(500).json({ message: 'Failed to update client' });
  }
};

exports.updateDayOff = async (req, res) => {
  try {
    const { id } = req.params
    const { dayOff } = req.body

    // ---------- VALIDATION ----------
    if (!Array.isArray(dayOff)) {
      return res.status(400).json({
        message: 'dayOff must be an array'
      })
    }

    const valid = dayOff.every(d => Number.isInteger(d) && d >= 0 && d <= 6)

    if (!valid) {
      return res.status(400).json({
        message: 'dayOff values must be integers 0-6'
      })
    }

    const uniqueDays = [...new Set(dayOff)]

    // ---------- GET USER ----------
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // ---------- SAFE COPY ----------
    const oldDayOff = [...(user.dayOff || [])]

    // ---------- COMPARE ----------
    const changed =
      JSON.stringify(oldDayOff.slice().sort()) !==
      JSON.stringify(uniqueDays.slice().sort())

    // ---------- HISTORY ----------
    if (changed) {
      user.dayOffHistory.push({
        from: oldDayOff,
        to: uniqueDays,
        changedAt: new Date(),
        changedBy: req.user?.email || 'system'
      })
    }

    // ---------- UPDATE ----------
    user.dayOff = uniqueDays

    await user.save()

    return res.json(user)

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Server error'
    })
  }
}

exports.addLeave = async (req, res) => {
  try {
    const { id } = req.params
    const { startDate, endDate, reason } = req.body
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Add new leave to existing array
    const allLeaves = [
      ...(user.leaves || []),
      { startDate, endDate, reason }
    ]

    // Merge overlapping ranges
    const merged = mergeLeaveRanges(allLeaves)

    // Replace leaves with merged result
    user.leaves = merged

    await user.save()

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.removeLeave = async (req, res) => {
  try {
    const { id, leaveId } = req.params

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    user.leaves = user.leaves.filter(
      l => String(l._id) !== leaveId
    )

    await user.save()

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.searchSRF = async (req, res) => {
  try {
    const { id } = req.params
    const regex = new RegExp(id, "i")

    const results = await Installation.find({
      $or: [
        { clientTitle: regex },
        { srf_id: regex },
        { device_id: regex },
        { serviceCoordinator: regex },
        { task: regex },
        { technician: regex },
        { location: regex },
        { status_id: regex },
        { device_id: regex },
        { admin: regex },
        // 🔥 DATE SEARCH SUPPORT
        {
          $expr: {
            $regexMatch: {
              input: {
                $dateToString: {
                  format: "%b %d %Y %H:%M",
                  date: "$date"
                }
              },
              regex: id,
              options: "i"
            }
          }
        },
      ]
    })
    .sort({ created_at: -1 })

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { id } = req.params
    const regex = new RegExp(id, "i")

    const results = await User.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { role: regex },
        // 🔥 DATE SEARCH SUPPORT
        {
          $expr: {
            $regexMatch: {
              input: {
                $dateToString: {
                  format: "%b %d %Y %H:%M",
                  date: "$date"
                }
              },
              regex: id,
              options: "i"
            }
          }
        }
      ]
    })
    .sort({ created_at: -1 })

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchClient = async (req, res) => {
  try {
    const { id } = req.params
    const regex = new RegExp(id, "i")

    const results = await Client.find({
      $or: [
        { name: regex },
        { location: regex },
        { contact_person: regex },
        { contact_no: regex },
        { installation_address: regex },
        { billing_address: regex },
        { client_Id: regex },
        // 🔥 DATE SEARCH SUPPORT
        {
          $expr: {
            $regexMatch: {
              input: {
                $dateToString: {
                  format: "%b %d %Y %H:%M",
                  date: "$date"
                }
              },
              regex: id,
              options: "i"
            }
          }
        }
      ]
    })
    .sort({ created_at: -1 })

    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateChecklist = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!data) {
    console.log("Missing data!");
    return res.status(400).json({ error: 'data is required' });
  }

  try {
    const updated = await Installation.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    if (!updated) {
      console.log("SRF not found");
      return res.status(404).json({ error: 'SRF not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error in update checklist:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.mobileSRF = async (req, res) => {
  try {
    const technician = req.params.technician;
    const data = await Installation.aggregate([
      {
        $match: {
          technician: technician
        }
      },
      {
        $match: {
          status_id: {
            $in: ["Approved", "Completed", "On-going", "Cancelled"]
          }
        }
      },
      {
        $project: {
          _id: 1,
          technician: 1,
          date: 1,
          task: 1,
          serviceVehicle: 1,
          status_id: 1,
          clientTitle: 1
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.addSpecialDayOff = async (req, res) => {
  try {
    const { id } = req.params
    const { dayOffDate, reason } = req.body

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    user.specialDayOff.push({
      dayOffDate,
      reason
    })

    await user.save()

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.removeSpecialDayOff = async (req, res) => {
  try {
    const { id, dayoffId } = req.params

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    user.specialDayOff = user.specialDayOff.filter(
      d => String(d._id) !== dayoffId
    )

    await user.save()

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAllAuditLogs = async (req, res) => {
  try {
    const auditTypes = await AuditLog.find().sort({ created_at: -1 });
    res.json(auditTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE JobOrder
exports.createJobOrder = async (req, res) => {
  try {
    const jobOrder_id = await getNextJobOrderId();

    const jobOrders = [];

    for (const item of req.body.jobOrders) {
      jobOrders.push({
        ...item,
        srf_id: await getNextSRFId()
      });
    }

    const newJO = await JobOrder.create({
      ...req.body,
      jobOrder_id,
      jobOrders
    });

    res.status(201).json(newJO);
  } catch (err) {
    console.error('Job Order creation error:', err);
    res.status(400).json({ error: err.message });
  }
};

// READ ALL Job Order
exports.getAllJobOrder = async (req, res) => {
  try {
    const rows = await JobOrder.find().lean();

    const summary = {
      total: rows.length,
      pending: 0,
      approval: 0,
      revision: 0,
      ongoing: 0,
      completed: 0,
      cancelled: 0
    };

    rows.forEach((row) => {
      switch (row.status_id) {
        case "Pending":
          summary.pending++;
          break;

        case "For Approval":
          summary.approval++;
          break;

        case "For Revision":
          summary.revision++;
          break;

        case "On-going":
          summary.ongoing++;
          break;

        case "Completed":
          summary.completed++;
          break;

        case "Cancelled":
          summary.cancelled++;
          break;
      }
    });

    res.json({
      summary,
      rows
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.getOneJob = async (req, res) => {
  try {
    const srf = await JobOrder.findById(req.params.id);
    if (!srf) return res.status(404).json({ error: 'SRF not found' });
    res.json(srf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update one Job Order
exports.updateJobOrder = async (req, res) => {
  try {
    const jobOrder = await JobOrder.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true
      }
    );

    if (!jobOrder) {
      return res.status(404).json({
        error: 'Job Order not found'
      });
    }

    res.json(jobOrder);
  } catch (err) {
    console.error('Job Order update error:', err);

    res.status(500).json({
      error: err.message
    });
  }
};