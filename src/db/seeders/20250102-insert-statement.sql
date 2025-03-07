INSERT INTO roles (role_name)
SELECT role_name
FROM (VALUES 
    ('admin'),
    ('faculty'),
    ('student')
) AS new_roles(role_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM roles
    WHERE roles.role_name = new_roles.role_name
);

INSERT INTO programs (program_name)
SELECT program_name
FROM (VALUES 
    ('BSIT')
) AS new_programs(program_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM programs
    WHERE programs.program_name = new_programs.program_name
);

INSERT INTO College_Department (department_name)
SELECT department_name
FROM (VALUES 
    ('CITC')
) AS new_departments(department_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM College_Department
    WHERE College_Department.department_name = new_departments.department_name
);

WITH ProgramID AS (
    SELECT program_id
    FROM programs
    WHERE program_name = 'BSIT'
    LIMIT 1
)
INSERT INTO subjects (program_id, subject_name)
SELECT program_id, subject_name
FROM ProgramID, (VALUES 
    ('Sys Ad'),
    ('Elective 3'),
    ('Elective 4'),
    ('Capstone'),
    ('SPI'),
    ('GNS')
) AS new_subjects(subject_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM subjects
    WHERE subjects.program_id = ProgramID.program_id
    AND subjects.subject_name = new_subjects.subject_name
);

INSERT INTO Department_Programs (department_id, program_id)
SELECT 
    (SELECT department_id FROM College_Department WHERE department_name = 'CITC'),
    (SELECT program_id FROM programs WHERE program_name = 'BSIT')
WHERE NOT EXISTS (
    SELECT 1
    FROM Department_Programs
    WHERE department_id = (SELECT department_id FROM College_Department WHERE department_name = 'CITC')
    AND program_id = (SELECT program_id FROM programs WHERE program_name = 'BSIT')
);

INSERT INTO mode (mode)
SELECT mode
FROM (VALUES 
    ('online'),
    ('onsite')
) AS new_modes(mode)
WHERE NOT EXISTS (
    SELECT 1
    FROM mode
    WHERE mode.mode = new_modes.mode
);

INSERT INTO Status (status)
SELECT status
FROM (VALUES 
    ('Pending'),
    ('Confirmed'),
    ('Rescheduled'),
    ('Completed'),
    ('Cancelled'),
    ('No-Show'),
    ('In Progress'),
    ('Postponed'),
    ('Awaiting Confirmation'),
    ('Denied')
) AS new_statuses(status)
WHERE NOT EXISTS (
    SELECT 1
    FROM Status
    WHERE Status.status = new_statuses.status
);


-- Replace the hashed password with the actual bcrypt hash generated earlier
INSERT INTO users (password, first_name, last_name, email, is_active)
SELECT 
    '$2b$10$Olvkf5SecXe3wD6bergCyOC8YgJnlU.5xExeZdGuOkk7oUEzCHmU.', 
    'Admin',
    'User',
    'gakkcons@gmail.com',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM users
    WHERE email = 'gakkcons@gmail.com'
);

WITH AdminRole AS (
    SELECT role_id
    FROM roles
    WHERE role_name = 'admin'
),
AdminUser AS (
    SELECT user_id
    FROM users
    WHERE email = 'gakkcons@gmail.com'
)
INSERT INTO user_roles (user_id, role_id)
SELECT user_id, role_id
FROM AdminUser, AdminRole
WHERE NOT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = (SELECT user_id FROM AdminUser)
    AND role_id = (SELECT role_id FROM AdminRole)
);
