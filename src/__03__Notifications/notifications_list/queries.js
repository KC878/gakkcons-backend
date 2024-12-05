const getNotifications = `
  SELECT 
    a.appointment_id,
    u1.first_name || ' ' || u1.last_name AS student_name,  -- Concatenating first and last name for student
    u2.first_name || ' ' || u2.last_name AS faculty_name,  -- Concatenating first and last name for faculty
    m.mode,  -- Mode of appointment (e.g., in-person, online)
    s.status,  -- Status of appointment (e.g., pending, confirmed)
    a.reason,  -- Reason for the appointment
    a.scheduled_date,  -- Scheduled date of the appointment
    a.timestamp  -- Timestamp of when the appointment was created
  FROM Appointments a
  JOIN Users u1 ON a.student_id = u1.user_id  -- Join with Users to get student details
  JOIN Users u2 ON a.faculty_id = u2.user_id  -- Join with Users to get faculty details
  JOIN Mode m ON a.mode_id = m.mode_id  -- Join with Mode to get appointment mode
  JOIN Status s ON a.status_id = s.status_id  -- Join with Status to get appointment status
  ORDER BY a.timestamp DESC;  -- Order by timestamp for the most recent appointments
`;


const updateAppointmentStatus = `
  UPDATE Appointments
  SET status_id = $1  -- Set new status
  WHERE appointment_id = $2  -- Find the appointment by ID
  RETURNING appointment_id, student_id, faculty_id, mode_id, status_id, reason, scheduled_date, meet_link, timestamp;
`;



module.exports = {
  getNotifications,
  updateAppointmentStatus,
};
