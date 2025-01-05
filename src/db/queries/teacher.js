const getTeachersQuery = (search) => `
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
    ) AS subjects
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
    u.user_id, ur.role_id, ur.user_id, ud.department_name
  ORDER BY 
    u.first_name;
`;

module.exports = {
  getTeachersQuery,
};
