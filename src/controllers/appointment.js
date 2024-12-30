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

// Request an appointment
const requestAppointment = async (req, res) => {
  const { student_id, faculty_id, mode_id } = req.body;

  // Validate mandatory fields
  if (!student_id || !faculty_id || !mode_id) {
    return res.status(400).json({ error: "Student ID, Faculty ID, and Mode are required." });
  }

  try {
    const status_id = 1;  // Assuming '1' represents "pending" status.
    const reason = null;  // Reason is null
    const scheduled_date = null;  // Scheduled date is null
    const meet_link = null;  // Meet link is null

    // Insert new appointment request into the database
    const result = await pool.query(
      appointmentQueries.requestAppointment_Student, 
      [student_id, faculty_id, mode_id, status_id, reason, scheduled_date, meet_link]
    );

    // Return the created appointment
    res.status(201).json({
      message: "Appointment request submitted successfully.",
      appointment: result.rows[0],
    });
  } catch (err) {
    console.error("Error requesting appointment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// after request Appointment
const updateReason = async (req, res) => {
  const { appointment_id } = req.params;
  const { reason } = req.body;

  console.log("Request Params:", req.params);
  console.log("Request Body:", req.body);

  if (!reason) {
    return res.status(400).json({ error: "Reason is required." });
  }

  try {
    const result = await pool.query(appointmentQueries.updateReason, [
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



const updateAppointmentMode = async (req, res) => {
  const { mode_id } = req.body; // Extract only `mode_id` from the request body
  const { appointment_id } = req.params; // Extract `appointment_id` from the URL parameter

  // Validate if `mode_id` and `appointment_id` are provided
  if (!mode_id) {
    return res.status(400).json({ error: "Mode Id is required" });
  }

  try {
    // Step 1: Verify that the appointment exists
    const ownershipResult = await pool.query(appointmentQueries.verifyAppointmentExist, [
      appointment_id,
    ]);

    if (ownershipResult.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Step 2: Update the `mode_id` for the specific appointment
    const updateResult = await pool.query(appointmentQueries.updateMode, [
      mode_id,
      appointment_id,
    ]);

    const updatedAppointment = updateResult.rows[0];

    // Step 3: Respond with the updated appointment
    return res.status(200).json({
      message: "Appointment mode updated successfully.",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment mode:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the appointment mode." });
  }
};


module.exports = {
  getAppointments,
  getAppointmentById,
  requestAppointment,
  updateReason,
  updateAppointmentMode,
};
