//const { requestAppointment } = require("../../controllers/appointment");

const getAppointmentsByStudent = `
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
  WHERE 
    a.student_id = $1;
`;

const getAppointmentsByFaculty = `
  SELECT 
    a.appointment_id, 
    a.reason,
    a.meet_link,
    TO_CHAR(a.scheduled_date, 'YYYY-MM-DD') AS appointment_date,
    TO_CHAR(a.scheduled_date, 'HH24:MI') AS appointment_time,
    TO_CHAR(a.scheduled_date, 'HH12:MI AM') || ' ' || TO_CHAR(a.scheduled_date, 'MM-DD-YYYY') AS appointment_timestamp,
    m.mode_id AS mode_id,
    m.mode AS appointment_type,
    u.user_id AS userID,
    u.first_name AS firstname,
    u.last_name AS lastname,
    s.status AS status,
    TO_CHAR(a.timestamp AT TIME ZONE 'UTC', 'HH12:MI AM') || ' ' || TO_CHAR(a.timestamp AT TIME ZONE 'UTC', 'MM-DD-YYYY') AS timestamp
  FROM 
    Appointments a
  JOIN Mode m ON a.mode_id = m.mode_id
  JOIN Status s ON a.status_id = s.status_id
  JOIN Users u ON a.student_id = u.user_id
  WHERE 
    a.faculty_id = $1;
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
const getAppointmentStudentId = `
  SELECT
    a.appointment_id,
    u1.user_id,
    u2.first_name || ' ' || u2.last_name AS faculty_name,
    m.mode
  FROM Appointments a
  JOIN Users u1 ON a.student_id = u1.user_id
  JOIN Users u2 ON a.faculty_id = u2.user_id 
  JOIN Mode m ON a.mode_id = m.mode_id
  WHERE a.appointment_id = $1
`;

// Request Appointments

const requestAppointment_Student = `INSERT INTO Appointments 
  (student_id, faculty_id, mode_id, status_id, reason)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`;

const updateReason = `
  UPDATE Appointments
  SET reason = $1
  WHERE appointment_id = $2
  RETURNING *;
`;

const updateMeetingLinkQuery = `
UPDATE Appointments
SET 
  status_id = $1,   
  meet_link = $2,
  mode_id = $3
WHERE 
  appointment_id = $4;
`;

const rejectAppointment = ` 
UPDATE Appointments
SET
  status_id = $1
WHERE
  appointment_id = $2
`;

const completedAppointment = ` 
UPDATE Appointments
SET
  status_id = $1
WHERE
  appointment_id = $2
`;

module.exports = {
  getAppointmentsByStudent,
  getAppointmentsByFaculty,
  getAppointmentById,
  requestAppointment_Student,
  updateMeetingLinkQuery,
  rejectAppointment,
  completedAppointment,
  getAppointmentStudentId,
};
