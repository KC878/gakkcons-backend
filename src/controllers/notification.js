const pool = require("../db/pool");
const notificationQueries = require("../db/queries/notification");

const getNotifications = async (req, res) => {
  try {
    const studentId = req.user.user_id;
    const { rows } = await pool.query(notificationQueries.getNotifications, [
      studentId,
      "Confirmed",
    ]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { appointment_id } = req.params;
  const { status_id } = req.body;

  try {
    await pool.query("BEGIN");
    const { rows } = await pool.query(
      notificationQueries.updateAppointmentStatus,
      [status_id, appointment_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Emit updated appointments after status change
    const notifications = await pool.query(
      notificationQueries.getNotifications
    ); // Fetch all updated notifications
    // if (io) {
    //   io.emit("appointments", notifications.rows); // Emit the updated appointments in real-time
    // }
    await pool.query("COMMIT");
    res.status(200).json({
      message: "Appointment status updated successfully.",
      appointment: rows[0],
    });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error updating appointment status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getNotifications,
  updateAppointmentStatus,
};
