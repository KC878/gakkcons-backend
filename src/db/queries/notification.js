const getNotifications = `
  SELECT 
    a.appointment_id,
    u1.first_name || ' ' || u1.last_name AS student_name,  
    u2.first_name || ' ' || u2.last_name AS faculty_name,  
    m.mode,  
    s.status,  
    a.reason,  
    a.scheduled_date AT TIME ZONE 'Asia/Singapore' AS scheduled_date,
    a.meet_link, 
    a.timestamp AT TIME ZONE 'Asia/Singapore' AS timestamp,
    a.updated_at AT TIME ZONE 'Asia/Singapore' AS updated_at
  FROM Appointments a
  JOIN Users u1 ON a.student_id = u1.user_id
  JOIN Users u2 ON a.faculty_id = u2.user_id  
  JOIN Mode m ON a.mode_id = m.mode_id  
  JOIN Status s ON a.status_id = s.status_id
  WHERE a.student_id = $1 AND a.status_id = (SELECT status_id FROM Status WHERE status = $2)
  ORDER BY a.timestamp DESC;
  
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
