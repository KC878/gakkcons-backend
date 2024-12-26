-- Populate Roles
INSERT INTO ROLES (role_name)
VALUES
    ('admin'),
    ('faculty'),
    ('student');

-- Create a dummy account for teacher
INSERT INTO users (password, first_name, last_name, email)
VALUES 
    ('password', 'Sir', 'Rojo', 'rojo@gmail.com');

-- Assign role to the dummy user
INSERT INTO user_roles (user_id, role_id)
VALUES 
    ((SELECT user_id FROM users WHERE email = 'rojo@gmail.com'), 
     (SELECT role_id FROM roles WHERE role_name = 'faculty'));

-- Populate Programs
INSERT INTO programs (program_name)
VALUES 
    ('BSIT');

-- Populate Subjects
WITH ProgramID AS (
    SELECT program_id
    FROM programs
    WHERE program_name = 'BSIT'
    LIMIT 1
)
INSERT INTO subjects (program_id, subject_name)
VALUES 
    ((SELECT program_id FROM ProgramID), 'Sys Ad'),
    ((SELECT program_id FROM ProgramID), 'Elective 3'),
    ((SELECT program_id FROM ProgramID), 'Elective 4'),
    ((SELECT program_id FROM ProgramID), 'Capstone'),
    ((SELECT program_id FROM ProgramID), 'SPI'),
    ((SELECT program_id FROM ProgramID), 'GNS');


-- Populate College Department
INSERT INTO College_Department (department_name, department_head_id, program_id)
VALUES 
    ('CITC', 
     (SELECT user_id FROM users WHERE email = 'rojo@gmail.com'), 
     (SELECT program_id FROM programs WHERE program_name = 'BSIT'));

-- Link Department to Programs
INSERT INTO Department_Programs (department_id, program_id)
VALUES 
    ((SELECT department_id FROM College_Department WHERE department_name = 'CITC'),
     (SELECT program_id FROM programs WHERE program_name = 'BSIT'));

-- Populate Mode Table
INSERT INTO mode (mode)
VALUES 
    ('online'),
    ('onsite');

-- Populate Status Table
INSERT INTO Status (status)
VALUES 
    ('Pending'),
    ('Confirmed'),
    ('Rescheduled'),
    ('Completed'),
    ('Cancelled'),
    ('No-Show'),
    ('In Progress'),
    ('Postponed'),
    ('Awaiting Confirmation'),
    ('Denied');

-- -- Create a dummy appointment
-- INSERT INTO Appointments (student_id, faculty_id, mode_id, status_id, reason, scheduled_date, meet_link)
-- VALUES 
--     (8, 
--      (SELECT id FROM users WHERE email = 'rojo@gmail.com'), 
--      (SELECT id FROM mode WHERE mode = 'online'), 
--      (SELECT id FROM Status WHERE status = 'In Progress'), 
--      'Consult Grade', 
--      '2024-12-05 10:30:00', 
--      'http://example.com/meeting-link');
