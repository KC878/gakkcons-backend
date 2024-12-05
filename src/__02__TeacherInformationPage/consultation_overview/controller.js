const db = require('./../../db'); // Import the database connection
const queries = require('./queries');

// Get all appointments with their details (date, time, type, status)
module.exports.getAppointments = async (req, res) => {
  try {
    const result = await db.query(queries.getAppointments);
    res.json(result.rows);  // Return the list of appointments
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single appointment by ID with its details
module.exports.getAppointmentById = async (req, res) => {
  const { appointment_id } = req.params;

  try {
    const result = await db.query(queries.getAppointmentById, [appointment_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(result.rows[0]);  // Return the appointment details
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
