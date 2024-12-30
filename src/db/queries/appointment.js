//const { requestAppointment } = require("../../controllers/appointment");

const getAppointments = `
  SELECT 
    a.appointment_id, 
    TO_CHAR(a.scheduled_date, 'YYYY-MM-DD') AS appointment_date,
    TO_CHAR(a.scheduled_date, 'HH24:MI') AS appointment_time,
    m.mode AS appointment_type,
    s.status AS appointment_status
  FROM 
    Appointments a
  JOIN Mode m ON a.mode_id = m.mode_id
  JOIN Status s ON a.status_id = s.status_id;
`;

// Query to get a specific appointment by ID
const getAppointmentById = `
  SELECT 
    a.appointment_id, 
    TO_CHAR(a.scheduled_date, 'YYYY-MM-DD') AS appointment_date,
    TO_CHAR(a.scheduled_date, 'HH24:MI') AS appointment_time,
    m.mode AS appointment_type,
    s.status AS appointment_status
  FROM 
    Appointments a
  JOIN Mode m ON a.mode_id = m.mode_id
  JOIN Status s ON a.status_id = s.status_id
  WHERE a.appointment_id = $1;
`;

// Request Appointments

const requestAppointment_Student = `INSERT INTO Appointments 
  (student_id, faculty_id, mode_id, status_id, reason, scheduled_date, meet_link)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;`;

const updateReason = `
  UPDATE Appointments
  SET reason = $1
  WHERE appointment_id = $2
  RETURNING *;
`;



// Query to verify if the appointment exists
const verifyAppointmentExist = `
  SELECT * FROM appointments WHERE appointment_id = $1
`;

// Query to update the `mode_id` for the appointment
const updateMode = `
  UPDATE appointments SET mode_id = $1 WHERE appointment_id = $2 RETURNING *
`;

module.exports = {
  getAppointments,
  getAppointmentById,
  requestAppointment_Student,
  updateReason,
  verifyAppointmentExist,
  updateMode

};
