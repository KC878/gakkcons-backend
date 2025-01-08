// const getTeachers = `
//   SELECT 
//     u.first_name || ' ' || u.last_name AS name, 
//     ur.role_id, 
//     ur.user_id,
//     ud.department_name AS college_department,
//     COALESCE(
//       json_agg(
//         CASE 
//           WHEN a.appointment_id IS NOT NULL THEN
//             json_build_object(
//               'appointment_id', a.appointment_id,
//               'mode', m.mode,
//               'status', st.status,
//               'scheduled_date', a.scheduled_date
//             )
//         END
//       ) FILTER (WHERE a.appointment_id IS NOT NULL),
//       '[]'
//     ) AS appointments,
//     COALESCE(
//       json_agg(
//         DISTINCT s.subject_name
//       ) FILTER (WHERE s.subject_name IS NOT NULL),
//       '[]'
//     ) AS subjects
//   FROM 
//     users u
//   JOIN 
//     user_roles ur ON ur.user_id = u.user_id
//   LEFT JOIN 
//     college_department ud ON ud.department_head_id = u.user_id
//   LEFT JOIN 
//     appointments a ON a.faculty_id = u.user_id
//   LEFT JOIN 
//     mode m ON a.mode_id = m.mode_id
//   LEFT JOIN 
//     status st ON a.status_id = st.status_id
//   LEFT JOIN 
//     user_subjects us ON us.user_id = u.user_id
//   LEFT JOIN 
//     subjects s ON us.subject_id = s.subject_id
//   WHERE 
//     ur.role_id = 2
//   GROUP BY 
//     u.user_id, ur.role_id, ur.user_id, ud.department_name
//   ORDER BY 
//     u.first_name;
// `;


const getTeachers = `
  SELECT 
    u.first_name || ' ' || u.last_name AS name, 
    ur.role_id, 
    ur.user_id,
    ud.department_name AS college_department,
    COALESCE(
      json_agg(
        CASE 
          WHEN a.appointment_id IS NOT NULL THEN
            json_build_object(
              'appointment_id', a.appointment_id,
              'mode', m.mode,
              'status', st.status,
              'scheduled_date', a.scheduled_date
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
    COUNT(CASE WHEN a.scheduled_date::date = CURRENT_DATE THEN 1 END) AS daily_appointments,
    COUNT(CASE WHEN a.scheduled_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) AS weekly_appointments,
    COUNT(CASE WHEN a.scheduled_date >= CURRENT_DATE - INTERVAL '1 year' THEN 1 END) AS yearly_appointments
  FROM 
    users u
  JOIN 
    user_roles ur ON ur.user_id = u.user_id
  LEFT JOIN 
    college_department ud ON ud.department_head_id = u.user_id
  LEFT JOIN 
    appointments a ON a.faculty_id = u.user_id
  LEFT JOIN 
    mode m ON a.mode_id = m.mode_id
  LEFT JOIN 
    status st ON a.status_id = st.status_id
  LEFT JOIN 
    user_subjects us ON us.user_id = u.user_id
  LEFT JOIN 
    subjects s ON us.subject_id = s.subject_id
  WHERE 
    ur.role_id = 2
  GROUP BY 
    u.user_id, ur.role_id, ur.user_id, ud.department_name
  ORDER BY 
    u.first_name;
`;




const searchTeacher = async (query) => {
  const client = await pool.connect(); // Connect to the database
  try {
    const res = await client.query(
      `SELECT first_name 
       FROM users 
       WHERE first_name ILIKE $1 
       ORDER BY first_name 
       LIMIT 10`,
      [`%${query}%`] // Use ILIKE for case-insensitive matching
    );
    return res.rows; // Return the resulting rows
  } catch (error) {
    throw new Error("Error while querying the database"); // Handle query errors
  } finally {
    client.release(); // Release the connection
  }
};

module.exports = {
  getTeachers,
  searchTeacher,
};
