const getTeachersQuery = (search) => `
  SELECT 
    u.first_name || ' ' || u.last_name AS name,
    u.mode AS faculty_mode,
    u.last_active, 
    ur.role_id, 
    ur.user_id,
    r.role_name,
    ud.department_name AS college_department,
    COALESCE(
      json_agg(
        CASE 
          WHEN a.appointment_id IS NOT NULL THEN
            json_build_object(
              'appointment_id', a.appointment_id,
              'mode', m.mode,
              'status', st.status,
              'scheduled_date', a.scheduled_date,
              'student', json_build_object(
                'student_id', st_user.user_id,
                'student_idnumber', st_user.id_number,
                'first_name', st_user.first_name,
                'last_name', st_user.last_name
              )
            )
        END
      ) FILTER (WHERE a.appointment_id IS NOT NULL),
      '[]'
    ) AS appointments,
    COALESCE(
      json_agg(
        DISTINCT s.subject_name
      ) FILTER (WHERE s.subject_name IS NOT NULL),
      '[]'
    ) AS subjects,
    -- Analytics: Daily, Weekly, and Yearly count of appointments
    COUNT(CASE WHEN st.status = 'Confirmed' THEN 1 END) AS approved_appointments,
    COUNT(CASE WHEN st.status = 'Denied' THEN 1 END) AS rejected_appointments,
    COUNT(CASE WHEN st.status = 'Completed' THEN 1 END) AS completed_appointments,
    COUNT(CASE WHEN st.status = 'Pending' THEN 1 END) AS pending_appointments,
    COUNT(*) AS total_appointments
  FROM 
    users u
  JOIN 
    user_roles ur ON ur.user_id = u.user_id
  JOIN 
    roles r ON ur.role_id = r.role_id
  LEFT JOIN 
    college_department ud ON ud.department_head_id = u.user_id
  LEFT JOIN 
    appointments a ON a.faculty_id = u.user_id
  LEFT JOIN 
    users st_user ON a.student_id = st_user.user_id -- Join for student details
  LEFT JOIN 
    mode m ON a.mode_id = m.mode_id
  LEFT JOIN 
    status st ON a.status_id = st.status_id
  LEFT JOIN 
    user_subjects us ON us.user_id = u.user_id
  LEFT JOIN 
    subjects s ON us.subject_id = s.subject_id
  WHERE 
    r.role_name = 'faculty'
    ${
      search
        ? `
    AND (
      LOWER(u.first_name || ' ' || u.last_name) LIKE LOWER($1)
      OR LOWER(ud.department_name) LIKE LOWER($1)
      OR LOWER(s.subject_name) LIKE LOWER($1)
    )`
        : ""
    }
  GROUP BY 
    u.user_id, ur.role_id, ur.user_id, ud.department_name, r.role_name
  ORDER BY 
    u.first_name;
`;

const searchTeacher = async (query) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT first_name 
       FROM users 
       WHERE first_name ILIKE $1 
       ORDER BY first_name 
       LIMIT 10`,
      [`%${query}%`]
    );
    return res.rows;
  } catch (error) {
    throw new Error("Error while querying the database");
  } finally {
    client.release();
  }
};

module.exports = {
  getTeachersQuery,
  searchTeacher,
};
