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

// const getAppointmentsByFaculty = `
//   SELECT 
//     a.appointment_id, 
//     TO_CHAR(a.scheduled_date, 'YYYY-MM-DD') AS appointment_date,
//     TO_CHAR(a.scheduled_date, 'HH24:MI') AS appointment_time,
//     m.mode AS appointment_type,
//     s.status AS appointment_status
//   FROM 
//     Appointments a
//   JOIN Mode m ON a.mode_id = m.mode_id
//   JOIN Status s ON a.status_id = s.status_id
//   WHERE 
//     a.faculty_id = $1;
// `;

const getAppointmentsByFaculty = `
  SELECT 
    a.appointment_id, 
    a.reason,
    a.meet_link,
    TO_CHAR(a.scheduled_date, 'YYYY-MM-DD') AS appointment_date,
    TO_CHAR(a.scheduled_date, 'HH24:MI') AS appointment_time,
    m.mode_id AS mode_id,
    m.mode AS appointment_type,
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


module.exports = {
  getAppointmentsByStudent,
  getAppointmentsByFaculty,
  getAppointmentById,
  requestAppointment_Student,
  updateMeetingLinkQuery
};
