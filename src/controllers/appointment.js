const moment = require("moment");
const pool = require("../db/pool");
const appointmentQueries = require("../db/queries/appointment");
const { getSocket } = require("../utils/socketIO");

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

    if (!result || !result.rows) {
      return res.status(404).json({ message: "No appointments found." });
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

    await pool.query("BEGIN");

    const recentAppointment = await pool.query(
      appointmentQueries.checkRecentAppointment,
      [studentId, facultyId]
    );

    if (recentAppointment.rows.length > 0) {
      const recentScheduledDate = moment(
        recentAppointment.rows[0].scheduled_date
      );
      const now = moment();

      if (recentScheduledDate.isSameOrAfter(now, "day")) {
        return res.status(400).json({
          message:
            "You are not allowed to request an appointment with the same instructor twice in a day. Please try again tomorrow.",
        });
      }
    }

    const statusName = "Pending";

    const result = await pool.query(appointmentQueries.requestAppointment, [
      studentId,
      facultyId,
      mode,
      statusName,
      reason,
    ]);

    await pool.query("COMMIT");

    res.status(201).json({
      message: "Appointment request submitted successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    await pool.query("ROLLBACK");

    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateMeetingLink = async (req, res) => {
  const { appointment_id } = req.params;
  const { status, meet_link, mode, scheduled_date } = req.body;
  const io = getSocket();

  if (!appointment_id || !status || !mode || !scheduled_date) {
    return res
      .status(400)
      .json({ message: "Invalid input. All fields are required." });
  }

  try {
    await pool.query("BEGIN");
    const statusResult = await pool.query(appointmentQueries.getStatusIdQuery, [
      status,
    ]);
    if (statusResult.rowCount === 0) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }
    const status_id = statusResult.rows[0].status_id;

    // Validate mode
    const modeResult = await pool.query(appointmentQueries.getModeIdQuery, [
      mode,
    ]);
    if (modeResult.rowCount === 0) {
      return res.status(400).json({ message: `Invalid mode: ${mode}` });
    }
    const mode_id = modeResult.rows[0].mode_id;
    const updated_at = new Date();

    const result = await pool.query(appointmentQueries.updateMeetingLinkQuery, [
      status_id,
      meet_link,
      mode_id,
      scheduled_date,
      updated_at,
      appointment_id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const studentResult = await pool.query(
      appointmentQueries.getAppointmentStudentId,
      [appointment_id]
    );

    const studentId = studentResult.rows[0].user_id;
    const facultyName = studentResult.rows[0].faculty_name;
    const appointmentMode = studentResult.rows[0].mode;

    io.to(studentId).emit("notification", {
      text: `${facultyName} has accepted your consultation request. Venue: ${appointmentMode}. Date: ${moment(
        scheduled_date
      ).format("MMM DD, YYYY [at] hh:mm A")}`,
      route: "/tabs/notification",
    });

    const updatedAppointment = result.rows[0];
    await pool.query("COMMIT");
    res.status(200).json({
      message: "Meeting link and scheduled date updated successfully.",
      appointment: updatedAppointment,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error updating meeting link:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const rejectAppointments = async (req, res) => {
  const { appointment_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res
      .status(400)
      .json({ message: "Status is required to reject appointment." });
  }

  try {
    const statusResult = await pool.query(appointmentQueries.getStatusIdQuery, [
      status,
    ]);
    if (statusResult.rowCount === 0) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }
    const status_id = statusResult.rows[0].status_id;

    console.log("Rejecting appointment with", { appointment_id, status_id });

    const result = await pool.query(appointmentQueries.rejectAppointment, [
      status_id,
      appointment_id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const rejectedAppointment = result.rows[0];
    res.status(200).json({
      message: "Appointment rejected successfully.",
      appointment: rejectedAppointment,
    });
  } catch (error) {
    console.error("Error rejecting appointment:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const completedAppointments = async (req, res) => {
  const { appointment_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res
      .status(400)
      .json({ message: "Status is required to completed appointment." });
  }

  try {
    const statusResult = await pool.query(appointmentQueries.getStatusIdQuery, [
      status,
    ]);
    if (statusResult.rowCount === 0) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }
    const status_id = statusResult.rows[0].status_id;

    console.log("Completing appointment with", { appointment_id, status_id });

    const result = await pool.query(appointmentQueries.completedAppointment, [
      status_id,
      appointment_id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const completedAppointment = result.rows[0];
    res.status(200).json({
      message: "Appointment completed successfully.",
      appointment: completedAppointment,
    });
  } catch (error) {
    console.error("Error rejecting appointment:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
// const getAppointmentsAnalytics = async (req, res) => {
//   try {
//     // Execute the query to get appointment analytics
//     const result = await pool.query(appointmentQueries.getAllAppointmentsAnalytics);

//     // Separate the count data and appointments data
//     const counts = result.rows[0]; // First row will contain the counts
//     const appointments = result.rows.map(row => ({
//       appointment_id: row.appointment_id,
//       reason: row.reason,
//       appointment_date: row.appointment_date,
//       appointment_time: row.appointment_time,
//       consultation_mode: row.consultation_mode,
//       instructor_first_name: row.instructor_first_name,
//       instructor_last_name: row.instructor_last_name,
//       appointment_status: row.appointment_status
//     }));

const getAppointmentsAnalytics = async (req, res) => {
  try {
    // Execute the query to get appointment analytics
    const result = await pool.query(
      appointmentQueries.getAllAppointmentsAnalytics
    );

    if (result.rows.length === 0) {
      return res.json({
        total_appointments: 0,
        approved_appointments: 0,
        rejected_appointments: 0,
        pending_appointments: 0,
        completed_appointments: 0,
        appointments: [],
      });
    }

    // Separate the count data and filter for confirmed appointments only
    const counts = {
      total_appointments: result.rows[0].total_appointments,
      approved_appointments: result.rows[0].approved_appointments,
      rejected_appointments: result.rows[0].rejected_appointments,
      pending_appointments: result.rows[0].pending_appointments,
      completed_appointments: result.rows[0].completed_appointments,
    };

    const appointments = result.rows
      .map((row) => ({
        appointment_id: row.appointment_id,
        reason: row.reason,
        appointment_date: row.appointment_date,
        appointment_time: row.appointment_time,
        consultation_mode: row.consultation_mode,
        instructor_first_name: row.instructor_first_name,
        instructor_last_name: row.instructor_last_name,
        student_firstname: row.student_first_name,
        student_lastname: row.student_last_name,
        appointment_status: row.appointment_status,
      }));

    // Respond with the structured data
    res.json({
      ...counts,
      appointments,
    });
  } catch (err) {
    console.error("Error fetching appointments analytics:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const requestReport = async (req, res) => {
  const { appointment_id, report } = req.body;

  const reporter_id = req.user.user_id;
  if (!appointment_id || !report || !reporter_id) {
    return res.status(400).json({ message: "Invalid input." });
  }

  try {
    const appointmentResult = await pool.query(
      "SELECT student_id FROM Appointments WHERE appointment_id = $1",
      [appointment_id]
    );

    if (appointmentResult.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const student_id = appointmentResult.rows[0].student_id;

    const result = await pool.query(appointmentQueries.insertReport, [
      appointment_id,
      student_id,
      reporter_id,
      report,
      new Date(),
    ]);

    res.status(201).json({
      message: "Report submitted successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting report:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  requestAppointment,
  updateMeetingLink,
  rejectAppointments,
  completedAppointments,
  getAppointmentsAnalytics,
  requestReport,
};
