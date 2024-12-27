const pool = require("../db/pool");
const appointmentQueries = require("../db/queries/appointment");

const getAppointments = async (req, res) => {
  try {
    let result;
    if (req.user.user_role === 2) {
      result = await pool.query(appointmentQueries.getAppointmentsByFaculty, [
        req.user.user_id,
      ]);
    } else if (req.user.user_role === 3) {
      result = await pool.query(appointmentQueries.getAppointmentsByStudent, [
        req.user.user_id,
      ]);
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAppointmentById = async (req, res) => {
  const { appointment_id } = req.params;

  try {
    const result = await pool.query(appointmentQueries.getAppointmentById, [
      appointment_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const requestAppointment = async (req, res) => {
  try {
    const { student_id, faculty_id, reason, mode_id } = req.body;

    if (!student_id || !faculty_id || !mode_id) {
      return res
        .status(400)
        .json({ error: "Student ID, Faculty ID, and Mode are required." });
    }

    const status_id = 1;

    const result = await pool.query(
      appointmentQueries.requestAppointment_Student,
      [student_id, faculty_id, mode_id, status_id, reason]
    );

    res.status(201).json({
      message: "Appointment request submitted successfully.",
      appointment: result.rows[0],
    });
  } catch (err) {
    console.error("Error requesting appointment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  requestAppointment,
};
