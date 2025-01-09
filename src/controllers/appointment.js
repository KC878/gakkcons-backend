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
    } else if (req.user.user_role === 1) {
      result = await pool.query(appointmentQueries.getAppointmentsByAdmin);

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

    // Execute the update query with the RETURNING clause to get updated appointment details
    const result = await pool.query(appointmentQueries.updateMeetingLinkQuery, [
      status_id,
      meet_link,
      mode_id,
      appointment_id
    ]);

    // Check if any rows were returned (if the appointment was updated)
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Return the updated appointment details in the response
    const updatedAppointment = result.rows[0];
    res.status(200).json({
      message: "Meeting link updated successfully.",
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error("Error updating meeting link:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const rejectAppointments = async (req, res) => {
  const { appointment_id } = req.params;
  const { status_id } = req.body;

  if (!status_id) {
    return res.status(400).json({ message: "Something went wrong!." });
  }

  try {
    console.log('Updating appointment with', { appointment_id, status_id });

    // Execute the update query with the RETURNING clause to get updated appointment details
    const result = await pool.query(appointmentQueries.rejectAppointment, [
      status_id,
      appointment_id
    ]);
    
    // Return the updated appointment details in the response
    const rejectAppointment = result.rows[0];
    res.status(200).json({
      message: "Reject appointment successfully.",
      appointment: rejectAppointment
    });
  } catch (error) {
    console.error("Error rejecting appointment:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }


}

const completedAppoinments = async (req, res) => {
  const { appointment_id } = req.params;
  const { status_id } = req.body;

  if (!status_id) {
    return res.status(400).json({ message: "Something went wrong!." });
  }

  try {
    console.log('Completing appointment with', { appointment_id, status_id });

    // Execute the update query with the RETURNING clause to get updated appointment details
    const result = await pool.query(appointmentQueries.rejectAppointment, [
      status_id,
      appointment_id
    ]);
    
    // Return the updated appointment details in the response
    const rejectAppointment = result.rows[0];
    res.status(200).json({
      message: "Completed appointment successfully.",
      appointment: rejectAppointment
    });
  } catch (error) {
    console.error("Error completing appointment:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }


}

const getAppointmentsAnalytics = async (req, res) => {
  try {
    // Execute the query to get appointment analytics
    const result = await pool.query(appointmentQueries.getAllAppointmentsAnalytics);
    
    // Separate the count data and appointments data
    const counts = result.rows[0]; // First row will contain the counts
    const appointments = result.rows.map(row => ({
      appointment_id: row.appointment_id,
      reason: row.reason,
      appointment_date: row.appointment_date,
      appointment_time: row.appointment_time,
      consultation_mode: row.consultation_mode,
      instructor_first_name: row.instructor_first_name,
      instructor_last_name: row.instructor_last_name,
      appointment_status: row.appointment_status
    }));

    // Respond with the structured data
    res.json({
      total_appointments: counts.total_appointments,
      approved_appointments: counts.approved_appointments,
      rejected_appointments: counts.rejected_appointments,
      pending_appointments: counts.pending_appointments,
      appointments: appointments
    });
  } catch (err) {
    console.error("Error fetching appointments analytics:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getAppointmentsAnalyticsByID = async (req, res) => {


  


}



module.exports = {
  getAppointments,
  getAppointmentById,
  requestAppointment,
  updateMeetingLink,
  rejectAppointments,
  completedAppoinments,
  getAppointmentsAnalytics
};
