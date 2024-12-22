const pool = require("../db/pool");
const appointmentQueries = require("../db/queries/appointment");

// Get all appointments with their details (date, time, type, status)
const getAppointments = async (req, res) => {
  try {
    const result = await pool.query(appointmentQueries.getAppointments);
    res.json(result.rows); // Return the list of appointments
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single appointment by ID with its details
const getAppointmentById = async (req, res) => {
  const { appointment_id } = req.params;

  try {
    const result = await pool.query(appointmentQueries.getAppointmentById, [
      appointment_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(result.rows[0]); // Return the appointment details
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateReason = async (req, res) => {
  const { appointment_id } = req.params;
  const { reason } = req.body;

  console.log("Request Params:", req.params);
  console.log("Request Body:", req.body);

  if (!reason) {
    return res.status(400).json({ error: "Reason is required." });
  }

  try {
    const result = await db.query(appointmentQueries.updateReason, [
      reason,
      appointment_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.json({
      message: "Reason updated successfully.",
      appointment: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  updateReason,
};
