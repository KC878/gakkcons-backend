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
    const studentId = req.user.user_id;
    const { facultyId, reason, mode } = req.body;

    if (!studentId || !facultyId || !mode || !reason) {
      return res.status(400).json({ message: "Invalid request." });
    }

    let modeId;

    if (mode === "online") {
      modeId = 1;
    } else {
      modeId = 2;
    }

    const status_id = 1;

    const result = await pool.query(
      appointmentQueries.requestAppointment_Student,
      [studentId, facultyId, modeId, status_id, reason]
    );

    res.status(201).json({
      message: "Appointment request submitted successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateMeetingLink = async (req, res) => {
  const { appointment_id } = req.params; 
  const { meet_link, status_id, mode_id } = req.body; 

  if (!appointment_id || !status_id || !mode_id) {
    return res.status(400).json({ message: "Invalid input." });
  }

  try {
    console.log('Updating appointment with', { appointment_id, meet_link, status_id, mode_id });

    const result = await pool.query(appointmentQueries.updateMeetingLinkQuery, [
      status_id,        // Fix parameter order
      meet_link,     
      mode_id,
      appointment_id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Meeting link updated successfully." });
  } catch (error) {
    console.error("Error updating meeting link:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  requestAppointment,
  updateMeetingLink
};
