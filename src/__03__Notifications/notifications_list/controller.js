const db = require('./../../db');  // Database connection
const queries = require('./queries');  // SQL queries file

let io = null;  // Socket.IO instance

// Set Socket.IO instance for real-time updates
const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Fetch all appointments
const getAppointments = async (req, res) => {
  try {
    const { rows } = await db.query(queries.getNotifications);  // Run the query to fetch appointments
    res.status(200).json(rows);

    // Emit notifications in real-time using Socket.IO
    if (io) {
      io.emit('appointments', rows);  // Emit real-time appointment data to clients
    }
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { appointment_id } = req.params;
  const { status_id } = req.body;

  try {
    const { rows } = await db.query(queries.updateAppointmentStatus, [status_id, appointment_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    // Emit updated appointments after status change
    const notifications = await db.query(queries.getNotifications);  // Fetch all updated notifications
    if (io) {
      io.emit('appointments', notifications.rows);  // Emit the updated appointments in real-time
    }

    res.status(200).json({
      message: 'Appointment status updated successfully.',
      appointment: rows[0],
    });
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Periodically emit appointments for real-time updates
const startNotificationEmitter = () => {
  setInterval(async () => {
    try {
      const { rows } = await db.query(queries.getNotifications);  // Query all appointments
      if (io) {
        io.emit('appointments', rows);  // Emit all appointments in real-time
      }
    } catch (err) {
      console.error('Error emitting appointments:', err);
    }
  }, 5000);  // Emit every 5 seconds
};

module.exports = {
  setSocketIO,
  getAppointments,
  updateAppointmentStatus,
  startNotificationEmitter,
};
