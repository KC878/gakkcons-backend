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
    u.idnumber,
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



const getAppointmentsByAdmin = `
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
    u.idnumber,
    s.status AS status,
    TO_CHAR(a.timestamp AT TIME ZONE 'UTC', 'HH12:MI AM') || ' ' || TO_CHAR(a.timestamp AT TIME ZONE 'UTC', 'MM-DD-YYYY') AS timestamp
  FROM 
    Appointments a
  JOIN Mode m ON a.mode_id = m.mode_id
  JOIN Status s ON a.status_id = s.status_id
  JOIN Users u ON a.student_id = u.user_id
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


const rejectAppointment = ` 
UPDATE Appointments
SET
  status_id = $1
WHERE
  appointment_id = $2
`

const completedAppointment = ` 
UPDATE Appointments
SET
  status_id = $1
WHERE
  appointment_id = $2
`

const getAllAppointmentsAnalytics = `
WITH appointment_counts AS (
  SELECT
    COUNT(*) AS total_appointments,
    COUNT(CASE WHEN a.status_id = 2 THEN 1 END) AS approved_appointments,
    COUNT(CASE WHEN a.status_id = 10 THEN 1 END) AS rejected_appointments,
    COUNT(CASE WHEN a.status_id = 1 THEN 1 END) AS pending_appointments
  FROM 
    appointments a
)
SELECT 
  ac.total_appointments,
  ac.approved_appointments,
  ac.rejected_appointments,
  ac.pending_appointments,
  a.appointment_id, 
  a.reason,
  TO_CHAR(a.scheduled_date, 'YYYY-MM-DD') AS appointment_date,
  TO_CHAR(a.scheduled_date, 'HH24:MI') AS appointment_time,  
  m.mode AS consultation_mode,
  u.first_name AS instructor_first_name,
  u.last_name AS instructor_last_name,
  s.status AS appointment_status
FROM 
  appointment_counts ac
JOIN 
  appointments a ON a.status_id IN (2) -- Fetch all statuses (approved, pending, rejected)
JOIN 
  Mode m ON a.mode_id = m.mode_id
JOIN 
  Status s ON a.status_id = s.status_id
JOIN 
  Users u ON a.faculty_id = u.user_id; -- Assuming faculty_id refers to the instructor
`;


const getSpecicAppointmentsAnalytics = `
WITH appointment_counts AS (
  SELECT
    COUNT(*) AS total_appointments,
    COUNT(CASE WHEN a.status_id = 2 THEN 1 END) AS approved_appointments,
    COUNT(CASE WHEN a.status_id = 10 THEN 1 END) AS rejected_appointments,
    COUNT(CASE WHEN a.status_id = 1 THEN 1 END) AS pending_appointments
  FROM 
    appointments a
)
SELECT 
  ac.total_appointments,
  ac.approved_appointments,
  ac.rejected_appointments,
  ac.pending_appointments,
  a.appointment_id, 
  a.reason,
  TO_CHAR(a.scheduled_date, 'YYYY-MM-DD') AS appointment_date,
  TO_CHAR(a.scheduled_date, 'HH24:MI') AS appointment_time,  
  m.mode AS consultation_mode,
  u.user_id AS instructor_id
  u.first_name AS instructor_first_name,
  u.last_name AS instructor_last_name,
  s.status AS appointment_status
FROM 
  appointment_counts ac
JOIN 
  appointments a ON a.status_id IN (2) -- Fetch all statuses (approved, pending, rejected)
JOIN 
  Mode m ON a.mode_id = m.mode_id
JOIN 
  Status s ON a.status_id = s.status_id
JOIN 
  Users u ON a.faculty_id = u.user_id; -- Assuming faculty_id refers to the instructor

`;


module.exports = {
  getAppointmentsByStudent,
  getAppointmentsByFaculty,
  getAppointmentsByAdmin,
  getAppointmentById,
  requestAppointment_Student,
  updateMeetingLinkQuery,
  rejectAppointment,
  completedAppointment,
  getAllAppointmentsAnalytics
};
